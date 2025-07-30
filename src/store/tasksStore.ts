import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Category, TaskState, type Task, type TasksState } from '../types';
import { config } from '../game/config';
import { generateRandomTask } from '../helpers/generate-task';
import { useGameStore } from './gameStore';
import { useAssistantStore } from './assistantStore';

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: {
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
  getTasksArray: () => Object.values(get().tasks),
  newTask: (task?: Task) => {
    const newTask = task || {
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

    set((state: TasksState) => ({
      tasks: { ...state.tasks, [newTask.id]: newTask },
    }));
  },

  getNextUnassignedTask: () => {
    const unassignedTask = get()
      .getTasksArray()
      .find(
        (task) =>
          task?.assignedTo.length === 0 && task?.state === TaskState.Todo
      );

    return unassignedTask;
  },
  assignAssistantToTask: (assistantId: string, task: Task) => {
    if (task) {
      task.assignedTo = [assistantId];
    }

    set((state: TasksState) =>
      task ? { tasks: { ...state.tasks, [task.id]: task } } : state
    );
  },
  makeProgress: (id: string) => {
    const task = get().tasks[id];

    if (task) {
      const progressPerClick =
        100 / (task.difficulty * config.clicksPerDifficultyLevel);

      task.progress += progressPerClick;

      if (task.progress >= 100) {
        get().completeTask(id);
      }
    }

    set((state: TasksState) =>
      task ? { tasks: { ...state.tasks, [id]: task } } : state
    );
  },

  completeTask: (id: string) => {
    const completedTask = get().tasks[id];

    if (completedTask) {
      completedTask.state = TaskState.Completed;
      completedTask.progress = 100;

      // Unassign from task and assistant
      completedTask.assignedTo.forEach((assistantId) =>
        useAssistantStore.getState().unassignTask(completedTask.id, assistantId)
      );
      completedTask.assignedTo = [];

      useGameStore
        .getState()
        .addMoney(config.moneyPerTaskCompleted * completedTask.difficulty);
    }

    set((state: TasksState) =>
      completedTask
        ? {
            tasks: { ...state.tasks, [id]: completedTask },
          }
        : state
    );
  },
}));
