import { createGameStore } from '../reactive-store/createGameStore';
import type { Upgrade } from './assistantsUpgradesStore';
import { useGameStore } from './gameStore';
import { gameEvents } from './gameEvents';
import { localStorageSaveSystem } from './saveSystem';

interface PersonalUpgradesStoreState {
  personalMoneyPerTask: Upgrade;
  personalEfficiency: Upgrade;
  personalTasksCreation: Upgrade;
  taskPairing: Upgrade;
  FIRE: Upgrade;
}

const initialState: PersonalUpgradesStoreState = {
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
    baseValue: 1,
    cost: 300,
    rate: 1.4,
    owned: 0,
    ownedLimit: 10,
    deltaPerOwned: 1,
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
};

export const usePersonalUpgradesStore = createGameStore<
  PersonalUpgradesStoreState,
  { purchaseUpgrade: (upgradeId: string) => void }
>(
  {
    saveKey: 'personal-upgrades-store',
    initialState,
    savePrefix: '',
    saveSystem: localStorageSaveSystem,
  },
  (set, get) => ({
    purchaseUpgrade: (upgradeId: string) => {
      const upgrade = (get() as unknown as Record<string, Upgrade>)[upgradeId];
      const money = useGameStore.getState().money;

      if (upgrade && money >= upgrade.cost) {
        useGameStore.getState().spendMoney(upgrade.cost);
        const updated = { ...upgrade };
        updated.owned++;
        updated.currentValue =
          updated.baseValue + updated.deltaPerOwned * updated.owned;
        updated.cost = updated.cost * updated.rate;

        gameEvents['runWhenPurchased_' + upgradeId]?.(updated);

        set({ [updated.id]: updated });
      }
    },
  })
);
