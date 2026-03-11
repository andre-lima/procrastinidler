import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';
import { useTasksStore } from '../../store/tasksStore';

const renderComponent = (id: string = 'initial') => {
  return render(<TaskCard id={id} />);
};

describe('TaskCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent();

    expect(
      screen.getByText('Click and hold on white cards to complete them and earn money $')
    ).toBeInTheDocument();
  });

  it('should keep progress locally when releasing hold before 100%', async () => {
    const completeTaskSpy = vi.spyOn(
      useTasksStore.getState(),
      'completeTask'
    );
    renderComponent();

    const card = screen.getByRole('button');
    fireEvent.mouseDown(card);
    await new Promise((r) => requestAnimationFrame(r));
    fireEvent.mouseUp(card);

    expect(completeTaskSpy).not.toHaveBeenCalled();
  });

  it('should not allow hold when task is assigned', () => {
    const initialTask = useTasksStore.getState().tasks.initial;
    if (initialTask) {
      useTasksStore
        .getState()
        .assignAssistantToTask('some-assistant', { ...initialTask });
    }
    renderComponent();
    const completeTaskSpy = vi.spyOn(
      useTasksStore.getState(),
      'completeTask'
    );
    const card = screen.getByRole('button');
    fireEvent.mouseDown(card);
    fireEvent.mouseUp(card);
    expect(completeTaskSpy).not.toHaveBeenCalled();
  });
});
