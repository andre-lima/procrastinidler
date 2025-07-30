import type { Assistant } from './assistant';

export enum TaskState {
  Todo = 'todo',
  InProgress = 'inProgress',
  InReview = 'inReview',
  Completed = 'completed',
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  difficulty: number;
  deadline?: number;
  assignedTo: Assistant['id'][];
  state: TaskState;
  progress: number;
  isSpecial?: boolean;
  requiresReview?: boolean;
}

export enum Category {
  Personal = 'Personal',
  Health = 'Health',
  Work = 'Work',
  Metagame = 'Metagame',
  Other = 'Other',
}
