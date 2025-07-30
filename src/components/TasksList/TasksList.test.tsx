import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { TasksList } from './TasksList';
import { useTasksStore } from '../../store/tasksStore';

const renderComponent = () => {
  return render(<TasksList title="To Do" tasksSelector={() => []} />);
};

useTasksStore.setState({ tasks: {} });

describe('TasksList', () => {
  it('should render', () => {
    const component = renderComponent();

    expect(component.baseElement).toBeInTheDocument();
  });
});
