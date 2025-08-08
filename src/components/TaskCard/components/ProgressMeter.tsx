import { useShallow } from 'zustand/react/shallow';
import { useTasksStore } from '../../../store/tasksStore';
import { Flex, Box, Text, Progress } from '@radix-ui/themes';
import { humanNumber } from '../../../helpers/human-number';
import { TaskState } from '../../../types';

export const ProgressMeter = ({ id }: { id: string }) => {
  const { progress, state } = useTasksStore(
    useShallow((state) => ({ ...state.tasks[id]! }))
  );

  return (
    <>
      <Flex>
        <Box flexGrow="1">
          <Text size="2" color="gray">
            {state === TaskState.InReview ? 'Review' : 'Progress'}
          </Text>
        </Box>
        <Text size="2" color="gray">
          {humanNumber(progress, 0)}%
        </Text>
      </Flex>
      <Progress
        color="green"
        value={state === TaskState.Completed ? 100 : progress}
        variant="soft"
      />
    </>
  );
};
