import { Category, TaskState } from '../../types';
import {
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  Progress,
  Text,
  Theme,
  Tooltip,
} from '@radix-ui/themes';
import { DifficultyMeter } from './components/DifficultyMeter';
import { PiEyeBold } from 'react-icons/pi';
import './styles.scss';
// import { PieChart } from 'react-minimal-pie-chart';
import { useShallow } from 'zustand/shallow';
import { useTasksStore } from '../../store/tasksStore';
import { useUpgradesStore } from '../../store/upgradesStore';
import { DeadlineCountdown } from '../DeadlineCountdown/DeadlineCountdown';
import { useCallback } from 'react';
import { LuCheck, LuX } from 'react-icons/lu';
import { humanNumber } from '../../helpers/human-number';

export const TaskCard = ({ id }: { id: string }) => {
  const {
    title,
    category,
    difficulty,
    state,
    assignedTo,
    isSpecial,
    deadline,
    requiresReview,
    progress,
  } = useTasksStore(useShallow((state) => ({ ...state.tasks[id]! })));
  const canPair = useUpgradesStore(
    (state) => state.upgrades.taskPairing.owned > 0
  );
  const onDeadlineFinished = useCallback(() => {
    useTasksStore.getState().rejectTask(id);
  }, [id]);

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

  const getBadgeColor = (category: Category) => {
    if (category === Category.Metagame) {
      return 'red';
    }

    if (category === Category.Personal) {
      return 'green';
    }

    if (category === Category.Work) {
      return 'blue';
    }

    if (category === Category.Education) {
      return 'yellow';
    }

    if (category === Category.Health) {
      return 'purple';
    }

    if (category === Category.Leisure) {
      return 'orange';
    }

    if (category === Category.Other) {
      return 'indigo';
    }

    return 'gray';
  };

  return (
    <Theme
      // style={{ order: showOnTop ? 0 : 1 }}
      appearance={!isSpecial ? 'light' : 'dark'}
      data-has-background={false}
    >
      <Card
        className={
          'taskCard' +
          (isSpecial ? ' special ' : ' ') +
          state +
          (canClick ? ' canClick' : '')
        }
        mr="3"
        role="button"
        onClick={clicked}
      >
        <Grid
          gap="1"
          columns="2fr 1fr 1fr"
          rows="1fr 40px auto"
          areas="'title title category' 'assignedTo deadline difficulty' 'progress progress progress'"
        >
          <Box gridArea="title">
            <Flex gap="2" align="start">
              <Text className="taskTitle">{title}</Text>
              <Box flexShrink="0" pt="1">
                {requiresReview && state !== TaskState.Completed && (
                  <Tooltip content="This task requires review after completion">
                    <PiEyeBold size="16px" color="crimson" />
                  </Tooltip>
                )}
                {state === TaskState.Completed && (
                  <LuCheck size="22px" color="green" />
                )}
                {state === TaskState.Rejected && (
                  <LuX size="22px" color="red" />
                )}
              </Box>
            </Flex>
          </Box>
          <Flex justify="end" gridArea="category">
            {category && (
              <Badge color={getBadgeColor(category)}>{category}</Badge>
            )}
          </Flex>

          {assignedTo.length > 0 && (
            <Box gridArea="assignedTo">
              {assignedTo.map((assistantId) => (
                <div key={assistantId} className="assignedAssistantImage">
                  <img
                    src={'assistants/' + assistantId + '.png'}
                    alt={'assistant image'}
                  />
                </div>
              ))}
            </Box>
          )}
          <Box gridArea="deadline">
            {deadline && state === TaskState.Todo && (
              <DeadlineCountdown
                seconds={deadline}
                completionCallback={onDeadlineFinished}
              />
            )}
          </Box>
          <Box gridArea="difficulty">
            <DifficultyMeter difficulty={difficulty} />
          </Box>
          <Box gridArea="progress">
            <Flex>
              <Box flexGrow="1">
                <Text size="2" color="gray">
                  {state === TaskState.InReview ? 'Review' : 'Progress'}
                </Text>
              </Box>
              <Text size="2" color="gray">
                {humanNumber(progress, 0)}%
              </Text>
            </Flex>
            <Progress
              color="green"
              value={state === TaskState.Completed ? 100 : progress}
              variant="soft"
            />
          </Box>
        </Grid>
      </Card>
    </Theme>
  );
};
