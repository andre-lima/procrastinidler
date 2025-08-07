import { useEffect } from 'react';
import { useTasksStore } from '../../store/tasksStore';
import { useUpgradesStore } from '../../store/upgradesStore';
import { useBossStore } from '../../store/bossStore';
import { TaskState } from '../../types';
import { config } from '../../game/config';

let loopId: number;

export const Boss = () => {
  // const bossInterval = useUpgradesStore(
  //   (state) => state.upgrades.bossInterval.currentValue
  // );
  // const boss = useBossStore((state) => state.boss[id]);

  const bossLoop = () => {
    useTasksStore.getState().newTask();

    // TODO: Deal with boss reviews
    const assignedTasks = useBossStore.getState().boss?.assignedTo;

    const numOfTasksAssignable =
      useUpgradesStore.getState().upgrades.bossMultitasking.currentValue;

    if (assignedTasks?.length) {
      assignedTasks.forEach((task) => {
        useTasksStore.getState().makeProgress(task, 'boss');
      });
    }
    if ((assignedTasks?.length || 0) < numOfTasksAssignable) {
      const numToAssign = numOfTasksAssignable - (assignedTasks?.length || 0);
      const tasks = useTasksStore
        .getState()
        .getNextUnassignedTask(numToAssign, TaskState.InReview);
      if (tasks.length) {
        tasks.forEach((task) => {
          if (task) {
            useTasksStore.getState().assignBossToTask(task);
            useBossStore.getState().assignTaskToBoss(task.id);
          }
        });
      }
    }
  };

  useEffect(() => {
    loopId = setInterval(bossLoop, config.tickLength);

    return () => clearInterval(loopId);
  }, []);

  return null;
};
