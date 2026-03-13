import { useCallback, useMemo } from 'react';
import { useAssistantsUpgradesStore } from './assistantsUpgradesStore';
import type { Upgrade } from './assistantsUpgradesStore';

export type { Upgrade };
import { useBossUpgradesStore } from './bossUpgradesStore';
import { usePersonalUpgradesStore } from './personalUpgradesStore';
import { useComputerUpgradesStore } from './computerUpgradesStore';

export interface UpgradesStoreState {
  upgrades: Record<string, Upgrade>;
  purchaseUpgrade: (upgradeId: string) => void;
}

function getUpgradesFromStore(state: Record<string, unknown>): Record<string, Upgrade> {
  return Object.fromEntries(
    Object.entries(state).filter(([k, v]) => k !== 'purchaseUpgrade' && v && typeof v === 'object' && 'cost' in v)
  ) as Record<string, Upgrade>;
}

function getMergedUpgrades(): Record<string, Upgrade> {
  return {
    ...getUpgradesFromStore(useAssistantsUpgradesStore.getState() as unknown as Record<string, unknown>),
    ...getUpgradesFromStore(useBossUpgradesStore.getState() as unknown as Record<string, unknown>),
    ...getUpgradesFromStore(usePersonalUpgradesStore.getState() as unknown as Record<string, unknown>),
    ...getUpgradesFromStore(useComputerUpgradesStore.getState() as unknown as Record<string, unknown>),
  };
}

function purchaseUpgrade(upgradeId: string): void {
  const assistants = getUpgradesFromStore(useAssistantsUpgradesStore.getState() as unknown as Record<string, unknown>);
  const boss = getUpgradesFromStore(useBossUpgradesStore.getState() as unknown as Record<string, unknown>);
  const personal = getUpgradesFromStore(usePersonalUpgradesStore.getState() as unknown as Record<string, unknown>);
  const computer = getUpgradesFromStore(useComputerUpgradesStore.getState() as unknown as Record<string, unknown>);

  if (upgradeId in assistants) {
    useAssistantsUpgradesStore.getState().purchaseUpgrade(upgradeId);
  } else if (upgradeId in boss) {
    useBossUpgradesStore.getState().purchaseUpgrade(upgradeId);
  } else if (upgradeId in personal) {
    usePersonalUpgradesStore.getState().purchaseUpgrade(upgradeId);
  } else if (upgradeId in computer) {
    useComputerUpgradesStore.getState().purchaseUpgrade(upgradeId);
  }
}

function useUpgradesStoreHook<T>(selector: (state: UpgradesStoreState) => T): T {
  const assistantsState = useAssistantsUpgradesStore((s) => s);
  const bossState = useBossUpgradesStore((s) => s);
  const personalState = usePersonalUpgradesStore((s) => s);
  const computerState = useComputerUpgradesStore((s) => s);

  const upgrades = useMemo(
    () => ({
      ...getUpgradesFromStore(assistantsState as unknown as Record<string, unknown>),
      ...getUpgradesFromStore(bossState as unknown as Record<string, unknown>),
      ...getUpgradesFromStore(personalState as unknown as Record<string, unknown>),
      ...getUpgradesFromStore(computerState as unknown as Record<string, unknown>),
    }),
    [assistantsState, bossState, personalState, computerState]
  );

  const purchaseUpgradeFn = useCallback((id: string) => purchaseUpgrade(id), []);

  return selector({ upgrades, purchaseUpgrade: purchaseUpgradeFn });
}

export const useUpgradesStore = Object.assign(useUpgradesStoreHook, {
  getState: (): UpgradesStoreState => ({
    upgrades: getMergedUpgrades(),
    purchaseUpgrade,
  }),
});
