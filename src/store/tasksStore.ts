import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Category, TaskState, type Task, type TasksState } from '../types';
import { config } from '../game/config';
import { generateRandomTask } from '../helpers/generate-task';
import { useGameStore } from './gameStore';
import { useAssistantStore } from './assistantStore';
import { getRandomCategory } from '../helpers/random-category';

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
      category: getRandomCategory(),
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

  getNextUnassignedTask: (numToAssign: number = 1) => {
    const tasksToAssign: Task[] = [];

    const tasks = get().getTasksArray();

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      if (
        task?.assignedTo.length === 0 &&
        task?.state === TaskState.Todo &&
        !task.isSpecial
      ) {
        tasksToAssign.push(task);
      }

      if (tasksToAssign.length === numToAssign) {
        break;
      }
    }

    return tasksToAssign;
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

    if (task && task.progress < 100) {
      const progressPerClick =
        100 / (task.difficulty * config.clicksPerDifficultyLevel);

      task.progress += progressPerClick;

      if (task.progress >= 100) {
        setTimeout(() => {
          get().completeTask(id);
        }, 300);
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
