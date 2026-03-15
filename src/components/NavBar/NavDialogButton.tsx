import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitleBar,
  DialogClose,
  DialogBody,
  DialogTitle,
  DialogDescription,
} from '../ui';
import './styles.scss';
import type { ButtonVariant } from '../ui';
import type { ButtonType } from '../../386/src/components/Button';

export const NavDialogButton = ({
  id,
  children,
  variant = 'secondary',
  type = 'default',
}: {
  id: string;
  children: ReactNode;
  variant?: ButtonVariant;
  type?: ButtonType;
}) => {
  const { t } = useTranslation('common');

  return (
    <DialogRoot>
      <DialogTrigger
        render={
          <Button variant={variant} type={type} className="navButton">
            {t('menus.' + id + '.navButton')}
          </Button>
        }
      />
      <DialogPortal container={typeof document !== 'undefined' ? document.body : undefined}>
        <DialogBackdrop />
        <DialogPopup style={{ maxWidth: '450px' }}>
          <DialogTitleBar>
            <span>{t('menus.' + id + '.dialog.title')}</span>
            <DialogClose
              render={
                <button type="button" className="dialogCloseBtn">
                  ×
                </button>
              }
            />
          </DialogTitleBar>
          <DialogBody>
            <DialogTitle className="dialogTitle" />
            <DialogDescription className="dialogDescription" hidden>
              {id} upgrades
            </DialogDescription>
            {children}
          </DialogBody>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
};
