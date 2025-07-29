import { Category } from '../../types';
import {
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  Progress,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { DifficultyMeter } from './components/DifficultyMeter';
import { PiEyeBold } from 'react-icons/pi';
// import { PieChart } from 'react-minimal-pie-chart';
import { useShallow } from 'zustand/shallow';
import { useTodos } from '../../store/todosStore';

export const TodoCard = ({ id }: { id: string }) => {
  // const [clickCount, setClickCount] = useState(0);
  const { makeProgress } = useTodos();
  const todo = useTodos(useShallow((state) => state.todos[id]));

  if (!todo) {
    return null;
  }

  const { title, category, difficulty, progress, completed, assignedTo } = todo;

  const clicked = () => {
    // const newCount = clickCount + 1;

    if (!completed) {
      makeProgress(id);
      // setClickCount(newCount);
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
    <Card className="todoCard" role="button" onClick={clicked}>
      <Grid
        gap="3"
        columns="1fr auto"
        rows="2"
        areas="'title category' 'assignedTo difficulty' 'progress progress'"
      >
        <Box gridArea="title">
          <Flex gap="2" align="center">
            <Text>{title}</Text>
            <Tooltip content="This task requires review after completion">
              <PiEyeBold size={16} color="gray" />
            </Tooltip>
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
          <Progress color="green" value={progress} variant="soft" />
        </Box>
      </Grid>
    </Card>
  );
};
