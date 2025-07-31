import { create } from 'zustand';
import { type AssistantsState, type UpgradesState } from '../types';
import { useGameStore } from './gameStore';

export const useAssistantUpgradesStore = create<UpgradesState>((set, get) => ({
  upgrades: {
    buyAssistants: {
      id: 'buyAssistants',
      currentValue: 0,
      baseValue: 0,
      description: 'Buy a new assistant',
      cost: 200,
      rate: 2,
      owned: 0,
      ownedLimit: 5,
      deltaPerOwned: 0,
      callback: () => {
        useAssistantStore.getState().addAssistant();
      },
    },
    multitasking: {
      id: 'multitasking',
      currentValue: 1,
      baseValue: 0,
      description: 'Assistants can take on more tasks at once',
      cost: 100,
      rate: 2,
      owned: 1,
      ownedLimit: 5,
      deltaPerOwned: 1,
    },
    interval: {
      id: 'interval',
      currentValue: 1000,
      baseValue: 1000,
      description: 'Increase Assistants work speed by 5%',
      cost: 10,
      rate: 2,
      owned: 0,
      ownedLimit: 10,
      deltaPerOwned: -50,
    },
  },

  purchaseUpgrade: (upgradeId: string) => {
    const upgrade = get().upgrades[upgradeId];
    const money = useGameStore.getState().money;

    if (money >= upgrade.cost) {
      upgrade.owned++;
      useGameStore.getState().addMoney(-upgrade.cost);

      upgrade.currentValue =
        upgrade.baseValue + upgrade.deltaPerOwned * upgrade.owned;
      upgrade.cost = upgrade.cost * upgrade.rate;

      upgrade.callback?.();

      set((state: UpgradesState) => ({
        upgrades: { ...state.upgrades, [upgrade.id]: upgrade },
      }));
    }
  },
}));

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
