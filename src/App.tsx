import './App.scss';
import { useEffect } from 'react';
import { Box, Flex, Text } from './components/shared';
import { NavBar } from './components/NavBar/NavBar';
import { TaskState, type TasksState } from './store/tasksStore';
import { TasksList } from './components/TasksList/TasksList';
import { useGameStore } from './store/gameStore';
import { Settings } from './components/Settings/Settings';
import { config } from './game/config';
import { WorkerProgressLoop } from './components/WorkerProgressLoop/WorkerProgressLoop';
import { CompletedCount } from './components/CompletedCount/CompletedCount';
import { EventsLog } from './components/EventsLog/EventsLog';
import { Meters } from './components/Meters/Meters';
import { useUpgradesStore } from './store/upgradesStore';
import { useComputerUpgradesStore } from './store/computerUpgradesStore';
import { Button, WindowContainer } from './components/ui';
import { useTranslation } from 'react-i18next';
import { humanNumber } from './helpers/human-number';

/** Renders the FIRE upgrade in the player grid area. */
function PlayerFireUpgrade() {
  const fireUpgrade = useUpgradesStore((state) => state.upgrades.FIRE);
  const money = useGameStore((state) => state.money);
  const { t: tUpgrades } = useTranslation('upgrades');

  if (!fireUpgrade) return null;

  return <Flex gap={2} align='center' justify='center'>
    <Box gridArea="title" className="upgradeCard_title">
      <Text>{tUpgrades(fireUpgrade.id + '.title')}</Text>
    </Box>
    <Box gridArea="button" className="">
      <Button
        variant="danger"
        size="lg"
        className=""
        disabled={
          fireUpgrade.cost > money
        }
        onClick={() =>
          useUpgradesStore.getState().purchaseUpgrade(fireUpgrade.id)
        }
      >
        {humanNumber(fireUpgrade.cost)}$
      </Button>
    </Box>
  </Flex>;
}

function App() {
  const showRejectedColumn = useGameStore((state) => state.filters.showRejectedTasks);
  const maxTaskSlots =
    useComputerUpgradesStore(
      (s) => s.taskSlots?.currentValue ?? config.maxTodoTasks
    );
  const burnedOut = useGameStore((state) => (state as any).burnedOut ?? false);

  useEffect(() => {
    // useEventsStore.getState().addEvent('metadata_event');
  }, []);

  return (
    <div className="page gameLayout">
      <WorkerProgressLoop />
      <header className="gameHeader">
        <NavBar />
      </header>

      <div className="gameTasks">
        <Flex
          gap={4}
          style={{
            flex: 1,
            minHeight: 0,
            padding: 'var(--space-4)',
          }}
        >
          <TasksList
            title="Tasks"
            titleTodoInReview
            maxNumOfTasks={maxTaskSlots}
            tasksSelector={(state: TasksState) =>
              Object.keys(state.tasks).filter(
                (task) =>
                  state.tasks[task]?.state === TaskState.Todo ||
                  state.tasks[task]?.state === TaskState.InReview
              )
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
        </Flex>
      </div>

      <div className="gameCompleted">
        <CompletedCount />
      </div>
      <div className="gameBoost">Boost</div>
      <div className="gamePlayer">
        <WindowContainer variant="secondary">
          <Flex align="center" gap={2} direction='column'>
            <img src="/man.png" alt="Player" />
            <PlayerFireUpgrade />
          </Flex>
        </WindowContainer>
      </div>
      <div className="gameEvents">
        <EventsLog />
      </div>

      <div className="gameHeaderMeters">
        <Meters />
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
            Procrastinidler 386
          </span>
        </Flex>
      </Box>

      {burnedOut && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(128, 0, 0, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
          }}
        >
          <Flex direction="column" align="center" gap={4}>
            <Text as="h1" size="5" style={{ fontWeight: 'var(--font-weight-bold)' }}>
              You burned out.
            </Text>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const game = useGameStore.getState();
                game.startNewRun();
                game.setBurnedOut(false);
                game.setPaused(false);
              }}
            >
              Find a New Job
            </Button>
          </Flex>
        </div>
      )}
    </div>
  );
}

export default App;
