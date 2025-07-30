import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './TaskCard';
import { config } from '../../game/config';
import { useTasksStore } from '../../store/tasksStore';

const MOCK_TASK = {
  id: '1',
  title: 'Test Task',
  difficulty: 1,
  inProgress: false,
  completed: false,
};

const renderComponent = () => {
  return render(<TaskCard {...MOCK_TASK} />);
};

const completeTaskSpy = vi.spyOn(useTasksStore.getState(), 'completeTask');

describe('TaskCard component', () => {
  beforeEach(() => {});

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should complete when clicked enough times', async () => {
    renderComponent();

    const card = screen.getByRole('button');

    for (
      let i = 0;
      i < config.clicksPerDifficultyLevel * MOCK_TASK.difficulty;
      i++
    ) {
      await userEvent.click(card);
    }

    expect(completeTaskSpy).toHaveBeenCalledWith(MOCK_TASK.id);

    // Todo: Change to check progress value
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
