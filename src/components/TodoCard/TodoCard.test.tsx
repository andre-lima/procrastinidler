import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
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

  // it('should add money correctly', () => {
  //   const { addMoney } = useGameStore.getState();

  //   act(() => {
  //     addMoney(100);
  //   });
  //   expect(useGameStore.getState().money).toBe(100);
  // });

  // it('should add a new todo with provided data', () => {
  //   const customTodo = {
  //     id: '123',
  //     title: 'Test Todo',
  //     difficulty: 2,
  //     inProgress: false,
  //     completed: false,
  //   };

  //   act(() => {
  //     useGameStore.getState().newTodo(customTodo);
  //   });

  //   const todos = useGameStore.getState().todos;
  //   expect(todos.length).toBe(1);
  //   expect(todos[0]).toEqual(customTodo);
  // });

  // it('should add a new todo with default values when no arg is passed', () => {
  //   act(() => {
  //     useGameStore.getState().newTodo();
  //   });

  //   const todos = useGameStore.getState().todos;
  //   expect(todos.length).toBe(1);
  //   expect(todos[0].title).toBe('random todo title');
  //   expect(todos[0].difficulty).toBe(1);
  //   expect(todos[0].completed).toBe(false);
  // });

  // it('should move a todo to completed', () => {
  //   const todo = {
  //     id: 'abc',
  //     title: 'Complete Me',
  //     difficulty: 3,
  //     inProgress: false,
  //     completed: false,
  //   };

  //   act(() => {
  //     useGameStore.getState().newTodo(todo);
  //   });

  //   act(() => {
  //     useGameStore.getState().completeTodo(todo.id);
  //   });

  //   const state = useGameStore.getState();
  //   expect(state.todos).toHaveLength(0);
  //   expect(state.completed).toHaveLength(1);
  //   expect(state.completed[0].id).toBe('abc');
  //   expect(state.completed[0].completed).toBe(true);
  // });

  // it('should do nothing if completing a non-existent todo', () => {
  //   const initialState = useGameStore.getState();
  //   act(() => {
  //     useGameStore.getState().completeTodo('non-existent-id');
  //   });
  //   expect(useGameStore.getState()).toEqual(initialState);
  // });
});
