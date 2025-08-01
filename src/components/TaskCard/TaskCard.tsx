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

export const TaskCard = ({ id }: { id: string }) => {
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

  // const getDeadlineColor = () => {
  //   if (!deadline) {
  //     return 'gray';
  //   }

  //   if (deadline < 5) {
  //     return 'red';
  //   }

  //   if (deadline < 10) {
  //     return 'orange';
  //   }

  //   return 'green';
  // };

  return (
    <Theme
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
        role="button"
        onClick={clicked}
      >
        <Grid
          gap="1"
          columns="1fr auto"
          rows="1fr 40px 1fr"
          areas="'title category' 'assignedTo difficulty' 'progress progress'"
        >
          <Box gridArea="title">
            <Flex gap="2" align="center">
              <Text>{title}</Text>
              {requiresReview && (
                <Tooltip content="This task requires review after completion">
                  <PiEyeBold size={16} color="crimson" />
                </Tooltip>
              )}
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
              {/* <Container align="left" width="22px">
              <PieChart
                data={[
                  { title: 'One', value: deadline, color: getDeadlineColor() },
                  { title: 'One', value: 100 - deadline, color: 'transparent' },
                ]}
              />
            </Container> */}
            </Box>
          )}
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
                {progress}%
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
