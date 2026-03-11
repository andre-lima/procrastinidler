import { RentMeter } from '../../game/RentMeter';
import { BurnoutMeter } from '../../game/BurnoutMeter';
import { InfoBox } from '../../386/src/components';

export function Meters() {
  return (
    <InfoBox className="gameMeters">
      <RentMeter />
      <BurnoutMeter />
    </InfoBox>
  );
}
