import { createGameStore } from '../reactive-store/createGameStore';
export interface Upgrade {
  id: string;
  type: 'assistants' | 'boss' | 'personal' | 'computer';
  baseValue: number;
  currentValue: number;
  cost: number;
  rate: number;
  owned: number;
  ownedLimit: number;
  deltaPerOwned: number;
  /** Currency for purchase; default 'money'. Computer upgrades use 'RAM'. */
  currency?: 'money' | 'RAM';
}
import { useGameStore } from './gameStore';
import { gameEvents } from './gameEvents';
import { config } from '../game/config';
import { localStorageSaveSystem } from './saveSystem';

interface AssistantsUpgradesStoreState {
  buyAssistants: Upgrade;
  // assistantEfficiency: Upgrade;
  assistantInterval: Upgrade;
  bossAssistant: Upgrade;
}

const initialState: AssistantsUpgradesStoreState = {
  buyAssistants: {
    id: 'buyAssistants',
    type: 'assistants',
    currentValue: 0,
    baseValue: 0,
    cost: 10,
    rate: 5,
    owned: 0,
    ownedLimit: 5,
    deltaPerOwned: 0,
  },
  // assistantEfficiency: {
  //   id: 'assistantEfficiency',
  //   type: 'assistants',
  //   currentValue: 100,
  //   baseValue: 100,
  //   cost: 25,
  //   rate: 1.2,
  //   owned: 0,
  //   ownedLimit: 60,
  //   deltaPerOwned: 7.5,
  // },
  // Lowers fill time per task (same idea as bossInterval: lower currentValue = faster completion in tickWorkerProgress).
  assistantInterval: {
    id: 'assistantInterval',
    type: 'assistants',
    currentValue: config.assistantFillSpeedSeconds * 1000,
    baseValue: config.assistantFillSpeedSeconds * 1000,
    cost: 250,
    rate: 1.5,
    owned: 0,
    ownedLimit: 50,
    deltaPerOwned: -(config.assistantFillSpeedSeconds * 10),
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
};

export const useAssistantsUpgradesStore = createGameStore<
  AssistantsUpgradesStoreState,
  { purchaseUpgrade: (upgradeId: string) => void; resetForNewRun: () => void }
>(
  {
    saveKey: 'assistants-upgrades-store',
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
    resetForNewRun: () => {
      set({ ...initialState });
    },
  })
);
