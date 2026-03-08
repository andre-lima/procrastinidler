import React from 'react';
import Countdown, { type CountdownRenderProps } from 'react-countdown';
import './styles.scss';
import { Flex, Text } from '../shared';
import { humanNumber } from '../../helpers/human-number';

const timerRenderer = (props: CountdownRenderProps) => {
  return (
    <Flex align="center" gap={2}>
      <Text style={{ color: 'var(--color-fg-dim)' }}>
        Time: {humanNumber(props.total / 1000)}s
      </Text>
    </Flex>
  );
};

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
          intervalDelay={1000}
          precision={0}
          renderer={timerRenderer}
          onComplete={completionCallback}
        />
      </div>
    );
  }
);
