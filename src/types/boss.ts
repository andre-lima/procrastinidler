import type { Todo } from './tasks';

export interface Boss {
  assignedTo: Todo['id'][];
}
