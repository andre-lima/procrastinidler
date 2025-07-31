import { create } from 'zustand';
import { type AssistantsState } from '../types';

export const useAssistantStore = create<AssistantsState>((set, get) => ({
  assistants: {},
  addAssistant: () => {
    const newAssistant =
      'assistant_' + (Object.keys(get().assistants).length + 1);

    set((state: AssistantsState) => ({
      assistants: {
        ...state.assistants,
        [newAssistant]: { id: newAssistant, assignedTo: [] },
      },
    }));
  },
  assignTaskToAssistant: (todoId: string, assistantId: string) => {
    const assistant = get().assistants[assistantId];

    assistant?.assignedTo.push(todoId);

    set((state: AssistantsState) =>
      assistant
        ? { assistants: { ...state.assistants, [assistant.id]: assistant } }
        : state
    );
  },
  unassignTask: (todoId: string, assistantId: string) => {
    const assistant = get().assistants[assistantId];

    if (assistant) {
      assistant.assignedTo = assistant?.assignedTo.filter(
        (taskId) => taskId !== todoId
      );
    }

    set((state: AssistantsState) =>
      assistant
        ? { assistants: { ...state.assistants, [assistant.id]: assistant } }
        : state
    );
  },
}));
