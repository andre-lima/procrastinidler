import type { Category, Todo } from './todos';

export interface Assistant {
  id: string;
  assignedTo: Todo['id'][];
  category?: Category;
}
