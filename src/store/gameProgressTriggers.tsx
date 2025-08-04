import { useGameStore } from './gameStore';
import { useUpgradesStore } from './upgradesStore';

export const checkProgressTriggers = () => {
  const money = useGameStore.getState().money;
  const upgrades = useUpgradesStore.getState().upgrades;

  if (money >= upgrades.buyAssistants.cost) {
    useGameStore
      .getState()
      .setGameProgress({ canPurchaseAssistantUpgrades: true });
  }

  if (money >= upgrades.buyBoss.cost) {
    useGameStore.getState().setGameProgress({ canPurchaseBossUpgrades: true });
  }

  if (money >= upgrades.personalMoneyPerTask.cost) {
    useGameStore
      .getState()
      .setGameProgress({ canPurchasePersonalUpgrades: true });
  }
};
