/**
 * AnimatedNumber Component
 * Animates number counting with configurable duration and easing
 */

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
  className?: string;
  onComplete?: () => void;
}

// Easing function for smooth animation
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1500,
  formatFn = (v) => v.toLocaleString(),
  className = '',
  onComplete,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(0);

  useEffect(() => {
    if (value === previousValue.current) return;

    const startValue = previousValue.current;
    const difference = value - startValue;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    setIsAnimating(true);

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.round(startValue + easedProgress * difference);

      setDisplayValue(currentValue);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayValue(value);
        setIsAnimating(false);
        previousValue.current = value;
        onComplete?.();
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [value, duration, onComplete]);

  return (
    <span className={`animated-number ${isAnimating ? 'updating' : ''} ${className}`}>
      {formatFn(displayValue)}
    </span>
  );
};

export default AnimatedNumber;
