import '@radix-ui/themes/styles.css';
import './App.scss';
import { Box, Button, Flex, Grid, Heading, Link, Theme, Text } from '@radix-ui/themes';
import { NavBar } from './components/NavBar/NavBar';
import { TaskState, type TasksState } from './types';
import { TasksList } from './components/TasksList/TasksList';
import { useUpgradesStore } from './store/upgradesStore';
import { useGameStore } from './store/gameStore';
import { Settings } from './components/Settings/Settings';
import { config } from './game/config';
import { useTasksStore } from './store/tasksStore.ts';
import { useShallow } from 'zustand/react/shallow';

function App() {
  const showReviewsColumn = useUpgradesStore((state) => state.upgrades.requiresReview.owned > 0);
  const showRejectedColumn = useGameStore((state) => state.filters.showRejectedTasks);

  const completedTasks = useTasksStore(
    useShallow((state) => Object.keys(state.tasks).filter((task) => state.tasks[task]?.state === TaskState.Completed)),
  );
  const isDarkMode = useGameStore((state) => state.filters.isDarkMode);

  return (
    <Theme appearance={isDarkMode ? 'dark' : 'light'} accentColor="violet">
      <Grid
        gap="1"
        columns="100%"
        rows="auto auto 1fr auto"
        areas="'header' 'filters' 'tasks' 'footer'"
        align="center"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        <Box gridArea="header" width="100%">
          <NavBar />
        </Box>

        <Flex gridArea="filters" align="center" justify="between" width="100%">
          {/* <TasksFilter /> */}
          <div></div>
          <Settings />
        </Flex>

        <Grid
          gap="4"
          p="4"
          width="auto"
          gridArea="tasks"
          height={'100%'}
          style={{
            gridAutoColumns: '1fr',
            gridAutoFlow: 'column',
          }}
        >
          <TasksList
            title="To Do"
            maxNumOfTasks={config.maxTodoTasks}
            tasksSelector={(state: TasksState) =>
              Object.keys(state.tasks).filter((task) => state.tasks[task]?.state === TaskState.Todo)
            }
          />
          {showReviewsColumn && (
            <TasksList
              title="In Review"
              tasksSelector={(state: TasksState) =>
                Object.keys(state.tasks).filter((task) => state.tasks[task]?.state === TaskState.InReview)
              }
            />
          )}
          <TasksList
            title="Completed"
            tasksSelector={(state: TasksState) =>
              Object.keys(state.tasks).filter((task) => state.tasks[task]?.state === TaskState.Completed)
            }
          />

          {showRejectedColumn && (
            <TasksList
              title="Expired"
              tasksSelector={(state: TasksState) =>
                Object.keys(state.tasks).filter((task) => state.tasks[task]?.state === TaskState.Rejected)
              }
            />
          )}
        </Grid>

        <Box gridArea="footer">
          <Flex align="center" justify="between" width="auto" px="4" pb="4">
            <Heading size="4" as="h1">
              {completedTasks.length > 30 && (
                <div>
                  <small style={{ color: '#565656' }}>Play my other incremental game: </small>
                  <Button className={'ntabd_button'}>
                    <Link
                      underline={'none'}
                      target={'_blank'}
                      href={'https://andre-lima.itch.io/now-thats-a-big-dragon'}
                    >
                      <Text style={{ color: 'white' }}> Now THAT's a Big Dragon! </Text>
                    </Link>
                  </Button>
                </div>
              )}
            </Heading>
            <Heading size="4" as="h1">
              | procrastinidler. |
            </Heading>
          </Flex>
        </Box>
      </Grid>
    </Theme>
  );
}

export default App;
