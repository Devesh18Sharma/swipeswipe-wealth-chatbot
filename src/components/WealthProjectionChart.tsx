/**
 * Wealth Projection Chart Component
 * Visualizes wealth growth over time with and without SwipeSwipe
 */

import React from 'react';
import { WealthProjection } from '../types';
import { formatCurrency } from '../utils/calculations';

// Simple SVG-based chart (no external dependencies)
// For production, replace with recharts when available

interface WealthProjectionChartProps {
  projection: WealthProjection;
  companyName?: string;
}

export const WealthProjectionChart: React.FC<WealthProjectionChartProps> = ({
  projection,
  companyName = 'SwipeSwipe'
}) => {
  const years = [5, 10, 15, 20, 25, 30, 35];
  const maxValue = Math.max(
    ...years.map(y => projection.withSwipeSwipe[y]),
    ...years.map(y => projection.withoutSwipeSwipe[y])
  );

  const chartHeight = 300;
  const chartWidth = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 80 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const getX = (year: number, index: number) => {
    return padding.left + (index / (years.length - 1)) * graphWidth;
  };

  const getY = (value: number) => {
    return padding.top + graphHeight - (value / maxValue) * graphHeight;
  };

  // Create path for line chart
  const createPath = (getValue: (year: number) => number) => {
    const points = years.map((year, index) => {
      const x = getX(year, index);
      const y = getY(getValue(year));
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    });
    return points.join(' ');
  };

  const withPath = createPath((year) => projection.withSwipeSwipe[year]);
  const withoutPath = createPath((year) => projection.withoutSwipeSwipe[year]);

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '100%', 
      margin: '20px 0',
      padding: '20px',
      background: '#f8fafc',
      borderRadius: '12px',
      overflowX: 'auto'
    }}>
      <h3 style={{ 
        marginBottom: '20px', 
        fontSize: '1.25rem', 
        fontWeight: 600,
        color: '#1e293b'
      }}>
        📈 Your Wealth Growth Over Time
      </h3>
      
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        overflowX: 'auto'
      }}>
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ 
            width: '100%', 
            maxWidth: `${chartWidth}px`,
            height: 'auto',
            minWidth: '400px'
          }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + graphHeight - (ratio * graphHeight);
            const value = maxValue * ratio;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + graphWidth}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#64748b"
                >
                  {formatCurrency(value)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {years.map((year, index) => {
            const x = getX(year, index);
            return (
              <text
                key={year}
                x={x}
                y={chartHeight - padding.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#64748b"
                fontWeight="500"
              >
                {year}yr
              </text>
            );
          })}

          {/* Without SwipeSwipe line */}
          <path
            d={withoutPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeDasharray="6,4"
            opacity="0.7"
          />

          {/* With SwipeSwipe line */}
          <path
            d={withPath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
          />

          {/* Data points - Without SwipeSwipe */}
          {years.map((year, index) => {
            const x = getX(year, index);
            const y = getY(projection.withoutSwipeSwipe[year]);
            return (
              <circle
                key={`without-${year}`}
                cx={x}
                cy={y}
                r="5"
                fill="#94a3b8"
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}

          {/* Data points - With SwipeSwipe */}
          {years.map((year, index) => {
            const x = getX(year, index);
            const y = getY(projection.withSwipeSwipe[year]);
            return (
              <circle
                key={`with-${year}`}
                cx={x}
                cy={y}
                r="6"
                fill="#6366f1"
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}

          {/* Tooltip areas (hover would show values) */}
          {years.map((year, index) => {
            const x = getX(year, index);
            return (
              <rect
                key={`tooltip-${year}`}
                x={x - 15}
                y={padding.top}
                width="30"
                height={graphHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                title={`${year} years: ${formatCurrency(projection.withSwipeSwipe[year])} with ${companyName}`}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '24px',
        marginTop: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '4px',
            background: '#6366f1',
            borderRadius: '2px'
          }}></div>
          <span style={{ fontSize: '14px', color: '#475569' }}>
            With {companyName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '4px',
            background: '#94a3b8',
            borderRadius: '2px',
            borderTop: '2px dashed #94a3b8'
          }}></div>
          <span style={{ fontSize: '14px', color: '#475569' }}>
            Without {companyName}
          </span>
        </div>
      </div>

      {/* Key insight */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#eef2ff',
        borderRadius: '8px',
        borderLeft: '4px solid #6366f1'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          color: '#1e293b',
          lineHeight: '1.6'
        }}>
          <strong>💡 Key Insight:</strong> By using {companyName}, you could accumulate an additional{' '}
          <strong style={{ color: '#6366f1' }}>
            {formatCurrency(projection.swipeswipeContribution[30])}
          </strong>{' '}
          over 30 years! This shows the power of consistent savings and compound interest.
        </p>
      </div>
    </div>
  );
};
