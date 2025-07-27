export interface Todo {
  id: string;
  title: string;
  difficulty: number;
  deadline?: number;
  inProgress: boolean;
  completed: boolean;
}
