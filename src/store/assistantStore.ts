import { create } from 'zustand';
import type { AssistantsState } from '../types';

export const useAssistantStore = create<AssistantsState>((set, get) => ({
  assistants: {},
  assistantInterval: 1000,
}));
