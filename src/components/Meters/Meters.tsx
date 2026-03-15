import { RentMeter } from '../../game/RentMeter';
import { BurnoutMeter } from '../../game/BurnoutMeter';
import { WindowContainer } from '../../386/src/components';
import { useTranslation } from 'react-i18next';

export function Meters() {
  const { t } = useTranslation('common');

  return (
    <WindowContainer variant="secondary" title={t('windows.meters.title')}>
      <RentMeter />
      <BurnoutMeter />
    </WindowContainer>
  );
}
