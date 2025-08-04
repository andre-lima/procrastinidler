import { Box, Flex, Heading, ScrollArea } from '@radix-ui/themes';
import { TaskCard } from '../TaskCard/TaskCard';
import { useShallow } from 'zustand/shallow';
import { useTasksStore } from '../../store/tasksStore';
import type { TasksState } from '../../types';
import { useGameStore } from '../../store/gameStore';

export const TasksList = ({
  title,
  tasksSelector,
}: {
  title: string;
  tasksSelector: (state: TasksState) => string[];
}) => {
  const itemIds = useTasksStore(useShallow(tasksSelector));
  const sortByNewer = useGameStore((state) => state.filters.newerTasksFirst);

  return (
    <Box
      p="4"
      pr="2"
      style={{
        background: 'var(--gray-a3)',
        borderRadius: 'var(--radius-3)',
      }}
    >
      <Heading size="4" as="h2" mb="4">
        {title} ({itemIds.length})
      </Heading>

      <ScrollArea
        type="auto"
        scrollbars="vertical"
        style={{ maxHeight: '70vh' }}
      >
        <Flex direction={sortByNewer ? 'column-reverse' : 'column'} gap="2">
          {itemIds.map((id) => (
            <TaskCard key={id} id={id} />
          ))}
        </Flex>
      </ScrollArea>
    </Box>
  );
};
