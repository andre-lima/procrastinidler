import { useEffect } from 'react';
import { useAssistantStore } from '../../store/assistantStore';
import { useTodosStore } from '../../store/todosStore';

let loopId: number;

export const Assistant = ({ id }: { id: string }) => {
  const { assistantInterval } = useAssistantStore();
  const assistant = useAssistantStore((state) => state.assistants[id]);

  const { getNextUnassignedTask, assignAssistantToTask } = useTodosStore();
  const { assignTaskToAssistant } = useAssistantStore();

  const assistantLoop = () => {
    // const elements = document.querySelectorAll('.todoCard');
    // const clickThis = elements[0] as HTMLDivElement;
    // clickThis?.click();
    const assignedTasks =
      useAssistantStore.getState().assistants[id]?.assignedTo;

    if (assignedTasks?.length) {
      assignedTasks.forEach((task) => {
        useTodosStore.getState().makeProgress(task);
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
