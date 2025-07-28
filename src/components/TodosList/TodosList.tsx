import { Box, Flex, Heading } from '@radix-ui/themes';
import { useGameStore } from '../../store/gameStore';
import type { GameState, Todo } from '../../types';
import { TodoCard } from '../TodoCard/TodoCard';

export const TodosList = ({
  title,
  todoSelector,
}: {
  title: string;
  todoSelector: (state: GameState) => Todo[];
}) => {
  const items = useGameStore(todoSelector);

  return (
    <Box
      p="4"
      style={{
        background: 'var(--gray-a3)',
        borderRadius: 'var(--radius-3)',
      }}
    >
      <Heading size="4" as="h2" mb="4">
        {title} ({items.length})
      </Heading>

      <Flex direction="column" gap="2">
        {items.map((item) => (
          <TodoCard key={item.id} {...item} />
        ))}
      </Flex>
    </Box>
  );
};
