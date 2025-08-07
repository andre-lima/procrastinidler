import { Box, Flex, Heading, ScrollArea } from '@radix-ui/themes';
import { TaskCard } from '../TaskCard/TaskCard';
import { useShallow } from 'zustand/shallow';
import { useTasksStore } from '../../store/tasksStore';
import type { TasksState } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { config } from '../../game/config';
import { LuEllipsisVertical } from 'react-icons/lu';
import { humanNumber } from '../../helpers/human-number';

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
        {title} ({humanNumber(itemIds.length)})
      </Heading>

      <ScrollArea
        type="auto"
        scrollbars="vertical"
        style={{ maxHeight: '70vh' }}
      >
        <Flex direction={sortByNewer ? 'column-reverse' : 'column'} gap="2">
          {itemIds.slice(0, config.maxCardsPerColumn - 1).map((id) => (
            <TaskCard key={id} id={id} />
          ))}
          {itemIds.length > config.maxCardsPerColumn && (
            <LuEllipsisVertical
              color="gray"
              style={{ padding: '12px', margin: '0 auto' }}
              size="60px"
            />
          )}
        </Flex>
      </ScrollArea>
    </Box>
  );
};
