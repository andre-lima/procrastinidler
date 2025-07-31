import { Flex } from '@radix-ui/themes';
import { useAssistantUpgradesStore } from '../../store/assistantStore';
import type { AssistantUpgradesState } from '../../types';
import type { Upgrade } from '../../types/assistant';
import { UpgradeCard } from './UpgradeCard';

export const PurchaseUpgrades = ({
  upgradesSelector,
}: {
  upgradesSelector: (state: AssistantUpgradesState) => Upgrade[];
}) => {
  const upgrades = useAssistantUpgradesStore(upgradesSelector);

  return (
    <Flex direction="column" gap="3">
      {Object.values(upgrades).map((upgrade) => (
        <UpgradeCard key={upgrade.id} upgrade={upgrade} />
      ))}
    </Flex>
  );
};
