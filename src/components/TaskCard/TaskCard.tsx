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
import { Category } from '../../store/tasksStore';
import { useUpgradesStore } from '../../store/upgradesStore';
import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { ProgressMeter } from './components/ProgressMeter';
import { config } from '../../game/config';
import { useEventsStore } from '../../store/eventsStore';

export const TaskCard = memo(({ id }: { id: string }) => {
  const {
    title,
    category,
    difficulty,
    state,
    assignedTo,
    isSpecial,
    requiresReview,
    progress,
  } = useTasksStore(useShallow((state) => ({ ...state.tasks[id]! })));
  const canPair = useUpgradesStore(
    (state) => state.upgrades.taskPairing.owned > 0
  );

  const [isHolding, setIsHolding] = useState(false);
  /** Local progress for unassigned Todo; avoids store writes until completion */
  const [localProgress, setLocalProgress] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  /** Ref for the progress bar fill; we update its width in RAF during hold to avoid re-renders */
  const liveFillRef = useRef<HTMLDivElement | null>(null);
  /** Effective progress for starting a hold: localProgress (unassigned partial) or store progress. Kept in ref so startFilling can read current value without stale closure. */
  const effectiveProgressRef = useRef(0);

  const isLocked =
    isSpecial ||
    assignedTo.length > 0 ||
    state !== TaskState.Todo;
  const canHold =
    !isSpecial &&
    state === TaskState.Todo &&
    (assignedTo.length === 0 || canPair);

  const displayProgress = localProgress ?? progress;
  effectiveProgressRef.current = displayProgress;

  const stopFilling = useCallback(() => {
    setIsHolding(false);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startTimeRef.current = null;
    const final = progressRef.current;
    if (final < 100) {
      const task = useTasksStore.getState().tasks[id];
      const isAssigned = (task?.assignedTo?.length ?? 0) > 0;
      if (isAssigned) {
        useTasksStore.getState().mergeTaskProgress(id, final);
        setLocalProgress(null);
      } else {
        setLocalProgress(final);
      }
    }
  }, [id]);

  const startFilling = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const task = useTasksStore.getState().tasks[id];
      const canPairNow = (useUpgradesStore.getState().upgrades.taskPairing?.owned ?? 0) > 0;
      const canStart =
        task &&
        !task.isSpecial &&
        task.state === TaskState.Todo &&
        ((task.assignedTo?.length ?? 0) === 0 || canPairNow);
      if (!canStart) return;
      e.preventDefault();
      e.stopPropagation?.();
      setIsHolding(true);
      const startProgress = Math.min(100, effectiveProgressRef.current);
      progressRef.current = startProgress;
      if (startProgress >= 100) return;

      const speed = (config.fillSpeedSeconds ?? 1.8) * (task.difficulty || 1);
      startTimeRef.current =
        performance.now() - (startProgress / 100) * speed * 1000;

      const tick = (timestamp: number) => {
        const elapsed = (timestamp - (startTimeRef.current ?? 0)) / 1000;
        const next = Math.min((elapsed / speed) * 100, 100);
        progressRef.current = next;
        if (liveFillRef.current) {
          liveFillRef.current.style.width = `${next}%`;
        }

        if (next < 100) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setIsHolding(false);
          setLocalProgress(null);
          if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
          startTimeRef.current = null;
          useTasksStore.getState().completeTask(id);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [id]
  );

  useEffect(() => {
    if (state !== TaskState.Todo) setLocalProgress(null);
  }, [state]);

  useEffect(() => {
    if (assignedTo.length > 0 && localProgress !== null) {
      useTasksStore.getState().mergeTaskProgress(id, localProgress);
      setLocalProgress(null);
    }
  }, [id, assignedTo.length, localProgress]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  if (!title) {
    return null;
  }

  useEffect(() => {
    if (category === Category.Metagame || isSpecial) {
      useEventsStore.getState().addEvent('metadata_event', { event: `"${title}"` });
    }
  }, []);

  const variant = isSpecial
    ? 'special'
    : state === TaskState.InReview
      ? 'inReview'
      : assignedTo.length > 0
        ? 'assigned'
        : 'todo';

  return (
    <div
      className={
        'panel panelInner taskCard taskCard--' +
        variant +
        (isSpecial ? ' special ' : ' ') +
        state +
        (canHold ? ' canClick' : '')
      }
      style={{
        marginRight: 'var(--space-3)',
        cursor: canHold ? 'pointer' : 'default',
      }}
      role="button"
      tabIndex={canHold ? 0 : undefined}
      onMouseDown={startFilling}
      onMouseUp={stopFilling}
      onMouseLeave={stopFilling}
      onTouchStart={startFilling}
      onTouchEnd={stopFilling}
      onKeyDown={(e) => {
        if (!canHold) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (e.type === 'keydown' && e.repeat) return;
          startFilling(e as unknown as React.MouseEvent);
          const onKeyUp = () => {
            stopFilling();
            window.removeEventListener('keyup', onKeyUp);
          };
          window.addEventListener('keyup', onKeyUp);
        }
      }}
    >
      <Grid
        gap={1}
        columns="2fr 1fr 1fr"
        rows="1fr 40px auto"
        areas="'title title category' 'assignedTo deadline difficulty' 'progress progress progress'"
      >
        <Box gridArea="title">
          <Flex gap={2} align="start" wrap="wrap">
            <Text className="taskTitle">{title}</Text>
            {state === TaskState.InReview && (
              <span
                className="taskCard-inReviewLabel"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                }}
              >
                In review
              </span>
            )}
            <Box flexShrink={0} style={{ paddingTop: 'var(--space-1)' }}>
              {requiresReview && state !== TaskState.Completed && state !== TaskState.ToSubmit && (
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'start', gridArea: 'category' }}>
          {category && (
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-bg-black)',
                padding: '2px 6px',
                fontSize: 'var(--text-sm)',
                color: getBadgeColor(category),
              }}
            >
              {category}
            </span>
          )}
        </div>

        {assignedTo.length > 0 && (
          <Box gridArea="assignedTo" style={{ position: 'relative' }}>
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
          <ProgressMeter
            id={id}
            overrideProgress={
              isHolding
                ? displayProgress
                : isLocked
                  ? progress
                  : localProgress !== null
                    ? localProgress
                    : undefined
            }
            liveFillRef={isHolding ? liveFillRef : undefined}
          />
        </Box>
      </Grid>
    </div>
  );
});
