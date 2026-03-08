import { createGameStore } from '../reactive-store/createGameStore';
import type { Upgrade } from '../types/assistant';
import { useGameStore } from './gameStore';
import { gameEvents } from './gameEvents';
import { config } from '../game/config';
import { localStorageSaveSystem } from './saveSystem';

interface UpgradesStoreState {
  upgrades: Record<string, Upgrade>;
}

const initialState: UpgradesStoreState = {
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
  },
};

export const useUpgradesStore = createGameStore<
  UpgradesStoreState,
  { purchaseUpgrade: (upgradeId: string) => void }
>(
  {
    saveKey: 'upgrades-store',
    initialState,
    savePrefix: '',
    saveSystem: localStorageSaveSystem,
  },
  (set, get) => ({
    purchaseUpgrade: (upgradeId: string) => {
      const upgrade = get().upgrades[upgradeId];
      const money = useGameStore.getState().money;

      if (upgrade && money >= upgrade.cost) {
        useGameStore.getState().spendMoney(upgrade.cost);
        const updated = { ...upgrade };
        updated.owned++;
        updated.currentValue =
          updated.baseValue + updated.deltaPerOwned * updated.owned;
        updated.cost = updated.cost * updated.rate;

        gameEvents['runWhenPurchased_' + upgradeId]?.(updated);

        set({
          upgrades: { ...get().upgrades, [updated.id]: updated },
        });
      }
    },
  })
);
