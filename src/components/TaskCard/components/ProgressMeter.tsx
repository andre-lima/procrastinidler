import { useShallow } from 'zustand/react/shallow';
import { useTasksStore } from '../../../store/tasksStore';
import { Flex, Box, Text } from '../../shared';
import { Progress } from '@base-ui/react/progress';
import { humanNumber } from '../../../helpers/human-number';
import { TaskState } from '../../../store/tasksStore';

export const ProgressMeter = ({ id }: { id: string }) => {
  const { progress, state } = useTasksStore(
    useShallow((state) => ({ ...state.tasks[id]! }))
  );

  const value = state === TaskState.Completed ? 100 : progress;

  return (
    <>
      <Flex gap={2}>
        <Box flexGrow={1}>
          <Text size="2" style={{ color: 'var(--color-fg-dim)' }}>
            {state === TaskState.InReview ? 'Review' : 'Progress'}
          </Text>
        </Box>
        <Text size="2" style={{ color: 'var(--color-fg-dim)' }}>
          {humanNumber(value, 0)}%
        </Text>
      </Flex>
      <Progress.Root value={value} style={{ marginBottom: 'var(--space-2)' }}>
        <Progress.Track className="progressTrack">
          <Progress.Indicator
            className="progressFill"
            style={{ width: `${value}%` }}
          />
        </Progress.Track>
      </Progress.Root>
    </>
  );
};
