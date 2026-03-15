import { Box, Flex, Grid, Text } from '../shared';
import { Button } from '../ui';
import type { Upgrade } from '../../store/upgradesStore';
import './styles.scss';
import { useUpgradesStore } from '../../store/upgradesStore';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from 'react-i18next';
import { humanNumber } from '../../helpers/human-number';

export const UpgradeCard = ({ upgrade }: { upgrade: Upgrade }) => {
  const money = useGameStore((state) => state.money);
  const ram = useGameStore((state) => state.RAM);
  const { t: tUpgrades } = useTranslation('upgrades');

  const isRamCurrency = upgrade.currency === 'RAM';
  const balance = isRamCurrency ? ram : money;
  const costLabel = isRamCurrency
    ? `${humanNumber(upgrade.cost)} RAM`
    : `${humanNumber(upgrade.cost)}$`;

  return (
    <div className="upgradeCard panel panelInner">
      <Grid
        className="upgradeCard_grid"
        columns="1fr auto"
        rows="auto auto"
        areas="'title price' 'description button'"
        gap={2}
      >
        <Box gridArea="title" className="upgradeCard_title">
          <Text>{tUpgrades(upgrade.id + '.title')}</Text>
        </Box>
        <Box gridArea="description" className="upgradeCard_description">
          <Text>{tUpgrades(upgrade.id + '.description')}</Text>
        </Box>
        <Flex gap={4} gridArea="price" align="center" className="upgradeCard_price">
          <Text className="upgradeCard_owned">
            Owned {upgrade.owned} / {upgrade.ownedLimit}
          </Text>
          <Text className="upgradeCard_cost">
            <Flex gap={1} align="center">
              <Text>{costLabel}</Text>
            </Flex>
          </Text>
        </Flex>

        <Box gridArea="button" className="upgradeCard_button">
          <Button
            variant="secondary"
            type="warning"
            className="purchaseUpgradeButton"
            onClick={() =>
              useUpgradesStore.getState().purchaseUpgrade(upgrade.id)
            }
            disabled={
              upgrade.owned >= upgrade.ownedLimit || upgrade.cost > balance
            }
          >
            Purchase
          </Button>
        </Box>
      </Grid>
    </div>
  );
};
