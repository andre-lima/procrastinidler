import { create } from 'zustand';
import { type BossState, type UpgradesState } from '../types';
import { useGameStore } from './gameStore';

export const useBossUpgradesStore = create<UpgradesState>((set, get) => ({
  upgrades: {
    buyBoss: {
      id: 'buyBoss',
      currentValue: 0,
      baseValue: 0,
      description:
        'Hire a boss to help you create and eventually review tasks.',
      cost: 200,
      rate: 2,
      owned: 0,
      ownedLimit: 5,
      deltaPerOwned: 0,
      callback: () => {
        // useBossStore.getState().addBoss();
      },
    },
    multitasking: {
      id: 'multitasking',
      currentValue: 1,
      baseValue: 0,
      description: 'The Boss can review more tasks at once',
      cost: 100,
      rate: 2,
      owned: 1,
      ownedLimit: 5,
      deltaPerOwned: 1,
    },
    interval: {
      id: 'interval',
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

export const useBossStore = create<BossState>((set, get) => ({
  boss: {
    assignedTo: [],
  },
  bossInterval: 1000,
  assignTaskToBoss: (todoId: string) => {
    const boss = get().boss;

    boss?.assignedTo.push(todoId);

    set(() => ({
      boss,
    }));
  },
  unassignTask: (todoId: string) => {
    const boss = get().boss;

    if (boss) {
      boss.assignedTo = boss?.assignedTo.filter((taskId) => taskId !== todoId);
    }

    set(() => ({
      boss,
    }));
  },
}));
