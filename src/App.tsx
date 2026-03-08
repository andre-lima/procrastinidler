import './App.scss';
import { Box, Flex, Grid, Heading, Text } from './components/shared';
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

  return (
    <div className="page">
      <Grid
        gap={1}
        columns="100%"
        rows="auto auto 1fr auto"
        areas="'header' 'filters' 'tasks' 'footer'"
        align="center"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        <Box gridArea="header">
          <NavBar />
        </Box>

        <Flex gridArea="filters" align="center" justify="between">
          <div />
          <Settings />
        </Flex>

        <Grid
          gap={4}
          gridArea="tasks"
          style={{
            gridAutoColumns: '1fr',
            gridAutoFlow: 'column',
            height: '100%',
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
          <Flex align="center" justify="between" style={{ padding: 'var(--space-4)' }}>
            <Heading size="4" as="h1">
              {completedTasks.length > 30 && (
                <div>
                  <small style={{ color: 'var(--color-fg-dim)' }}>Play my other incremental game: </small>
                  <a
                    className="btn btnPrimary ntabd_button"
                    target="_blank"
                    rel="noreferrer"
                    href="https://andre-lima.itch.io/now-thats-a-big-dragon"
                    style={{ color: 'var(--color-fg-text)', textDecoration: 'none' }}
                  >
                    <Text> Now THAT's a Big Dragon! </Text>
                  </a>
                </div>
              )}
            </Heading>
            <Heading size="4" as="h1">
              | procrastinidler. |
            </Heading>
          </Flex>
        </Box>
      </Grid>
    </div>
  );
}

export default App;
