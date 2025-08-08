import { useGameStore } from './gameStore';
import { useTasksStore } from './tasksStore';
import { useUpgradesStore } from './upgradesStore';
import { useBossStore } from './bossStore';
import { useAssistantStore } from './assistantStore';

export const resetAllStores = () => {
  useGameStore.persist.clearStorage();
  useTasksStore.persist.clearStorage();
  useUpgradesStore.persist.clearStorage();
  useBossStore.persist.clearStorage();
  useAssistantStore.persist.clearStorage();

  window.location.reload();
};
