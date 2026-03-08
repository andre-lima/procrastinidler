import { createGameStore } from '../createGameStore';
// import { SuperSaveSystem } from '@game-libs/super-save-system';

// ─── Types ─────────────────────────────────────────────────────────────────────

/**
 * Each upgrade is a generic record identified by a string key.
 * TUpgradeKey is a string union defined per-game, e.g.:
 *   type MyUpgrades = 'FASTER_CLICKS' | 'DOUBLE_GOLD' | 'AUTO_CLICKER'
 *
 * This avoids magic strings scattered through game code.
 */
export interface UpgradeEntry {
  /** Current level — 0 means not purchased */
  level: number;
  /** Max level allowed. Undefined = unlimited. */
  maxLevel?: number;
}

// ─── State ─────────────────────────────────────────────────────────────────────

export interface UpgradesState<TUpgradeKey extends string = string> {
  /** Map of upgrade ID → current entry */
  upgrades: Record<TUpgradeKey, UpgradeEntry>;

  /** IDs of upgrades that are currently unlocked (visible to the player) */
  unlockedUpgrades: TUpgradeKey[];
}

// ─── Actions ───────────────────────────────────────────────────────────────────

export interface UpgradesActions<TUpgradeKey extends string = string> {
  /** Unlock an upgrade, making it visible/purchasable */
  unlockUpgrade: (key: TUpgradeKey) => void;

  /**
   * Purchase one level of an upgrade.
   * Returns false if already at maxLevel or not yet unlocked.
   */
  purchaseUpgrade: (key: TUpgradeKey) => boolean;

  /** Set the level directly (useful for loading/cheats/testing) */
  setUpgradeLevel: (key: TUpgradeKey, level: number) => void;

  /** Returns current level for an upgrade (0 if not purchased) */
  getUpgradeLevel: (key: TUpgradeKey) => number;

  /** Returns true if upgrade is at maxLevel */
  isMaxed: (key: TUpgradeKey) => boolean;

  /** Returns true if upgrade has been unlocked (visible to player) */
  isUnlocked: (key: TUpgradeKey) => boolean;

  /** Hard reset all upgrades */
  resetUpgrades: () => void;
}

// ─── Factory ───────────────────────────────────────────────────────────────────
// The store is a factory function rather than a direct const export
// because TUpgradeKey is a game-specific string union.
// Each game calls createUpgradesStore<MyUpgrades>(...) once and exports the result.

export function createUpgradesStore<TUpgradeKey extends string>(
  upgradeDefinitions: Record<TUpgradeKey, { maxLevel?: number }>,
  savePrefix?: string,
) {
  // Build the initial state from the definitions passed in
  const initialUpgrades = Object.keys(upgradeDefinitions).reduce(
    (acc, key) => {
      const k = key as TUpgradeKey;
      acc[k] = {
        level: 0,
        maxLevel: upgradeDefinitions[k].maxLevel,
      };
      return acc;
    },
    {} as Record<TUpgradeKey, UpgradeEntry>,
  );

  const initialState: UpgradesState<TUpgradeKey> = {
    upgrades: initialUpgrades,
    unlockedUpgrades: [],
  };

  return createGameStore<UpgradesState<TUpgradeKey>, UpgradesActions<TUpgradeKey>>(
    {
      saveKey: 'upgrades',
      initialState,
      // saveSystem: SuperSaveSystem(),
      savePrefix,
      persistKeys: ['upgrades', 'unlockedUpgrades'],
    },
    (set, get, initialState) => ({
      unlockUpgrade: (key) => {
        const { unlockedUpgrades } = get();
        if (!unlockedUpgrades.includes(key)) {
          set({ unlockedUpgrades: [...unlockedUpgrades, key] });
        }
      },

      purchaseUpgrade: (key) => {
        const { upgrades, unlockedUpgrades } = get();
        if (!unlockedUpgrades.includes(key)) return false;

        const entry = upgrades[key];
        if (!entry) return false;
        if (entry.maxLevel !== undefined && entry.level >= entry.maxLevel) return false;

        set({
          upgrades: {
            ...upgrades,
            [key]: { ...entry, level: entry.level + 1 },
          },
        });
        return true;
      },

      setUpgradeLevel: (key, level) => {
        const { upgrades } = get();
        const entry = upgrades[key];
        if (!entry) return;
        set({
          upgrades: {
            ...upgrades,
            [key]: { ...entry, level },
          },
        });
      },

      getUpgradeLevel: (key) => {
        return get().upgrades[key]?.level ?? 0;
      },

      isMaxed: (key) => {
        const entry = get().upgrades[key];
        if (!entry || entry.maxLevel === undefined) return false;
        return entry.level >= entry.maxLevel;
      },

      isUnlocked: (key) => {
        return get().unlockedUpgrades.includes(key);
      },

      resetUpgrades: () => set({ ...initialState }),
    }),
  );
}

// ─── Per-game Usage ────────────────────────────────────────────────────────────

/**
 * DEFINE UPGRADES FOR YOUR GAME:
 *
 *   // upgrades.config.ts
 *   export type MyUpgradeKey =
 *     | 'FASTER_CLICKS'
 *     | 'DOUBLE_GOLD'
 *     | 'AUTO_CLICKER'
 *     | 'CLICK_MULTIPLIER';
 *
 *   export const upgradeDefinitions: Record<MyUpgradeKey, { maxLevel?: number }> = {
 *     FASTER_CLICKS:    { maxLevel: 5  },
 *     DOUBLE_GOLD:      { maxLevel: 1  },
 *     AUTO_CLICKER:     { maxLevel: 10 },
 *     CLICK_MULTIPLIER: { maxLevel: undefined }, // unlimited
 *   };
 *
 *   export const useUpgradesStore = createUpgradesStore<MyUpgradeKey>(upgradeDefinitions);
 *
 * REACT COMPONENT:
 *
 *   const level = useUpgradesStore(s => s.getUpgradeLevel('AUTO_CLICKER'));
 *   const { purchaseUpgrade } = useUpgradesStore();
 *
 *   const handleBuy = () => {
 *     const purchased = purchaseUpgrade('AUTO_CLICKER');
 *     if (!purchased) showToast("Can't afford that!");
 *   };
 *
 * OUTSIDE REACT — read current levels to calculate rates:
 *
 *   const { getUpgradeLevel } = useUpgradesStore.getState();
 *   const autoClickerLevel = getUpgradeLevel('AUTO_CLICKER');
 *   const rate = BASE_RATE * autoClickerLevel;
 *
 * WIRE UPGRADES → ECONOMY (in game setup):
 *
 *   useUpgradesStore.subscribe(
 *     s => s.getUpgradeLevel('AUTO_CLICKER'),
 *     (level) => {
 *       useEconomyStore.getState().setGoldPerSecond(BASE_GPS * level);
 *     }
 *   );
 */
