import type { StoreApi, UseBoundStore } from 'zustand';

// ─── Save System Interface ────────────────────────────────────────────────────
// Matches the SuperSaveSystem interface from @game-libs/super-save-system
// but kept generic so the library isn't hard-coupled to it.
export interface SaveSystem {
  save: (key: string, value: unknown) => Promise<void>;
  load: <T>(key: string, fallback: T) => Promise<T>;
}

// ─── Store Types ──────────────────────────────────────────────────────────────

/**
 * Bound store with full Zustand API.
 * UseBoundStore gives you the hook + .getState() + .subscribe() + .setState()
 */
export type GameStore<TState extends object, TActions extends object> = UseBoundStore<
  StoreApi<TState & TActions>
>;

/**
 * Options passed to createGameStore
 */
export interface CreateGameStoreOptions<TState extends object> {
  /** Unique key used for persistence. Combined with savePrefix. e.g. 'settings' */
  saveKey: string;

  /** Initial state values */
  initialState: TState;

  /**
   * Prefix prepended to saveKey. Defaults to VITE_GAME_PREFIX env var or 'my-game'.
   * Override per-store if different games share the same save system.
   */
  savePrefix?: string;

  /**
   * Optional save system. If omitted, persistence is disabled.
   * Pass an instance of SuperSaveSystem or any object matching SaveSystem.
   */
  saveSystem?: SaveSystem;

  /**
   * Which state keys to persist. If omitted, the entire state is persisted.
   * Useful when some state is transient (e.g. isPaused, activeModal).
   */
  persistKeys?: (keyof TState)[];
}

/**
 * The factory function signature each store definition must export.
 * set/get are Zustand's standard set/get, typed to the full shape.
 * set accepts either a partial object or a function (state) => partial.
 */
export type StoreInitializer<TState extends object, TActions extends object> = (
  set: (partial: Partial<TState & TActions> | ((state: TState & TActions) => Partial<TState & TActions>)) => void,
  get: () => TState & TActions,
  initialState: TState,
) => TActions;
