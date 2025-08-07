import { Category, TaskState } from '../types';
import { useAssistantStore } from './assistantStore';
import { useBossStore } from './bossStore';
import { useGameStore } from './gameStore';
import { useTasksStore } from './tasksStore';
import { useUpgradesStore } from './upgradesStore';

export const checkProgressTriggers = () => {
  const money = useGameStore.getState().money;
  const upgrades = useUpgradesStore.getState().upgrades;
  const boss = useBossStore.getState().boss;
  const assistants = Object.keys(useAssistantStore.getState().assistants);

  const {
    canPurchaseAssistantUpgrades,
    canPurchaseBossUpgrades,
    canPurchasePersonalUpgrades,
  } = useGameStore.getState().gameProgress;

  if (
    money >= upgrades.buyAssistants.cost &&
    !canPurchaseAssistantUpgrades &&
    assistants.length === 0
  ) {
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

  if (money >= upgrades.buyBoss.cost && !canPurchaseBossUpgrades && !boss) {
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
    !canPurchasePersonalUpgrades &&
    upgrades.personalMoneyPerTask.owned === 0
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
