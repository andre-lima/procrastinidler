import { Flex, Text } from '../shared';
import { useState } from 'react';
import { Switch } from '@base-ui/react/switch';
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
          <button
            type="button"
            className="btn btnPrimary btnDanger"
            onClick={clearSave}
          >
            Yes
          </button>
          <button
            type="button"
            className="btn btnSecondary"
            onClick={() => setConfirmClear(false)}
          >
            No
          </button>
        </>
      )}
      <button
        type="button"
        className="btn btnSecondary btnSm"
        onClick={() => setConfirmClear(true)}
        style={{ marginBottom: 0 }}
      >
        Clear save
      </button>

      <label className="switchLabel">
        <Switch.Root
          checked={sfxOn}
          onCheckedChange={(v) => useGameStore.getState().setSfxOn(v)}
          className={sfxOn ? 'switchRoot switchRootOn' : 'switchRoot'}
        >
          <Switch.Thumb className={sfxOn ? 'switchThumb switchThumbOn' : 'switchThumb'}>
            {sfxOn ? 'ON' : 'OFF'}
          </Switch.Thumb>
        </Switch.Root>
        Sound
      </label>
    </Flex>
  );
};
