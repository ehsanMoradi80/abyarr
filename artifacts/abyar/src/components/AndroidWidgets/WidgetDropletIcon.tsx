import React from 'react';

interface WidgetDropletIconProps {
  size?: number;
  className?: string;
  isDark?: boolean;
}

export const WidgetDropletIcon: React.FC<WidgetDropletIconProps> = ({
  size = 40,
  className = '',
  isDark = false,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="widgetDropGrad" x1="20" y1="10" x2="80" y2="110">
            <stop offset="0%" stopColor="#60B7FF" />
            <stop offset="60%" stopColor="#2D9CFF" />
            <stop offset="100%" stopColor="#0066CC" />
          </linearGradient>

          <linearGradient id="widgetDropBorder" x1="10" y1="10" x2="90" y2="120">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <radialGradient id="widgetDropInnerGlow" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#2D9CFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Droplet Body */}
        <path
          d="M50 10 C50 10 16 56 16 80 C16 98.7 31.3 114 50 114 C68.7 114 84 98.7 84 80 C84 56 50 10 50 10 Z"
          fill="url(#widgetDropGrad)"
          stroke="url(#widgetDropBorder)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Soft Light */}
        <path
          d="M50 14 C50 14 20 58 20 80 C20 96 33 110 50 110 C67 110 80 96 80 80 C80 58 50 14 50 14 Z"
          fill="url(#widgetDropInnerGlow)"
        />

        {/* Left Curved Highlight Arc */}
        <path
          d="M26 78 C26 62 42 36 48 26"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* Small Heart on upper right (As seen in the mockup) */}
        <path
          d="M74 44 C71.5 40 66 40.5 64 44 C62 40.5 56.5 40 54 44 C50 50 64 61 64 61 C64 61 78 50 74 44 Z"
          fill="#38BDF8"
          fillOpacity="0.9"
          stroke="white"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
};
