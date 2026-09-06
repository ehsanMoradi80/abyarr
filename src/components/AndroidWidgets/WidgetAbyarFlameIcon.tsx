import React from 'react';

interface WidgetAbyarFlameIconProps {
  size?: number;
  className?: string;
  isDark?: boolean;
}

export const WidgetAbyarFlameIcon: React.FC<WidgetAbyarFlameIconProps> = ({
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
          {/* Flame Gradient */}
          <linearGradient id="widgetFlameGrad" x1="20" y1="10" x2="80" y2="110">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="35%" stopColor="#FB923C" />
            <stop offset="70%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          {/* Water Droplet Inside Flame Gradient */}
          <linearGradient id="innerDropGrad" x1="30" y1="40" x2="70" y2="100">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="60%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Flame Silhouette */}
        <path
          d="M50 8 C50 8 68 28 68 46 C68 52 64 56 62 58 C68 52 74 44 74 38 C74 38 88 56 88 78 C88 98 71 114 50 114 C29 114 12 98 12 78 C12 56 32 32 50 8 Z"
          fill="url(#widgetFlameGrad)"
          filter="url(#flameGlow)"
        />

        {/* Inner Flame Glow */}
        <path
          d="M50 24 C50 24 62 40 62 54 C62 60 58 64 56 66 C60 60 64 54 64 50 C64 50 76 64 76 80 C76 95 64 107 50 107 C36 107 24 95 24 80 C24 64 38 42 50 24 Z"
          fill="#FDE047"
          fillOpacity="0.4"
        />

        {/* App Water Droplet embedded in Flame (Clearly links to Abyar) */}
        <path
          d="M50 50 C50 50 34 72 34 86 C34 95 41 102 50 102 C59 102 66 95 66 86 C66 72 50 50 50 50 Z"
          fill="url(#innerDropGrad)"
          stroke="#BAE6FD"
          strokeWidth="2"
        />

        {/* Water Droplet Shine */}
        <path
          d="M40 82 C40 74 46 64 50 58"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
      </svg>
    </div>
  );
};
