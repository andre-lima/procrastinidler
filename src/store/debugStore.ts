import { create } from 'zustand';
import { useGameStore } from './gameStore';

/** Debug-only store (not persisted). Press "d" to toggle 3x game speed. */
interface DebugState {
  /** 1 = normal, 3 = debug 3x speed. */
  speedMultiplier: number;
  toggleSpeed: (multiplier?: number) => void;
  giveMoney: (amount: number) => void;
  giveRAM: (amount: number) => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  speedMultiplier: 1,
  toggleSpeed: (multiplier = 10) =>
    set((s) => ({ speedMultiplier: s.speedMultiplier !== 1 ? 1 : multiplier })),
  giveMoney: (amount: number) => useGameStore.getState().addMoney(amount),
  giveRAM: (amount: number) => useGameStore.getState().addRAM(amount),
}));
