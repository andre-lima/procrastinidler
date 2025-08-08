import { Flex } from '@radix-ui/themes';
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
      Object.values(state.upgrades).filter((upgrade) => upgrade.type === id)
    )
  );

  return (
    <Flex direction="column" gap="3">
      {upgrades.map((upgrade) => (
        <UpgradeCard key={upgrade.id} upgrade={upgrade} />
      ))}
    </Flex>
  );
};
