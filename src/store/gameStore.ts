import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { GameState, Todo } from '../types';
import { config } from '../game/config';

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
        title: 'random todo title',
        difficulty: 1,
        inProgress: false,
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
          money: get().money + config.moneyPerTodoCompleted,
          todos: get().todos.filter((todo) => todo.id !== id),
          completed: [...get().completed, completedTodo],
        };
      }
      return state;
    }),
}));

export { useGameStore };
