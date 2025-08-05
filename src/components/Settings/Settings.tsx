import { Button, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { LuSaveOff } from 'react-icons/lu';
import { resetAllStores } from '../../store/resetStores';

export const Settings = () => {
  const [confirmClear, setConfirmClear] = useState(false);

  const clearSave = () => {
    resetAllStores();
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
    </Flex>
  );
};
