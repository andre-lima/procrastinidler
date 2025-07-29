import '@radix-ui/themes/styles.css';
import './App.scss';
import { Grid, Theme } from '@radix-ui/themes';
import { TodosList } from './components/TodosList/TodosList';
import { NavBar } from './components/NavBar/NavBar';
import { Assistant } from './components/Assistant/Assistant';
import type { TodosState } from './types';

function App() {
  return (
    <Theme>
      <Assistant id="cat_1" />
      <Assistant id="cat_2" />
      <NavBar />

      <Grid columns="3" gap="3" p="4" width="auto">
        <TodosList
          title="Todos"
          todosSelector={(state: TodosState) =>
            Object.values(state.todos)
              .filter((todo) => !todo?.completed)
              .map((todo) => todo?.id || '')
          }
        />
        <TodosList
          title="Completed"
          todosSelector={(state: TodosState) =>
            Object.values(state.todos)
              .filter((todo) => todo?.completed)
              .map((todo) => todo?.id || '')
          }
        />
      </Grid>

      {/* <Box maxWidth="240px">
        <Card>
          <Flex gap="3" align="center">
            <Avatar
              size="3"
              src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
              radius="full"
              fallback="T"
            />
            <Box>
              <Text as="div" size="2" weight="bold">
                Teodros Girmay
              </Text>
              <Text as="div" size="2" color="gray">
                Engineering
              </Text>
            </Box>
          </Flex>
        </Card>
      </Box> */}
    </Theme>
  );
}

export default App;
