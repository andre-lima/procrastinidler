import type { Assistant } from './assistant';
import type { Todo } from './todos';

export interface GameState {
  money: number;
  addMoney: (amount: number) => void;
}

export interface TodosState {
  todos: Partial<Record<string, Todo>>;
  getTodosArray: () => (Todo | undefined)[];
  getNextUnassignedTask: (assistantId: string) => Todo | undefined;
  assignAssistantToTask: (assistantId: string, todo: Todo) => void;
  newTodo: (todo?: Todo) => void;
  makeProgress: (id: string) => void;
  completeTodo: (id: string) => void;
}

export interface AssistantsState {
  assistantInterval: number;
  assistants: Partial<Record<string, Assistant>>;
  assignTaskToAssistant: (todoId: string, assistantId: string) => void;
}
