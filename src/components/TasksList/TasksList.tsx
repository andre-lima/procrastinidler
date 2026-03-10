import { useMemo } from 'react';
import { Flex, ScrollArea, Text } from '../shared';
import { TaskCard } from '../TaskCard/TaskCard';
import { WindowContainer } from '../ui';
import { useShallow } from 'zustand/react/shallow';
import { useTasksStore } from '../../store/tasksStore';
import type { TasksState } from '../../store/tasksStore';
import { Category, TaskState } from '../../store/tasksStore';
import { useGameStore } from '../../store/gameStore';
import { config } from '../../game/config';
import { humanNumber } from '../../helpers/human-number';
import { memo } from 'react';
import './tasksList.scss';

export const TasksList = memo(
  ({
    title,
    tasksSelector,
    maxNumOfTasks,
    sortByState,
  }: {
    title: string;
    tasksSelector: (state: TasksState) => string[];
    maxNumOfTasks?: number;
    /** When 'todoAndReview', sort order is: Metagame first, then InReview, then Todo */
    sortByState?: 'todoAndReview';
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
        if (sortByState === 'todoAndReview') {
          const reviewA = taskA.state === TaskState.InReview ? 0 : 1;
          const reviewB = taskB.state === TaskState.InReview ? 0 : 1;
          if (reviewA !== reviewB) return reviewA - reviewB;
        }
        const orderA = orderMap.get(a) ?? 0;
        const orderB = orderMap.get(b) ?? 0;
        return sortByNewer ? orderB - orderA : orderA - orderB;
      });
    }, [itemIds, tasks, sortByNewer, sortByState]);

    const windowTitle = `${title} (${humanNumber(itemIds.length)})`;

    return (
      <div className="tasksList">
        <WindowContainer variant="primary" title={windowTitle} className="tasksListPanel">
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
        </WindowContainer >
      </div>
    );
  }
);
