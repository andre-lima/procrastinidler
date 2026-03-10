import { useCallback, useEffect } from 'react';
import { AsciiProgressBar } from '../components/ui';
import { useRentStore } from '../store/rentStore';
import { config } from './config';
import { IntervalController } from '../helpers/interval-controller';
import { Flex, Text } from '../components/shared';

const rentIntervalMs = (config.rentIntervalSeconds ?? 120) * 1000;

export const RentMeter = () => {
  const rentAmount = useRentStore((state) => state.rentAmount);
  const remainingMs = useRentStore((state) => state.remainingMs);

  const tickCb = useCallback(() => {
    useRentStore.getState().tick();
  }, []);

  useEffect(() => {
    const timer = new IntervalController(tickCb, config.tickLength);
    timer.start();
    return () => timer.stop();
  }, [tickCb]);

  const progressValue = Math.max(0, Math.min(remainingMs, rentIntervalMs));

  return (
    <Flex gap={3} align="center">
      <AsciiProgressBar
        title="rent"
        value={progressValue}
        max={rentIntervalMs}
        barCount={10}
        showPercent={false}
      />
      <Text size="2" style={{ color: 'var(--color-fg-dim)', whiteSpace: 'nowrap' }}>
        Rent ${rentAmount}
      </Text>
    </Flex>
  );
};
