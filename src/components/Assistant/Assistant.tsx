import { useEffect } from 'react';
import { useAssistantStore } from '../../store/assistantStore';
import { useTasksStore } from '../../store/tasksStore';
import './styles.scss';
import { useUpgradesStore } from '../../store/upgradesStore';

let loopId: number;

export const Assistant = ({ id }: { id: string }) => {
  const assistantInterval = useUpgradesStore(
    (state) => state.upgrades.assistantInterval.currentValue
  );
  // const assistant = useAssistantStore((state) => state.assistants[id]);

  const assistantLoop = () => {
    const assignedTasks =
      useAssistantStore.getState().assistants[id]?.assignedTo;

    const numOfTasksAssignable =
      useUpgradesStore.getState().upgrades.assistantsMultitasking.currentValue;

    if (assignedTasks?.length) {
      assignedTasks.forEach((task) => {
        useTasksStore.getState().makeProgress(task);
      });
    }
    if ((assignedTasks?.length || 0) < numOfTasksAssignable) {
      const numToAssign = numOfTasksAssignable - (assignedTasks?.length || 0);
      const tasks = useTasksStore.getState().getNextUnassignedTask(numToAssign);
      if (tasks.length) {
        tasks.forEach((task) => {
          if (task) {
            useTasksStore.getState().assignAssistantToTask(id, task);
            useAssistantStore.getState().assignTaskToAssistant(task.id, id);
          }
        });
      }
    }
  };

  useEffect(() => {
    loopId = setInterval(assistantLoop, assistantInterval);

    return () => clearInterval(loopId);
  }, [assistantInterval]);

  return (
    <div className="assistantImage navBarImage">
      <img src={'assistants/' + id + '.png'} alt={'assistant image'} />
    </div>
  );
};
