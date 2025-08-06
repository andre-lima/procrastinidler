import { Box, Button, Card, Flex, Grid, Text, Theme } from '@radix-ui/themes';
import type { Upgrade } from '../../types/assistant';
import { LuCoins } from 'react-icons/lu';
import './styles.scss';
import { useUpgradesStore } from '../../store/upgradesStore';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from 'react-i18next';
import { humanNumber } from '../../helpers/human-number';

export const UpgradeCard = ({ upgrade }: { upgrade: Upgrade }) => {
  const money = useGameStore((state) => state.money);

  const { t: tUpgrades } = useTranslation('upgrades');

  return (
    <Card key={upgrade.id}>
      <Grid
        gapX="3"
        gapY="2"
        columns="1fr auto"
        rows="auto auto"
        areas="'title price' 'description button"
        align="end"
      >
        <Box gridArea="title">
          <Text>{tUpgrades(upgrade.id + '.title')}</Text>
        </Box>
        <Box gridArea="description">
          <Text size="2" color="gray">
            {tUpgrades(upgrade.id + '.description')}
          </Text>
        </Box>
        <Flex gap="4" gridArea="price" align="center">
          <Text size="1" color="gray">
            Owned {upgrade.owned} / {upgrade.ownedLimit}
          </Text>
          <Text>
            <Flex gap="1" align="center">
              <LuCoins color="orange" />
              <Text size="2" weight="bold">
                {humanNumber(upgrade.cost)}
              </Text>
            </Flex>
          </Text>
        </Flex>

        <Box style={{ marginLeft: 'auto' }} gridArea="button">
          <Theme appearance="dark" data-has-background={false}>
            <Button
              className="purchaseUpgradeButton"
              style={{
                backgroundColor: 'var(--gray-2)',
                color: 'var(--gray-12)',
              }}
              variant="surface"
              onClick={() =>
                useUpgradesStore.getState().purchaseUpgrade(upgrade.id)
              }
              disabled={
                upgrade.owned >= upgrade.ownedLimit || upgrade.cost > money
              }
            >
              <LuCoins /> Purchase
            </Button>
          </Theme>
        </Box>
      </Grid>
    </Card>
  );
};
