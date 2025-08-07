import { humanNumber } from '../helpers/human-number';
import { Category, TaskState } from '../types';
import type { Upgrade } from '../types/assistant';
import { useAssistantStore } from './assistantStore';
import { useBossStore } from './bossStore';
import { useGameStore } from './gameStore';
import { useTasksStore } from './tasksStore';

export const gameEvents: Record<string, (upgrade: Upgrade) => void> = {
  runWhenPurchased_buyAssistants: (upgrade: Upgrade) => {
    useAssistantStore.getState().addAssistant();
    if (upgrade.owned === 1) {
      useTasksStore.getState().completeTask('canPurchaseAssistantUpgrades');
    }
  },

  runWhenPurchased_buyBoss: () => {
    if (!useBossStore.getState().boss) {
      useBossStore.getState().addBoss();
      useTasksStore.getState().completeTask('canPurchaseBossUpgrades');
    }
  },

  runWhenPurchased_requiresReview: () => {
    useGameStore.getState().setGameProgress({ unlockedReviews: true });
  },

  runWhenPurchased_hasDeadline: () => {
    useGameStore.getState().setGameProgress({ unlockedDeadline: true });
  },

  runWhenPurchased_personalMoneyPerTask: (upgrade: Upgrade) => {
    if (upgrade.owned === 1) {
      useTasksStore.getState().completeTask('canPurchasePersonalUpgrades');
    }
  },

  runWhenPurchased_secondChance: () => {
    useTasksStore.getState().recoverTasks();
  },

  runWhenPurchased_FIRE: () => {
    useTasksStore.getState().newTask({
      id: 'youbeatthedemo',
      title:
        'YOU BEAT THE DEMO! It took you ' +
        humanNumber(
          (Date.now() - useGameStore.getState().gameProgress.startedAt) / 60000
        ) +
        ' minutes.',
      category: Category.Metagame,
      assignedTo: [],
      difficulty: 10,
      requiresReview: false,
      state: TaskState.Todo,
      progress: 0,
      isSpecial: true,
    });
  },
};
