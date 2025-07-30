import { useAssistantUpgradesStore } from '../../store/assistantStore';
import { useGameStore } from '../../store/gameStore';

export const PurchaseUpgrades = () => {
  const upgrades = useAssistantUpgradesStore((state) => state.upgrades);
  const money = useGameStore((state) => state.money);

  return (
    <div>
      {Object.values(upgrades).map((upgrade) => (
        <div key={upgrade.id}>
          <div>{upgrade.description}</div>
          <div>{upgrade.cost}</div>
          <div>
            {upgrade.owned} / {upgrade.ownedLimit}
          </div>
          <div>{upgrade.currentValue}</div>
          <button
            onClick={() =>
              useAssistantUpgradesStore.getState().purchaseUpgrade(upgrade.id)
            }
            disabled={
              upgrade.owned >= upgrade.ownedLimit || upgrade.cost > money
            }
          >
            Purchase {upgrade.cost}$ {'->'} i have {money}$
          </button>
        </div>
      ))}
    </div>
  );
};
