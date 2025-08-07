import { create } from 'zustand';
import { type UpgradesState } from '../types';
import { useGameStore } from './gameStore';
import { persist } from 'zustand/middleware';
import { gameEvents } from './gameEvents';
import { config } from '../game/config';

export const useUpgradesStore = create<UpgradesState>()(
  persist(
    (set, get) => ({
      upgrades: {
        buyAssistants: {
          id: 'buyAssistants',
          type: 'assistants',
          currentValue: 0,
          baseValue: 0,
          cost: 10,
          rate: 3.5,
          owned: 0,
          ownedLimit: 5,
          deltaPerOwned: 0,
        },
        assistantEfficiency: {
          id: 'assistantEfficiency',
          type: 'assistants',
          currentValue: 100,
          baseValue: 100,
          cost: 25,
          rate: 1.2,
          owned: 0,
          ownedLimit: 60,
          deltaPerOwned: 7.5,
        },
        assistantsMultitasking: {
          id: 'assistantsMultitasking',
          type: 'assistants',
          currentValue: 1,
          baseValue: 0,
          cost: 80,
          rate: 1.8,
          owned: 1,
          ownedLimit: 5,
          deltaPerOwned: 1,
        },
        assistantInterval: {
          id: 'assistantInterval',
          type: 'assistants',
          currentValue: config.tickLength,
          baseValue: config.tickLength,
          cost: 250,
          rate: 1.5,
          owned: 0,
          ownedLimit: 10,
          deltaPerOwned: -config.tickLength / 20,
        },
        bossAssistant: {
          id: 'bossAssistant',
          type: 'assistants',
          currentValue: 0,
          baseValue: 0,
          cost: 8000,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
        },
        buyBoss: {
          id: 'buyBoss',
          type: 'boss',
          currentValue: 0,
          baseValue: 0,
          cost: 12,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
        },
        increaseDifficulty: {
          id: 'increaseDifficulty',
          type: 'boss',
          currentValue: 1,
          baseValue: 0,
          cost: 300,
          rate: 1.5,
          owned: 1,
          ownedLimit: 20,
          deltaPerOwned: 1,
        },
        bossInterval: {
          id: 'bossInterval',
          type: 'boss',
          currentValue: config.tickLength,
          baseValue: config.tickLength,
          cost: 500,
          rate: 1.4,
          owned: 0,
          ownedLimit: 10,
          deltaPerOwned: -config.tickLength / 20,
        },
        requiresReview: {
          id: 'requiresReview',
          type: 'boss',
          currentValue: 0,
          baseValue: 0,
          cost: 1000,
          rate: 1.5,
          owned: 0,
          ownedLimit: 5,
          deltaPerOwned: 20,
        },
        bossMultitasking: {
          id: 'bossMultitasking',
          type: 'boss',
          currentValue: 1,
          baseValue: 0,
          cost: 1500,
          rate: 1.2,
          owned: 1,
          ownedLimit: 10,
          deltaPerOwned: 1,
        },
        promotion: {
          id: 'promotion',
          type: 'boss',
          currentValue: 1,
          baseValue: 0,
          cost: 10000,
          rate: 2,
          owned: 1,
          ownedLimit: 10,
          deltaPerOwned: 1,
        },
        // hasDeadline: {
        //   id: 'hasDeadline',
        //   type: 'boss',
        //   currentValue: 0,
        //   baseValue: 0,
        //   cost: 3000,
        //   rate: 1,
        //   owned: 0,
        //   ownedLimit: 1,
        //   deltaPerOwned: 0,
        // },
        // negotiateDeadline: {
        //   id: 'negotiateDeadline',
        //   type: 'boss',
        //   currentValue: 20,
        //   baseValue: 20,
        //   cost: 3000,
        //   rate: 1.5,
        //   owned: 0,
        //   ownedLimit: 5,
        //   deltaPerOwned: 5,
        // },
        // LGTM: {
        //   id: 'bossMultitasking',
        //   type: 'boss',
        //   currentValue: 1,
        //   baseValue: 0,
        //   cost: 100,
        //   rate: 2,
        //   owned: 1,
        //   ownedLimit: 5,
        //   deltaPerOwned: 1,
        // },
        personalMoneyPerTask: {
          id: 'personalMoneyPerTask',
          type: 'personal',
          currentValue: 1,
          baseValue: 1,
          cost: 5,
          rate: 1.3,
          owned: 0,
          ownedLimit: 500,
          deltaPerOwned: 1,
        },
        personalEfficiency: {
          id: 'personalEfficiency',
          type: 'personal',
          currentValue: 100,
          baseValue: 100,
          cost: 10,
          rate: 1.2,
          owned: 0,
          ownedLimit: 30,
          deltaPerOwned: 10,
        },
        personalTasksCreation: {
          id: 'personalTasksCreation',
          type: 'personal',
          currentValue: 1,
          baseValue: 0,
          cost: 300,
          rate: 1.4,
          owned: 0,
          ownedLimit: 6,
          deltaPerOwned: 5,
        },
        taskPairing: {
          id: 'taskPairing',
          type: 'personal',
          currentValue: 0,
          baseValue: 0,
          cost: 2000,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
        },
        // secondChance: {
        //   id: 'secondChance',
        //   type: 'personal',
        //   currentValue: 0,
        //   baseValue: 0,
        //   cost: 4000,
        //   rate: 2,
        //   owned: 0,
        //   ownedLimit: 10,
        //   deltaPerOwned: 0,
        // },
        FIRE: {
          id: 'FIRE',
          type: 'personal',
          currentValue: 0,
          baseValue: 0,
          cost: 5000000,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
        },
        // Billions: {
        //   id: 'Billions',
        //   type: 'personal',
        //   currentValue: 0,
        //   baseValue: 0,
        //   cost: 2000000000,
        //   rate: 1,
        //   owned: 0,
        //   ownedLimit: 1,
        //   deltaPerOwned: 0,
        // },
      },

      purchaseUpgrade: (upgradeId: string) => {
        const upgrade = get().upgrades[upgradeId];
        const money = useGameStore.getState().money;

        if (money >= upgrade.cost) {
          useGameStore.getState().spendMoney(upgrade.cost);
          upgrade.owned++;

          upgrade.currentValue =
            upgrade.baseValue + upgrade.deltaPerOwned * upgrade.owned;
          upgrade.cost = upgrade.cost * upgrade.rate;

          gameEvents['runWhenPurchased_' + upgradeId]?.(upgrade);

          set((state: UpgradesState) => ({
            upgrades: { ...state.upgrades, [upgrade.id]: upgrade },
          }));
        }
      },
    }),
    { name: 'upgrades-store' }
  )
);
