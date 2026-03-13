import { createGameStore } from '../reactive-store/createGameStore';
import { localStorageSaveSystem } from './saveSystem';

export interface Assistant {
  id: string;
  assignedTo: string[];
  category?: string;
}

interface AssistantStoreState {
  assistants: Partial<Record<string, Assistant>>;
}

const initialState: AssistantStoreState = {
  assistants: {},
};

export const useAssistantStore = createGameStore<
  AssistantStoreState,
  {
    addAssistant: () => void;
    assignTaskToAssistant: (taskId: string, assistantId: string) => void;
    unassignTask: (taskId: string, assistantId: string) => void;
    resetForNewRun: () => void;
  }
>(
  {
    saveKey: 'assistant-store',
    initialState,
    savePrefix: '',
    saveSystem: localStorageSaveSystem,
  },
  (set, get) => ({
    addAssistant: () => {
      const newAssistant =
        'assistant_' + (Object.keys(get().assistants).length + 1);

      set({
        assistants: {
          ...get().assistants,
          [newAssistant]: { id: newAssistant, assignedTo: [] },
        },
      });
    },
    assignTaskToAssistant: (todoId: string, assistantId: string) => {
      const assistant = get().assistants[assistantId];

      assistant?.assignedTo.push(todoId);

      set(
        assistant
          ? { assistants: { ...get().assistants, [assistant.id]: assistant } }
          : {}
      );
    },
    unassignTask: (todoId: string, assistantId: string) => {
      const assistant = get().assistants[assistantId];

      if (assistant) {
        assistant.assignedTo = assistant?.assignedTo.filter(
          (taskId) => taskId !== todoId
        );
      }

      set(
        assistant
          ? { assistants: { ...get().assistants, [assistant.id]: assistant } }
          : {}
      );
    },
    resetForNewRun: () => {
      set({ assistants: {} });
    },
  })
);
