import React from 'react';
import Countdown, { type CountdownRenderProps } from 'react-countdown';
import './styles.scss';
import { LuClock3 } from 'react-icons/lu';
import { Flex, Text } from '@radix-ui/themes';
import { humanNumber } from '../../helpers/human-number';

const timerRenderer = (props: CountdownRenderProps) => {
  return (
    <Flex align="center" gap="2">
      <LuClock3 color="gray" />
      <Text color="gray">{humanNumber(props.total / 1000)}</Text>
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
