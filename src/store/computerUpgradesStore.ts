import { createGameStore } from '../reactive-store/createGameStore';
import type { Upgrade } from './assistantsUpgradesStore';
import { useGameStore } from './gameStore';
import { localStorageSaveSystem } from './saveSystem';

/** Computer upgrades (e.g. task slots, multitasking); purchased with RAM. */
interface ComputerUpgradesStoreState {
  taskSlots: Upgrade;
  assistantsMultitasking: Upgrade;
  bossMultitasking: Upgrade;
  beerMoney: Upgrade;
}

const initialState: ComputerUpgradesStoreState = {
  // Extra task slots for the main board.
  taskSlots: {
    id: 'taskSlots',
    type: 'computer',
    currentValue: 10,
    baseValue: 10,
    cost: 1,
    rate: 1,
    owned: 0,
    ownedLimit: 20,
    deltaPerOwned: 2,
    currency: 'RAM',
  },
  // Assistants can take on more tasks at once.
  assistantsMultitasking: {
    id: 'assistantsMultitasking',
    type: 'computer',
    currentValue: 1,
    baseValue: 0,
    cost: 2,
    rate: 1.8,
    owned: 1,
    ownedLimit: 5,
    deltaPerOwned: 1,
    currency: 'RAM',
  },
  // Boss can juggle more review tasks at once.
  bossMultitasking: {
    id: 'bossMultitasking',
    type: 'computer',
    currentValue: 1,
    baseValue: 0,
    cost: 2,
    rate: 1.2,
    owned: 1,
    ownedLimit: 10,
    deltaPerOwned: 1,
    currency: 'RAM',
  },
  // Use your work computer to spin up a side gig that covers rent for a while.
  beerMoney: {
    id: 'beerMoney',
    type: 'computer',
    // currentValue tracks level; reward is granted on purchase via money payout.
    currentValue: 0,
    baseValue: 0,
    cost: 1,
    rate: 1.5,
    owned: 0,
    ownedLimit: 10,
    deltaPerOwned: 1,
    currency: 'RAM',
  },
};

export const useComputerUpgradesStore = createGameStore<
  ComputerUpgradesStoreState,
  { purchaseUpgrade: (upgradeId: string) => void }
>(
  {
    saveKey: 'computer-upgrades-store',
    initialState,
    savePrefix: '',
    saveSystem: localStorageSaveSystem,
  },
  (set, get) => ({
    purchaseUpgrade: (upgradeId: string) => {
      const upgrade = (get() as unknown as Record<string, Upgrade>)[upgradeId];
      const ram = useGameStore.getState().RAM;

      if (upgrade && ram >= upgrade.cost) {
        useGameStore.getState().spendRAM(upgrade.cost);
        const updated = { ...upgrade };
        updated.owned++;
        updated.currentValue =
          updated.baseValue + updated.deltaPerOwned * updated.owned;
        updated.cost = Math.ceil(updated.cost * updated.rate);

        // Beer Money pays out a lump sum in dollars when purchased.
        if (updated.id === 'beerMoney') {
          const level = updated.owned;
          const reward =
            level <= 0 ? 0 : 100 * Math.pow(2, level - 1); // 0, 100, 200, 400, 800, 1600, ...
          if (reward > 0) {
            // Use negative spendMoney to add raw money without per-task multipliers.
            useGameStore.getState().spendMoney(-reward);
          }
        }

        set({ [updated.id]: updated });
      }
    },
  })
);
