import { Badge, Flex, Text } from '@radix-ui/themes';
import { LuCoins } from 'react-icons/lu';
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
    requiresReview,
  } = useUpgradesStore((state) => state.upgrades);

  const audio = useRef<HTMLAudioElement>(new Audio('./sfx/money.ogg'));

  const moneyPerTask =
    personalMoneyPerTask.currentValue *
    increaseDifficulty.currentValue *
    (hasDeadline?.owned === 1 ? 3 : 1) *
    (requiresReview?.owned === 1 ? 3 : 1);

  useEffect(() => {
    setShaking(true);
    const timeout = setTimeout(() => setShaking(false), 400); // match CSS duration

    if (sfxOn) {
      audio.current?.play().catch((err) => {
        console.warn('Audio play failed:', err);
      });
    }

    return () => clearTimeout(timeout);
  }, [money]);

  return (
    <Flex gap="3" align="end">
      <Text size="2" color="gray">
        +{moneyPerTask}$ per task
      </Text>
      <Badge
        className={shaking ? 'shake' : ''}
        variant="solid"
        style={{
          padding: '2px 22px',
          fontSize: '1.6em',
          border: '2px solid var(--yellow-10)',
        }}
        color="yellow"
        size="3"
      >
        <Flex align="center" gap="2">
          <LuCoins />
          <Text>{humanNumber(money)}$</Text>
        </Flex>
      </Badge>
    </Flex>
  );
};
