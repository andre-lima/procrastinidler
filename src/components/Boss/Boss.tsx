import { useCallback, useEffect } from 'react';
import { useTasksStore } from '../../store/tasksStore';
import { useUpgradesStore } from '../../store/upgradesStore';
import { useBossStore } from '../../store/bossStore';
import { TaskState } from '../../store/tasksStore';
import { IntervalController } from '../../helpers/interval-controller';

export const Boss = () => {
  const bossInterval = useUpgradesStore(
    (state) => state.upgrades.bossInterval.currentValue
  );
  // const boss = useBossStore((state) => state.boss[id]);

  const bossLoop = useCallback(() => {
    useTasksStore.getState().newTask();

    const assignedTasks = useBossStore.getState().boss?.assignedTo ?? [];
    const numOfTasksAssignable =
      useUpgradesStore.getState().upgrades.bossMultitasking.currentValue;

    if (assignedTasks.length < numOfTasksAssignable) {
      const numToAssign = numOfTasksAssignable - assignedTasks.length;
      const tasks = useTasksStore
        .getState()
        .getNextUnassignedTask(numToAssign, [TaskState.InReview]);
      tasks.forEach((task) => {
        if (task) {
          useTasksStore.getState().assignBossToTask(task);
          useBossStore.getState().assignTaskToBoss(task.id);
        }
      });
    }
  }, []);

  useEffect(() => {
    const timer = new IntervalController(() => {
      bossLoop();
    }, bossInterval);
    timer.start();

    return () => timer.stop();
  }, [bossInterval]);

  return null;
};
