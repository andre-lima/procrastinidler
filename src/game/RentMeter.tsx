import { useCallback, useEffect } from 'react';
import { AsciiProgressBar } from '../components/ui';
import { useRentStore } from '../store/rentStore';
import { useGameStore } from '../store/gameStore';
import { config } from './config';
import { IntervalController } from '../helpers/interval-controller';
import { Flex } from '../components/shared';
import { useTranslation } from 'react-i18next';
import { humanNumber } from '../helpers/human-number';

const rentIntervalMs = (config.rentIntervalSeconds ?? 120) * 1000;

export const RentMeter = () => {
  const { t } = useTranslation('common');
  const money = useGameStore((state) => state.money);
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
  const safe = money >= rentAmount;
  const amountClass = safe ? 'meterLabel meterLabel--safe' : 'meterLabel meterLabel--danger';

  return (
    <Flex gap={3} align="center">
      <AsciiProgressBar
        title={
          <>
            <span className={amountClass}>{humanNumber(rentAmount)}$</span> {t('rent_due_suffix')}
          </>
        }
        value={progressValue}
        max={rentIntervalMs}
        barCount={10}
        showPercent={false}
      />
    </Flex>
  );
};
