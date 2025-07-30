import { useEffect } from 'react';
import { useAssistantStore } from '../../store/assistantStore';
import { useTasksStore } from '../../store/tasksStore';
let loopId: number;

export const Assistant = ({ id }: { id: string }) => {
  const { assistantInterval } = useAssistantStore();
  const assistant = useAssistantStore((state) => state.assistants[id]);

  const { getNextUnassignedTask, assignAssistantToTask } = useTasksStore();
  const { assignTaskToAssistant } = useAssistantStore();

  const assistantLoop = () => {
    const assignedTasks =
      useAssistantStore.getState().assistants[id]?.assignedTo;

    if (assignedTasks?.length) {
      assignedTasks.forEach((task) => {
        useTasksStore.getState().makeProgress(task);
      });
    } else {
      const task = getNextUnassignedTask(id);
      if (task) {
        // Todo: Only assign if not assigned yet
        assignAssistantToTask(id, task);
        assignTaskToAssistant(task.id, id);
      }
    }
  };

  useEffect(() => {
    loopId = setInterval(assistantLoop, assistantInterval);

    return () => clearInterval(loopId);
  }, [assistantInterval]);

  return <div>assistant {assistant?.assignedTo.length}</div>;
};
