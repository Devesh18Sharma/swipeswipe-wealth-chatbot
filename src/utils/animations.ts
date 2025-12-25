/**
 * Animation Utilities
 * Shared animation functions for celebrations and effects
 */

import confetti from 'canvas-confetti';

// SwipeSwipe Brand Colors for animations
const BRAND_COLORS = {
  primary: '#293A60',
  accent: '#FBC950',
  success: '#19B600',
  gold: '#FFD700',
};

/**
 * Celebrate wealth projection reveal
 * Intensity scales with wealth amount
 */
export const celebrateProjection = (wealthAmount: number): void => {
  const colors = [BRAND_COLORS.primary, BRAND_COLORS.accent, BRAND_COLORS.success];

  // Basic confetti burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6, x: 0.5 },
    colors,
    gravity: 1,
    ticks: 200,
  });

  // Extra celebration for millionaires
  if (wealthAmount >= 1000000) {
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors: [BRAND_COLORS.accent, BRAND_COLORS.gold],
        gravity: 0.8,
        ticks: 250,
      });
    }, 500);

    // Side bursts for millionaires
    setTimeout(() => {
      // Left side
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      // Right side
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });
    }, 800);
  }

  // Half-million celebration
  if (wealthAmount >= 500000 && wealthAmount < 1000000) {
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.55, x: 0.5 },
        colors: [BRAND_COLORS.success, BRAND_COLORS.accent],
        gravity: 0.9,
      });
    }, 400);
  }
};

/**
 * Celebrate milestone achievements
 */
export const celebrateMilestone = (milestoneType: 'save' | 'invest' | 'complete'): void => {
  const colors = [BRAND_COLORS.primary, BRAND_COLORS.accent, BRAND_COLORS.success];

  switch (milestoneType) {
    case 'complete':
      // Full celebration for completing the flow
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
      break;

    case 'invest':
      // Moderate celebration for investment step
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: [BRAND_COLORS.success, BRAND_COLORS.accent],
      });
      break;

    case 'save':
      // Light celebration for savings step
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 },
        colors: [BRAND_COLORS.accent],
      });
      break;
  }
};

/**
 * Fire continuous confetti stream (for special moments)
 * Returns a function to stop the animation
 */
export const startConfettiStream = (durationMs = 3000): (() => void) => {
  const colors = [BRAND_COLORS.primary, BRAND_COLORS.accent, BRAND_COLORS.success];
  let animationFrameId: number;
  const startTime = Date.now();

  const frame = () => {
    const elapsed = Date.now() - startTime;

    if (elapsed < durationMs) {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors,
      });
      animationFrameId = requestAnimationFrame(frame);
    }
  };

  frame();

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
};

/**
 * Easing functions for number animations
 */
export const easings = {
  linear: (t: number): number => t,
  easeOutQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
  easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  bounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
};

/**
 * Animate a number from start to end value
 */
export const animateNumber = (
  start: number,
  end: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void,
  easing: (t: number) => number = easings.easeOutQuart
): (() => void) => {
  const startTime = performance.now();
  let animationFrameId: number;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = Math.round(start + (end - start) * easedProgress);

    onUpdate(currentValue);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationFrameId);
};
