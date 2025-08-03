import React from 'react';
import Countdown from 'react-countdown';
import { PieChart } from 'react-minimal-pie-chart';
import './styles.scss';
import { LuClock3 } from 'react-icons/lu';
import { config } from '../../game/config';

export const DeadlineCountdown = React.memo(
  ({
    seconds,
    completionCallback,
  }: {
    seconds: number;
    completionCallback?: () => void;
  }) => {
    return (
      <div className="deadlineCountdown">
        <Countdown
          date={Date.now() + seconds * 1000}
          intervalDelay={100}
          precision={3}
          renderer={(props) => <Clock time={props.total} />}
          onComplete={completionCallback}
        />
      </div>
    );
  }
);

const Clock = ({ time }: { time: number }) => {
  const getDeadlineColor = () => {
    if (!time) {
      return 'gray';
    }

    if (time < config.maxDeadline / 5) {
      return 'var(--red-8)';
    }

    if (time < config.maxDeadline / 4) {
      return 'var(--yellow-8)';
    }

    return 'var(--green-8)';
  };

  return (
    <div className="deadlineClock">
      <LuClock3
        color={time === 0 ? 'var(--red-8)' : 'gray'}
        size="20px"
        className="clockIcon"
      />
      <PieChart
        data={[
          { title: 'One', value: time, color: getDeadlineColor() },
          {
            title: 'One',
            value: config.maxDeadline - time,
            color: 'transparent',
          },
        ]}
      />
    </div>
  );
};
