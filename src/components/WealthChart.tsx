/**
 * WealthChart Component
 * Interactive wealth projection visualization using Recharts
 * Enhanced visual design that clearly shows SwipeSwipe benefit
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
  ReferenceLine,
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
  primary: '#293A60',
  primaryLight: '#DEEFF2',
  success: '#19B600',
  successLight: '#D4FACE',
  accent: '#FBC950',
  accentDark: '#F4B545',
  textPrimary: '#293A60',
  textSecondary: '#879CA8',
  bgSecondary: '#FAFAFA',
  border: '#F3F6F9',
  white: '#FFFFFF',
  swipeSwipeGradientStart: '#19B600',
  swipeSwipeGradientEnd: '#0D8C00',
};

// Custom tooltip component with enhanced styling
const CustomTooltip: React.FC<any> = ({ active, payload, label, companyName }) => {
  if (active && payload && payload.length) {
    const withSwipe = payload.find((p: any) => p.dataKey === 'withSwipeSwipe');
    const withoutSwipe = payload.find((p: any) => p.dataKey === 'withoutSwipeSwipe');
    const contribution = withSwipe && withoutSwipe
      ? withSwipe.value - withoutSwipe.value
      : 0;

    return (
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(41, 58, 96, 0.2)',
          border: `2px solid ${colors.accent}`,
          minWidth: '240px',
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
          Year {label}
        </p>

        {/* With SwipeSwipe */}
        <div style={{
          marginBottom: '12px',
          padding: '12px',
          background: colors.successLight,
          borderRadius: '10px',
          border: `1px solid ${colors.success}`,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: colors.success,
              fontSize: '13px',
              fontWeight: 600,
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: colors.success,
                boxShadow: `0 0 8px ${colors.success}`,
              }} />
              With {companyName}
            </span>
            <span style={{ fontWeight: 700, color: colors.success, fontSize: '16px' }}>
              {formatCurrency(withSwipe?.value || 0)}
            </span>
          </div>
        </div>

        {/* Without SwipeSwipe */}
        <div style={{
          marginBottom: '12px',
          padding: '10px 12px',
          background: colors.primaryLight,
          borderRadius: '8px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: colors.textSecondary,
              fontSize: '13px',
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: colors.primary,
                opacity: 0.5,
              }} />
              Without {companyName}
            </span>
            <span style={{ fontWeight: 600, color: colors.textSecondary }}>
              {formatCurrency(withoutSwipe?.value || 0)}
            </span>
          </div>
        </div>

        {/* SwipeSwipe Bonus */}
        {contribution > 0 && (
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: `2px dashed ${colors.accent}`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
              padding: '12px 14px',
              borderRadius: '10px',
            }}>
              <span style={{ fontSize: '13px', color: colors.primary, fontWeight: 600 }}>
                {companyName} Bonus
              </span>
              <span style={{
                fontWeight: 800,
                color: colors.primary,
                fontSize: '16px',
              }}>
                +{formatCurrency(contribution)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Custom legend component with enhanced styling
const CustomLegend: React.FC<{ companyName: string; contribution30yr: number }> = ({ companyName, contribution30yr }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  }}>
    {/* Legend items */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '32px',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '24px',
          height: '4px',
          background: `linear-gradient(90deg, ${colors.success} 0%, ${colors.swipeSwipeGradientEnd} 100%)`,
          borderRadius: '2px',
          boxShadow: `0 0 8px ${colors.success}`,
        }} />
        <span style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 600 }}>
          With {companyName}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '24px',
          height: '4px',
          background: colors.primary,
          borderRadius: '2px',
          opacity: 0.4,
        }} />
        <span style={{ fontSize: '14px', color: colors.textSecondary }}>
          Without {companyName}
        </span>
      </div>
    </div>

    {/* SwipeSwipe Impact Highlight */}
    <div style={{
      background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}10 100%)`,
      border: `2px solid ${colors.accent}`,
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    }}>
      <span style={{
        fontSize: '24px',
      }}>💰</span>
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
          fontSize: '20px',
          fontWeight: 700,
          color: colors.primary,
        }}>
          +{formatCurrency(contribution30yr)}
        </span>
        <span style={{
          fontSize: '13px',
          color: colors.textSecondary,
          marginLeft: '6px',
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
  // Prepare chart data with age labels if available
  const years = [5, 10, 15, 20, 25, 30, 35];
  const chartData = years.map(year => ({
    year,
    displayLabel: userAge ? `Age ${userAge + year}` : `${year}yr`,
    withSwipeSwipe: projection.withSwipeSwipe[year],
    withoutSwipeSwipe: projection.withoutSwipeSwipe[year],
    contribution: projection.swipeswipeContribution[year],
  }));

  // Calculate the difference area (the visual gap between the two lines)
  const maxWithSwipe = Math.max(...years.map(y => projection.withSwipeSwipe[y]));
  const isMillionaire = maxWithSwipe >= 1000000;
  const millionaireYear = years.find(y => projection.withSwipeSwipe[y] >= 1000000);

  // 30-year contribution for the legend
  const contribution30yr = projection.swipeswipeContribution[30];

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

        {/* Return Rate Badge */}
        <div style={{
          background: colors.primaryLight,
          padding: '8px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: 600,
          color: colors.primary,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ color: colors.success }}>●</span>
          11% Annual Return
        </div>
      </div>

      {/* Main Chart */}
      <ResponsiveContainer width="100%" height={380}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <defs>
            {/* Enhanced gradient for With SwipeSwipe */}
            <linearGradient id="colorWithSwipe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.success} stopOpacity={0.4} />
              <stop offset="50%" stopColor={colors.success} stopOpacity={0.2} />
              <stop offset="100%" stopColor={colors.success} stopOpacity={0.05} />
            </linearGradient>
            {/* Gradient for Without SwipeSwipe */}
            <linearGradient id="colorWithoutSwipe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.15} />
              <stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
            </linearGradient>
            {/* Glow effect for the main line */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
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

          <Tooltip content={<CustomTooltip companyName={companyName} />} />

          {/* Without SwipeSwipe area - rendered first (behind) */}
          <Area
            type="monotone"
            dataKey="withoutSwipeSwipe"
            stroke={colors.primary}
            strokeWidth={2}
            strokeDasharray="6 6"
            strokeOpacity={0.4}
            fill="url(#colorWithoutSwipe)"
            animationDuration={animationDuration}
            animationEasing="ease-out"
          />

          {/* With SwipeSwipe area - rendered second (in front) */}
          <Area
            type="monotone"
            dataKey="withSwipeSwipe"
            stroke={colors.success}
            strokeWidth={4}
            fill="url(#colorWithSwipe)"
            animationDuration={animationDuration}
            animationEasing="ease-out"
            filter="url(#glowEffect)"
          />

          {/* Millionaire reference line */}
          {isMillionaire && (
            <ReferenceLine
              y={1000000}
              stroke={colors.accent}
              strokeDasharray="8 4"
              strokeWidth={2}
              label={{
                value: '🎉 Millionaire!',
                fill: colors.primary,
                fontSize: 13,
                fontWeight: 700,
                position: 'right',
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* Custom Legend with SwipeSwipe Impact */}
      <CustomLegend companyName={companyName} contribution30yr={contribution30yr} />

      {/* Key Insight Box */}
      <div style={{
        marginTop: '20px',
        padding: '18px 20px',
        background: `linear-gradient(135deg, ${colors.successLight} 0%, ${colors.white} 100%)`,
        borderRadius: '14px',
        borderLeft: `5px solid ${colors.success}`,
        boxShadow: `0 4px 16px ${colors.success}20`,
      }}>
        <p style={{
          margin: 0,
          fontSize: '15px',
          color: colors.textPrimary,
          lineHeight: 1.7,
        }}>
          <strong style={{ color: colors.success }}>Key Insight:</strong> Using {companyName} to control spending adds{' '}
          <strong style={{
            color: colors.success,
            fontSize: '17px',
          }}>
            {formatCurrency(contribution30yr)}
          </strong>{' '}
          to your 30-year wealth through the power of compound interest!
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
