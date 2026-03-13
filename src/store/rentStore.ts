import { createGameStore } from '../reactive-store/createGameStore';
import { config } from '../game/config';
import { useGameStore } from './gameStore';
import { useEventsStore } from './eventsStore';
import { localStorageSaveSystem } from './saveSystem';
import { humanNumber } from '../helpers/human-number';

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
    resetForNewRun: () => void;
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
        const moneyBefore = useGameStore.getState().money;
        useGameStore.getState().spendMoney(rentAmount);
        if (moneyBefore >= rentAmount) {
          useEventsStore.getState().addEvent('rent_paid', { amount: humanNumber(rentAmount) });
        } else {
          const owedAmount = moneyBefore > 0 ? rentAmount - moneyBefore : rentAmount;
          useEventsStore.getState().addEvent('rent_owed', { amount: humanNumber(owedAmount) });
        }
        set({
          rentAmount: rentAmount * 2,
          remainingMs: rentIntervalMs,
        });
      } else {
        set({ remainingMs: newRemaining });
      }
    },
    resetForNewRun: () => {
      set({ rentAmount: initialState.rentAmount, remainingMs: rentIntervalMs });
    },
  })
);
