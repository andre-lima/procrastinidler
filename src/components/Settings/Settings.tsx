import { Button, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { LuMoon, LuSaveOff, LuSun, LuVolume2, LuVolumeX } from 'react-icons/lu';
import { resetAllStores } from '../../store/resetStores';
import { useGameStore } from '../../store/gameStore';

export const Settings = () => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sfxOn, setSfxOn] = useState(false);

  const clearSave = () => {
    resetAllStores();
  };

  const toggleDarkMode = () => {
    useGameStore.getState().setDarkMode(!isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  const toggleSFX = () => {
    useGameStore.getState().setSfxOn(!sfxOn);
    setSfxOn(!sfxOn);
  };

  return (
    <Flex px="4" gap="2" align="center">
      {confirmClear && (
        <>
          <Flex direction="column" style={{ position: 'relative' }}>
            <Text>Are you sure you want to clear your save file?</Text>
            <Text
              style={{ position: 'absolute', bottom: '-12px' }}
              className="subWarning"
              size="1"
              color="crimson"
            >
              This action cannot be reverted.
            </Text>
          </Flex>
          <Button
            color="crimson"
            variant="surface"
            size="1"
            onClick={clearSave}
          >
            Yes
          </Button>
          <Button
            variant="surface"
            size="1"
            onClick={() => setConfirmClear(false)}
          >
            No
          </Button>
        </>
      )}
      <LuSaveOff
        cursor="pointer"
        size="24px"
        color="gray"
        role="button"
        onClick={() => setConfirmClear(true)}
      />

      {sfxOn ? (
        <LuVolume2
          role="button"
          size="22px"
          color="gray"
          cursor="pointer"
          onClick={toggleSFX}
        />
      ) : (
        <LuVolumeX
          role="button"
          size="22px"
          color="gray"
          cursor="pointer"
          onClick={toggleSFX}
        />
      )}

      {isDarkMode ? (
        <LuSun
          role="button"
          size="22px"
          color="gray"
          cursor="pointer"
          onClick={toggleDarkMode}
        />
      ) : (
        <LuMoon
          role="button"
          size="22px"
          color="gray"
          cursor="pointer"
          onClick={toggleDarkMode}
        />
      )}
    </Flex>
  );
};
