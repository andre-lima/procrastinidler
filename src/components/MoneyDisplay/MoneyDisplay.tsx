import { Flex, Text } from '../shared';
import { useEffect, useState } from 'react';
import './styles.scss';
import { useRef } from 'react';
import { humanNumber } from '../../helpers/human-number';
import { useGameStore } from '../../store/gameStore';
import { useUpgradesStore } from '../../store/upgradesStore';

export const MoneyDisplay = () => {
  const [shaking, setShaking] = useState(false);
  const money = useGameStore((state) => state.money);
  const sfxOn = useGameStore((state) => state.filters.sfxOn);
  const {
    personalMoneyPerTask,
    increaseDifficulty,
    hasDeadline,
    promotion,
    requiresReview,
  } = useUpgradesStore((state) => state.upgrades);

  const audio = useRef<HTMLAudioElement>(new Audio('./sfx/money.ogg'));

  const moneyPerTask =
    personalMoneyPerTask.currentValue *
    increaseDifficulty.currentValue *
    (hasDeadline?.owned === 1 ? 3 : 1) *
    (requiresReview?.owned === 1 ? 3 : 1) *
    promotion.currentValue;

  useEffect(() => {
    setShaking(true);
    const timeout = setTimeout(() => setShaking(false), 400);

    if (sfxOn) {
      audio.current?.play().catch((err) => {
        console.warn('Audio play failed:', err);
      });
    }

    return () => clearTimeout(timeout);
  }, [money]);

  return (
    <Flex gap={3} align="end">
      <Text size="2" style={{ color: 'var(--color-fg-dim)' }}>
        +{moneyPerTask}$ per task
      </Text>
      <span
        className={shaking ? 'shake' : ''}
        style={{
          padding: '2px 22px',
          fontSize: '1.6em',
          border: '2px solid var(--color-warning)',
          background: 'var(--color-bg-dark)',
          color: 'var(--color-fg-text)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <Flex align="center" gap={2}>
          <Text>{humanNumber(money)}$</Text>
        </Flex>
      </span>
    </Flex>
  );
};
