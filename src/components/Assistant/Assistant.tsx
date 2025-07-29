import { useEffect } from 'react';
import { useAssistantStore } from '../../store/assistantStore';
import { useTodos } from '../../store/todosStore';

let loopId: number;

export const Assistant = ({ id }: { id: string }) => {
  const { assistantInterval } = useAssistantStore();
  const assistant = useAssistantStore((state) => state.assistants[id]);
  const { getNextUnassignedTask } = useTodos();

  const assistantLoop = () => {
    // const elements = document.querySelectorAll('.todoCard');
    // const clickThis = elements[0] as HTMLDivElement;
    // clickThis?.click();

    const task = getNextUnassignedTask(id);
    console.log(assistant?.assignedTo, task);
  };

  useEffect(() => {
    loopId = setInterval(assistantLoop, assistantInterval);

    return () => clearInterval(loopId);
  }, [assistantInterval]);

  return <div>assistant</div>;
};
