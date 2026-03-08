# Cursor Prompt: Refactor ProcrastinIdler to use reactive-store

## Context

I have a shared game store library at `reactive-store` .The library exports a single factory function:

```ts
import { createGameStore } from 'reactive-store';
import { createUpgradesStore } from 'reactive-store/examples/stores/useUpgradesStore';
```

The factory wraps Zustand with:

- `subscribeWithSelector` middleware (enables `store.subscribe(selector, callback)`)
- Optional persistence via `SuperSaveSystem` from `@game-libs/super-save-system` (not to be implemented yet)
- `persistKeys` option to selectively persist only certain state fields
- Full TypeScript generics: state and actions are typed separately, composed into a flat Zustand store

The two signatures are:

```ts
// For flat stores (settings, economy, game state):
createGameStore<TState, TActions>(options, initializer)

// For the upgrades store (uses a factory because TUpgradeKey is game-specific):
createUpgradesStore<TUpgradeKey>(upgradeDefinitions, savePrefix?)
```

---

## Your Task

Refactor ProcrastinIdler's existing Zustand stores to use this library. Do not change any game logic — only migrate the store structure.

### Step 1 — Audit existing stores

Find all files in this project that:

- Call `create(...)` or `createStore(...)` from `zustand`
- Define state and actions for settings, economy/currency, upgrades, or global game state
- Use `persist` middleware directly
- Use `@preact/signals` for reactive state

List them before making changes.

### Step 2 — Create the new store files

For each store domain found, create a new file following this pattern:

```
src/stores/useSettingsStore.ts
src/stores/useEconomyStore.ts   (or useCurrencyStore.ts — match existing naming)
src/stores/useUpgradesStore.ts
src/stores/useGameStateStore.ts (if a global game state store exists)
```

Each file should:

1. Define a `*State` interface for plain data fields only (no functions, no signals)
2. Define a `*Actions` interface for all mutating functions
3. Define `initialState` as a typed const
4. Export the store using `createGameStore` (or `createUpgradesStore` for upgrades)
5. Pass the game's existing `savePrefix` (check `VITE_GAME_PREFIX` in `.env` or existing persist keys)
6. Use `persistKeys` to exclude transient fields (e.g. `isPaused`, `activeModal`, `isAnimating`)

For the upgrades store specifically:

- Extract the upgrade key names into a `type ProcrastinIdlerUpgrade = '...' | '...'` union
- Extract maxLevel values from wherever they currently live
- Use `createUpgradesStore<ProcrastinIdlerUpgrade>(definitions)`

### Step 3 — Replace usages

Search for every usage of the old store hooks/selectors across the codebase (components, systems, actors, hooks) and update them. The API is identical to plain Zustand:

```ts
// Hook in React component (unchanged from standard Zustand):
const gold = useEconomyStore(s => s.gold);

// Read outside React (Excalibur actors, plain functions):
const { gold } = useEconomyStore.getState();

// Subscribe outside React:
useEconomyStore.subscribe(s => s.gold, (gold) => { ... });
```

### Step 4 — Create store wiring file

Create `src/stores/store-wiring.ts`. This file should contain all cross-store `subscribe` calls that currently live scattered across components, actors, or a context provider. Wire up:

- Settings changes → audio engine calls
- Upgrade level changes → economy rate recalculations (`setGoldPerSecond`, `setGoldMultiplier`, etc.)
- Economy totals → achievement system stat updates (if an achievement system exists)

Call `initStoreWiring()` once in `main.ts` or `App.tsx` before the game boots.

### Step 5 — Remove old store infrastructure

Once all usages are migrated:

- Delete the old store files
- Remove any `persist` middleware imports that were handled manually
- Remove any `@preact/signals` imports that were only used for store reactivity (keep signals that are used directly in Excalibur actors if any)
- Remove any `window.global_game_store` singleton pattern if it exists

### Step 6 — Verify

- All TypeScript errors resolved
- `tsc --noEmit` passes
- The game boots and state persists across page refresh
- React components re-render when state changes
- Excalibur actors can read state synchronously via `.getState()`

---

## Constraints

- Do NOT change any game logic, formulas, constants, or UI behaviour
- Do NOT rename store hooks — keep the same export names the components already use (e.g. if it was `useGoldStore`, keep it `useGoldStore`)
- Do NOT migrate to a different persistence backend — keep using `SuperSaveSystem`
- If a store has state that should NOT be persisted between sessions (e.g. `isPaused`, `isInCutscene`, UI flags), pass those keys in `persistKeys` to exclude them
- The `savePrefix` must match what was used before so existing save data is not lost

---

## Reference: createGameStore signature

```ts
function createGameStore<TState extends object, TActions extends object>(
  options: {
    saveKey: string; // e.g. 'economy' → full key: '{prefix}_economy'
    initialState: TState;
    savePrefix?: string; // defaults to VITE_GAME_PREFIX or 'my-game'
    saveSystem?: SaveSystem; // pass SuperSaveSystem() instance
    persistKeys?: (keyof TState)[]; // if omitted, all state keys are persisted
  },
  initializer: (
    set: (partial: Partial<TState & TActions>) => void,
    get: () => TState & TActions,
    initialState: TState, // original initial values, useful for resets
  ) => TActions,
): UseBoundStore<StoreApi<TState & TActions>>;
```

## Reference: createUpgradesStore signature

```ts
function createUpgradesStore<TUpgradeKey extends string>(
  upgradeDefinitions: Record<TUpgradeKey, { maxLevel?: number }>,
  savePrefix?: string,
): UseBoundStore<StoreApi<UpgradesState<TUpgradeKey> & UpgradesActions<TUpgradeKey>>>;
```

The returned store has these built-in actions:

- `unlockUpgrade(key)` — make upgrade visible/purchasable
- `purchaseUpgrade(key) → boolean` — increment level, returns false if maxed or not unlocked
- `setUpgradeLevel(key, level)` — direct set (for load/cheat)
- `getUpgradeLevel(key) → number` — current level (0 = not purchased)
- `isMaxed(key) → boolean`
- `isUnlocked(key) → boolean`
- `resetUpgrades()`
