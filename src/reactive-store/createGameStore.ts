import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  CreateGameStoreOptions,
  GameStore,
  SaveSystem,
  StoreInitializer,
} from './types';

/**
 * createGameStore
 *
 * A typed factory that creates a Zustand store with:
 * - Full React hook support: const { gold } = useEconomyStore()
 * - Selector support: const gold = useEconomyStore(s => s.gold)
 * - Synchronous reads outside React: useEconomyStore.getState().gold
 * - Subscriptions outside React: useEconomyStore.subscribe(s => s.gold, cb)
 * - Optional persistence via any SaveSystem (e.g. SuperSaveSystem)
 * - Selective persistence — only persist the keys you care about
 * - Type-safe generics: state shape and actions shape are separate,
 *   composed into a single flat store (idiomatic Zustand)
 *
 * @example
 * export const useSettingsStore = createGameStore(
 *   { saveKey: 'settings', initialState, saveSystem },
 *   (set, get, init) => ({
 *     setVolume: (v) => set({ musicVolume: v }),
 *   })
 * );
 */
export function createGameStore<TState extends object, TActions extends object>(
  options: CreateGameStoreOptions<TState>,
  initializer: StoreInitializer<TState, TActions>,
): GameStore<TState, TActions> {
  const {
    saveKey,
    initialState,
    saveSystem,
    persistKeys,
    savePrefix = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GAME_PREFIX) || 'my-game',
  } = options;

  const fullKey = savePrefix ? `${savePrefix}_${saveKey}` : saveKey;

  // ─── Build the store ────────────────────────────────────────────────────────
  // subscribeWithSelector middleware enables store.subscribe(selector, callback)
  // which is essential for Excalibur/canvas code outside React.
  const store = create<TState & TActions>()(
    subscribeWithSelector((set, get) => {
      const actions = initializer(set, get, initialState);

      return {
        ...initialState,
        ...actions,
      };
    }),
  );

  // ─── Persistence ───────────────────────────────────────────────────────────
  if (saveSystem) {
    // Load persisted state on creation (async — will patch state when ready)
    loadPersistedState(store, saveSystem, fullKey, initialState, persistKeys);

    // Subscribe to state changes and auto-save
    store.subscribe(
      // Subscribe to the full state object (minus functions)
      (state) => extractPersistableState(state, initialState, persistKeys),
      (persistable) => {
        saveSystem.save(fullKey, persistable);
      },
      // Only fire when the persistable portion actually changes
      { equalityFn: shallowEqual },
    );
  }

  return store;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function loadPersistedState<TState extends object, TActions extends object>(
  store: GameStore<TState, TActions>,
  saveSystem: SaveSystem,
  key: string,
  initialState: TState,
  persistKeys?: (keyof TState)[],
): Promise<void> {
  const persisted = await saveSystem.load<Partial<TState>>(key, {});

  if (persisted && Object.keys(persisted).length > 0) {
    const validKeys = persistKeys ?? (Object.keys(initialState) as (keyof TState)[]);

    // Only restore known state keys — never blindly spread persisted data
    // which could contain stale action references or unknown fields.
    const restored = validKeys.reduce(
      (acc, k) => {
        if (k in persisted) {
          acc[k] = persisted[k] as TState[typeof k];
        }
        return acc;
      },
      {} as Partial<TState>,
    );

    store.setState(restored as Partial<TState & TActions>);
  }
}

function extractPersistableState<TState extends object, TActions extends object>(
  state: TState & TActions,
  initialState: TState,
  persistKeys?: (keyof TState)[],
): Partial<TState> {
  const keys = persistKeys ?? (Object.keys(initialState) as (keyof TState)[]);
  return keys.reduce(
    (acc, k) => {
      acc[k] = state[k] as TState[typeof k];
      return acc;
    },
    {} as Partial<TState>,
  );
}

function shallowEqual(a: object, b: object): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k) => (a as any)[k] === (b as any)[k]);
}
