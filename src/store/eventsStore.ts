import { create } from 'zustand';

export type GameEventKey = 'rent_paid' | 'rent_owed' | 'metadata_event';

export interface GameEvent {
  id: string;
  key: GameEventKey;
  params?: Record<string, number | string>;
}

const MAX_EVENTS = 100;

interface EventsState {
  events: GameEvent[];
  addEvent: (key: GameEventKey, params?: Record<string, number | string>) => void;
}

let eventIdCounter = 0;
function nextId(): string {
  return `evt-${Date.now()}-${++eventIdCounter}`;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  addEvent: (key, params) => {
    set((state) => {
      const event: GameEvent = { id: nextId(), key, params };
      const events = [event, ...state.events].slice(0, MAX_EVENTS);
      return { events };
    });
  },
}));
