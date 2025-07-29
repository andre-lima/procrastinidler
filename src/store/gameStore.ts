import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Category, type GameState, type Todo } from '../types';
import { config } from '../game/config';
import { generateRandomTask } from '../helpers/generate-task';

const useGameStore = create<GameState>((set, get) => ({
  money: 0,
  assistantInterval: 1000,
  todos: {},
  getTodosArray: () => Object.values(get().todos),
  addMoney: (amount: number) => {
    const money = get().money + amount;

    set(() => ({ money }));
  },
  newTodo: (todo?: Todo) => {
    const newTodo = todo || {
      id: uuid(),
      title: generateRandomTask(),
      category: Category.Metagame,
      deadline: 90,
      assignedTo: undefined,
      difficulty: 1,
      inReview: false,
      completed: false,
      progress: 0,
    };

    set((state: GameState) => ({
      todos: { ...state.todos, [newTodo.id]: newTodo },
    }));
  },
  getNextUnassignedTask: (assistantId: string) => {
    const unassignedTodo = get()
      .getTodosArray()
      .find((todo) => !todo.assignedTo && !todo.completed && !todo.inReview);
    console.log(unassignedTodo, assistantId);

    if (unassignedTodo) {
      get().assignTask(assistantId, unassignedTodo);

      return unassignedTodo;
    }

    return undefined;
  },
  assignTask: (assistantId: string, todo: Todo) => {
    if (todo) {
      todo.assignedTo = assistantId;
    }

    set((state: GameState) =>
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

    set((state: GameState) =>
      todo ? { todos: { ...state.todos, [id]: todo } } : state
    );
  },
  completeTodo: (id: string) => {
    const completedTodo = get().todos[id];

    if (completedTodo) {
      completedTodo.completed = true;

      get().addMoney(config.moneyPerTodoCompleted * completedTodo.difficulty);
    }

    set((state: GameState) =>
      completedTodo
        ? {
            todos: { ...state.todos, [id]: completedTodo },
          }
        : state
    );
  },
}));

export { useGameStore };
