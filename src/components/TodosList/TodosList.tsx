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
  console.log(todoSelector);

  const items = useGameStore(todoSelector);

  return (
    <div>
      {/* <h2>
        {title} ({items.length})
      </h2>
      {items.map((item) => (
        <div key={item.id}>
          <TodoCard {...item} />
        </div>
      ))} */}
    </div>
  );
};
