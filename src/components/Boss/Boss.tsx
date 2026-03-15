import { useCallback, useEffect } from 'react';
import { useTasksStore } from '../../store/tasksStore';
import { useUpgradesStore } from '../../store/upgradesStore';
import { useBossStore } from '../../store/bossStore';
import { TaskState } from '../../store/tasksStore';
import { IntervalController } from '../../helpers/interval-controller';
import { useGameStore } from '../../store/gameStore';
import { useDebugStore } from '../../store/debugStore';

export const Boss = () => {
  const bossInterval = useUpgradesStore(
    (state) => state.upgrades.bossInterval.currentValue
  );
  const speedMultiplier = useDebugStore((state) => state.speedMultiplier);
  // const boss = useBossStore((state) => state.boss[id]);

  const bossLoop = useCallback(() => {
    if (useGameStore.getState().paused) return;

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
    const interval = bossInterval / speedMultiplier;
    const timer = new IntervalController(() => {
      bossLoop();
    }, interval);
    timer.start();

    return () => timer.stop();
  }, [bossInterval, speedMultiplier, bossLoop]);

  return null;
};
