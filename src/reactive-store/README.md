# @game-libs/reactive-store

A typed Zustand store factory for games that need reactive state in React **and** synchronous reads outside React (Excalibur actors, canvas systems, plain functions).

---

## The problem it solves

Games often mix React UI with a canvas engine (Excalibur, Pixi, etc.). You need:

| Requirement | Solution |
|---|---|
| React re-renders on state change | `useMyStore(selector)` |
| Read current value in an Excalibur actor | `useMyStore.getState().value` |
| React to state changes in a game system | `useMyStore.subscribe(selector, cb)` |
| Persist state across sessions | Pass `saveSystem` to the factory |
| Multiple independent domains | One `createGameStore()` call per domain |

---

## Installation

```ts
// In your monorepo, add as a workspace dependency:
// "@game-libs/reactive-store": "workspace:*"
```

---

## Core API

### `createGameStore<TState, TActions>(options, initializer)`

```ts
import { createGameStore } from '@game-libs/reactive-store';
import { SuperSaveSystem } from '@game-libs/super-save-system';

interface MyState { count: number }
interface MyActions { increment: () => void }

export const useMyStore = createGameStore<MyState, MyActions>(
  {
    saveKey: 'my-store',      // → saved as '{prefix}_my-store'
    initialState: { count: 0 },
    saveSystem: SuperSaveSystem(),
  },
  (set, get, initialState) => ({
    increment: () => set({ count: get().count + 1 }),
  }),
);
```

### `createUpgradesStore<TUpgradeKey>(definitions, savePrefix?)`

```ts
import { createUpgradesStore } from '@game-libs/reactive-store/examples/stores/useUpgradesStore';

type MyUpgrades = 'FASTER_CLICKS' | 'AUTO_CLICKER';

export const useUpgradesStore = createUpgradesStore<MyUpgrades>({
  FASTER_CLICKS: { maxLevel: 5 },
  AUTO_CLICKER:  { maxLevel: 10 },
});
```

---

## Usage patterns

### React component

```tsx
// Selector — re-renders only when count changes:
const count = useMyStore(s => s.count);
const increment = useMyStore(s => s.increment);

// Or destructure (re-renders on any change):
const { count, increment } = useMyStore();
```

### Excalibur actor / plain function

```ts
// Synchronous, no hooks needed:
const { count } = useMyStore.getState();
```

### Subscribe in a game system

```ts
// subscribeWithSelector is included — no extra middleware needed:
useMyStore.subscribe(
  s => s.count,
  (count) => console.log('count changed to', count),
);
```

---

## Options reference

| Option | Type | Required | Description |
|---|---|---|---|
| `saveKey` | `string` | ✅ | Key suffix. Full key = `{prefix}_{saveKey}` |
| `initialState` | `TState` | ✅ | Default values |
| `saveSystem` | `SaveSystem` | — | If omitted, persistence is disabled |
| `savePrefix` | `string` | — | Defaults to `VITE_GAME_PREFIX` or `'my-game'` |
| `persistKeys` | `(keyof TState)[]` | — | If omitted, all state keys are persisted |

---

## Folder structure

```
@game-libs/reactive-store/
  src/
    types.ts              ← all TypeScript interfaces
    createGameStore.ts    ← core factory
    index.ts              ← barrel export
  examples/
    stores/
      useSettingsStore.ts  ← copy & adapt for your game
      useEconomyStore.ts
      useUpgradesStore.ts  ← factory pattern for typed upgrade keys
    integration/
      game-setup.ts        ← wiring all stores together
  CURSOR_PROMPT.md         ← prompt to refactor an existing game
```
