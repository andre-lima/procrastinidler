import { create } from 'zustand';
import { Category, TaskState, type UpgradesState } from '../types';
import { useAssistantStore } from './assistantStore';
import { useGameStore } from './gameStore';
import { useBossStore } from './bossStore';
import { useTasksStore } from './tasksStore';
import { persist } from 'zustand/middleware';

export const useUpgradesStore = create<UpgradesState>()(
  persist(
    (set, get) => ({
      upgrades: {
        buyAssistants: {
          id: 'buyAssistants',
          type: 'assistants',
          currentValue: 0,
          baseValue: 0,
          cost: 15,
          rate: 3,
          owned: 0,
          ownedLimit: 5,
          deltaPerOwned: 0,
          runWhenPurchased: (upgrade) => {
            useAssistantStore.getState().addAssistant();
            if (upgrade.owned === 1) {
              useTasksStore
                .getState()
                .completeTask('canPurchaseAssistantUpgrades');
            }
          },
        },
        assistantEfficiency: {
          id: 'assistantEfficiency',
          type: 'assistants',
          currentValue: 100,
          baseValue: 100,
          cost: 30,
          rate: 1.3,
          owned: 0,
          ownedLimit: 30,
          deltaPerOwned: 5,
        },
        assistantsMultitasking: {
          id: 'assistantsMultitasking',
          type: 'assistants',
          currentValue: 1,
          baseValue: 0,
          cost: 100,
          rate: 2,
          owned: 1,
          ownedLimit: 5,
          deltaPerOwned: 1,
        },
        assistantInterval: {
          id: 'assistantInterval',
          type: 'assistants',
          currentValue: 1000,
          baseValue: 1000,
          cost: 300,
          rate: 2,
          owned: 0,
          ownedLimit: 10,
          deltaPerOwned: -50,
        },
        buyBoss: {
          id: 'buyBoss',
          type: 'boss',
          currentValue: 0,
          baseValue: 0,
          cost: 10,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
          runWhenPurchased: () => {
            useBossStore.getState().addBoss();
            useTasksStore.getState().completeTask('canPurchaseBossUpgrades');
          },
        },
        increaseDifficulty: {
          id: 'increaseDifficulty',
          type: 'boss',
          currentValue: 1,
          baseValue: 0,
          cost: 300,
          rate: 2,
          owned: 1,
          ownedLimit: 10,
          deltaPerOwned: 1,
        },
        requiresReview: {
          id: 'requiresReview',
          type: 'boss',
          currentValue: 0,
          baseValue: 0,
          cost: 1500,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
          runWhenPurchased: () => {
            useGameStore.getState().setGameProgress({ unlockedReviews: true });
          },
        },
        bossMultitasking: {
          id: 'bossMultitasking',
          type: 'boss',
          currentValue: 1,
          baseValue: 0,
          cost: 2000,
          rate: 1.5,
          owned: 1,
          ownedLimit: 5,
          deltaPerOwned: 1,
        },
        hasDeadline: {
          id: 'hasDeadline',
          type: 'boss',
          currentValue: 0,
          baseValue: 0,
          cost: 3000,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
          runWhenPurchased: () => {
            useGameStore.getState().setGameProgress({ unlockedDeadline: true });
          },
        },
        negotiateDeadline: {
          id: 'negotiateDeadline',
          type: 'boss',
          currentValue: 20,
          baseValue: 20,
          cost: 4000,
          rate: 1.5,
          owned: 0,
          ownedLimit: 5,
          deltaPerOwned: 5,
        },
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
        // bossInterval: {
        //   id: 'bossInterval',
        //   type: 'boss',
        //   currentValue: 1000,
        //   baseValue: 1000,
        //   cost: 500,
        //   rate: 2,
        //   owned: 0,
        //   ownedLimit: 10,
        //   deltaPerOwned: -50,
        // },
        personalMoneyPerTask: {
          id: 'personalMoneyPerTask',
          type: 'personal',
          currentValue: 1,
          baseValue: 1,
          cost: 5,
          rate: 1.2,
          owned: 0,
          ownedLimit: 50,
          deltaPerOwned: 0.2,
          runWhenPurchased: (upgrade) => {
            if (upgrade.owned === 1) {
              useTasksStore
                .getState()
                .completeTask('canPurchasePersonalUpgrades');
            }
          },
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
          deltaPerOwned: 5,
        },
        taskPairing: {
          id: 'taskPairing',
          type: 'personal',
          currentValue: 0,
          baseValue: 0,
          cost: 8000,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
        },
        secondChance: {
          id: 'secondChance',
          type: 'personal',
          currentValue: 0,
          baseValue: 0,
          cost: 10000,
          rate: 3,
          owned: 0,
          ownedLimit: 10,
          deltaPerOwned: 0,
          runWhenPurchased: () => {
            useTasksStore.getState().recoverTasks();
          },
        },
        FIRE: {
          id: 'FIRE',
          type: 'personal',
          currentValue: 0,
          baseValue: 0,
          cost: 10000000,
          rate: 1,
          owned: 0,
          ownedLimit: 1,
          deltaPerOwned: 0,
          runWhenPurchased() {
            useTasksStore.getState().newTask({
              id: 'youbeatthedemo',
              title: 'YOU BEAT THE DEMO!',
              category: Category.Metagame,
              assignedTo: [],
              difficulty: 10,
              requiresReview: false,
              state: TaskState.Todo,
              progress: 0,
              isSpecial: true,
            });

            setTimeout(() => {
              useTasksStore.getState().newTask({
                id: 'whatsNext',
                title: "What's hapenning to me? Am I stuck... Help me!",
                category: Category.Metagame,
                assignedTo: [],
                difficulty: 10,
                requiresReview: false,
                state: TaskState.Todo,
                progress: 0,
                isSpecial: true,
              });
            }, 5000);
          },
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

          upgrade.runWhenPurchased?.(upgrade);

          set((state: UpgradesState) => ({
            upgrades: { ...state.upgrades, [upgrade.id]: upgrade },
          }));
        }
      },
    }),
    { name: 'upgrades-store' }
  )
);
