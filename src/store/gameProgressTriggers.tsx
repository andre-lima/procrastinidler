import { Category, TaskState } from '../types';
import { useGameStore } from './gameStore';
import { useTasksStore } from './tasksStore';
import { useUpgradesStore } from './upgradesStore';

export const checkProgressTriggers = () => {
  const money = useGameStore.getState().money;
  const upgrades = useUpgradesStore.getState().upgrades;
  const {
    canPurchaseAssistantUpgrades,
    canPurchaseBossUpgrades,
    canPurchasePersonalUpgrades,
  } = useGameStore.getState().gameProgress;

  if (money >= upgrades.buyAssistants.cost && !canPurchaseAssistantUpgrades) {
    useGameStore
      .getState()
      .setGameProgress({ canPurchaseAssistantUpgrades: true });

    useTasksStore.getState().newTask({
      id: 'canPurchaseAssistantUpgrades',
      title:
        'Click the Assistants button and hire an assistant to help you out.',
      category: Category.Metagame,
      assignedTo: [],
      difficulty: 1,
      requiresReview: false,
      state: TaskState.Todo,
      progress: 0,
      isSpecial: true,
    });
  }

  if (money >= upgrades.buyBoss.cost && !canPurchaseBossUpgrades) {
    useGameStore.getState().setGameProgress({ canPurchaseBossUpgrades: true });
    useTasksStore.getState().newTask({
      id: 'canPurchaseBossUpgrades',
      title: 'Click the Boss button and hire a boss to help you out.',
      category: Category.Metagame,
      assignedTo: [],
      difficulty: 1,
      requiresReview: false,
      state: TaskState.Todo,
      progress: 0,
      isSpecial: true,
    });
  }

  if (
    money >= upgrades.personalMoneyPerTask.cost &&
    !canPurchasePersonalUpgrades
  ) {
    useGameStore
      .getState()
      .setGameProgress({ canPurchasePersonalUpgrades: true });

    useTasksStore.getState().newTask({
      id: 'canPurchasePersonalUpgrades',
      title: 'Click the Personal button and purchase the 1st upgrade.',
      category: Category.Metagame,
      assignedTo: [],
      difficulty: 1,
      requiresReview: false,
      state: TaskState.Todo,
      progress: 0,
      isSpecial: true,
    });
  }
};
