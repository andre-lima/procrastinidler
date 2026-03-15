import { useCallback, useEffect } from 'react';
import { AsciiProgressBar } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { useRentStore } from '../store/rentStore';
import { useEventsStore } from '../store/eventsStore';
import { useDebugStore } from '../store/debugStore';
import { usePersonalUpgradesStore } from '../store/personalUpgradesStore';
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
  const resiliency = usePersonalUpgradesStore((s) => s.resiliency.currentValue);

  const tick = useCallback(() => {
    // Don't advance burnout while game is paused (e.g. burnout overlay).
    if (useGameStore.getState().paused) return;

    const { money, burnout: currentBurnout } = useGameStore.getState();
    const growthFactor = Math.max(0.5, 1 - resiliency);

    if (money < rentAmount) {
      const newBurnout = currentBurnout + config.burnoutGrowthPerTick * growthFactor;
      setBurnout(newBurnout);

      if (newBurnout >= 100) {
        useEventsStore.getState().addEvent('burnout');
        // Enter burned-out paused state; overlay & loops will respect these flags.
        useGameStore.getState().setBurnedOut(true);
        useGameStore.getState().setPaused(true);
        setBurnout(0);
      }
    }
  }, [setBurnout, rentAmount, resiliency]);

  const speedMultiplier = useDebugStore((state) => state.speedMultiplier);
  useEffect(() => {
    const interval = config.tickLength / speedMultiplier;
    const timer = new IntervalController(tick, interval);
    timer.start();
    return () => timer.stop();
  }, [tick, speedMultiplier]);

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
