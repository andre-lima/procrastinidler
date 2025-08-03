import { Button, Dialog, Flex } from '@radix-ui/themes';
import { LuCrown, LuUser, LuX } from 'react-icons/lu';
import { useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { GrGroup } from 'react-icons/gr';
// import { HiExclamationCircle } from 'react-icons/hi';
import './styles.scss';

export const NavDialogButton = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const { t } = useTranslation('common');

  const getTitleIcon = useCallback(
    (color?: string) => {
      switch (id) {
        case 'personal':
          return () => <LuUser color={color} />;
        case 'boss':
          return () => <LuCrown color={color} />;
        case 'assistants':
          return () => <GrGroup color={color} />;

        default:
          return () => null;
      }
    },
    [id]
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <div className="navButton">
          <Button
            style={{
              backgroundColor: 'var(--gray-1)',
              color: 'var(--gray-12)',
            }}
            variant="surface"
          >
            {getTitleIcon()()} {t('menus.' + id + '.navButton')}
          </Button>
          {/* <HiExclamationCircle
            className="exclamationIcon"
            color="tomato"
            size="20px"
          /> */}
        </div>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title mb="4">
          <Flex gap="2" align="center">
            <Flex gap="2" align="center" flexGrow="1">
              {getTitleIcon('orange')()} {t('menus.' + id + '.dialog.title')}
            </Flex>
            <Dialog.Close>
              <LuX role="button" style={{ cursor: 'pointer' }} size="20px" />
            </Dialog.Close>
          </Flex>
        </Dialog.Title>
        <Dialog.Description hidden={true}>{id} upgrades</Dialog.Description>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
};
