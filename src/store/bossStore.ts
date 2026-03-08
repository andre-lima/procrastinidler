import { createGameStore } from '../reactive-store/createGameStore';
import type { Boss } from '../types/boss';
import { config } from '../game/config';
import { localStorageSaveSystem } from './saveSystem';

interface BossStoreState {
  boss: Boss | null;
  bossInterval: number;
}

const initialState: BossStoreState = {
  boss: null,
  bossInterval: config.tickLength,
};

export const useBossStore = createGameStore<
  BossStoreState,
  {
    assignTaskToBoss: (todoId: string) => void;
    addBoss: () => void;
    unassignTask: (todoId: string) => void;
  }
>(
  {
    saveKey: 'boss-store',
    initialState,
    savePrefix: '',
    saveSystem: localStorageSaveSystem,
  },
  (set, get) => ({
    assignTaskToBoss: (todoId: string) => {
      const boss = get().boss;
      boss?.assignedTo.push(todoId);
      set({ boss: boss ?? null });
    },
    addBoss: () => {
      if (get().boss) return;
      set({
        boss: {
          assignedTo: [],
        },
      });
    },
    unassignTask: (todoId: string) => {
      const boss = get().boss;
      if (boss) {
        boss.assignedTo = boss.assignedTo.filter((taskId) => taskId !== todoId);
      }
      set({ boss: boss ?? null });
    },
  })
);
