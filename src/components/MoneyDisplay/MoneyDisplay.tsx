import { Badge, Flex, Text } from '@radix-ui/themes';
import { LuCoins } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import './styles.scss';
import { useRef } from 'react';
import { humanNumber } from '../../helpers/human-number';

export const MoneyDisplay = ({ money }: { money: number }) => {
  const [shaking, setShaking] = useState(false);

  const audio = useRef<HTMLAudioElement>(new Audio('./sfx/money.ogg'));

  useEffect(() => {
    setShaking(true);
    const timeout = setTimeout(() => setShaking(false), 400); // match CSS duration

    audio.current?.play().catch((err) => {
      console.warn('Audio play failed:', err);
    });

    return () => clearTimeout(timeout);
  }, [money]);

  return (
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
  );
};
