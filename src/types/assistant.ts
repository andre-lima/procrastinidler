import type { Category, Todo } from './todos';

export interface Assistant {
  id: string;
  category: Category;
  assignedTo: Todo[];
}
