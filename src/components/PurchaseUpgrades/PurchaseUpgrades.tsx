import { Flex } from '../shared';
import { UpgradeCard } from './UpgradeCard';
import { useUpgradesStore } from '../../store/upgradesStore';
import { useShallow } from 'zustand/react/shallow';

export const PurchaseUpgrades = ({
  id,
}: {
  id: 'assistants' | 'boss' | 'personal';
}) => {
  const upgrades = useUpgradesStore(
    useShallow((state) =>
      Object.values(state.upgrades).filter(
        (upgrade) =>
          upgrade.type === id &&
          // FIRE is shown in the player grid area instead of the Personal dialog
          upgrade.id !== 'FIRE'
      )
    )
  );

  return (
    <Flex direction="column" gap={3}>
      {upgrades.map((upgrade) => (
        <UpgradeCard key={upgrade.id} upgrade={upgrade} />
      ))}
    </Flex>
  );
};
