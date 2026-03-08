import { Flex, Box } from '../../shared';

export const DifficultyMeter = ({ difficulty }: { difficulty: number }) => {
  const getBarColor = () => {
    if (difficulty < 3) return 'var(--color-success)';
    if (difficulty < 6) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <Flex gap="2px" align="center">
      <Box style={{ marginLeft: 'auto' }}>
        <span style={{ fontSize: 'var(--text-sm)', color: getBarColor() }}>Lv{difficulty}</span>
      </Box>
      {Array.from({ length: difficulty }).map((_, index) => (
        <Box
          key={index}
          style={{
            width: '6px',
            height: '12px',
            backgroundColor: getBarColor(),
            borderRadius: '9999px',
          }}
        />
      ))}
    </Flex>
  );
};
