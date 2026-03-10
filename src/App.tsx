import './App.scss';
import { useEffect } from 'react';
import { Box, Flex, Grid } from './components/shared';
import { NavBar } from './components/NavBar/NavBar';
import { TaskState, type TasksState } from './store/tasksStore';
import { TasksList } from './components/TasksList/TasksList';
import { useUpgradesStore } from './store/upgradesStore';
import { useGameStore } from './store/gameStore';
import { useEventsStore } from './store/eventsStore';
import { Settings } from './components/Settings/Settings';
import { config } from './game/config';
import { WorkerProgressLoop } from './components/WorkerProgressLoop/WorkerProgressLoop';
import { CompletedCount } from './components/CompletedCount/CompletedCount';
import { EventsLog } from './components/EventsLog/EventsLog';

function App() {
  const showReviewsColumn = useUpgradesStore((state) => state.upgrades.requiresReview.owned > 0);
  const showRejectedColumn = useGameStore((state) => state.filters.showRejectedTasks);

  useEffect(() => {
    useEventsStore.getState().addEvent('metadata_event');
  }, []);

  return (
    <div className="page gameLayout">
      <WorkerProgressLoop />
      <header className="gameHeader">
        <NavBar />
      </header>

      <div className="gameTasks">
        <Grid
          gap={4}
          style={{
            gridAutoColumns: '1fr',
            gridAutoFlow: 'column',
            flex: 1,
            minHeight: 0,
            padding: 'var(--space-4)',
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

          {showRejectedColumn && (
            <TasksList
              title="Expired"
              tasksSelector={(state: TasksState) =>
                Object.keys(state.tasks).filter((task) => state.tasks[task]?.state === TaskState.Rejected)
              }
            />
          )}
        </Grid>
      </div>

      <div className="gameCompleted">
        <CompletedCount />
      </div>
      <div className="gameBoost">Boost</div>
      <div className="gamePlayer">Player</div>
      <div className="gameEvents">
        <EventsLog />
      </div>

      <Box className="gameFooter">
        <Flex align="center" justify="between" style={{ padding: 'var(--space-2) var(--space-3)' }}>
          <Flex align="center" gap={2}>
            <Settings />
            {/* {completedTasks.length > 30 && (
              <Heading size="4" as="h1">
                <small style={{ color: 'var(--color-sidebar-item-text)' }}>Play my other incremental game: </small>
                <a
                  className="btn btnPrimary ntabd_button"
                  target="_blank"
                  rel="noreferrer"
                  href="https://andre-lima.itch.io/now-thats-a-big-dragon"
                  style={{ color: 'var(--color-sidebar-item-text)', textDecoration: 'none' }}
                >
                  <Text> Now THAT's a Big Dragon! </Text>
                </a>
              </Heading>
            )} */}
          </Flex>
          <span className="footerBrand" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)' }}>
            Procrastinidler
          </span>
        </Flex>
      </Box>
    </div>
  );
}

export default App;
