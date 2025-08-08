import { Box, Flex, Heading, ScrollArea, Text } from '@radix-ui/themes';
import { TaskCard } from '../TaskCard/TaskCard';
import { useShallow } from 'zustand/react/shallow';
import { useTasksStore } from '../../store/tasksStore';
import type { TasksState } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { config } from '../../game/config';
import { LuEllipsisVertical } from 'react-icons/lu';
import { humanNumber } from '../../helpers/human-number';
import { memo } from 'react';

export const TasksList = memo(
  ({
    title,
    tasksSelector,
    maxNumOfTasks,
  }: {
    title: string;
    tasksSelector: (state: TasksState) => string[];
    maxNumOfTasks?: number;
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
        <Flex align="end" gap="2">
          <Heading size="4" as="h2" mb="4">
            {title} ({humanNumber(itemIds.length)})
          </Heading>

          {maxNumOfTasks && (
            <Text color="tomato" size="2" mb="3">
              {maxNumOfTasks && maxNumOfTasks <= itemIds.length && (
                <span>Max of {maxNumOfTasks} tasks reached</span>
              )}
            </Text>
          )}
        </Flex>

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
  }
);
