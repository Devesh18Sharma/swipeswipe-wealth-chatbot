/**
 * WealthChart Component
 * Interactive wealth projection visualization using Recharts
 *
 * Design: Stacked area chart showing:
 * - Dark Green (#1B5E20): Base investment growth (without SwipeSwipe)
 * - Golden Yellow (#FBC950): SwipeSwipe contribution stacked on top (the bonus)
 */

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WealthProjection } from '../types';
import { formatCurrency } from '../utils/calculations';

interface WealthChartProps {
  projection: WealthProjection;
  companyName?: string;
  animationDuration?: number;
  userAge?: number;
}

// SwipeSwipe Theme Colors
const colors = {
  primary: '#1B5E20',          // Dark Green - base investment (changed from gray/blue)
  primaryLight: '#E8F5E9',     // Light green background
  primaryMuted: '#2E7D32',     // Muted green for secondary elements
  accent: '#FBC950',           // Golden Yellow - SwipeSwipe contribution (THE HIGHLIGHT)
  accentDark: '#F4B545',
  accentLight: '#FEF3D9',      // Light golden for backgrounds
  success: '#19B600',
  successLight: '#D4FACE',
  successDark: '#0D7A00',      // Dark green for post-retirement badge
  successLightBg: '#E8F5E3',   // Very light green for pre-retirement badge
  textPrimary: '#293A60',      // Keep text in deep blue for readability
  textSecondary: '#879CA8',
  bgSecondary: '#FAFAFA',
  border: '#F3F6F9',
  white: '#FFFFFF',
};

