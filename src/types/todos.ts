export interface Todo {
  id: string;
  title: string;
  category: Category;
  difficulty: number;
  deadline?: number;
  inReview: boolean;
  completed: boolean;
}

export enum Category {
  Personal = 'Personal',
  Work = 'Work',
  Metagame = 'Metagame',
  Other = 'Other',
}
