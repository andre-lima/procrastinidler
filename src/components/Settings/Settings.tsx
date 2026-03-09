import { Flex, Text } from '../shared';
import { useState } from 'react';
import { Button, Switch } from '../ui';
import { resetAllStores } from '../../store/resetStores';
import { useGameStore } from '../../store/gameStore';

export const Settings = () => {
  const [confirmClear, setConfirmClear] = useState(false);
  const sfxOn = useGameStore((state) => state.filters.sfxOn);

  const clearSave = () => {
    resetAllStores();
  };


  return (
    <Flex gap={2} align="center" style={{ paddingLeft: 'var(--space-4)' }}>
      {confirmClear && (
        <>
          <Flex direction="column" style={{ position: 'relative' }}>
            <Text>Are you sure you want to clear your save file?</Text>
            <Text
              style={{
                position: 'absolute',
                bottom: '-12px',
                color: 'var(--color-danger)',
                fontSize: 'var(--text-xs)',
              }}
            >
              This action cannot be reverted.
            </Text>
          </Flex>
          <Button variant="danger" onClick={clearSave}>
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setConfirmClear(false)}>
            No
          </Button>
        </>
      )}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setConfirmClear(true)}
        style={{ marginBottom: 0 }}
      >
        Clear save
      </Button>

      <Switch
        label="Sound"
        checked={sfxOn}
        onCheckedChange={(v) => useGameStore.getState().setSfxOn(v)}
        onLabel="ON"
        offLabel="OFF"
      />
    </Flex>
  );
};
