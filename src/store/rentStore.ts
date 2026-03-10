import { createGameStore } from '../reactive-store/createGameStore';
import { config } from '../game/config';
import { useGameStore } from './gameStore';
import { localStorageSaveSystem } from './saveSystem';

const rentIntervalMs = (config.rentIntervalSeconds ?? 120) * 1000;

interface RentStoreState {
  rentAmount: number;
  remainingMs: number;
}

const initialState: RentStoreState = {
  rentAmount: config.rentAmount ?? 100,
  remainingMs: rentIntervalMs,
};

export const useRentStore = createGameStore<
  RentStoreState,
  {
    tick: () => void;
  }
>(
  {
    saveKey: 'rent-store',
    initialState,
    savePrefix: '',
    saveSystem: localStorageSaveSystem,
  },
  (set, get) => ({
    tick: () => {
      const { remainingMs, rentAmount } = get();
      const newRemaining = remainingMs - config.tickLength;

      if (newRemaining <= 0) {
        useGameStore.getState().spendMoney(rentAmount);
        set({
          rentAmount: rentAmount * 2,
          remainingMs: rentIntervalMs,
        });
      } else {
        set({ remainingMs: newRemaining });
      }
    },
  })
);
