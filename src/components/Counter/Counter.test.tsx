// src/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';
import { useCounterStore } from '../../store/store'; // Import the store for resetting
import { describe, it, expect, beforeEach } from 'vitest';

describe('Counter Component', () => {
  // Reset the store state before each test to ensure isolated tests
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it('renders the initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments the count when the Increment button is clicked', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('Increment'));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('decrements the count when the Decrement button is clicked', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('Decrement'));
    expect(screen.getByText('Count: -1')).toBeInTheDocument();
  });
});