// Custom tooltip component - redesigned for stacked chart
const CustomTooltip: React.FC<any> = ({ active, payload, label, companyName, userAge }) => {
  if (active && payload && payload.length) {
    // For stacked chart: base = withoutSwipeSwipe, contribution = swipeswipeContribution
    const baseData = payload.find((p: any) => p.dataKey === 'base');
    const contributionData = payload.find((p: any) => p.dataKey === 'swipeswipeContribution');

    const baseValue = baseData?.value || 0;
    const contributionValue = contributionData?.value || 0;
    const totalValue = baseValue + contributionValue;
    const displayAge = userAge ? `Age ${userAge + label}` : `Year ${label}`;

    return (
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(41, 58, 96, 0.2)',
          border: `2px solid ${colors.primary}`,
          minWidth: '260px',
        }}
      >
        <p style={{
          margin: '0 0 16px 0',
          fontWeight: 700,
          color: colors.textPrimary,
          fontSize: '16px',
          borderBottom: `2px solid ${colors.border}`,
          paddingBottom: '12px',
        }}>
          {displayAge}
        </p>

        {/* Total With SwipeSwipe - The big number */}
        <div style={{
          marginBottom: '16px',
          padding: '14px',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryMuted} 100%)`,
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
            Total With {companyName}
          </div>
          <div style={{ fontWeight: 800, color: colors.white, fontSize: '24px' }}>
            {formatCurrency(totalValue)}
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Base Investment */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 12px',
            background: colors.primaryLight,
            borderRadius: '8px',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: colors.primary,
              fontSize: '13px',
              fontWeight: 500,
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: colors.primary,
              }} />
              Your Investment
            </span>
            <span style={{ fontWeight: 700, color: colors.primary, fontSize: '14px' }}>
              {formatCurrency(baseValue)}
            </span>
          </div>

          {/* SwipeSwipe Contribution - Golden Yellow highlight */}
          {contributionValue > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              background: `linear-gradient(135deg, ${colors.accent}30 0%, ${colors.accentLight} 100%)`,
              borderRadius: '8px',
              border: `2px solid ${colors.accent}`,
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: colors.accentDark,
                fontSize: '13px',
                fontWeight: 600,
              }}>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: colors.accent,
                }} />
                {companyName} Adds
              </span>
              <span style={{ fontWeight: 800, color: colors.accentDark, fontSize: '14px' }}>
                +{formatCurrency(contributionValue)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Custom legend component - redesigned for stacked chart
const CustomLegend: React.FC<{ companyName: string; totalContribution: number }> = ({ companyName, totalContribution }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  }}>
    {/* Legend items - matching the stacked areas */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '32px',
      flexWrap: 'wrap',
    }}>
      {/* Your Investment - Deep Blue */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '20px',
          height: '12px',
          background: colors.primary,
          borderRadius: '3px',
        }} />
        <span style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 600 }}>
          Your Investment
        </span>
      </div>

      {/* SwipeSwipe Adds - Golden Yellow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '20px',
          height: '12px',
          background: colors.accent,
          borderRadius: '3px',
        }} />
        <span style={{ fontSize: '14px', color: colors.accentDark, fontWeight: 600 }}>
          {companyName} Adds
        </span>
      </div>
    </div>

    {/* SwipeSwipe Impact Highlight Box - Golden Yellow theme */}
    <div style={{
      background: `linear-gradient(135deg, ${colors.accent}25 0%, ${colors.accentLight} 100%)`,
      border: `2px solid ${colors.accent}`,
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    }}>
      <span style={{ fontSize: '28px' }}>💰</span>
      <div>
        <span style={{
          fontSize: '14px',
          color: colors.textSecondary,
          display: 'block',
          marginBottom: '2px',
        }}>
          {companyName} adds
        </span>
        <span style={{
          fontSize: '24px',
          fontWeight: 800,
          color: colors.primary,
        }}>
          +{formatCurrency(totalContribution)}
        </span>
        <span style={{
          fontSize: '14px',
          color: colors.textSecondary,
          marginLeft: '8px',
        }}>
          to your wealth
        </span>
      </div>
    </div>
  </div>
);

export const WealthChart: React.FC<WealthChartProps> = ({
  projection,
  companyName = 'SwipeSwipe',
  animationDuration = 1500,
  userAge,
}) => {
  // Calculate years to show until age 90
  const LIFE_EXPECTANCY = 90;
  const yearsUntil90 = userAge ? LIFE_EXPECTANCY - userAge : 35;

  // Generate dynamic years array based on user's age to reach age 90
  const allMilestoneYears = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
  let years = allMilestoneYears.filter(y => y <= yearsUntil90);

  // IMPORTANT: Always add the exact year to reach age 90 if not already included
  if (yearsUntil90 > 0 && !years.includes(yearsUntil90)) {
    years = [...years, yearsUntil90];
  }

  // Prepare chart data for STACKED area chart
  // base = withoutSwipeSwipe (the foundation)
  // swipeswipeContribution = the extra amount (stacked on top)
  const chartData = years.map(year => {
    const baseValue = year === 0
      ? (projection.withoutSwipeSwipe[0] ?? projection.withoutSwipeSwipe[5] ?? 0)
      : (projection.withoutSwipeSwipe[year] || 0);

    const contributionValue = year === 0
      ? 0
      : (projection.swipeswipeContribution[year] || 0);

    return {
      year,
      base: baseValue,
      swipeswipeContribution: contributionValue,
      // Keep these for reference
      withSwipeSwipe: baseValue + contributionValue,
      withoutSwipeSwipe: baseValue,
    };
  });

  // Calculate metrics
  const maxWithSwipe = Math.max(...chartData.map(d => d.withSwipeSwipe));
  const isMillionaire = maxWithSwipe >= 1000000;
  const millionaireYear = chartData.find(d => d.withSwipeSwipe >= 1000000)?.year;

  // Get the final year's contribution for the legend
  const finalYear = years[years.length - 1] || 35;
  const finalContribution = projection.swipeswipeContribution[finalYear] || 0;

  return (
    <div className="projection-chart-container" style={{
      background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.bgSecondary} 100%)`,
      borderRadius: '20px',
      padding: '28px',
      margin: '16px 0',
      border: `2px solid ${colors.border}`,
      boxShadow: '0 8px 32px rgba(41, 58, 96, 0.08)',
    }}>
      {/* Chart Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <h3 className="projection-chart-title" style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: colors.textPrimary,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{
            fontSize: '1.5rem',
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
            borderRadius: '8px',
            padding: '6px 8px',
            lineHeight: 1,
          }}>📈</span>
          Your Wealth Growth Journey
        </h3>

        {/* Return Rate Badges */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            background: colors.successLightBg,
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 600,
            color: colors.success,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{ color: colors.success }}>●</span>
            11% Pre-Retirement
          </div>
          <div style={{
            background: colors.successLight,
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 600,
            color: colors.successDark,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{ color: colors.successDark }}>●</span>
            6% Post-Retirement
          </div>
        </div>
      </div>

      {/* Main Chart - Stacked Area Chart */}
      <ResponsiveContainer width="100%" height={450}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          stackOffset="none"
        >
          <defs>
            {/* Gradient for base investment - Deep Blue */}
            <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.9} />
              <stop offset="50%" stopColor={colors.primary} stopOpacity={0.7} />
              <stop offset="100%" stopColor={colors.primary} stopOpacity={0.5} />
            </linearGradient>

            {/* Gradient for SwipeSwipe contribution - Golden Yellow (THE HIGHLIGHT) */}
            <linearGradient id="colorContribution" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.accent} stopOpacity={1} />
              <stop offset="50%" stopColor={colors.accent} stopOpacity={0.9} />
              <stop offset="100%" stopColor={colors.accentDark} stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke={colors.border}
            vertical={false}
          />

          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.textSecondary, fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => userAge ? `Age ${userAge + value}` : `${value}yr`}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.textSecondary, fontSize: 11, fontWeight: 500 }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
              return `$${value}`;
            }}
            width={70}
          />

          <Tooltip content={<CustomTooltip companyName={companyName} userAge={userAge} />} />

          {/* Base Investment Area - Deep Blue (bottom of stack) */}
          <Area
            type="monotone"
            dataKey="base"
            stackId="1"
            stroke={colors.primary}
            strokeWidth={2}
            fill="url(#colorBase)"
            animationDuration={animationDuration}
            animationEasing="ease-out"
          />

          {/* SwipeSwipe Contribution Area - Golden Yellow (stacked on top) */}
          <Area
            type="monotone"
            dataKey="swipeswipeContribution"
            stackId="1"
            stroke={colors.accentDark}
            strokeWidth={3}
            fill="url(#colorContribution)"
            animationDuration={animationDuration}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Custom Legend with SwipeSwipe Impact */}
      <CustomLegend companyName={companyName} totalContribution={finalContribution} />

      {/* Key Insight Box - Light blue theme to differentiate from yellow SwipeSwipe box */}
      <div style={{
        marginTop: '20px',
        padding: '18px 20px',
        background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.white} 100%)`,
        borderRadius: '14px',
        borderLeft: `5px solid ${colors.primary}`,
        boxShadow: '0 4px 16px rgba(41, 58, 96, 0.1)',
      }}>
        <p style={{
          margin: 0,
          fontSize: '15px',
          color: colors.textPrimary,
          lineHeight: 1.7,
        }}>
          <strong style={{ color: colors.primary }}>Key Insight:</strong> Saving effortlessly with {companyName} while you shop puts an extra{' '}
          <strong style={{
            color: colors.primary,
            fontSize: '17px',
          }}>
            {formatCurrency(finalContribution)}
          </strong>{' '}
          into your bank account to be invested to increase growth.
          {isMillionaire && millionaireYear && (
            <span style={{
              display: 'block',
              marginTop: '10px',
              padding: '10px 14px',
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
              borderRadius: '8px',
              color: colors.primary,
              fontWeight: 600,
            }}>
              🏆 You could reach millionaire status in {millionaireYear} years!
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default WealthChart;
