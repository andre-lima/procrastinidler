import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
  WindowContainer,
} from '../ui';
import { PurchaseUpgrades } from '../PurchaseUpgrades/PurchaseUpgrades';

const UPGRADE_IDS = ['personal', 'boss', 'assistants', 'computer'] as const;

/** Single list item that opens an upgrades dialog (same content as before). */
function UpgradeDialogItem({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { t } = useTranslation('common');

  return (
    <DialogRoot>
      <DialogTrigger
        render={
          <button type="button" className="upgradesSidebar_link">
            {t('menus.' + id + '.navButton')}
          </button>
        }
      />
      <DialogPortal container={typeof document !== 'undefined' ? document.body : undefined}>
        <DialogBackdrop />
        <DialogPopup style={{ maxWidth: '650px' }}>
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
}

export function UpgradesSidebar() {
  const { t } = useTranslation('common');

  return (
    <WindowContainer variant="primary" title={t('menus.upgrades.title')}>
      <ul className="upgradesSidebar_list">
        {UPGRADE_IDS.map((id) => (
          <li key={id}>
            <UpgradeDialogItem id={id}>
              <PurchaseUpgrades id={id} />
            </UpgradeDialogItem>
          </li>
        ))}
      </ul>
    </WindowContainer>
  );
}
