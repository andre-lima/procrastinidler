import type { Assistant } from './assistant';
import type { Boss } from './boss';
import type { Task } from './tasks';

export interface GameState {
  money: number;
  addMoney: (amount: number) => void;
}

export interface TasksState {
  tasks: Partial<Record<string, Task>>;
  getTasksArray: () => (Task | undefined)[];
  getNextUnassignedTask: (assistantId: string) => Task | undefined;
  assignAssistantToTask: (assistantId: string, task: Task) => void;
  newTask: (task?: Task) => void;
  makeProgress: (id: string) => void;
  completeTask: (id: string) => void;
}

export interface AssistantsState {
  assistantInterval: number;
  assistants: Partial<Record<string, Assistant>>;
  assignTaskToAssistant: (taskId: string, assistantId: string) => void;
  unassignTask: (taskId: string, assistantId: string) => void;
}

export interface BossState {
  bossInterval: number;
  boss: Boss;
  assignTaskToBoss: (todoId: string) => void;
  unassignTask: (todoId: string) => void;
}
