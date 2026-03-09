import { useEffect, useRef } from 'react';
import { useTasksStore } from '../../store/tasksStore';

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
      if (deltaSeconds > 0 && deltaSeconds < 1) {
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

  return null;
}
