import { Box, Flex, Heading } from '@radix-ui/themes';
import { TaskCard } from '../TaskCard/TaskCard';
import { useShallow } from 'zustand/shallow';
import { useTasksStore } from '../../store/tasksStore';
import type { TasksState } from '../../types';

export const TasksList = ({
  title,
  tasksSelector,
}: {
  title: string;
  tasksSelector: (state: TasksState) => string[];
}) => {
  const itemIds = useTasksStore(useShallow(tasksSelector));

  return (
    <Box
      p="4"
      style={{
        background: 'var(--gray-a3)',
        borderRadius: 'var(--radius-3)',
      }}
    >
      <Heading size="4" as="h2" mb="4">
        {title} ({itemIds.length})
      </Heading>

      <Flex direction="column" gap="2">
        {itemIds.map((id) => (
          <TaskCard key={id} id={id} />
        ))}
      </Flex>
    </Box>
  );
};
