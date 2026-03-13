import { createGameStore } from '../reactive-store/createGameStore';
import { useUpgradesStore } from './upgradesStore';
import { checkProgressTriggers } from './gameProgressTriggers';
import { localStorageSaveSystem } from './saveSystem';
import { useComputerUpgradesStore } from './computerUpgradesStore';
import { useTasksStore } from './tasksStore';
import { useAssistantStore } from './assistantStore';
import { useBossStore } from './bossStore';
import { useRentStore } from './rentStore';
import { useAssistantsUpgradesStore } from './assistantsUpgradesStore';
import { useBossUpgradesStore } from './bossUpgradesStore';

/** Flags for which game features are currently enabled (e.g. by upgrades or progress). */
export interface FeaturesEnabled {
  requiresReview: boolean;
  rentPayment: boolean;
  uploadWorkCompleted: boolean;
  burnoutMeter: boolean;
}

interface GameStoreState {
  money: number;
  RAM: number;
  burnout: number;
  /** Whether the game simulation is paused (e.g. during burnout). */
  paused: boolean;
  /** Whether the player is currently in a burnout state (shows overlay). */
  burnedOut: boolean;
  /** Current run index; shown as \"Job #X\" in the UI. */
  runNumber: number;
  /** Which features are enabled; used to show/hide or gate mechanics. */
  featuresEnabled: FeaturesEnabled;
  gameProgress: {
    startedAt: number;
    canPurchasePersonalUpgrades: boolean;
    canPurchaseBossUpgrades: boolean;
    canPurchaseAssistantUpgrades: boolean;
    unlockedReviews: boolean;
    unlockedDeadline: boolean;
  };
  filters: {
    newerTasksFirst: boolean;
    showRejectedTasks: boolean;
    sfxOn: boolean;
  };
}

const initialState: GameStoreState = {
  money: 100000,
  RAM: 10,
  burnout: 0,
  paused: false,
  burnedOut: false,
  runNumber: 1,
  featuresEnabled: {
    requiresReview: false,
    rentPayment: false,
    uploadWorkCompleted: false,
    burnoutMeter: false,
  },
  gameProgress: {
    startedAt: Date.now(),
    canPurchasePersonalUpgrades: false,
    canPurchaseBossUpgrades: false,
    canPurchaseAssistantUpgrades: false,
    unlockedReviews: false,
    unlockedDeadline: false,
  },
  filters: {
    newerTasksFirst: true,
    showRejectedTasks: false,
    sfxOn: true,
  },
};

const useGameStore = createGameStore<
  GameStoreState,
  {
    addMoney: (amount: number) => void;
    spendMoney: (amount: number) => void;
    addRAM: (amount: number) => void;
    spendRAM: (amount: number) => void;
    setBurnout: (value: number) => void;
    setTaskSorting: (sortByNewer: boolean) => void;
    setShowingRejected: (showRejected: boolean) => void;
    setSfxOn: (sfxOn: boolean) => void;
    setGameProgress: (progressUpdate: Partial<GameStoreState['gameProgress']>) => void;
    setFeaturesEnabled: (update: Partial<FeaturesEnabled>) => void;
    setPaused: (paused: boolean) => void;
    setBurnedOut: (burnedOut: boolean) => void;
    startNewRun: () => void;
  }
>(
  {
    saveKey: 'game-store',
    initialState,
    savePrefix: '',
    saveSystem: localStorageSaveSystem,
  },
  (set, get) => ({
    addMoney: (amount: number) => {
      const money =
        get().money +
        amount *
        useUpgradesStore.getState().upgrades.personalMoneyPerTask.currentValue;
      set({ money });
      checkProgressTriggers();
    },
    spendMoney: (amount: number) => {
      set({ money: get().money - amount });
    },
    addRAM: (amount: number) => {
      set({ RAM: get().RAM + amount });
    },
    spendRAM: (amount: number) => {
      set({ RAM: Math.max(0, get().RAM - amount) });
    },
    setBurnout: (value: number) => {
      set({ burnout: Math.max(0, Math.min(100, value)) });
    },
    setTaskSorting: (sortByNewer: boolean) => {
      set((state) => ({
        filters: { ...state.filters, newerTasksFirst: sortByNewer },
      } as Partial<GameStoreState>));
    },
    setShowingRejected: (showRejected: boolean) => {
      set((state) => ({
        filters: { ...state.filters, showRejectedTasks: showRejected },
      } as Partial<GameStoreState>));
    },
    setSfxOn: (sfxOn: boolean) => {
      set((state) => ({
        filters: { ...state.filters, sfxOn },
      } as Partial<GameStoreState>));
    },
    setGameProgress: (progressUpdate) => {
      set((state) => ({
        gameProgress: { ...state.gameProgress, ...progressUpdate },
      } as Partial<GameStoreState>));
    },
    setFeaturesEnabled: (update) => {
      set((state) => ({
        featuresEnabled: { ...state.featuresEnabled, ...update },
      } as Partial<GameStoreState>));
    },
    setPaused: (paused) => {
      set({ paused });
    },
    setBurnedOut: (burnedOut) => {
      set({ burnedOut });
    },
    startNewRun: () => {
      const currentRun = get().runNumber ?? 1;

      // Reset run-scoped stores
      useTasksStore.getState().resetForNewRun();
      useAssistantStore.getState().resetForNewRun();
      useBossStore.getState().resetForNewRun();
      useRentStore.getState().resetForNewRun();
      useAssistantsUpgradesStore.getState().resetForNewRun();
      useBossUpgradesStore.getState().resetForNewRun();

      // Zero money for the new run
      set({ money: 0 });

      // Award Beer Money at start of run based on owned levels
      const beerMoney = useComputerUpgradesStore.getState().beerMoney;
      if (beerMoney && beerMoney.owned > 0) {
        const level = beerMoney.owned;
        const reward = 100 * Math.pow(2, level - 1);
        if (reward > 0) {
          // Use negative spendMoney to add raw money without per-task multipliers.
          set((state) => ({ money: state.money + reward }));
        }
      }

      // Increment run number, reset burnout, and unpause for the new Job
      set({ runNumber: currentRun + 1, paused: false, burnedOut: false, burnout: 0 });
    },
  })
);

export { useGameStore };
