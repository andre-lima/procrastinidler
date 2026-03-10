import type { RefObject } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTasksStore } from '../../../store/tasksStore';
import { Flex, Box, Text } from '../../shared';
import { ProgressRoot, ProgressTrack, ProgressIndicator } from '../../ui';
import { humanNumber } from '../../../helpers/human-number';
import { TaskState } from '../../../store/tasksStore';

export const ProgressMeter = ({
  id,
  overrideProgress,
  liveFillRef,
}: {
  id: string;
  /** When provided (e.g. during hold-to-fill), use this instead of store progress for display */
  overrideProgress?: number;
  /** When provided, attach to fill element; parent updates width imperatively (no re-renders during hold) */
  liveFillRef?: RefObject<HTMLDivElement | null>;
}) => {
  const { progress, state } = useTasksStore(
    useShallow((state) => ({ ...state.tasks[id]! }))
  );

  const value =
    overrideProgress !== undefined
      ? overrideProgress
      : state === TaskState.Completed || state === TaskState.ToSubmit
        ? 100
        : progress;

  return (
    <>
      <Flex gap={2}>
        <Box flexGrow={1}>
          <Text size="2" style={{ color: 'var(--color-fg-dim)' }}>
            {state === TaskState.InReview ? 'Review' : state === TaskState.ToSubmit ? 'Ready to submit' : 'Progress'}
          </Text>
        </Box>
        <Text size="2" style={{ color: 'var(--color-fg-dim)' }}>
          {humanNumber(value, 0)}%
        </Text>
      </Flex>
      <ProgressRoot value={value} style={{ marginBottom: 'var(--space-2)' }}>
        <ProgressTrack>
          <ProgressIndicator
            ref={liveFillRef}
            style={liveFillRef ? undefined : { width: `${value}%` }}
          />
        </ProgressTrack>
      </ProgressRoot>
    </>
  );
};
