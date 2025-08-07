import '@radix-ui/themes/styles.css';
import './App.scss';
import { Box, Flex, Grid, Heading, Theme } from '@radix-ui/themes';
import { NavBar } from './components/NavBar/NavBar';
import { TaskState, type TasksState } from './types';
import { TasksList } from './components/TasksList/TasksList';
import { useUpgradesStore } from './store/upgradesStore';
import { useGameStore } from './store/gameStore';
import { TasksFilter } from './components/TasksFilter/TasksFilter';
import { Settings } from './components/Settings/Settings';

function App() {
  const showReviewsColumn = useUpgradesStore(
    (state) => state.upgrades.requiresReview.owned > 0
  );
  const showRejectedColumn = useGameStore(
    (state) => state.filters.showRejectedTasks
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
            tasksSelector={(state: TasksState) =>
              Object.keys(state.tasks).filter(
                (task) => state.tasks[task]?.state === TaskState.Todo
              )
            }
          />
          {showReviewsColumn && (
            <TasksList
              title="In Review"
              tasksSelector={(state: TasksState) =>
                Object.keys(state.tasks).filter(
                  (task) => state.tasks[task]?.state === TaskState.InReview
                )
              }
            />
          )}
          <TasksList
            title="Completed"
            tasksSelector={(state: TasksState) =>
              Object.keys(state.tasks).filter(
                (task) => state.tasks[task]?.state === TaskState.Completed
              )
            }
          />

          {showRejectedColumn && (
            <TasksList
              title="Expired"
              tasksSelector={(state: TasksState) =>
                Object.keys(state.tasks).filter(
                  (task) => state.tasks[task]?.state === TaskState.Rejected
                )
              }
            />
          )}
        </Grid>

        <Box gridArea="footer">
          <Flex align="center" justify="end" width="auto" px="4" pb="4">
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
