import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Category, type GameState, type Todo } from '../types';
import { config } from '../game/config';
import { faker } from '@faker-js/faker';
import { generateRandomTask } from '../helpers/generate-task';

const useGameStore = create<GameState>()((set, get) => ({
  money: 0,
  todos: [],
  completed: [],
  addMoney: (amount: number) =>
    set((state: GameState) => ({ money: state.money + amount })),
  newTodo: (todo?: Todo) =>
    set((state: GameState) => {
      const newTodo = todo || {
        id: uuid(),
        title: generateRandomTask(),
        category: Category.Metagame,
        deadline: 90,
        difficulty: 2,
        inReview: false,
        completed: false,
      };

      return { todos: [...state.todos, newTodo] };
    }),
  completeTodo: (id: string) =>
    set((state: GameState) => {
      const completedTodo = get().todos.find((todo) => todo.id === id);

      if (completedTodo) {
        completedTodo.completed = true;

        return {
          money:
            get().money +
            config.moneyPerTodoCompleted * completedTodo.difficulty,
          todos: get().todos.filter((todo) => todo.id !== id),
          completed: [...get().completed, completedTodo],
        };
      }
      return state;
    }),
}));

export { useGameStore };
