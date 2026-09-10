import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  showHeart?: boolean;
  animated?: boolean;
  withText?: boolean;
  withTagline?: boolean;
  tagline?: string;
  variant?: 'vertical' | 'horizontal' | 'iconOnly';
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 48,
  className = '',
  showHeart = true,
  animated = false,
  withText = false,
  withTagline = false,
  tagline = 'نوشیدن آب، یادآوری عشق به خودت',
  variant = 'iconOnly',
}) => {
  const uniqueId = React.useId().replace(/:/g, '');

  const iconElement = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Outer Ring / Droplet Stroke Gradient */}
          <linearGradient id={`dropletGrad_${uniqueId}`} x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#56B7FF" />
            <stop offset="45%" stopColor="#2D9CFF" />
            <stop offset="100%" stopColor="#1E70E8" />
          </linearGradient>

          {/* Water Fill Wave Gradient */}
          <linearGradient id={`waterWaveGrad_${uniqueId}`} x1="30" y1="60" x2="80" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8ED3FF" />
            <stop offset="50%" stopColor="#56B7FF" />
            <stop offset="100%" stopColor="#2D9CFF" />
          </linearGradient>

          {/* Heart Gradient */}
          <linearGradient id={`heartGrad_${uniqueId}`} x1="90" y1="20" x2="115" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#56B7FF" />
            <stop offset="100%" stopColor="#2D9CFF" />
          </linearGradient>

          {/* Droplet Inner Mask for Water Wave */}
          <mask id={`dropletMask_${uniqueId}`}>
            <path
              d="M55 12 C55 12 20 52 20 78 C20 97.3 35.7 113 55 113 C74.3 113 90 97.3 90 78 C90 52 55 12 55 12 Z"
              fill="#FFFFFF"
            />
          </mask>
        </defs>

        {/* Droplet Outer Contour / Border */}
        <path
          d="M55 12 C55 12 18 52 18 78 C18 98.4 34.6 115 55 115 C75.4 115 92 98.4 92 78 C92 52 55 12 55 12 Z"
          fill="none"
          stroke={`url(#dropletGrad_${uniqueId})`}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Droplet Background Glass Fill */}
        <path
          d="M55 14 C55 14 20 53 20 78 C20 96 35 111 55 111 C75 111 90 96 90 78 C90 53 55 14 55 14 Z"
          fill="currentColor"
          className="text-white/50 dark:text-[#1E3A5F]/40"
        />

        {/* Water Inside with Wave */}
        <g mask={`url(#dropletMask_${uniqueId})`}>
          <path
            d="M15 68 C28 61 42 75 58 72 C74 69 85 61 95 65 L95 120 L15 120 Z"
            fill={`url(#waterWaveGrad_${uniqueId})`}
            className={animated ? 'animate-pulse' : ''}
          />
          {/* Light Reflection Highlight on bottom-left */}
          <path
            d="M27 78 C27 88 33 98 42 103"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
        </g>

        {/* Companion Heart */}
        {showHeart && (
          <path
            d="M103.5 24 C100 20.5 94.5 20.5 91 24 C87.5 20.5 82 20.5 78.5 24 C75 27.5 75 33 78.5 36.5 L91 49 L103.5 36.5 C107 33 107 27.5 103.5 24 Z"
            fill={`url(#heartGrad_${uniqueId})`}
            transform="scale(0.8) translate(22, 0)"
          />
        )}
      </svg>
    </div>
  );

  if (variant === 'vertical' || withText) {
    return (
      <div className={`inline-flex flex-col items-center justify-center text-center ${className}`}>
        {iconElement}
        <h1 className="text-3xl font-black tracking-tight text-[#2D9CFF] mt-3">
          نوش
        </h1>
        {withTagline && (
          <p className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mt-1.5 max-w-[220px]">
            {tagline}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {iconElement}
        <div className="text-right">
          <span className="text-2xl font-black tracking-tight text-[#2D9CFF] block leading-none">
            نوش
          </span>
          {withTagline && (
            <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mt-1 block">
              {tagline}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {iconElement}
    </div>
  );
};

