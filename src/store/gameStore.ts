import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Category, type GameState, type Todo } from '../types';
import { config } from '../game/config';
import { generateRandomTask } from '../helpers/generate-task';

const useGameStore = create<GameState>((set, get) => ({
  money: 0,
  todos: {},
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

      state.todos[newTodo.id] = newTodo;

      return { ...state };
    }),
  completeTodo: (id: string) =>
    set((state: GameState) => {
      const completedTodo = get().todos[id];

      if (completedTodo) {
        completedTodo.completed = true;
        get().addMoney(config.moneyPerTodoCompleted * completedTodo.difficulty);

        return {
          todos: get().todos,
        };
      }
      return state;
    }),
}));

export { useGameStore };
