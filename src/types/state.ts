import type { Todo } from './todos';

export interface GameState {
  money: number;
  todos: Record<string, Todo>;
  getTodosArray: () => Todo[];
  assistantInterval: number;
  getNextUnassignedTask: (assistantId: string) => Todo | undefined;
  assignTask: (assistantId: string, todo: Todo) => void;
  addMoney: (amount: number) => void;
  newTodo: (todo?: Todo) => void;
  makeProgress: (id: string) => void;
  completeTodo: (id: string) => void;
}
