import { create } from 'zustand';
import { type AssistantsState } from '../types';

export const useAssistantStore = create<AssistantsState>((set, get) => ({
  assistants: {
    cat_1: { id: 'cat_1', assignedTo: [] },
    cat_2: { id: 'cat_2', assignedTo: [] },
  },
  assistantInterval: 1000,
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

    console.log('xxx', assistant?.assignedTo);

    set((state: AssistantsState) =>
      assistant
        ? { assistants: { ...state.assistants, [assistant.id]: assistant } }
        : state
    );
  },
}));
