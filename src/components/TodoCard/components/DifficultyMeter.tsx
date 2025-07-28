import { Box, Flex } from '@radix-ui/themes';
import { RxLightningBolt } from 'react-icons/rx';

export const DifficultyMeter = ({ difficulty }: { difficulty: number }) => {
  const getBoltColor = () => {
    if (difficulty < 3) {
      return 'green';
    }

    if (difficulty < 6) {
      return 'orange';
    }

    return 'tomato';
  };

  return (
    <Flex gap="2px" align="center">
      <Box mr="1" ml="auto">
        <RxLightningBolt color={getBoltColor()} size={16} />
      </Box>
      {Array.from({ length: difficulty }).map((_, index) => (
        <Box
          key={index}
          style={{
            width: '6px',
            height: '12px',
            backgroundColor: 'var(--gray-a6)',
            borderRadius: '9999px',
          }}
        />
      ))}
    </Flex>
  );
};
