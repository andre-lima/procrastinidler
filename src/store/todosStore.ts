import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Category, TaskState, type Todo, type TodosState } from '../types';
import { config } from '../game/config';
import { generateRandomTask } from '../helpers/generate-task';
import { useGameStore } from './gameStore';
import { useAssistantStore } from './assistantStore';

export const useTodosStore = create<TodosState>((set, get) => ({
  todos: {
    initial: {
      id: 'initial',
      title: 'Click on this card 5 times',
      category: Category.Metagame,
      assignedTo: [],
      difficulty: 1,
      state: TaskState.Todo,
      progress: 0,
    },
    clickNewTask: {
      id: 'clickNewTask',
      title: 'Click the + Task button',
      category: Category.Metagame,
      assignedTo: [],
      difficulty: 1,
      state: TaskState.Todo,
      progress: 0,
      isSpecial: true,
    },
  },
  getTodosArray: () => Object.values(get().todos),
  newTodo: (todo?: Todo) => {
    const newTodo = todo || {
      id: uuid(),
      title: generateRandomTask(),
      category: Category.Metagame,
      deadline: 90,
      assignedTo: [],
      difficulty: 1,
      requiresReview: false,
      state: TaskState.Todo,
      progress: 0,
    };

    set((state: TodosState) => ({
      todos: { ...state.todos, [newTodo.id]: newTodo },
    }));
  },

  getNextUnassignedTask: () => {
    const unassignedTodo = get()
      .getTodosArray()
      .find(
        (todo) =>
          todo?.assignedTo.length === 0 && todo?.state === TaskState.Todo
      );

    return unassignedTodo;
  },
  assignAssistantToTask: (assistantId: string, todo: Todo) => {
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
      completedTodo.state = TaskState.Completed;
      completedTodo.progress = 100;

      // Unassign from task and assistant
      completedTodo.assignedTo.forEach((assistantId) =>
        useAssistantStore.getState().unassignTask(completedTodo.id, assistantId)
      );
      completedTodo.assignedTo = [];

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
