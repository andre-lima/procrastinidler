import '@radix-ui/themes/styles.css';
import './App.scss';
import { Grid, Theme } from '@radix-ui/themes';
import { NavBar } from './components/NavBar/NavBar';
// import { Assistant } from './components/Assistant/Assistant';
import { TaskState, type TasksState } from './types';
import { TasksList } from './components/TasksList/TasksList';

function App() {
  return (
    <Theme>
      {/* <Assistant id="cat_1" />
      <Assistant id="cat_2" /> */}
      <NavBar />

      <Grid columns="3" gap="3" p="4" width="auto">
        <TasksList
          title="To Do"
          tasksSelector={(state: TasksState) =>
            Object.values(state.tasks)
              .filter((task) => task?.state === TaskState.Todo)
              .map((task) => task?.id || '')
          }
        />
        <TasksList
          title="Completed"
          tasksSelector={(state: TasksState) =>
            Object.values(state.tasks)
              .filter((task) => task?.state === TaskState.Completed)
              .map((task) => task?.id || '')
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
