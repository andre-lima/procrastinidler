import type { SaveSystem } from '../reactive-store/types';

/**
 * localStorage-backed SaveSystem. Uses the same keys as the previous
 * zustand persist setup (game-store, upgrades-store, etc.) so existing
 * save data continues to work. When SuperSaveSystem is introduced,
 * swap this instance for SuperSaveSystem() in each store.
 */
export const localStorageSaveSystem: SaveSystem & {
  clear(key: string): void;
  clearAll(): void;
} = {
  save: async (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[saveSystem] save failed', key, e);
    }
  },

  load: async <T>(key: string, fallback: T): Promise<T> => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  clear(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[saveSystem] clear failed', key, e);
    }
  },

  clearAll() {
    STORE_KEYS.forEach((key) => localStorageSaveSystem.clear(key));
  },
};

/** Keys used for persistence; must match saveKey in each store when savePrefix is ''. */
export const STORE_KEYS = [
  'game-store',
  'upgrades-store',
  'tasks-store',
  'boss-store',
  'assistant-store',
] as const;
