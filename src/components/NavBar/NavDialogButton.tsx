import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.scss';

export const NavDialogButton = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const { t } = useTranslation('common');

  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <button type="button" className="btn btnSecondary navButton">
            {t('menus.' + id + '.navButton')}
          </button>
        }
      />
      <Dialog.Portal container={typeof document !== 'undefined' ? document.body : undefined}>
        <Dialog.Backdrop className="dialogBackdrop" />
        <Dialog.Popup className="dialogPopup" style={{ maxWidth: '450px' }}>
          <div className="dialogTitleBar">
            <span>{t('menus.' + id + '.dialog.title')}</span>
            <Dialog.Close
              render={
                <button type="button" className="dialogCloseBtn">
                  ×
                </button>
              }
            />
          </div>
          <div className="dialogBody">
            <Dialog.Title className="dialogTitle" />
            <Dialog.Description className="dialogDescription" hidden>
              {id} upgrades
            </Dialog.Description>
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
