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

  if (!title) {
    return null;
  }

  const clicked = () => {
    if (state === TaskState.Todo && !isSpecial) {
      useTasksStore.getState().makeProgress(id);
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

    if (category === Category.Other) {
      return 'orange';
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
      data-has-background={!isSpecial}
    >
      <Card
        className={'taskCard' + (isSpecial ? ' special ' : ' ') + state}
        role="button"
        onClick={clicked}
      >
        <Grid
          gap="3"
          columns="1fr auto"
          rows="2"
          areas="'title category' 'assignedTo difficulty' 'progress progress'"
        >
          <Box gridArea="title">
            <Flex gap="2" align="center">
              <Text>{title}</Text>
              {requiresReview && (
                <Tooltip content="This task requires review after completion">
                  <PiEyeBold size={16} color="gray" />
                </Tooltip>
              )}
            </Flex>
          </Box>
          <Box gridArea="category">
            {category && (
              <Badge color={getBadgeColor(category)}>{category}</Badge>
            )}
          </Box>
          {assignedTo && (
            <Box gridArea="assignedTo">
              <div>{assignedTo}</div>
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
                  Progress
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
