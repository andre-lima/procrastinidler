import { useCallback, useEffect } from 'react';
import type { GameState } from '../../types';
import { useGameStore } from '../../store/gameStore';

let loopId: number;

export const Assistant = ({ id }: { id: string }) => {
  const assistantInterval = useGameStore(
    (state: GameState) => state.assistantInterval
  );

  const { getNextUnassignedTask } = useGameStore();

  const clickToFind = useCallback(() => {
    // const elements = document.querySelectorAll('.todoCard');
    // const clickThis = elements[0] as HTMLDivElement;
    // clickThis?.click();

    const task = getNextUnassignedTask(id);
  }, [id, getNextUnassignedTask]);

  useEffect(() => {
    loopId = setInterval(clickToFind, assistantInterval);

    return () => clearInterval(loopId);
  }, [assistantInterval, clickToFind]);

  return <div onClick={clickToFind}>assistant</div>;
};
