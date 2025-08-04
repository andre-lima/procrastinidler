import { create } from 'zustand';
import { type GameState } from '../types';
import { useUpgradesStore } from './upgradesStore';

const useGameStore = create<GameState>((set, get) => ({
  money: 5000000,
  gameProgress: {
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
}));

export { useGameStore };
