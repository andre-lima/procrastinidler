import { useCallback, useEffect } from 'react';
import { AsciiProgressBar } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { useRentStore } from '../store/rentStore';
import { useEventsStore } from '../store/eventsStore';
import { config } from './config';
import { IntervalController } from '../helpers/interval-controller';
import { Flex } from '../components/shared';
import { useTranslation } from 'react-i18next';

export const BurnoutMeter = () => {
  const { t } = useTranslation('common');
  const burnout = useGameStore((state) => state.burnout);
  const setBurnout = useGameStore((state) => state.setBurnout);
  const money = useGameStore((state) => state.money);
  const rentAmount = useRentStore((state) => state.rentAmount);

  const tick = useCallback(() => {
    const { money, burnout: currentBurnout } = useGameStore.getState();

    if (money < rentAmount) {
      const newBurnout = currentBurnout + config.burnoutGrowthPerTick;
      setBurnout(newBurnout);

      if (newBurnout >= 100) {
        useEventsStore.getState().addEvent('burnout');
        setBurnout(0);
      }
    }
  }, [setBurnout, rentAmount]);

  useEffect(() => {
    const timer = new IntervalController(tick, config.tickLength);
    timer.start();
    return () => timer.stop();
  }, [tick]);

  const safe = money >= rentAmount;
  const titleClass = safe ? 'meterLabel meterLabel--safe' : 'meterLabel meterLabel--danger';

  return (
    <Flex gap={3} align="center">
      <AsciiProgressBar
        title={<span className={titleClass}>{t('burnout')}</span>}
        value={burnout}
        barCount={30}
        theme={safe ? 'disabled' : 'default'}
      />
    </Flex>
  );
};
