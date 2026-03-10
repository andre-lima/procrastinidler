import { useCallback, useEffect } from 'react';
import { AsciiProgressBar } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { useRentStore } from '../store/rentStore';
import { config } from './config';
import { IntervalController } from '../helpers/interval-controller';
import { Flex } from '../components/shared';

export const BurnoutMeter = () => {
  const burnout = useGameStore((state) => state.burnout);
  const setBurnout = useGameStore((state) => state.setBurnout);
  const rentAmount = useRentStore((state) => state.rentAmount);

  const tick = useCallback(() => {
    const { money, burnout: currentBurnout } = useGameStore.getState();

    if (money < rentAmount) {
      const newBurnout = currentBurnout + config.burnoutGrowthPerTick;
      setBurnout(newBurnout);

      if (newBurnout >= 100) {
        console.log('Burnout triggered!');
        setBurnout(0);
      }
    }
  }, [setBurnout, rentAmount]);

  useEffect(() => {
    const timer = new IntervalController(tick, config.tickLength);
    timer.start();
    return () => timer.stop();
  }, [tick]);

  return (
    <Flex gap={3} align="center">
      <AsciiProgressBar title="burnout" value={burnout} barCount={50} />
    </Flex>
  );
};
