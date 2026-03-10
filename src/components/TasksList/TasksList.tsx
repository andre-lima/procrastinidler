import { useMemo } from 'react';
import { Box, Flex, Heading, ScrollArea, Text } from '../shared';
import { TaskCard } from '../TaskCard/TaskCard';
import { useShallow } from 'zustand/react/shallow';
import { useTasksStore } from '../../store/tasksStore';
import type { TasksState } from '../../store/tasksStore';
import { Category } from '../../store/tasksStore';
import { useGameStore } from '../../store/gameStore';
import { config } from '../../game/config';
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
    const tasks = useTasksStore((state) => state.tasks);
    const sortByNewer = useGameStore((state) => state.filters.newerTasksFirst);

    const sortedIds = useMemo(() => {
      const orderMap = new Map(itemIds.map((id, idx) => [id, idx]));
      return [...itemIds].sort((a, b) => {
        const taskA = tasks[a];
        const taskB = tasks[b];
        if (!taskA || !taskB) return 0;
        const metaA = taskA.category === Category.Metagame ? 0 : 1;
        const metaB = taskB.category === Category.Metagame ? 0 : 1;
        if (metaA !== metaB) return metaA - metaB;
        const orderA = orderMap.get(a) ?? 0;
        const orderB = orderMap.get(b) ?? 0;
        return sortByNewer ? orderB - orderA : orderA - orderB;
      });
    }, [itemIds, tasks, sortByNewer]);

    return (
      <Box
        className="tasksListPanel"
        style={{
          padding: 'var(--space-4)',
          paddingRight: 'var(--space-2)',
          background: 'var(--color-bg-panel)',
        }}
      >
        <Flex align="end" gap={2}>
          <Heading size="4" as="h2" style={{ marginBottom: 'var(--space-4)' }}>
            {title} ({humanNumber(itemIds.length)})
          </Heading>

          {maxNumOfTasks && (
            <Text size="2" style={{ marginBottom: 'var(--space-3)', color: 'var(--color-danger)' }}>
              {maxNumOfTasks && maxNumOfTasks <= itemIds.length && (
                <span>Max of {maxNumOfTasks} tasks reached</span>
              )}
            </Text>
          )}
        </Flex>

        <ScrollArea maxHeight="70vh">
          <Flex direction="column" gap={2}>
            {sortedIds.slice(0, config.maxCardsPerColumn - 1).map((id) => (
              <TaskCard key={id} id={id} />
            ))}
            {sortedIds.length > config.maxCardsPerColumn && (
              <span style={{ padding: '12px', margin: '0 auto', color: 'var(--color-fg-dim)' }}>
                …
              </span>
            )}
          </Flex>
        </ScrollArea>
      </Box>
    );
  }
);
