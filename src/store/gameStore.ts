import { create } from 'zustand';
import { type GameState } from '../types';
import { useUpgradesStore } from './upgradesStore';
import { checkProgressTriggers } from './gameProgressTriggers';

const useGameStore = create<GameState>((set, get) => ({
  money: 5000000,
  gameProgress: {
    canPurchasePersonalUpgrades: false,
    canPurchaseBossUpgrades: false,
    canPurchaseAssistantUpgrades: false,
    unlockedReviews: false,
    unlockedDeadline: false,
  },
  filters: {
    newerTasksFirst: false,
    showRejectedTasks: false,
  },
  addMoney: (amount: number) => {
    const money =
      get().money +
      amount *
        useUpgradesStore.getState().upgrades.personalMoneyPerTask.currentValue;

    checkProgressTriggers();

    set(() => ({ money }));
  },
  spendMoney: (amount: number) => {
    const money = get().money - amount;

    set(() => ({ money }));
  },
  setTaskSorting: (sortByNewer: boolean) => {
    set((state) => ({
      filters: { ...state.filters, newerTasksFirst: sortByNewer },
    }));
  },
  setShowingRejected: (showRejected: boolean) => {
    set((state) => ({
      filters: { ...state.filters, showRejectedTasks: showRejected },
    }));
  },
  setGameProgress: (progressUpdate) => {
    set((state) => ({
      gameProgress: { ...state.gameProgress, ...progressUpdate },
    }));
  },
}));

export { useGameStore };
