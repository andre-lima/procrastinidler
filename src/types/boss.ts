import type { Todo } from './todos';

export interface Boss {
  assignedTo: Todo['id'][];
}
