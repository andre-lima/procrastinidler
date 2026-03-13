import { Flex, Text } from '../shared';
import { humanNumber } from '../../helpers/human-number';
import { useGameStore } from '../../store/gameStore';

/** Displays current RAM currency in the header. */
export const RamDisplay = () => {
  const ram = useGameStore((state) => state.RAM);

  return (
    <span
      style={{
        padding: '2px 12px',
        fontSize: '1.2em',
        border: '2px solid var(--color-accent)',
        background: 'var(--color-bg-dark)',
        color: 'var(--color-fg-text)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <Flex align="center" gap={2}>
        <Text size="1" style={{ color: 'var(--color-fg-dim)' }}>
          RAM
        </Text>
        <Text>{humanNumber(ram)}</Text>
      </Flex>
    </span>
  );
};
