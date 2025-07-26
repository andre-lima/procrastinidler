import { describe, it, expect, beforeEach } from 'vitest';
import { useCounterStore } from './store';

// Reset Zustand store between tests
beforeEach(() => {
  const { increment, decrement } = useCounterStore.getState();
  useCounterStore.setState({ count: 0 });
});

describe('useCounterStore', () => {
  it('should initialize with count 0', () => {
    const { count } = useCounterStore.getState();
    expect(count).toBe(0);
  });

  it('should increment the count', () => {
    useCounterStore.getState().increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it('should decrement the count', () => {
    useCounterStore.setState({ count: 2 }); // set count manually
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it('should increment then decrement the count', () => {
    const store = useCounterStore.getState();
    store.increment();
    store.increment();
    store.decrement();
    expect(useCounterStore.getState().count).toBe(1);
  });
});
