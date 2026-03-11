import { createGameStore } from '../reactive-store/createGameStore';
import { v4 as uuid } from 'uuid';
import { config } from '../game/config';

export enum TaskState {
  Todo = 'todo',
  InProgress = 'inProgress',
  InReview = 'inReview',
  ToSubmit = 'toSubmit',
  Completed = 'completed',
  Rejected = 'rejected',
}

export enum Category {
  Personal = 'Personal',
  Health = 'Health',
  Education = 'Education',
  Leisure = 'Leisure',
  Work = 'Work',
  Metagame = 'Metagame',
  Other = 'Other',
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  difficulty: number;
  deadline?: number;
  assignedTo: string[];
  state: TaskState;
  progress: number;
  isSpecial?: boolean;
  requiresReview?: boolean;
}
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
      title: 'Click and hold on white cards to complete them and earn money $',
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
    tryAssignAssistantToTask: (task: Task) => void;
    fillIdleAssistantsWithUnassignedTasks: () => void;
    tryAssignBossToTask: (task: Task) => void;
    tryAssignBossToNextReviewTasks: () => void;
    recoverTasks: () => void;
    assignAssistantToTask: (assistantId: string, task: Task) => void;
    assignBossToTask: (task: Task) => void;
    makeProgress: (id: string, worker: 'assistant' | 'personal' | 'boss') => void;
    /** Merge player progress when helping an assigned task; keeps max(current, progress) so assistant progress is not lost */
    mergeTaskProgress: (id: string, progress: number) => void;
    tickWorkerProgress: (deltaTimeSeconds: number) => void;
    rejectTask: (id: string) => void;
    completeTask: (id: string) => void;
    submitTasks: () => void;
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

      if (!newTaskObj.isSpecial && newTaskObj.assignedTo.length === 0) {
        get().tryAssignAssistantToTask(newTaskObj);
        get().fillIdleAssistantsWithUnassignedTasks();
      }
    },
    fillIdleAssistantsWithUnassignedTasks: () => {
      const assistants = useAssistantStore.getState().assistants;
      const numCapacity =
        useUpgradesStore.getState().upgrades.assistantsMultitasking?.currentValue ?? 1;
      let totalSlots = 0;
      for (const a of Object.values(assistants)) {
        if (a) totalSlots += Math.max(0, numCapacity - (a.assignedTo?.length ?? 0));
      }
      if (totalSlots <= 0) return;
      const tasks = get().getNextUnassignedTask(totalSlots, [TaskState.Todo]);
      for (const task of tasks) {
        if (task) get().tryAssignAssistantToTask(task);
      }
    },
    tryAssignAssistantToTask: (task: Task) => {
      if ((task.assignedTo ?? []).length > 0) return;
      if (task.state === TaskState.InReview) {
        if (useUpgradesStore.getState().upgrades.bossAssistant?.owned !== 1) return;
      } else if (task.state !== TaskState.Todo) return;

      const assistants = useAssistantStore.getState().assistants;
      const numCapacity =
        useUpgradesStore.getState().upgrades.assistantsMultitasking
          ?.currentValue ?? 1;
      for (const assistantId of Object.keys(assistants)) {
        const a = assistants[assistantId];
        if (!a) continue;
        if (a.assignedTo.length < numCapacity) {
          get().assignAssistantToTask(assistantId, task);
          useAssistantStore.getState().assignTaskToAssistant(task.id, assistantId);
          return;
        }
      }
    },
    tryAssignBossToTask: (task: Task) => {
      if (task.state !== TaskState.InReview) return;
      if ((task.assignedTo ?? []).length > 0) return;
      const boss = useBossStore.getState().boss;
      if (!boss) return;
      const capacity =
        useUpgradesStore.getState().upgrades.bossMultitasking?.currentValue ?? 1;
      if (boss.assignedTo.length >= capacity) return;
      get().assignBossToTask(task);
      useBossStore.getState().assignTaskToBoss(task.id);
    },
    tryAssignBossToNextReviewTasks: () => {
      const boss = useBossStore.getState().boss;
      if (!boss) return;
      const capacity =
        useUpgradesStore.getState().upgrades.bossMultitasking?.currentValue ?? 1;
      const slots = capacity - boss.assignedTo.length;
      if (slots <= 0) return;
      const tasks = get().getNextUnassignedTask(slots, [TaskState.InReview]);
      tasks.forEach((task) => {
        if (task) {
          get().assignBossToTask(task);
          useBossStore.getState().assignTaskToBoss(task.id);
        }
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
      const tasks = get().tasks;
      const taskIds = Object.keys(tasks);
      const orderMap = new Map(taskIds.map((id, i) => [id, i]));
      const sortedIds = [...taskIds].sort((a, b) => {
        const taskA = tasks[a];
        const taskB = tasks[b];
        if (!taskA || !taskB) return 0;
        const metaA = taskA.category === Category.Metagame ? 0 : 1;
        const metaB = taskB.category === Category.Metagame ? 0 : 1;
        if (metaA !== metaB) return metaA - metaB;
        return (orderMap.get(a) ?? 0) - (orderMap.get(b) ?? 0);
      });
      const match = (task: Task | undefined) =>
        task &&
        (task.assignedTo ?? []).length === 0 &&
        taskStates.includes(task.state) &&
        !task.isSpecial;
      const tasksToAssign: (Task | undefined)[] = [];
      for (const id of sortedIds) {
        if (tasksToAssign.length >= numToAssign) break;
        const task = tasks[id];
        if (match(task)) tasksToAssign.push(task);
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
    mergeTaskProgress: (id: string, progress: number) => {
      const task = get().tasks[id];
      if (!task) return;
      const current = task.progress ?? 0;
      task.progress = Math.min(100, Math.max(current, progress));
      if (task.progress >= 100) {
        setTimeout(() => get().completeTask(id), 300);
      }
      set({ tasks: { ...get().tasks, [id]: task } });
    },
    tickWorkerProgress: (deltaTimeSeconds: number) => {
      const currentTasks = get().tasks;
      const assistantIntervalUpgrade = useUpgradesStore.getState().upgrades.assistantInterval;
      const assistantSpeed =
        (assistantIntervalUpgrade?.owned ?? 0) > 0
          ? (assistantIntervalUpgrade.currentValue as number) / 1000
          : (config.assistantFillSpeedSeconds ?? 4);
      const bossIntervalUpgrade = useUpgradesStore.getState().upgrades.bossInterval;
      const bossSpeed =
        (bossIntervalUpgrade?.owned ?? 0) > 0
          ? (bossIntervalUpgrade.currentValue as number) / 1000
          : (config.bossFillSpeedSeconds ?? 2);
      const toComplete: string[] = [];
      const nextTasks = { ...currentTasks };
      let updated = false;

      for (const task of Object.values(currentTasks)) {
        if (!task || task.progress >= 100) continue;
        const assignedTo = task.assignedTo ?? [];
        if (assignedTo.length !== 1) continue;
        if (task.state !== TaskState.Todo && task.state !== TaskState.InReview)
          continue;

        const worker = assignedTo[0];
        const fillTimeSeconds =
          worker === 'boss'
            ? bossSpeed * (task.difficulty || 1)
            : assistantSpeed * (task.difficulty || 1);

        const deltaPercent = (deltaTimeSeconds / fillTimeSeconds) * 100;
        const newProgress = Math.min(task.progress + deltaPercent, 100);
        nextTasks[task.id] = { ...task, progress: newProgress };
        updated = true;

        if (newProgress >= 100) toComplete.push(task.id);
      }

      if (updated) set({ tasks: nextTasks });
      toComplete.forEach((id) => get().completeTask(id));
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
        const wasInReview = completedTask.state === TaskState.InReview;
        const requiresReviewUpgradePurchased =
          (useUpgradesStore.getState().upgrades.requiresReview?.owned ?? 0) > 0;
        const isSpecial = completedTask.isSpecial === true;

        if (isSpecial) {
          completedTask.state = TaskState.Completed;
          completedTask.progress = 100;
        } else if (
          completedTask.state === TaskState.Todo &&
          requiresReviewUpgradePurchased
        ) {
          completedTask.state = TaskState.InReview;
          completedTask.progress = 0;
        } else {
          completedTask.state = TaskState.ToSubmit;
          completedTask.progress = 100;
        }

        (completedTask.assignedTo ?? []).forEach((assistantId) =>
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

        if (completedTask.state === TaskState.InReview) {
          const taskInStore = get().tasks[id];
          if (taskInStore) {
            get().tryAssignBossToTask(taskInStore);
            get().tryAssignAssistantToTask(taskInStore);
          }
        }
        if (wasInReview) {
          get().tryAssignBossToNextReviewTasks();
        }
      }
    },
    submitTasks: () => {
      const tasks = get().getTasksArray();
      const toSubmit = tasks.filter((t) => t?.state === TaskState.ToSubmit);
      if (toSubmit.length === 0) return;

      const nextTasks = { ...get().tasks };
      const promotionMoneyMultiplier =
        useUpgradesStore.getState().upgrades.promotion?.currentValue ?? 1;

      for (const task of toSubmit) {
        if (!task) continue;
        const deadlineMoneyMultiplier = task.deadline ? 3 : 1;
        const requiresReviewMoneyMultiplier = task.requiresReview ? 3 : 1;
        const updated = { ...task, state: TaskState.Completed, progress: 100 };
        nextTasks[task.id] = updated;
        useGameStore.getState().addMoney(
          config.moneyPerTaskCompleted *
          task.difficulty *
          deadlineMoneyMultiplier *
          requiresReviewMoneyMultiplier *
          promotionMoneyMultiplier
        );
      }
      set({ tasks: nextTasks });
    },
  })
);

export type TasksState = ReturnType<typeof useTasksStore.getState>;

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
