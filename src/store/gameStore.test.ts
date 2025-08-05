// import { describe, it, expect, beforeEach } from 'vitest';
// import { useGameStore } from './gameStore';
// import { act } from '@testing-library/react';

// describe('useGameStore', () => {
//   // Reset the store before each test
//   beforeEach(() => {
//     const { setState } = useGameStore;
//     setState({
//       money: 0,
//       tasks: [],
//       completed: [],
//     });
//   });

//   it('should start with 0 money and empty tasks', () => {
//     const state = useGameStore.getState();
//     expect(state.money).toBe(0);
//     expect(state.tasks).toEqual([]);
//     expect(state.completed).toEqual([]);
//   });

//   it('should add money correctly', () => {
//     const { addMoney } = useGameStore.getState();

//     act(() => {
//       addMoney(100);
//     });
//     expect(useGameStore.getState().money).toBe(100);
//   });

//   it('should add a new task with provided data', () => {
//     const customTodo = {
//       id: '123',
//       title: 'Test Todo',
//       difficulty: 2,
//       inProgress: false,
//       completed: false,
//     };

//     act(() => {
//       useGameStore.getState().newTodo(customTodo);
//     });

//     const tasks = useGameStore.getState().tasks;
//     expect(tasks.length).toBe(1);
//     expect(tasks[0]).toEqual(customTodo);
//   });

//   it('should add a new task with default values when no arg is passed', () => {
//     act(() => {
//       useGameStore.getState().newTodo();
//     });

//     const tasks = useGameStore.getState().tasks;
//     expect(tasks.length).toBe(1);
//     expect(tasks[0].title).toBe('random task title');
//     expect(tasks[0].difficulty).toBe(1);
//     expect(tasks[0].completed).toBe(false);
//   });

//   it('should move a task to completed', () => {
//     const task = {
//       id: 'abc',
//       title: 'Complete Me',
//       difficulty: 3,
//       inProgress: false,
//       completed: false,
//     };

//     act(() => {
//       useGameStore.getState().newTodo(task);
//     });

//     act(() => {
//       useGameStore.getState().completeTask(task.id);
//     });

//     const state = useGameStore.getState();
//     expect(state.tasks).toHaveLength(0);
//     expect(state.completed).toHaveLength(1);
//     expect(state.completed[0].id).toBe('abc');
//     expect(state.completed[0].completed).toBe(true);
//   });

//   it('should do nothing if completing a non-existent task', () => {
//     const initialState = useGameStore.getState();
//     act(() => {
//       useGameStore.getState().completeTask('non-existent-id');
//     });
//     expect(useGameStore.getState()).toEqual(initialState);
//   });
// });
