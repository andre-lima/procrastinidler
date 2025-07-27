import { BellIcon } from '@radix-ui/react-icons';
import { useGameStore } from '../../store/gameStore';
import type { GameState } from '../../types';
import { Badge, Button, Container, Flex, Grid, Theme } from '@radix-ui/themes';

export const NavBar = () => {
  const { newTodo, money } = useGameStore((state: GameState) => state);

  return (
    <div className="navBar">
      <Container p="4" maxWidth="100%">
        <Grid columns="3" gap="3" rows="1" width="auto">
          <Flex gap="2" align="center">
            <Button
              variant="surface"
              color="gray"
              size="3"
              onClick={() => newTodo()}
            >
              + Todo
            </Button>
            <Button variant="surface" color="gray" onClick={() => newTodo()}>
              <BellIcon /> Boss
            </Button>
            <Button variant="surface" color="gray" onClick={() => newTodo()}>
              Assistants
            </Button>
          </Flex>
          <Container align="center" width="auto">
            Not a todo list app!
          </Container>
          <Container align="right" width="auto">
            <Badge color="yellow" size="3">
              {money}$
            </Badge>
          </Container>
        </Grid>
      </Container>
    </div>
  );
};
