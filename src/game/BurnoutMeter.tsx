import { useCallback, useEffect } from 'react';
import { AsciiProgressBar } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { config } from './config';
import { IntervalController } from '../helpers/interval-controller';

export const BurnoutMeter = () => {
  const burnout = useGameStore((state) => state.burnout);
  const setBurnout = useGameStore((state) => state.setBurnout);

  const tick = useCallback(() => {
    const { money, burnout: currentBurnout } = useGameStore.getState();

    if (money <= 0) {
      const newBurnout = currentBurnout + config.burnoutGrowthPerTick;
      setBurnout(newBurnout);

      if (newBurnout >= 100) {
        console.log('Burnout triggered!');
        setBurnout(0);
      }
    } else {
      setBurnout(0);
    }
  }, [setBurnout]);

  useEffect(() => {
    const timer = new IntervalController(tick, config.tickLength);
    timer.start();
    return () => timer.stop();
  }, [tick]);

  return <AsciiProgressBar title="burnout" value={burnout} />;
};
