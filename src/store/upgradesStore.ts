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
      description: 'Buy a new assistant',
      cost: 200,
      rate: 2,
      owned: 0,
      ownedLimit: 5,
      deltaPerOwned: 0,
      callback: () => {
        useAssistantStore.getState().addAssistant();
      },
    },
    assistantsMultitasking: {
      id: 'assistantsMultitasking',
      type: 'assistants',
      currentValue: 1,
      baseValue: 0,
      description: 'Assistants can take on more tasks at once',
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
      description: 'Increase Assistants work speed by 5%',
      cost: 10,
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
      description:
        'Hire a boss to help you create and eventually review tasks.',
      cost: 200,
      rate: 2,
      owned: 0,
      ownedLimit: 1,
      deltaPerOwned: 0,
      callback: () => {
        useBossStore.getState().addBoss();
      },
    },
    bossMultitasking: {
      id: 'bossMultitasking',
      type: 'boss',
      currentValue: 1,
      baseValue: 0,
      description: 'The Boss can review more tasks at once',
      cost: 100,
      rate: 2,
      owned: 1,
      ownedLimit: 5,
      deltaPerOwned: 1,
    },
    bossInterval: {
      id: 'bossInterval',
      type: 'boss',
      currentValue: 1000,
      baseValue: 1000,
      description: 'Increase task creation speed by 5%',
      cost: 10,
      rate: 2,
      owned: 0,
      ownedLimit: 10,
      deltaPerOwned: -50,
    },
  },

  purchaseUpgrade: (upgradeId: string) => {
    const upgrade = get().upgrades[upgradeId];
    const money = useGameStore.getState().money;

    if (money >= upgrade.cost) {
      upgrade.owned++;
      useGameStore.getState().addMoney(-upgrade.cost);

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
