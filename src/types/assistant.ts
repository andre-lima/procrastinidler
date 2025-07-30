import type { Category, Todo } from './tasks';

export interface Assistant {
  id: string;
  assignedTo: Todo['id'][];
  category?: Category;
}
