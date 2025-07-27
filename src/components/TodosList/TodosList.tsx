import { useGameStore } from '../../store/gameStore';
import type { GameState, Todo } from '../../types';
import { TodoCard } from '../TodoCard/TodoCard';

export const TodosList = ({
  todoSelector,
}: {
  todoSelector: (state: GameState) => Todo[];
}) => {
  const items = useGameStore(todoSelector);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <TodoCard {...item} />
        </div>
      ))}
    </div>
  );
};
