import { useState } from 'react';
import type { Todo } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { config } from '../../game/config';

export const TodoCard = ({ title, difficulty, id, completed }: Todo) => {
  const [clickCount, setClickCount] = useState(0);
  const { completeTodo } = useGameStore();

  const clicked = () => {
    const newCount = clickCount + 1;

    if (!completed) {
      setClickCount(newCount);

      if (newCount >= difficulty * config.clicksPerDifficultyLevel) {
        completeTodo(id);
      }
    }
  };

  return (
    <div role="button" onClick={clicked}>
      <div>{title}</div>
      <div>{difficulty}</div>
      <div>{clickCount}</div>
      <div>{id}</div>
    </div>
  );
};
