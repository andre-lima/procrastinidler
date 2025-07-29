import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Category, type Todo, type TodosState } from '../types';
import { config } from '../game/config';
import { generateRandomTask } from '../helpers/generate-task';
import { useGameStore } from './gameStore';

export const useTodos = create<TodosState>((set, get) => ({
  todos: {},
  getTodosArray: () => Object.values(get().todos),
  newTodo: (todo?: Todo) => {
    const newTodo = todo || {
      id: uuid(),
      title: generateRandomTask(),
      category: Category.Metagame,
      deadline: 90,
      assignedTo: [],
      difficulty: 1,
      inReview: false,
      completed: false,
      progress: 0,
    };

    set((state: TodosState) => ({
      todos: { ...state.todos, [newTodo.id]: newTodo },
    }));
  },

  getNextUnassignedTask: (assistantId: string) => {
    const unassignedTodo = get()
      .getTodosArray()
      .find(
        (todo) =>
          todo?.assignedTo.length === 0 && !todo?.completed && !todo?.inReview
      );

    // get().assignTask(assistantId, unassignedTodo);
    return unassignedTodo;
  },
  assignTask: (assistantId: string, todo: Todo) => {
    if (todo) {
      todo.assignedTo = [assistantId];
    }

    set((state: TodosState) =>
      todo ? { todos: { ...state.todos, [todo.id]: todo } } : state
    );
  },
  makeProgress: (id: string) => {
    const todo = get().todos[id];

    if (todo) {
      const progressPerClick =
        100 / (todo.difficulty * config.clicksPerDifficultyLevel);

      todo.progress += progressPerClick;

      if (todo.progress >= 100) {
        get().completeTodo(id);
      }
    }

    set((state: TodosState) =>
      todo ? { todos: { ...state.todos, [id]: todo } } : state
    );
  },

  completeTodo: (id: string) => {
    const completedTodo = get().todos[id];

    if (completedTodo) {
      completedTodo.completed = true;

      useGameStore
        .getState()
        .addMoney(config.moneyPerTodoCompleted * completedTodo.difficulty);
    }

    set((state: TodosState) =>
      completedTodo
        ? {
            todos: { ...state.todos, [id]: completedTodo },
          }
        : state
    );
  },
}));
