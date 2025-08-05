import type { Assistant, Upgrade } from './assistant';
import type { Boss } from './boss';
import { TaskState, type Task } from './tasks';

export interface GameState {
  money: number;
  filters: {
    newerTasksFirst: boolean;
    showRejectedTasks: boolean;
    isDarkMode: boolean;
  };
  gameProgress: {
    canPurchasePersonalUpgrades: boolean;
    canPurchaseBossUpgrades: boolean;
    canPurchaseAssistantUpgrades: boolean;
    unlockedReviews: boolean;
    unlockedDeadline: boolean;
  };
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => void;
  setTaskSorting: (sortByNewer: boolean) => void;
  setShowingRejected: (showRejected: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setGameProgress: (progressUpdate: Partial<GameState['gameProgress']>) => void;
}

export interface TasksState {
  tasks: Partial<Record<string, Task>>;
  getTasksArray: () => (Task | undefined)[];
  getNextUnassignedTask: (
    maxNumOfTasks: number,
    state?: TaskState
  ) => (Task | undefined)[];
  assignAssistantToTask: (assistantId: string, task: Task) => void;
  assignBossToTask: (task: Task) => void;
  newTask: (task?: Task) => void;
  makeProgress: (id: string, worker: 'assistant' | 'personal' | 'boss') => void;
  completeTask: (id: string) => void;
  rejectTask: (id: string) => void;
  recoverTasks: () => void;
}

export interface AssistantsState {
  assistants: Partial<Record<string, Assistant>>;
  addAssistant: () => void;
  assignTaskToAssistant: (taskId: string, assistantId: string) => void;
  unassignTask: (taskId: string, assistantId: string) => void;
}

export interface UpgradesState {
  upgrades: Record<string, Upgrade>;
  purchaseUpgrade: (upgradeId: string) => void;
}

export interface BossState {
  bossInterval: number;
  boss: Boss | null;
  addBoss: () => void;
  assignTaskToBoss: (todoId: string) => void;
  unassignTask: (todoId: string) => void;
}
