import { useEffect, useRef } from 'react';
import { useTasksStore } from '../../store/tasksStore';
import { useGameStore } from '../../store/gameStore';

/**
 * Runs a requestAnimationFrame loop that advances assistant/boss task progress
 * over time (fluid progress, same model as player hold-to-fill but continuous).
 */
export function WorkerProgressLoop() {
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const tick = (now: number) => {
      const deltaSeconds = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const paused = useGameStore.getState().paused;
      if (!paused && deltaSeconds > 0 && deltaSeconds < 1) {
        useTasksStore.getState().tickWorkerProgress(deltaSeconds);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!useGameStore.getState().paused) {
        useTasksStore.getState().fillIdleAssistantsWithUnassignedTasks();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
