import type { Todo } from './todos';

export interface GameState {
  money: number;
  todos: Todo[];
  completed: Todo[];
  addMoney: (amount: number) => void;
  newTodo: (todo?: Todo) => void;
  completeTodo: (id: string) => void;
}
