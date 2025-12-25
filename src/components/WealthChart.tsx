/**
 * WealthChart Component
 * Interactive wealth projection visualization using Recharts
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
}

// SwipeSwipe Theme Colors
const colors = {
  primary: '#293A60',
  primaryLight: '#DEEFF2',
  success: '#19B600',
  successLight: '#D4FACE',
  accent: '#FBC950',
  textPrimary: '#293A60',
  textSecondary: '#879CA8',
  bgSecondary: '#FAFAFA',
  border: '#F3F6F9',
};

// Custom tooltip component
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
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(41, 58, 96, 0.15)',
          border: `1px solid ${colors.border}`,
          minWidth: '200px',
        }}
      >
        <p style={{
          margin: '0 0 12px 0',
          fontWeight: 600,
          color: colors.textPrimary,
          fontSize: '14px',
        }}>
          Year {label}
        </p>
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: colors.success,
              fontSize: '13px',
            }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: colors.success,
              }} />
              With {companyName}
            </span>
            <span style={{ fontWeight: 600, color: colors.success }}>
              {formatCurrency(withSwipe?.value || 0)}
            </span>
          </div>
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
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: colors.primary,
                opacity: 0.6,
              }} />
              Without {companyName}
            </span>
            <span style={{ fontWeight: 600, color: colors.textSecondary }}>
              {formatCurrency(withoutSwipe?.value || 0)}
            </span>
          </div>
        </div>
        {contribution > 0 && (
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: `1px solid ${colors.border}`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: colors.successLight,
              padding: '8px 12px',
              borderRadius: '6px',
            }}>
              <span style={{ fontSize: '12px', color: colors.success }}>
                {companyName} Bonus
              </span>
              <span style={{
                fontWeight: 700,
                color: colors.success,
                fontSize: '14px',
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

// Custom legend component
const CustomLegend: React.FC<any> = ({ companyName }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginTop: '16px',
    flexWrap: 'wrap',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '16px',
        height: '4px',
        background: colors.success,
        borderRadius: '2px',
      }} />
      <span style={{ fontSize: '14px', color: colors.textSecondary }}>
        With {companyName}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '16px',
        height: '4px',
        background: colors.primary,
        borderRadius: '2px',
        opacity: 0.6,
      }} />
      <span style={{ fontSize: '14px', color: colors.textSecondary }}>
        Without {companyName}
      </span>
    </div>
  </div>
);

export const WealthChart: React.FC<WealthChartProps> = ({
  projection,
  companyName = 'SwipeSwipe',
  animationDuration = 1500,
}) => {
  // Prepare chart data
  const years = [5, 10, 15, 20, 25, 30, 35];
  const chartData = years.map(year => ({
    year,
    withSwipeSwipe: projection.withSwipeSwipe[year],
    withoutSwipeSwipe: projection.withoutSwipeSwipe[year],
    contribution: projection.swipeswipeContribution[year],
  }));

  // Check if user will become a millionaire
  const isMillionaire = projection.withSwipeSwipe[30] >= 1000000;
  const millionaireYear = years.find(y => projection.withSwipeSwipe[y] >= 1000000);

  return (
    <div className="projection-chart-container" style={{
      background: colors.bgSecondary,
      borderRadius: '16px',
      padding: '24px',
      margin: '16px 0',
      border: `1px solid ${colors.border}`,
    }}>
      <h3 className="projection-chart-title" style={{
        fontSize: '1.125rem',
        fontWeight: 600,
        color: colors.textPrimary,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ color: colors.accent }}>📈</span>
        Your Wealth Growth Journey
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWithSwipe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.success} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.success} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorWithoutSwipe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.primary} stopOpacity={0.2} />
              <stop offset="95%" stopColor={colors.primary} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.border}
            vertical={false}
          />

          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.textSecondary, fontSize: 12 }}
            tickFormatter={(value) => `${value}yr`}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.textSecondary, fontSize: 11 }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
              return `$${value}`;
            }}
            width={65}
          />

          <Tooltip content={<CustomTooltip companyName={companyName} />} />

          {/* Without SwipeSwipe area */}
          <Area
            type="monotone"
            dataKey="withoutSwipeSwipe"
            stroke={colors.primary}
            strokeWidth={2}
            strokeDasharray="5 5"
            strokeOpacity={0.6}
            fill="url(#colorWithoutSwipe)"
            animationDuration={animationDuration}
            animationEasing="ease-out"
          />

          {/* With SwipeSwipe area */}
          <Area
            type="monotone"
            dataKey="withSwipeSwipe"
            stroke={colors.success}
            strokeWidth={3}
            fill="url(#colorWithSwipe)"
            animationDuration={animationDuration}
            animationEasing="ease-out"
          />

          {/* Millionaire reference line */}
          {isMillionaire && (
            <ReferenceLine
              y={1000000}
              stroke={colors.accent}
              strokeDasharray="3 3"
              strokeWidth={2}
              label={{
                value: 'Millionaire!',
                fill: colors.accent,
                fontSize: 12,
                fontWeight: 600,
                position: 'right',
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      <CustomLegend companyName={companyName} />

      {/* Key insight box */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: colors.successLight,
        borderRadius: '12px',
        borderLeft: `4px solid ${colors.success}`,
      }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: colors.textPrimary,
          lineHeight: 1.6,
        }}>
          <strong>Key Insight:</strong> By using {companyName}, you could accumulate an additional{' '}
          <strong style={{ color: colors.success }}>
            {formatCurrency(projection.swipeswipeContribution[30])}
          </strong>{' '}
          over 30 years!
          {isMillionaire && millionaireYear && (
            <span style={{ display: 'block', marginTop: '8px', color: colors.accent }}>
              You could reach millionaire status in just {millionaireYear} years!
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default WealthChart;
