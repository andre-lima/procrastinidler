import { useMemo } from 'react';
import { Flex, ScrollArea, Text } from '../shared';
import { TaskCard } from '../TaskCard/TaskCard';
import { WindowContainer } from '../ui';
import { useShallow } from 'zustand/react/shallow';
import { useTasksStore } from '../../store/tasksStore';
import type { TasksState } from '../../store/tasksStore';
import { Category, TaskState } from '../../store/tasksStore';
import { useUpgradesStore } from '../../store/upgradesStore';
import { config } from '../../game/config';
import { humanNumber } from '../../helpers/human-number';
import { memo } from 'react';
import './tasksList.scss';

export const TasksList = memo(
  ({
    title,
    tasksSelector,
    maxNumOfTasks,
    titleTodoInReview,
  }: {
    title: string;
    tasksSelector: (state: TasksState) => string[];
    maxNumOfTasks?: number;
    /** When true, title shows "To-Do (#) / In Review (#)" instead of "title (total)" */
    titleTodoInReview?: boolean;
  }) => {
    const itemIds = useTasksStore(useShallow(tasksSelector));
    const tasks = useTasksStore((state) => state.tasks);
    const requiresReviewPurchased = useUpgradesStore(
      (state) => (state.upgrades.requiresReview?.owned ?? 0) > 0
    );

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
        return orderA - orderB;
      });
    }, [itemIds, tasks]);

    // Optional title format: "To-Do (#)" or "To-Do (#) / In Review (#)" when requiresReview is purchased
    const windowTitle = titleTodoInReview
      ? (() => {
          let todo = 0;
          let inReview = 0;
          for (const id of itemIds) {
            const s = tasks[id]?.state;
            if (s === TaskState.Todo) todo++;
            else if (s === TaskState.InReview) inReview++;
          }
          return requiresReviewPurchased
            ? `To-Do (${humanNumber(todo)}) / In Review (${humanNumber(inReview)})`
            : `To-Do (${humanNumber(todo)})`;
        })()
      : `${title} (${humanNumber(itemIds.length)})`;

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
