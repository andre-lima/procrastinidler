import { Flex } from '../shared';
import { Switch } from '../ui';
import { useGameStore } from '../../store/gameStore';
import { useTasksStore } from '../../store/tasksStore';
import { TaskState } from '../../store/tasksStore';

export const TasksFilter = () => {
  const { showRejectedTasks } = useGameStore((state) => state.filters);

  const rejectedTasksLength = useTasksStore(
    (state) =>
      state.getTasksArray().filter((task) => task?.state === TaskState.Rejected)
        .length
  );

  const { unlockedDeadline } = useGameStore((state) => state.gameProgress);

  const onChangeExpiredFilter = (value: boolean) => {
    useGameStore.getState().setShowingRejected(value);
  };

  return (
    <Flex align="center" gap={4} style={{ paddingLeft: 'var(--space-4)' }}>
      {unlockedDeadline && (
        <>
          <div className="separator" style={{ width: 1, height: '1em', margin: '0 var(--space-2)', borderLeft: '1px solid var(--color-border)' }} />
          <Switch
            label={`Show expired (${rejectedTasksLength})`}
            checked={showRejectedTasks}
            onCheckedChange={onChangeExpiredFilter}
          />
          <div className="separator" style={{ width: 1, height: '1em', margin: '0 var(--space-2)', borderLeft: '1px solid var(--color-border)' }} />
        </>
      )}
    </Flex>
  );
};
