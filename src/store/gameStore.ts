import { create } from 'zustand';
import { type GameState } from '../types';
import { useUpgradesStore } from './upgradesStore';
import { checkProgressTriggers } from './gameProgressTriggers';
import { persist } from 'zustand/middleware';

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      money: 4500,
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
        isDarkMode: false,
        sfxOn: true,
      },
      addMoney: (amount: number) => {
        const money =
          get().money +
          amount *
            useUpgradesStore.getState().upgrades.personalMoneyPerTask
              .currentValue;

        set(() => ({ money }));
        checkProgressTriggers();
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
      setDarkMode: (isDarkMode: boolean) =>
        set((state) => ({
          filters: { ...state.filters, isDarkMode },
        })),
      setSfxOn: (sfxOn: boolean) =>
        set((state) => ({
          filters: { ...state.filters, sfxOn },
        })),
      setGameProgress: (progressUpdate) => {
        set((state) => ({
          gameProgress: { ...state.gameProgress, ...progressUpdate },
        }));
      },
    }),
    { name: 'game-store' }
  )
);

export { useGameStore };
