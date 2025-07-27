import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoCard } from './TodoCard';
import { useGameStore } from '../../store/gameStore';
import { config } from '../../game/config';

const MOCK_TODO = {
  id: '1',
  title: 'Test Todo',
  difficulty: 1,
  inProgress: false,
  completed: false,
};

const renderComponent = () => {
  render(<TodoCard {...MOCK_TODO} />);
};

describe('TodoCard component', () => {
  beforeEach(() => {});

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should complete when clicked enough times', async () => {
    const completeTodoSpy = vi.spyOn(useGameStore.getState(), 'completeTodo');

    renderComponent();

    const card = screen.getByRole('button');

    for (
      let i = 0;
      i < config.clicksPerDifficultyLevel * MOCK_TODO.difficulty;
      i++
    ) {
      await userEvent.click(card);
    }

    expect(completeTodoSpy).toHaveBeenCalledWith(MOCK_TODO.id);

    // Todo: Change to check progress value
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
