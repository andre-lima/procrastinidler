import { Flex } from '../shared';
import { RentMeter } from '../../game/RentMeter';
import { BurnoutMeter } from '../../game/BurnoutMeter';
import { WindowContainer } from '../ui';
import { InfoBox, Sidebar } from '../../386/src/components';

export function Meters() {
  return (
    <InfoBox>
      <RentMeter />
      <BurnoutMeter />
    </InfoBox>
  );
}
