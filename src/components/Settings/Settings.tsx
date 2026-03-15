import { Flex, Text } from '../shared';
import { useState } from 'react';
import {
  Button,
  Switch,
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitleBar,
  DialogClose,
  DialogBody,
  TabsRoot,
  TabsList,
  TabsTab,
  TabsPanel,
} from '../ui';
import { resetAllStores } from '../../store/resetStores';
import { useGameStore } from '../../store/gameStore';

type TabId = 'audio' | 'game';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabId>('audio');
  const [confirmClear, setConfirmClear] = useState(false);
  const sfxOn = useGameStore((state) => state.filters.sfxOn);
  const crtEnabled = useGameStore((state) => state.crtEnabled);

  const clearSave = () => {
    resetAllStores();
  };

  return (
    <DialogRoot>
      <DialogTrigger
        render={
          <button type="button" className="footerNavItem">
            <span className="footerNavItemText">Settings</span>
          </button>
        }
      />
      <DialogPortal container={typeof document !== 'undefined' ? document.body : undefined}>
        <DialogBackdrop />
        <DialogPopup style={{ maxWidth: '420px' }}>
          <DialogTitleBar>
            <span>Settings</span>
            <DialogClose
              render={
                <button type="button" className="dialogCloseBtn">
                  ×
                </button>
              }
            />
          </DialogTitleBar>
          <DialogBody>
            <TabsRoot value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
              <TabsList>
                <TabsTab value="audio" active={activeTab === 'audio'}>
                  Audio
                </TabsTab>
                <TabsTab value="game" active={activeTab === 'game'}>
                  Game
                </TabsTab>
              </TabsList>

              <TabsPanel value="audio" className="tabPanel">
                <Flex gap={2} align="center">
                  <Switch
                    label="Sound"
                    checked={sfxOn}
                    onCheckedChange={(v) => useGameStore.getState().setSfxOn(v)}
                    onLabel="ON"
                    offLabel="OFF"
                  />
                </Flex>
              </TabsPanel>

              <TabsPanel value="game" className="tabPanel">
                <Flex gap={2} align="center" direction="column" style={{ alignItems: 'flex-start' }}>
                  <Flex gap={2} align="center">
                    <Switch
                      label="CRT effect"
                      checked={crtEnabled}
                      onCheckedChange={(v) => useGameStore.getState().setCrtEnabled(v)}
                      onLabel="ON"
                      offLabel="OFF"
                    />
                  </Flex>
                  {confirmClear ? (
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
                      <Flex gap={2}>
                        <Button variant="danger" onClick={clearSave}>
                          Yes
                        </Button>
                        <Button variant="secondary" onClick={() => setConfirmClear(false)}>
                          No
                        </Button>
                      </Flex>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirmClear(true)}
                      style={{ marginBottom: 0 }}
                    >
                      Clear save
                    </Button>
                  )}
                </Flex>
              </TabsPanel>
            </TabsRoot>
          </DialogBody>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
};
