import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TodosList } from './TodosList';
import { useGameStore } from '../../store/gameStore';

const renderComponent = () => {
  return render(<TodosList title="Todos" todoSelector={() => []} />);
};

useGameStore.setState({ todos: [] });

describe('TodosList', () => {
  it('should render', () => {
    const component = renderComponent();

    expect(component.baseElement).toBeInTheDocument();
  });
});
