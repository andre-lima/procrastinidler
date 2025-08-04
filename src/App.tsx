import '@radix-ui/themes/styles.css';
import './App.scss';
import { Box, Flex, Grid, Heading, Theme } from '@radix-ui/themes';
import { NavBar } from './components/NavBar/NavBar';
import { TaskState, type TasksState } from './types';
import { TasksList } from './components/TasksList/TasksList';
import { useUpgradesStore } from './store/upgradesStore';
import { useGameStore } from './store/gameStore';
import { TasksFilter } from './components/TasksFilter/TasksFilter';

function App() {
  const showReviewsColumn = useUpgradesStore(
    (state) => state.upgrades.requiresReview.owned > 0
  );
  const showRejectedColumn = useGameStore(
    (state) => state.filters.showRejectedTasks
  );

  return (
    <Theme>
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

        <Box gridArea="filters" width="100%">
          <TasksFilter />
        </Box>

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
              Object.values(state.tasks)
                .filter((task) => task?.state === TaskState.Todo)
                .map((task) => task?.id || '')
            }
          />
          {showReviewsColumn && (
            <TasksList
              title="In Review"
              tasksSelector={(state: TasksState) =>
                Object.values(state.tasks)
                  .filter((task) => task?.state === TaskState.InReview)
                  .map((task) => task?.id || '')
              }
            />
          )}
          <TasksList
            title="Completed"
            tasksSelector={(state: TasksState) =>
              Object.values(state.tasks)
                .filter((task) => task?.state === TaskState.Completed)
                .map((task) => task?.id || '')
            }
          />

          {showRejectedColumn && (
            <TasksList
              title="Rejected"
              tasksSelector={(state: TasksState) =>
                Object.values(state.tasks)
                  .filter((task) => task?.state === TaskState.Rejected)
                  .map((task) => task?.id || '')
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
