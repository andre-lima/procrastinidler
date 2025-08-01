import { create } from 'zustand';
import { type GameState } from '../types';
import { useUpgradesStore } from './upgradesStore';

const useGameStore = create<GameState>((set, get) => ({
  money: 20000,
  addMoney: (amount: number, options?: { hasDeadline?: boolean }) => {
    if (options?.hasDeadline) {
      amount *= 2;
    }

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
}));

export { useGameStore };
