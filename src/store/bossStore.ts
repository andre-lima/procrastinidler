import { create } from 'zustand';
import { type BossState } from '../types';
import { persist } from 'zustand/middleware';

export const useBossStore = create<BossState>()(
  persist(
    (set, get) => ({
      boss: null,
      bossInterval: 1000,
      assignTaskToBoss: (todoId: string) => {
        const boss = get().boss;

        boss?.assignedTo.push(todoId);

        set(() => ({
          boss,
        }));
      },
      addBoss: () => {
        const boss = get().boss;

        if (boss) {
          return;
        }

        set(() => ({
          boss: {
            assignedTo: [],
          },
        }));
      },
      unassignTask: (todoId: string) => {
        const boss = get().boss;

        if (boss) {
          boss.assignedTo = boss?.assignedTo.filter(
            (taskId) => taskId !== todoId
          );
        }

        set(() => ({
          boss,
        }));
      },
    }),
    { name: 'boss-store' }
  )
);
