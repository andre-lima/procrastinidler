import { useEffect } from 'react';
import type { GameState } from '../../types';
import { useGameStore } from '../../store/gameStore';

let loopId: number;

export const Assistant = () => {
  const assistantInterval = useGameStore(
    (state: GameState) => state.assistantInterval
  );

  const clickToFind = () => {
    const elements = document.querySelectorAll('.todoCard');

    const clickThis = elements[0] as HTMLDivElement;
    // clickThis?.click();
  };

  useEffect(() => {
    loopId = setInterval(clickToFind, assistantInterval);

    return () => clearInterval(loopId);
  }, [assistantInterval]);

  return <div onClick={clickToFind}>assistant</div>;
};
