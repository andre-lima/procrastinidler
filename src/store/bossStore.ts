import { create } from 'zustand';
import { type BossState } from '../types';

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
