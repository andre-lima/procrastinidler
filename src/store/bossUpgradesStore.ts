import { createGameStore } from '../reactive-store/createGameStore';
import type { Upgrade } from './assistantsUpgradesStore';
import { useGameStore } from './gameStore';
import { gameEvents } from './gameEvents';
import { config } from '../game/config';
import { localStorageSaveSystem } from './saveSystem';

interface BossUpgradesStoreState {
  buyBoss: Upgrade;
  increaseDifficulty: Upgrade;
  bossInterval: Upgrade;
  requiresReview: Upgrade;
  bossMultitasking: Upgrade;
  promotion: Upgrade;
}

const initialState: BossUpgradesStoreState = {
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
    currentValue: config.bossFillSpeedSeconds * 1000,
    baseValue: config.bossFillSpeedSeconds * 1000,
    cost: 500,
    rate: 1.4,
    owned: 0,
    ownedLimit: 10,
    deltaPerOwned: -(config.bossFillSpeedSeconds * 1000) / 10,
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
};

export const useBossUpgradesStore = createGameStore<
  BossUpgradesStoreState,
  { purchaseUpgrade: (upgradeId: string) => void }
>(
  {
    saveKey: 'boss-upgrades-store',
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
