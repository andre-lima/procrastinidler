import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';
import { act } from '@testing-library/react';

describe('useGameStore', () => {
  // Reset the store before each test
  beforeEach(() => {
    const { setState } = useGameStore;
    setState({
      money: 0,
      todos: [],
      completed: [],
    });
  });

  it('should start with 0 money and empty todos', () => {
    const state = useGameStore.getState();
    expect(state.money).toBe(0);
    expect(state.todos).toEqual([]);
    expect(state.completed).toEqual([]);
  });

  it('should add money correctly', () => {
    const { addMoney } = useGameStore.getState();

    act(() => {
      addMoney(100);
    });
    expect(useGameStore.getState().money).toBe(100);
  });

  it('should add a new todo with provided data', () => {
    const customTodo = {
      id: '123',
      title: 'Test Todo',
      difficulty: 2,
      inProgress: false,
      completed: false,
    };

    act(() => {
      useGameStore.getState().newTodo(customTodo);
    });

    const todos = useGameStore.getState().todos;
    expect(todos.length).toBe(1);
    expect(todos[0]).toEqual(customTodo);
  });

  it('should add a new todo with default values when no arg is passed', () => {
    act(() => {
      useGameStore.getState().newTodo();
    });

    const todos = useGameStore.getState().todos;
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('random todo title');
    expect(todos[0].difficulty).toBe(1);
    expect(todos[0].completed).toBe(false);
  });

  it('should move a todo to completed', () => {
    const todo = {
      id: 'abc',
      title: 'Complete Me',
      difficulty: 3,
      inProgress: false,
      completed: false,
    };

    act(() => {
      useGameStore.getState().newTodo(todo);
    });

    act(() => {
      useGameStore.getState().completeTodo(todo.id);
    });

    const state = useGameStore.getState();
    expect(state.todos).toHaveLength(0);
    expect(state.completed).toHaveLength(1);
    expect(state.completed[0].id).toBe('abc');
    expect(state.completed[0].completed).toBe(true);
  });

  it('should do nothing if completing a non-existent todo', () => {
    const initialState = useGameStore.getState();
    act(() => {
      useGameStore.getState().completeTodo('non-existent-id');
    });
    expect(useGameStore.getState()).toEqual(initialState);
  });
});
