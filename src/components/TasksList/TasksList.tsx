import { useMemo } from 'react';
import { Flex, ScrollArea, Text } from '../shared';
import { TaskCard } from '../TaskCard/TaskCard';
import { WindowContainer } from '../ui';
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

    const windowTitle = `${title} (${humanNumber(itemIds.length)})`;

    return (
      <WindowContainer variant="secondary" title={windowTitle} className="tasksListPanel">
        {maxNumOfTasks != null && maxNumOfTasks <= itemIds.length && (
          <Text size="2" style={{ marginBottom: 'var(--space-2)', color: 'var(--color-danger)' }}>
            Max of {maxNumOfTasks} tasks reached
          </Text>
        )}
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
      </WindowContainer>
    );
  }
);
