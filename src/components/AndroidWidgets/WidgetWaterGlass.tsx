import React from 'react';

interface WidgetWaterGlassProps {
  filled: boolean;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const WidgetWaterGlass: React.FC<WidgetWaterGlassProps> = ({
  filled,
  isDark = false,
  size = 'md',
}) => {
  const widthClass = size === 'sm' ? 'w-3.5 h-6' : size === 'lg' ? 'w-5 h-9' : 'w-4 h-7 sm:w-4.5 sm:h-7.5';

  return (
    <div className={`relative ${widthClass} mx-0.5 transition-all duration-300`}>
      <svg
        viewBox="0 0 24 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60B7FF" />
            <stop offset="50%" stopColor="#2D9CFF" />
            <stop offset="100%" stopColor="#0077E6" />
          </linearGradient>
          <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Glass Rim & Body */}
        <path
          d="M3 4 L6 34 C6.5 36 8 37 12 37 C16 37 17.5 36 18 34 L21 4 Z"
          fill={
            filled
              ? 'url(#waterGrad)'
              : isDark
              ? 'rgba(30, 41, 59, 0.6)'
              : 'rgba(226, 232, 240, 0.7)'
          }
          stroke={
            filled
              ? '#56B7FF'
              : isDark
              ? 'rgba(71, 85, 105, 0.6)'
              : 'rgba(203, 213, 225, 0.9)'
          }
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Top Rim Ellipse */}
        <ellipse
          cx="12"
          cy="4"
          rx="9"
          ry="2"
          fill={filled ? '#78C4FF' : isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)'}
          stroke={
            filled
              ? '#8ED3FF'
              : isDark
              ? 'rgba(71, 85, 105, 0.8)'
              : 'rgba(203, 213, 225, 0.9)'
          }
          strokeWidth="1.2"
        />

        {/* Water Surface reflection if filled */}
        {filled && (
          <>
            <ellipse cx="12" cy="7" rx="7.5" ry="1.5" fill="#BFE3FF" fillOpacity="0.8" />
            {/* Side Shine Highlight */}
            <path
              d="M5.5 8 L7 32"
              stroke="url(#glassShine)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </div>
  );
};
