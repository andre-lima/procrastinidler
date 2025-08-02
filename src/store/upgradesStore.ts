import { create } from 'zustand';
import type { UpgradesState } from '../types';
import { useAssistantStore } from './assistantStore';
import { useGameStore } from './gameStore';
import { useBossStore } from './bossStore';

export const useUpgradesStore = create<UpgradesState>((set, get) => ({
  upgrades: {
    buyAssistants: {
      id: 'buyAssistants',
      type: 'assistants',
      currentValue: 0,
      baseValue: 0,
      cost: 20,
      rate: 3,
      owned: 0,
      ownedLimit: 5,
      deltaPerOwned: 0,
      callback: () => {
        useAssistantStore.getState().addAssistant();
      },
    },
    assistantEfficiency: {
      id: 'assistantEfficiency',
      type: 'assistants',
      currentValue: 100,
      baseValue: 100,
      cost: 50,
      rate: 1.2,
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
      callback: () => {
        useBossStore.getState().addBoss();
      },
    },
    increaseDifficulty: {
      id: 'increaseDifficulty',
      type: 'boss',
      currentValue: 1,
      baseValue: 0,
      cost: 1000,
      rate: 1.5,
      owned: 1,
      ownedLimit: 10,
      deltaPerOwned: 1,
    },
    requiresReview: {
      id: 'requiresReview',
      type: 'boss',
      currentValue: 0,
      baseValue: 0,
      cost: 2000,
      rate: 1,
      owned: 0,
      ownedLimit: 1,
      deltaPerOwned: 0,
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
    },
    negotiateDeadline: {
      id: 'negotiateDeadline',
      type: 'boss',
      currentValue: 30,
      baseValue: 30,
      cost: 4000,
      rate: 1.5,
      owned: 0,
      ownedLimit: 10,
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
    bossMultitasking: {
      id: 'bossMultitasking',
      type: 'boss',
      currentValue: 1,
      baseValue: 0,
      cost: 100,
      rate: 2,
      owned: 1,
      ownedLimit: 5,
      deltaPerOwned: 1,
    },
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
    personalMoneyPerTask: {
      id: 'personalMoneyPerTask',
      type: 'personal',
      currentValue: 1,
      baseValue: 1,
      cost: 10,
      rate: 1.2,
      owned: 0,
      ownedLimit: 30,
      deltaPerOwned: 0.2,
    },
    taskPairing: {
      id: 'taskPairing',
      type: 'personal',
      currentValue: 0,
      baseValue: 0,
      cost: 10000,
      rate: 1,
      owned: 0,
      ownedLimit: 1,
      deltaPerOwned: 0,
    },
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

      upgrade.callback?.();

      set((state: UpgradesState) => ({
        upgrades: { ...state.upgrades, [upgrade.id]: upgrade },
      }));
    }
  },
}));
