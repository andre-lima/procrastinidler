import { createGameStore } from '../src';
import { SuperSaveSystem } from '@game-libs/super-save-system';

// ─── State ─────────────────────────────────────────────────────────────────────

export interface EconomyState {
  // Current spendable balance
  gold: number;
  gems: number;

  // Lifetime totals — never decrease, used for achievements & progression gates
  totalGoldEarned: number;
  totalGemsEarned: number;
  totalGoldSpent: number;

  // Passive income rates (per tick / per second — your game decides the unit)
  goldPerSecond: number;
  gemsPerSecond: number;

  // Multipliers applied on top of base rates
  goldMultiplier: number;
  gemMultiplier: number;
}

// ─── Actions ───────────────────────────────────────────────────────────────────

export interface EconomyActions {
  /** Add gold earned (e.g. from a click, passive tick, quest reward) */
  earnGold: (amount: number) => void;

  /** Spend gold. Returns false if insufficient funds. */
  spendGold: (amount: number) => boolean;

  /** Add gems earned */
  earnGems: (amount: number) => void;

  /** Spend gems. Returns false if insufficient funds. */
  spendGems: (amount: number) => boolean;

  /** Apply a passive income tick (called by your game loop) */
  applyPassiveTick: (deltaSeconds: number) => void;

  /** Update the passive income rate (e.g. after buying an upgrade) */
  setGoldPerSecond: (rate: number) => void;
  setGemsPerSecond: (rate: number) => void;

  /** Adjust multipliers (e.g. from upgrades or temporary buffs) */
  setGoldMultiplier: (multiplier: number) => void;
  setGemMultiplier: (multiplier: number) => void;

  /** Hard reset — used on new game */
  resetEconomy: () => void;
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialEconomyState: EconomyState = {
  gold: 0,
  gems: 0,
  totalGoldEarned: 0,
  totalGemsEarned: 0,
  totalGoldSpent: 0,
  goldPerSecond: 0,
  gemsPerSecond: 0,
  goldMultiplier: 1,
  gemMultiplier: 1,
};

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useEconomyStore = createGameStore<EconomyState, EconomyActions>(
  {
    saveKey: 'economy',
    initialState: initialEconomyState,
    saveSystem: SuperSaveSystem(),
    // Only persist the data that matters across sessions.
    // Rates and multipliers are re-derived from upgrades on load, so we
    // persist them too — but you could exclude them if your game recalculates.
    persistKeys: [
      'gold',
      'gems',
      'totalGoldEarned',
      'totalGemsEarned',
      'totalGoldSpent',
      'goldPerSecond',
      'gemsPerSecond',
      'goldMultiplier',
      'gemMultiplier',
    ],
  },
  (set, get, initialState) => ({
    earnGold: (amount) => {
      const earned = Math.max(0, amount);
      set({
        gold: get().gold + earned,
        totalGoldEarned: get().totalGoldEarned + earned,
      });
    },

    spendGold: (amount) => {
      const { gold } = get();
      if (gold < amount) return false;
      set({
        gold: gold - amount,
        totalGoldSpent: get().totalGoldSpent + amount,
      });
      return true;
    },

    earnGems: (amount) => {
      const earned = Math.max(0, amount);
      set({
        gems: get().gems + earned,
        totalGemsEarned: get().totalGemsEarned + earned,
      });
    },

    spendGems: (amount) => {
      const { gems } = get();
      if (gems < amount) return false;
      set({ gems: gems - amount });
      return true;
    },

    applyPassiveTick: (deltaSeconds) => {
      const { goldPerSecond, goldMultiplier, gemsPerSecond, gemMultiplier } = get();
      const goldGained = goldPerSecond * goldMultiplier * deltaSeconds;
      const gemsGained = gemsPerSecond * gemMultiplier * deltaSeconds;

      if (goldGained > 0) get().earnGold(goldGained);
      if (gemsGained > 0) get().earnGems(gemsGained);
    },

    setGoldPerSecond: (goldPerSecond) => set({ goldPerSecond }),
    setGemsPerSecond: (gemsPerSecond) => set({ gemsPerSecond }),
    setGoldMultiplier: (goldMultiplier) => set({ goldMultiplier }),
    setGemMultiplier: (gemMultiplier) => set({ gemMultiplier }),

    resetEconomy: () => set({ ...initialState }),
  }),
);

// ─── Usage Examples ────────────────────────────────────────────────────────────

/**
 * REACT COMPONENT:
 *
 *   const gold = useEconomyStore(s => s.gold);
 *   const { earnGold, spendGold } = useEconomyStore();
 *
 * EXCALIBUR GAME LOOP (called every frame):
 *
 *   class EconomySystem extends System {
 *     onPreUpdate(_engine: Engine, delta: number) {
 *       useEconomyStore.getState().applyPassiveTick(delta / 1000);
 *     }
 *   }
 *
 * WIRE TO ACHIEVEMENT SYSTEM (in game setup):
 *
 *   useEconomyStore.subscribe(
 *     s => s.totalGoldEarned,
 *     (total) => achievementSystem.setStat('TOTAL_GOLD_EARNED', total)
 *   );
 */
