import { createGameStore } from '../reactive-store/createGameStore';
import { useUpgradesStore } from './upgradesStore';
import { checkProgressTriggers } from './gameProgressTriggers';
import { localStorageSaveSystem } from './saveSystem';

interface GameStoreState {
  money: number;
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
  money: 0,
  gameProgress: {
    startedAt: Date.now(),
    canPurchasePersonalUpgrades: false,
    canPurchaseBossUpgrades: false,
    canPurchaseAssistantUpgrades: false,
    unlockedReviews: false,
    unlockedDeadline: false,
  },
  filters: {
    newerTasksFirst: false,
    showRejectedTasks: false,
    sfxOn: true,
  },
};

const useGameStore = createGameStore<
  GameStoreState,
  {
    addMoney: (amount: number) => void;
    spendMoney: (amount: number) => void;
    setTaskSorting: (sortByNewer: boolean) => void;
    setShowingRejected: (showRejected: boolean) => void;
    setSfxOn: (sfxOn: boolean) => void;
    setGameProgress: (progressUpdate: Partial<GameStoreState['gameProgress']>) => void;
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
  })
);

export { useGameStore };
