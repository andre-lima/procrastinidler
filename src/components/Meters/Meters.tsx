import { Flex } from '../shared';
import { RentMeter } from '../../game/RentMeter';
import { BurnoutMeter } from '../../game/BurnoutMeter';
import { WindowContainer } from '../ui';

export function Meters() {
  return (
    <Flex direction="column" gap={0} align="start" justify="center" style={{ padding: 'var(--space-2) var(--space-4)' }}>
      <RentMeter />
      <BurnoutMeter />
    </Flex>
  );
}
