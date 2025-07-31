import { Button, Dialog, Flex } from '@radix-ui/themes';
import { LuCrown, LuUsers, LuX } from 'react-icons/lu';
import { useCallback, type ReactNode } from 'react';

export const NavDialogButton = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const getTitleIcon = useCallback(() => {
    switch (id) {
      case 'assistants':
        return () => <LuUsers color="orange" />;
      case 'boss':
        return () => <LuCrown color="orange" />;

      default:
        return () => null;
    }
  }, [id]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          style={{
            backgroundColor: 'var(--gray-1)',
            color: 'var(--gray-12)',
          }}
          variant="surface"
        >
          <LuUsers /> {id + '.navButton'}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title mb="4">
          <Flex gap="2" align="center">
            <Flex gap="2" align="center" flexGrow="1">
              {getTitleIcon()()} {id + '.dialog.title'}
            </Flex>
            <Dialog.Close>
              {/* <Button variant="ghost"> */}
              <LuX style={{ cursor: 'pointer' }} size="20px" />
              {/* </Button> */}
            </Dialog.Close>
          </Flex>
        </Dialog.Title>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
};
