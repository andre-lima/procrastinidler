import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Category, TaskState, type Task, type TasksState } from '../types';
import { config } from '../game/config';
import { generateRandomTask } from '../helpers/generate-task';
import { useGameStore } from './gameStore';
import { useAssistantStore } from './assistantStore';
import { getRandomCategory } from '../helpers/random-category';
import { useUpgradesStore } from './upgradesStore';
import { useBossStore } from './bossStore';

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: {
    initial: {
      id: 'initial',
      title: 'Click white cards to complete them and earn money $',
      category: Category.Metagame,
      assignedTo: [],
      difficulty: 1,
      state: TaskState.Todo,
      progress: 0,
      deadline: 15,
      requiresReview: false,
    },
    clickNewTask: {
      id: 'clickNewTask',
      title: 'Click the + Task button on the top left to create new tasks',
      category: Category.Metagame,
      assignedTo: [],
      difficulty: 1,
      state: TaskState.Todo,
      progress: 0,
      isSpecial: true,
    },
    // requiresReview: {
    //   id: 'requiresReview',
    //   requiresReview: true,
    //   title: 'This task requires review',
    //   category: Category.Metagame,
    //   assignedTo: [],
    //   difficulty: 1,
    //   state: TaskState.Todo,
    //   progress: 0,
    // },
    // inReview: {
    //   id: 'inReview',
    //   requiresReview: true,
    //   title: 'This task is in review',
    //   category: Category.Metagame,
    //   assignedTo: [],
    //   difficulty: 1,
    //   state: TaskState.InReview,
    //   progress: 0,
    // },
  },
  getTasksArray: () => Object.values(get().tasks),
  newTask: (task?: Task) => {
    const deadline =
      useUpgradesStore.getState().upgrades.hasDeadline.owned === 1
        ? useUpgradesStore.getState().upgrades.negotiateDeadline.currentValue
        : undefined;

    const newTask = task || {
      id: uuid(),
      title: generateRandomTask(),
      category: getRandomCategory(),
      deadline,
      assignedTo: [],
      difficulty:
        useUpgradesStore.getState().upgrades.increaseDifficulty.currentValue,
      requiresReview:
        useUpgradesStore.getState().upgrades.requiresReview.owned === 1,
      state: TaskState.Todo,
      progress: 0,
    };

    set((state: TasksState) => ({
      tasks: { ...state.tasks, [newTask.id]: newTask },
    }));
  },
  recoverTasks: () => {
    const tasks = get().getTasksArray();

    tasks.forEach((task) => {
      if (task?.state === TaskState.Rejected) {
        task.state = TaskState.Todo;
      }
    });

    set((state: TasksState) => ({
      tasks: { ...state.tasks },
    }));
  },
  getNextUnassignedTask: (
    numToAssign: number = 1,
    taskState = TaskState.Todo
  ) => {
    const tasksToAssign: Task[] = [];

    const tasks = get().getTasksArray();

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      if (
        task?.assignedTo.length === 0 &&
        task?.state === taskState &&
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
  assignBossToTask: (task: Task) => {
    if (task) {
      task.assignedTo = ['boss'];
    }

    set((state: TasksState) =>
      task ? { tasks: { ...state.tasks, [task.id]: task } } : state
    );
  },
  makeProgress: (id: string, worker: 'assistant' | 'personal' | 'boss') => {
    const task = get().tasks[id];

    let progressEfficiency;

    switch (worker) {
      case 'assistant':
        progressEfficiency =
          useUpgradesStore.getState().upgrades.assistantEfficiency.currentValue;
        break;
      case 'personal':
        progressEfficiency =
          useUpgradesStore.getState().upgrades.personalEfficiency.currentValue;
        break;
      case 'boss':
        progressEfficiency = 100;
        break;
      default:
        progressEfficiency =
          useUpgradesStore.getState().upgrades.personalEfficiency.currentValue;
        break;
    }

    if (task && task.progress < 100) {
      const progressPerClick =
        progressEfficiency /
        (task.difficulty * config.clicksPerDifficultyLevel);

      task.progress = Math.min(task.progress + progressPerClick, 100);

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
  rejectTask: (id: string) => {
    const rejectedTask = get().tasks[id];

    if (rejectedTask) {
      rejectedTask.state = TaskState.Rejected;
      // rejectedTask.progress = 0;

      // Unassign from task, assistant, boss
      rejectedTask.assignedTo.forEach((assistantId) =>
        useAssistantStore.getState().unassignTask(rejectedTask.id, assistantId)
      );
      useBossStore.getState().unassignTask(rejectedTask.id);
      rejectedTask.assignedTo = [];
    }

    set((state: TasksState) =>
      rejectedTask ? { tasks: { ...state.tasks, [id]: rejectedTask } } : state
    );
  },
  completeTask: (id: string) => {
    const completedTask = get().tasks[id];

    if (completedTask) {
      if (
        completedTask.state === TaskState.Todo &&
        completedTask.requiresReview
      ) {
        completedTask.state = TaskState.InReview;
        completedTask.progress = 0;
      } else {
        completedTask.state = TaskState.Completed;
        completedTask.progress = 100;
      }
      console.log(completedTask.state);
      // Unassign from task, assistant, boss
      completedTask.assignedTo.forEach((assistantId) =>
        useAssistantStore.getState().unassignTask(completedTask.id, assistantId)
      );
      useBossStore.getState().unassignTask(completedTask.id);
      completedTask.assignedTo = [];

      const deadlineBonus = completedTask.deadline ? 2 : 1;

      useGameStore
        .getState()
        .addMoney(
          config.moneyPerTaskCompleted *
            completedTask.difficulty *
            deadlineBonus
        );
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
