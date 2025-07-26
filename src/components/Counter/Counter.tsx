// src/Counter.tsx
import React from 'react';
import { useCounterStore } from '../../store/store';

const Counter: React.FC = () => {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
