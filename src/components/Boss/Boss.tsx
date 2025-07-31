import { useEffect } from 'react';
import { useTasksStore } from '../../store/tasksStore';
import { useUpgradesStore } from '../../store/upgradesStore';

let loopId: number;

export const Boss = () => {
  const bossInterval = useUpgradesStore(
    (state) => state.upgrades.bossInterval.currentValue
  );
  // const boss = useBossStore((state) => state.boss[id]);

  const bossLoop = () => {
    useTasksStore.getState().newTask();

    // TODO: Deal with boss reviews
    // const assignedTasks =
    //   useBossStore.getState().boss.assignedTo;
    // const numOfTasksAssignable =
    //   useBossUpgradesStore.getState().upgrades.multitasking.currentValue;
    // if (assignedTasks?.length) {
    //   assignedTasks.forEach((task) => {
    //     useTasksStore.getState().makeProgress(task);
    //   });
    // }
    // if ((assignedTasks?.length || 0) < numOfTasksAssignable) {
    //   const numToAssign = numOfTasksAssignable - (assignedTasks?.length || 0);
    //   const tasks = useTasksStore.getState().getNextUnassignedTask(numToAssign);
    //   if (tasks.length) {
    //     tasks.forEach((task) => {
    //       if (task) {
    //         useTasksStore.getState().assignAssistantToTask(id, task);
    //         useBossStore.getState().assignTaskToBoss(task.id, id);
    //       }
    //     });
    //   }
    // }
  };

  useEffect(() => {
    loopId = setInterval(bossLoop, bossInterval);

    console.log(bossInterval);

    return () => clearInterval(loopId);
  }, [bossInterval]);

  return null;
};
