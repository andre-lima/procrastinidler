import { TaskState } from '../../store/tasksStore';
import { Box, Flex, Grid, Text } from '../shared';
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
} from '../ui';
import { getBadgeColor } from '../../helpers/get-badge-color';
import { DifficultyMeter } from './components/DifficultyMeter';
import './styles.scss';
import { useShallow } from 'zustand/react/shallow';
import { useTasksStore } from '../../store/tasksStore';
import { useUpgradesStore } from '../../store/upgradesStore';
import { memo } from 'react';
import { ProgressMeter } from './components/ProgressMeter';

export const TaskCard = memo(({ id }: { id: string }) => {
  const {
    title,
    category,
    difficulty,
    state,
    assignedTo,
    isSpecial,
    requiresReview,
  } = useTasksStore(useShallow((state) => ({ ...state.tasks[id]! })));
  const canPair = useUpgradesStore(
    (state) => state.upgrades.taskPairing.owned > 0
  );

  if (!title) {
    return null;
  }

  const canClick =
    !isSpecial &&
    (canPair || assignedTo.length === 0) &&
    state === TaskState.Todo;

  const clicked = () => {
    if (canClick) {
      useTasksStore.getState().makeProgress(id, 'personal');
    }
  };

  return (
    <div
      className={
        'panel panelInner taskCard' +
        (isSpecial ? ' special ' : ' ') +
        state +
        (canClick ? ' canClick' : '')
      }
      style={{ marginRight: 'var(--space-3)', cursor: canClick ? 'pointer' : 'default' }}
      role="button"
      tabIndex={canClick ? 0 : undefined}
      onClick={clicked}
      onKeyDown={(e) => canClick && (e.key === 'Enter' || e.key === ' ') && clicked()}
    >
      <Grid
        gap={1}
        columns="2fr 1fr 1fr"
        rows="1fr 40px auto"
        areas="'title title category' 'assignedTo deadline difficulty' 'progress progress progress'"
      >
        <Box gridArea="title">
          <Flex gap={2} align="start">
            <Text className="taskTitle">{title}</Text>
            <Box flexShrink={0} style={{ paddingTop: 'var(--space-1)' }}>
              {requiresReview && state !== TaskState.Completed && (
                <TooltipProvider>
                  <TooltipRoot>
                    <TooltipTrigger render={
                      <span style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>!</span>
                    } />
                    <TooltipPortal>
                      <TooltipPositioner>
                        <TooltipPopup>
                          This task requires review after completion
                        </TooltipPopup>
                      </TooltipPositioner>
                    </TooltipPortal>
                  </TooltipRoot>
                </TooltipProvider>
              )}
            </Box>
          </Flex>
        </Box>
        <Flex justify="end" gridArea="category">
          {category && (
            <span
              style={{
                border: '1px solid var(--color-border)',
                padding: '2px 6px',
                fontSize: 'var(--text-sm)',
                color: getBadgeColor(category),
              }}
            >
              {category}
            </span>
          )}
        </Flex>

        {assignedTo.length > 0 && (
          <Box gridArea="assignedTo">
            {assignedTo.map((assistantId) => (
              <div key={assistantId} className="assignedAssistantImage">
                <img
                  src={'assistants/' + assistantId + '.png'}
                  alt="assistant"
                />
              </div>
            ))}
          </Box>
        )}
        <Box gridArea="deadline" />
        <Box gridArea="difficulty">
          <DifficultyMeter difficulty={difficulty} />
        </Box>
        <Box gridArea="progress">
          <ProgressMeter id={id} />
        </Box>
      </Grid>
    </div>
  );
});
