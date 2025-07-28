import type { Todo } from './todos';

export interface GameState {
  money: number;
  todos: Record<string, Todo>;
  addMoney: (amount: number) => void;
  newTodo: (todo?: Todo) => void;
  completeTodo: (id: string) => void;
}
