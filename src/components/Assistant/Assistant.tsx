import { useCallback, useEffect, useTransition } from 'react';
import { useAssistantStore } from '../../store/assistantStore';
import { useTasksStore } from '../../store/tasksStore';
import './styles.scss';
import { useUpgradesStore } from '../../store/upgradesStore';
import { TaskState, type Task } from '../../types';
import { IntervalController } from '../../helpers/interval-controller';

export const Assistant = ({ id }: { id: string }) => {
  const [, startTransition] = useTransition();

  const assistantInterval = useUpgradesStore(
    (state) => state.upgrades.assistantInterval.currentValue
  );
  // const assistant = useAssistantStore((state) => state.assistants[id]);

  const assistantLoop = useCallback(() => {
    const assignedTasks =
      useAssistantStore.getState().assistants[id]?.assignedTo;

    const numOfTasksAssignable =
      useUpgradesStore.getState().upgrades.assistantsMultitasking.currentValue;

    if (assignedTasks?.length) {
      assignedTasks.forEach((task) => {
        startTransition(() => {
          useTasksStore.getState().makeProgress(task, 'assistant');
        });
      });
    }

    if ((assignedTasks?.length || 0) < numOfTasksAssignable) {
      const numToAssign = numOfTasksAssignable - (assignedTasks?.length || 0);
      let tasks: (Task | undefined)[] = [];

      const todoTasks = useTasksStore
        .getState()
        .getNextUnassignedTask(numToAssign, [TaskState.Todo]);

      tasks = [...todoTasks];

      if (useUpgradesStore.getState().upgrades.bossAssistant.owned === 1) {
        const reviewTasks = useTasksStore
          .getState()
          .getNextUnassignedTask(1, [TaskState.InReview]);

        tasks = [...tasks, ...reviewTasks];
      }

      if (tasks.length) {
        tasks.forEach((task) => {
          if (task) {
            useTasksStore.getState().assignAssistantToTask(id, task);
            useAssistantStore.getState().assignTaskToAssistant(task.id, id);
          }
        });
      }
    }
  }, [id]);

  useEffect(() => {
    const interval = assistantInterval + Math.floor(Math.random() * 10);
    const timer = new IntervalController(() => {
      assistantLoop();
    }, interval);
    timer.start();

    return () => timer.stop();
  }, [assistantInterval, assistantLoop]);

  return (
    <div className="assistantImage navBarImage">
      <img src={'assistants/' + id + '.png'} alt={'assistant image'} />
    </div>
  );
};

// useEffect(() => {
//   const timer = new IntervalController(() => {
//     dispatch({ type: GUIActions.GENERATE_GENERATORS });
//   }, tickLength);

//   if (!gameStatus.playedCoupDeGrace) {
//     timer.start();
//   }

//   on(GameplayEvents.WAIT_FOR_LAST_HIT, () => {
//     timer.stop();
//   });

//   return () => {
//     timer.stop();
//   };
// }, [tickLength]);
