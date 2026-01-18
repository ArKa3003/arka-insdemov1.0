"use client";

import { useEffect, useState, useCallback } from "react";
import { ANIMATION_DURATION } from "@/lib/constants";

interface UseAnimationOptions {
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

/**
 * Hook for managing animation states
 */
export function useAnimation(options: UseAnimationOptions = {}) {
  const {
    duration = ANIMATION_DURATION.NORMAL,
    delay = 0,
    onComplete,
  } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const start = useCallback(() => {
    setIsAnimating(true);
    setIsComplete(false);
  }, []);

  const reset = useCallback(() => {
    setIsAnimating(false);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    const delayTimer = setTimeout(() => {
      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
        setIsComplete(true);
        onComplete?.();
      }, duration);

      return () => clearTimeout(animationTimer);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [isAnimating, duration, delay, onComplete]);

  return {
    isAnimating,
    isComplete,
    start,
    reset,
  };
}

/**
 * Hook for staggered animations
 */
export function useStaggeredAnimation(
  itemCount: number,
  staggerDelay: number = 100
) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  const startAnimation = useCallback(() => {
    setVisibleItems([]);
    
    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, i * staggerDelay);
    }
  }, [itemCount, staggerDelay]);

  const resetAnimation = useCallback(() => {
    setVisibleItems([]);
  }, []);

  const isItemVisible = useCallback(
    (index: number) => visibleItems.includes(index),
    [visibleItems]
  );

  return {
    visibleItems,
    startAnimation,
    resetAnimation,
    isItemVisible,
    allVisible: visibleItems.length === itemCount,
  };
}

/**
 * Hook for typewriter effect
 */
export function useTypewriter(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    setDisplayedText("");
    setIsTyping(true);
  }, []);

  const skipToEnd = useCallback(() => {
    setDisplayedText(text);
    setIsTyping(false);
  }, [text]);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isTyping, text, speed]);

  return {
    displayedText,
    isTyping,
    isComplete: displayedText === text,
    startTyping,
    skipToEnd,
  };
}

export default useAnimation;
