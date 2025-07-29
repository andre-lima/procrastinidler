export interface Todo {
  id: string;
  title: string;
  category: Category;
  difficulty: number;
  deadline?: number;
  assignedTo?: string;
  inReview: boolean;
  completed: boolean;
  progress: number;
}

export enum Category {
  Personal = 'Personal',
  Work = 'Work',
  Metagame = 'Metagame',
  Other = 'Other',
}
