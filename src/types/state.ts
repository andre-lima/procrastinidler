import type { Todo } from './todos';

export interface GameState {
  money: number;
  todos: Record<string, Todo>;
  assistantInterval: number;
  addMoney: (amount: number) => void;
  newTodo: (todo?: Todo) => void;
  makeProgress: (id: string) => void;
  completeTodo: (id: string) => void;
}
