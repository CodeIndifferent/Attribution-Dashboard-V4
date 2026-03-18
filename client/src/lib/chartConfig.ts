/**
 * Modern Vibrant Chart Configuration
 * Defines color palettes, gradients, and styling for all dashboard visualizations
 */

export const vibrantColors = {
  // Primary gradient colors
  primary: ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
  
  // Vibrant palette for multi-series charts
  vibrant: [
    '#00d9ff', // Cyan
    '#00ff88', // Green
    '#ff006e', // Pink
    '#ffbe0b', // Yellow
    '#8338ec', // Purple
    '#3a86ff', // Blue
    '#fb5607', // Orange
    '#ff006e', // Red
  ],
  
  // Neon palette for high contrast
  neon: [
    '#00ffff', // Cyan
    '#00ff00', // Lime
    '#ff00ff', // Magenta
    '#ffff00', // Yellow
    '#ff0080', // Hot Pink
    '#00ff80', // Spring Green
    '#ff8000', // Orange
    '#0080ff', // Blue
  ],

  // Gradient definitions
  gradients: {
    cyan: 'linear-gradient(135deg, #00d9ff 0%, #0ea5e9 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    purple: 'linear-gradient(135deg, #8338ec 0%, #3a86ff 100%)',
    orange: 'linear-gradient(135deg, #ff8c00 0%, #ffbe0b 100%)',
    pink: 'linear-gradient(135deg, #ff006e 0%, #ff5e78 100%)',
    multi: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #10b981 50%, #f59e0b 75%, #ef4444 100%)',
  },

  // Chart-specific colors
  charts: {
    bar: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      tertiary: '#10b981',
      accent: '#f59e0b',
    },
    line: {
      primary: '#00d9ff',
      secondary: '#10b981',
      tertiary: '#8338ec',
    },
    pie: [
      '#0ea5e9',
      '#06b6d4',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8338ec',
      '#3a86ff',
      '#fb5607',
    ],
    area: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      fill: 'rgba(14, 165, 233, 0.1)',
    },
  },
};

export const chartStyles = {
  // Grid styling
  grid: {
    stroke: 'rgba(148, 163, 184, 0.15)',
    strokeDasharray: '4 4',
  },

  // Axis styling
  axis: {
    tick: { fill: 'rgba(148, 163, 184, 0.7)', fontSize: 12 },
    line: { stroke: 'rgba(148, 163, 184, 0.2)' },
  },

  // Tooltip styling
  tooltip: {
    contentStyle: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(14, 165, 233, 0.3)',
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    labelStyle: { color: '#e0f2fe' },
    itemStyle: { color: '#0ea5e9' },
  },

  // Bar styling
  bar: {
    radius: [8, 8, 0, 0],
    animationDuration: 800,
    animationEasing: 'ease-in-out',
  },

  // Line styling
  line: {
    strokeWidth: 3,
    dot: { fill: '#0ea5e9', r: 4 },
    activeDot: { r: 6, fill: '#00d9ff' },
  },

  // Area styling
  area: {
    strokeWidth: 2,
    fillOpacity: 0.3,
  },
};

export const getGradientColor = (index: number, total: number): string => {
  const colors = vibrantColors.vibrant;
  return colors[index % colors.length];
};

export const getGradientId = (name: string): string => {
  return `gradient-${name.replace(/\s+/g, '-').toLowerCase()}`;
};
