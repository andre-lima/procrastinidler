import type { Assistant, Upgrade } from './assistant';
import type { Boss } from './boss';
import type { Task } from './tasks';

export interface GameState {
  money: number;
  addMoney: (amount: number) => void;
}

export interface TasksState {
  tasks: Partial<Record<string, Task>>;
  getTasksArray: () => (Task | undefined)[];
  getNextUnassignedTask: (maxNumOfTasks: number) => (Task | undefined)[];
  assignAssistantToTask: (assistantId: string, task: Task) => void;
  newTask: (task?: Task) => void;
  makeProgress: (id: string) => void;
  completeTask: (id: string) => void;
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
