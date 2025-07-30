import { create } from 'zustand';
import { type GameState } from '../types';

const useGameStore = create<GameState>((set, get) => ({
  money: 300000,
  addMoney: (amount: number) => {
    const money = get().money + amount;

    set(() => ({ money }));
  },
}));

export { useGameStore };
