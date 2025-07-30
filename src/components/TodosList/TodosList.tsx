import { Box, Flex, Heading } from '@radix-ui/themes';
import type { TodosState } from '../../types';
import { TodoCard } from '../TodoCard/TodoCard';
import { useShallow } from 'zustand/shallow';
import { useTodosStore } from '../../store/todosStore';

export const TodosList = ({
  title,
  todosSelector,
}: {
  title: string;
  todosSelector: (state: TodosState) => string[];
}) => {
  const itemIds = useTodosStore(useShallow(todosSelector));

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
