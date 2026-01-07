/**
 * HeroWealthDisplay Component
 * Prominently displays the projected wealth with animations and celebrations
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/calculations';

interface HeroWealthDisplayProps {
  targetAmount: number;
  yearsToRetirement: number;
  retirementAge: number;
  swipeswipeContribution: number;
  monthlyInvestment: number;
  onAnimationComplete?: () => void;
}

// SwipeSwipe Theme Colors
const colors = {
  primary: '#293A60',
  primaryLight: '#DEEFF2',
  success: '#19B600',
  successLight: '#D4FACE',
  accent: '#FBC950',
  accentDark: '#F4B545',
  orange: '#F5692B',
  orangeLight: '#FADBC9',
};

export const HeroWealthDisplay: React.FC<HeroWealthDisplayProps> = ({
  targetAmount,
  yearsToRetirement,
  retirementAge,
  swipeswipeContribution,
  monthlyInvestment,
  onAnimationComplete,
}) => {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showContribution, setShowContribution] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const isMillionaire = targetAmount >= 1000000;

  // Confetti celebration function
  const celebrate = useCallback(() => {
    const brandColors = [colors.primary, colors.accent, colors.success];

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 0.5 },
      colors: brandColors,
    });

    // Extra celebration for millionaires
    if (isMillionaire) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5, x: 0.5 },
          colors: [colors.accent, '#FFD700', colors.success],
        });
      }, 300);

      // Side bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: brandColors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: brandColors,
        });
      }, 600);
    }
  }, [isMillionaire]);

  // Animated counting effect
  useEffect(() => {
    if (targetAmount === 0) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    // Easing function for smooth deceleration
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.round(easedProgress * targetAmount);

      setDisplayAmount(currentValue);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayAmount(targetAmount);
        setIsAnimating(false);

        // Trigger celebration
        setTimeout(() => {
          setIsCelebrating(true);
          celebrate();
          setTimeout(() => {
            setShowContribution(true);
            onAnimationComplete?.();
          }, 300);
        }, 100);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [targetAmount, celebrate, onAnimationComplete]);

  return (
    <motion.div
      className={`hero-wealth-display ${isCelebrating ? 'celebrating' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Label */}
      <motion.div
        className="hero-wealth-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        YOUR FUTURE WEALTH
      </motion.div>

      {/* Main Amount */}
      <motion.div
        className={`hero-wealth-amount ${isAnimating ? 'counting' : ''} ${isMillionaire ? 'millionaire' : ''}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {formatCurrency(displayAmount)}
      </motion.div>

      {/* Timeframe */}
      <motion.div
        className="hero-wealth-timeframe"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        in {yearsToRetirement} years at age {retirementAge}
      </motion.div>

      {/* SwipeSwipe Contribution Badge - BIGGER and more prominent */}
      <AnimatePresence>
        {showContribution && swipeswipeContribution > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px 24px',
              background: `linear-gradient(135deg, ${colors.accent}30 0%, ${colors.accentDark}20 100%)`,
              borderRadius: '12px',
              border: `2px solid ${colors.accent}`,
              marginTop: '16px',
            }}
          >
            <span style={{ fontSize: '24px' }}>💰</span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: colors.primary,
            }}>
              +{formatCurrency(swipeswipeContribution)}
            </span>
            <span style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: colors.primary,
            }}>
              from SwipeSwipe
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monthly Breakdown */}
      <AnimatePresence>
        {showContribution && (
          <motion.div
            className="hero-monthly-breakdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            That's {formatCurrency(monthlyInvestment)}/month consistently invested
          </motion.div>
        )}
      </AnimatePresence>

      {/* Millionaire Celebration Message */}
      <AnimatePresence>
        {showContribution && isMillionaire && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            style={{
              marginTop: '16px',
              padding: '12px 20px',
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
              borderRadius: '8px',
              color: colors.primary,
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            You could become a MILLIONAIRE!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HeroWealthDisplay;
