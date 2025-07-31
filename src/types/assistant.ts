import type { Category, Task } from './tasks';

export interface Assistant {
  id: string;
  assignedTo: Task['id'][];
  category?: Category;
}

export interface Upgrade {
  id: string;
  type: 'assistants' | 'boss' | 'personal';
  baseValue: number;
  currentValue: number;
  description: string;
  cost: number;
  rate: number;
  owned: number;
  ownedLimit: number;
  deltaPerOwned: number;
  callback?: () => void;
}
