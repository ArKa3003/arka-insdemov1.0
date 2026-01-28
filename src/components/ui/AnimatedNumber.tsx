'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 2000,
  decimals = 1,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOutExpo for smooth deceleration
      const easeOutExpo =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentValue = easeOutExpo * value;
      setDisplayValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [value, duration]
  );

  useEffect(() => {
    // Only animate once on mount
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      // Small delay to ensure component is mounted
      const timeoutId = setTimeout(() => {
        rafRef.current = requestAnimationFrame(animate);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [animate]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
