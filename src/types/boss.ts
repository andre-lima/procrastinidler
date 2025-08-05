import type { Task } from './tasks';

export interface Boss {
  assignedTo: Task['id'][];
}
