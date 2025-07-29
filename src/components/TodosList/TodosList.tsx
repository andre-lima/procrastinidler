import { Box, Flex, Heading } from '@radix-ui/themes';
import { useGameStore } from '../../store/gameStore';
import type { GameState } from '../../types';
import { TodoCard } from '../TodoCard/TodoCard';
import { useShallow } from 'zustand/shallow';

export const TodosList = ({
  title,
  todosSelector,
}: {
  title: string;
  todosSelector: (state: GameState) => string[];
}) => {
  const itemIds = useGameStore(useShallow(todosSelector));

  return (
    <Box
      p="4"
      style={{
        background: 'var(--gray-a3)',
        borderRadius: 'var(--radius-3)',
      }}
    >
      <Heading size="4" as="h2" mb="4">
        {title} ({itemIds.length})
      </Heading>

      <Flex direction="column" gap="2">
        {itemIds.map((id) => (
          <TodoCard key={id} id={id} />
        ))}
      </Flex>
    </Box>
  );
};
