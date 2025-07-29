import type { Assistant } from './assistant';

export interface Todo {
  id: string;
  title: string;
  category: Category;
  difficulty: number;
  deadline?: number;
  assignedTo: Assistant['id'][];
  inReview: boolean;
  completed: boolean;
  progress: number;
}

export enum Category {
  Personal = 'Personal',
  Health = 'Health',
  Work = 'Work',
  Metagame = 'Metagame',
  Other = 'Other',
}
