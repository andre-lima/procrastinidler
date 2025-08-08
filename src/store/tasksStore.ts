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
import { persist } from 'zustand/middleware';

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: {
        initial: {
          id: 'initial',
          title: 'Click white cards to complete them and earn money $',
          category: Category.Metagame,
          assignedTo: [],
          difficulty: 1,
          state: TaskState.Todo,
          progress: 0,
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
      },
      getTasksArray: () => Object.values(get().tasks),
      getTodosLength: () =>
        get()
          .getTasksArray()
          .filter((task) => task?.state === TaskState.Todo).length,
      newTask: (task?: Task) => {
        if (!task?.isSpecial && get().getTodosLength() >= 50) {
          return;
        }

        const deadline =
          useUpgradesStore.getState().upgrades.hasDeadline?.owned === 1
            ? useUpgradesStore.getState().upgrades.negotiateDeadline
                .currentValue
            : undefined;

        const shouldRequireReview =
          Math.random() * 100 <
          useUpgradesStore.getState().upgrades.requiresReview.currentValue;

        const newTask = task || {
          id: uuid(),
          title: generateRandomTask(),
          category: getRandomCategory(),
          deadline,
          assignedTo: [],
          difficulty:
            useUpgradesStore.getState().upgrades.increaseDifficulty
              .currentValue,
          requiresReview: shouldRequireReview,
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
        taskStates: TaskState[] = [TaskState.Todo]
      ) => {
        const tasksToAssign: Task[] = [];

        const tasks = get().getTasksArray();

        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];

          if (
            task?.assignedTo?.length === 0 &&
            taskStates.includes(task?.state) &&
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
              useUpgradesStore.getState().upgrades.assistantEfficiency
                .currentValue;
            break;
          case 'personal':
            progressEfficiency =
              useUpgradesStore.getState().upgrades.personalEfficiency
                .currentValue;
            break;
          case 'boss':
            progressEfficiency = 200;
            break;
          default:
            progressEfficiency =
              useUpgradesStore.getState().upgrades.personalEfficiency
                .currentValue;
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
            useAssistantStore
              .getState()
              .unassignTask(rejectedTask.id, assistantId)
          );
          useBossStore.getState().unassignTask(rejectedTask.id);
          rejectedTask.assignedTo = [];
        }

        set((state: TasksState) =>
          rejectedTask
            ? { tasks: { ...state.tasks, [id]: rejectedTask } }
            : state
        );
      },
      completeTask: (id: string) => {
        let completedTask = get().tasks[id];

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

          // Unassign from task, assistant, boss
          completedTask?.assignedTo.forEach((assistantId) =>
            useAssistantStore
              .getState()
              .unassignTask(completedTask!.id, assistantId)
          );
          useBossStore.getState().unassignTask(completedTask.id);
          completedTask.assignedTo = [];

          const deadlineMoneyMultiplier = completedTask.deadline ? 3 : 1;
          const requiresReviewMoneyMultiplier = completedTask.requiresReview
            ? 3
            : 1;
          const promotionMoneyMultiplier =
            useUpgradesStore.getState().upgrades.promotion.currentValue;

          if (completedTask.state === TaskState.Completed) {
            useGameStore
              .getState()
              .addMoney(
                config.moneyPerTaskCompleted *
                  completedTask.difficulty *
                  deadlineMoneyMultiplier *
                  requiresReviewMoneyMultiplier *
                  promotionMoneyMultiplier
              );
          }
        }

        // Limits objects references to something that won't be used anymore.
        if (completedTask?.state === TaskState.Completed) {
          const completedTasksLength = get()
            .getTasksArray()
            .filter((task) => task?.state === TaskState.Completed).length;

          if (completedTasksLength > config.maxCardsPerColumn + 1) {
            completedTask = undefined;
          }
        }

        set((state: TasksState) =>
          completedTask
            ? {
                tasks: { ...state.tasks, [id]: completedTask },
              }
            : state
        );
      },
    }),
    { name: 'tasks-store' }
  )
);

// DEBUG: Add tons of tasks
setTimeout(() => {
  for (let i = 0; i < 1000; i++) {
    const randomNum = Math.random() * 100;
    let randomState = TaskState.Todo;

    if (randomNum > 25) {
      randomState = TaskState.InReview;
    }

    if (randomNum > 60) {
      randomState = TaskState.Completed;
    }

    useTasksStore.getState().newTask({
      id: uuid(),
      title: generateRandomTask(),
      category: getRandomCategory(),
      assignedTo: [],
      difficulty: 10,
      requiresReview: true,
      state: randomState,
      progress: 0,
    });
  }
}, 10);

// UGLY HACK: Fixes a bug where when progress is 100 but setTimeout
// hasn't fired yet completing the task the tasks will stay stuck at 100%
setTimeout(() => {
  useTasksStore
    .getState()
    .getTasksArray()
    .forEach((task) => {
      if (
        (task?.progress === 100 && task?.state === TaskState.Todo) ||
        (task?.progress === 100 && task?.state === TaskState.InReview)
      ) {
        console.warn('Stuck??? ', task.id);
        useTasksStore.getState().completeTask(task.id);
      }
    });
}, 0);
