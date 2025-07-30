import { useGameStore } from '../../store/gameStore';
import {
  Badge,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
} from '@radix-ui/themes';
import { LuCoins, LuCrown, LuUsers, LuPlus } from 'react-icons/lu';
import { useTodosStore } from '../../store/todosStore';
import { TaskState } from '../../types';

export const NavBar = () => {
  const { newTodo } = useTodosStore((state) => state);
  const money = useGameStore((state) => state.money);
  const newTaskTodo = useTodosStore((state) => state.todos.clickNewTask);

  const createNewTask = () => {
    if (newTaskTodo && newTaskTodo.state === TaskState.Todo) {
      useTodosStore.getState().completeTodo(newTaskTodo.id);
    }

    newTodo();
  };

  return (
    <div className="navBar">
      <Container p="4" maxWidth="100%">
        <Grid columns="3" gap="3" rows="1" width="auto">
          <Flex gap="2" align="center">
            <Button
              style={{
                backgroundColor: 'var(--gray-12)',
                color: 'var(--gray-1)',
              }}
              variant="surface"
              size="3"
              onClick={createNewTask}
            >
              <LuPlus /> Todo
            </Button>
            <Button
              style={{
                backgroundColor: 'var(--gray-1)',
                color: 'var(--gray-12)',
              }}
              variant="surface"
              onClick={() => newTodo()}
            >
              <LuCrown /> Boss
            </Button>
            <Button
              style={{
                backgroundColor: 'var(--gray-1)',
                color: 'var(--gray-12)',
              }}
              variant="surface"
              onClick={() => newTodo()}
            >
              <LuUsers /> Assistants
            </Button>
          </Flex>
          <Flex align="center" justify="center" width="auto">
            <Heading size="4" as="h1">
              Not a todo list app!
            </Heading>
          </Flex>
          <Flex justify="end" align="center" width="auto">
            <Badge style={{ fontSize: '1.2em' }} color="yellow" size="3">
              <LuCoins /> {money}$
            </Badge>
          </Flex>
        </Grid>
      </Container>
    </div>
  );
};
