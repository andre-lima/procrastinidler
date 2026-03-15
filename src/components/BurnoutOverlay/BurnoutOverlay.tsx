import { Flex, Text } from '../shared';
import { Button } from '../ui';
import { useGameStore } from '../../store/gameStore';

/** Full-screen overlay shown when the player has burned out; offers "Find a New Job" to start a new run. */
export function BurnoutOverlay() {
  const burnedOut = useGameStore((state) => state.burnedOut ?? false);

  if (!burnedOut) return null;

  const handleFindNewJob = () => {
    const game = useGameStore.getState();
    game.startNewRun();
    game.setBurnedOut(false);
    game.setPaused(false);
  };

  return (
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
        <Button variant="primary" size="lg" onClick={handleFindNewJob}>
          Find a New Job
        </Button>
      </Flex>
    </div>
  );
}
