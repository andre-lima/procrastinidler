import { createGameStore } from '../reactive-store/createGameStore';
import { v4 as uuid } from 'uuid';
import { Category, TaskState, type Task } from '../types';
import { config } from '../game/config';
import { generateRandomTask } from '../helpers/generate-task';
import { useGameStore } from './gameStore';
import { useAssistantStore } from './assistantStore';
import { getRandomCategory } from '../helpers/random-category';
import { useUpgradesStore } from './upgradesStore';
import { useBossStore } from './bossStore';
import { localStorageSaveSystem } from './saveSystem';

interface TasksStoreState {
  tasks: Partial<Record<string, Task>>;
}

const initialState: TasksStoreState = {
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
};

export const useTasksStore = createGameStore<
  TasksStoreState,
  {
    getTasksArray: () => (Task | undefined)[];
    getTodosLength: () => number;
    getNextUnassignedTask: (
      numToAssign?: number,
      taskStates?: TaskState[]
    ) => (Task | undefined)[];
    newTask: (task?: Task) => void;
    recoverTasks: () => void;
    assignAssistantToTask: (assistantId: string, task: Task) => void;
    assignBossToTask: (task: Task) => void;
    makeProgress: (id: string, worker: 'assistant' | 'personal' | 'boss') => void;
    rejectTask: (id: string) => void;
    completeTask: (id: string) => void;
  }
>(
  {
    saveKey: 'tasks-store',
    initialState,
    savePrefix: '',
    saveSystem: localStorageSaveSystem,
  },
  (set, get) => ({
    getTasksArray: () => Object.values(get().tasks),
    getTodosLength: () =>
      get()
        .getTasksArray()
        .filter((task) => task?.state === TaskState.Todo).length,
    newTask: (task?: Task) => {
      if (!task?.isSpecial && get().getTodosLength() >= 50) {
        return;
      }

      const upgrades = useUpgradesStore.getState().upgrades;
      const deadline =
        upgrades.hasDeadline?.owned === 1
          ? (upgrades.negotiateDeadline?.currentValue as number | undefined)
          : undefined;

      const shouldRequireReview =
        Math.random() * 100 < (upgrades.requiresReview?.currentValue ?? 0);

      const newTaskObj =
        task ||
        ({
          id: uuid(),
          title: generateRandomTask(),
          category: getRandomCategory(),
          deadline,
          assignedTo: [],
          difficulty: upgrades.increaseDifficulty?.currentValue ?? 1,
          requiresReview: shouldRequireReview,
          state: TaskState.Todo,
          progress: 0,
        } as Task);

      set({
        tasks: { ...get().tasks, [newTaskObj.id]: newTaskObj },
      });
    },
    recoverTasks: () => {
      const tasks = get().getTasksArray();
      tasks.forEach((t) => {
        if (t?.state === TaskState.Rejected) {
          (t as Task).state = TaskState.Todo;
        }
      });
      set({ tasks: { ...get().tasks } });
    },
    getNextUnassignedTask: (
      numToAssign: number = 1,
      taskStates: TaskState[] = [TaskState.Todo]
    ) => {
      const tasksToAssign: (Task | undefined)[] = [];
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
        if (tasksToAssign.length === numToAssign) break;
      }
      return tasksToAssign;
    },
    assignAssistantToTask: (assistantId: string, task: Task) => {
      if (task) {
        task.assignedTo = [assistantId];
      }
      if (task) {
        set({ tasks: { ...get().tasks, [task.id]: task } });
      }
    },
    assignBossToTask: (task: Task) => {
      if (task) {
        task.assignedTo = ['boss'];
      }
      if (task) {
        set({ tasks: { ...get().tasks, [task.id]: task } });
      }
    },
    makeProgress: (id: string, worker: 'assistant' | 'personal' | 'boss') => {
      const task = get().tasks[id];
      const upgrades = useUpgradesStore.getState().upgrades;

      let progressEfficiency: number;
      switch (worker) {
        case 'assistant':
          progressEfficiency = upgrades.assistantEfficiency?.currentValue ?? 100;
          break;
        case 'personal':
          progressEfficiency = upgrades.personalEfficiency?.currentValue ?? 100;
          break;
        case 'boss':
          progressEfficiency = 200;
          break;
        default:
          progressEfficiency = upgrades.personalEfficiency?.currentValue ?? 100;
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
        set({ tasks: { ...get().tasks, [id]: task } });
      }
    },
    rejectTask: (id: string) => {
      const rejectedTask = get().tasks[id];
      if (rejectedTask) {
        rejectedTask.state = TaskState.Rejected;
        rejectedTask.assignedTo.forEach((assistantId) =>
          useAssistantStore.getState().unassignTask(rejectedTask.id, assistantId)
        );
        useBossStore.getState().unassignTask(rejectedTask.id);
        rejectedTask.assignedTo = [];
        set({ tasks: { ...get().tasks, [id]: rejectedTask } });
      }
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

        completedTask.assignedTo.forEach((assistantId) =>
          useAssistantStore
            .getState()
            .unassignTask(completedTask.id, assistantId)
        );
        useBossStore.getState().unassignTask(completedTask.id);
        completedTask.assignedTo = [];

        const deadlineMoneyMultiplier = completedTask.deadline ? 3 : 1;
        const requiresReviewMoneyMultiplier = completedTask.requiresReview ? 3 : 1;
        const promotionMoneyMultiplier =
          useUpgradesStore.getState().upgrades.promotion?.currentValue ?? 1;

        if (completedTask.state === TaskState.Completed) {
          useGameStore.getState().addMoney(
            config.moneyPerTaskCompleted *
              completedTask.difficulty *
              deadlineMoneyMultiplier *
              requiresReviewMoneyMultiplier *
              promotionMoneyMultiplier
          );
        }

        set((state) => {
          if (
            completedTask.state === TaskState.Completed &&
            get()
              .getTasksArray()
              .filter((t) => t?.state === TaskState.Completed).length >
              config.maxCardsPerColumn + 1
          ) {
            return {
              tasks: {
                ...state.tasks,
                [id]: { state: TaskState.Completed } as Task,
              },
            };
          }
          return {
            tasks: { ...state.tasks, [id]: completedTask },
          };
        });
      }
    },
  })
);

// Fix stuck tasks where progress is 100 but completeTask hasn't run yet
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
