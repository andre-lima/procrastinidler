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
  const { t: tUpgrades } = useTranslation('upgrades');

  return (
    <div className="panel panelInner">
      <Grid
        columns="1fr auto"
        rows="auto auto"
        areas="'title price' 'description button'"
        gap={2}
        style={{ alignItems: 'end' }}
      >
        <Box gridArea="title">
          <Text>{tUpgrades(upgrade.id + '.title')}</Text>
        </Box>
        <Box gridArea="description">
          <Text size="2" style={{ color: 'var(--color-fg-dim)' }}>
            {tUpgrades(upgrade.id + '.description')}
          </Text>
        </Box>
        <Flex gap={4} gridArea="price" align="center">
          <Text size="1" style={{ color: 'var(--color-fg-dim)' }}>
            Owned {upgrade.owned} / {upgrade.ownedLimit}
          </Text>
          <Text>
            <Flex gap={1} align="center">
              <Text size="2" style={{ fontWeight: 'bold' }}>
                {humanNumber(upgrade.cost)}
              </Text>
            </Flex>
          </Text>
        </Flex>

        <Box style={{ marginLeft: 'auto' }} gridArea="button">
          <Button
            variant="primary"
            className="purchaseUpgradeButton"
            onClick={() =>
              useUpgradesStore.getState().purchaseUpgrade(upgrade.id)
            }
            disabled={
              upgrade.owned >= upgrade.ownedLimit || upgrade.cost > money
            }
          >
            Purchase
          </Button>
        </Box>
      </Grid>
    </div>
  );
};
