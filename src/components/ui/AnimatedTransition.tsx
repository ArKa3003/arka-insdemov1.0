'use client';

import { AnimatedNumber } from './AnimatedNumber';

interface AnimatedTransitionProps {
  fromValue: number;
  toValue: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  fromClassName?: string;
  toClassName?: string;
  arrowClassName?: string;
}

export function AnimatedTransition({
  fromValue,
  toValue,
  duration = 2000,
  decimals = 1,
  suffix = '%',
  fromClassName = 'text-red-500 font-bold',
  toClassName = 'text-green-500 font-bold',
  arrowClassName = 'text-gray-400 mx-2',
}: AnimatedTransitionProps) {
  return (
    <span className="inline-flex items-center">
      <AnimatedNumber
        value={fromValue}
        duration={duration}
        decimals={decimals}
        suffix={suffix}
        className={fromClassName}
      />
      <span className={arrowClassName}>→</span>
      <AnimatedNumber
        value={toValue}
        duration={duration}
        decimals={decimals}
        suffix={suffix}
        className={toClassName}
      />
    </span>
  );
}
