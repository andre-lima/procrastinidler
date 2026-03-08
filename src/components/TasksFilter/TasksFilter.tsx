import { Flex, Text } from '../shared';
import { Switch } from '@base-ui/react/switch';
import { useGameStore } from '../../store/gameStore';
import { useTasksStore } from '../../store/tasksStore';
import { TaskState } from '../../types';

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
          <label className="switchLabel">
            <Switch.Root
              checked={showRejectedTasks}
              onCheckedChange={onChangeExpiredFilter}
              className={showRejectedTasks ? 'switchRoot switchRootOn' : 'switchRoot'}
            >
              <Switch.Thumb className={showRejectedTasks ? 'switchThumb switchThumbOn' : 'switchThumb'} />
            </Switch.Root>
            <Text as="span" size="1">
              Show expired ({rejectedTasksLength})
            </Text>
          </label>
          <div className="separator" style={{ width: 1, height: '1em', margin: '0 var(--space-2)', borderLeft: '1px solid var(--color-border)' }} />
        </>
      )}
    </Flex>
  );
};
