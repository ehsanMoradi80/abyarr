import React from 'react';
import { motion } from 'motion/react';

// Card 1: Crystal Clean Glass of Water
export const WaterGlassGraphic: React.FC<{ size?: number; className?: string }> = ({
  size = 120,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="glassWaterGrad" x1="20" y1="40" x2="80" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8ED3FF" />
            <stop offset="50%" stopColor="#56B7FF" />
            <stop offset="100%" stopColor="#2D9CFF" />
          </linearGradient>
          <linearGradient id="glassBodyGrad" x1="10" y1="10" x2="90" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#CBE8FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8ED3FF" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer Glass Contour */}
        <path
          d="M20 15 L28 102 C28.5 108 34 112 40 112 L60 112 C66 112 71.5 108 72 102 L80 15 Z"
          fill="url(#glassBodyGrad)"
          stroke="#2D9CFF"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Water Inside Glass */}
        <path
          d="M23 45 C23 45 35 48 50 48 C65 48 77 45 77 45 L71 100 C70.5 105 66 108 60 108 L40 108 C34 108 29.5 105 29 100 Z"
          fill="url(#glassWaterGrad)"
        />

        {/* Water Surface Wave / Ellipse */}
        <ellipse cx="50" cy="45" rx="27" ry="5.5" fill="#8ED3FF" />
        <ellipse cx="50" cy="44" rx="24" ry="4" fill="#CBE8FF" opacity="0.8" />

        {/* Glass Edge Highlights / Reflections */}
        <path
          d="M24 22 L31 98"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M29 25 L34 85"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Right soft specular */}
        <path
          d="M74 25 L68 95"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Small floating air bubbles inside water */}
        <circle cx="42" cy="75" r="2.5" fill="#FFFFFF" opacity="0.8" />
        <circle cx="58" cy="88" r="2" fill="#FFFFFF" opacity="0.7" />
        <circle cx="48" cy="94" r="1.5" fill="#FFFFFF" opacity="0.6" />
      </svg>
    </div>
  );
};

// Card 2: Cute Animated Water Mascot holding a cup
export const WaterMascotGraphic: React.FC<{ size?: number; className?: string }> = ({
  size = 120,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 110 125"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mascotGrad" x1="20" y1="10" x2="90" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8ED3FF" />
            <stop offset="45%" stopColor="#56B7FF" />
            <stop offset="100%" stopColor="#2D9CFF" />
          </linearGradient>
          <linearGradient id="mascotHighlight" x1="25" y1="20" x2="45" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Mascot Droplet Body */}
        <path
          d="M55 12 C55 12 20 54 20 82 C20 101.3 35.7 117 55 117 C74.3 117 90 101.3 90 82 C90 54 55 12 55 12 Z"
          fill="url(#mascotGrad)"
          stroke="#1E70E8"
          strokeWidth="3.5"
        />

        {/* Body 3D Highlight */}
        <path
          d="M32 45 C32 45 26 62 26 80 C26 94 34 105 45 109"
          stroke="url(#mascotHighlight)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Cheerful Big Eyes */}
        {/* Left Eye */}
        <circle cx="44" cy="74" r="5" fill="#0B192C" />
        <circle cx="42.5" cy="72" r="2" fill="#FFFFFF" />
        {/* Right Eye */}
        <circle cx="66" cy="74" r="5" fill="#0B192C" />
        <circle cx="64.5" cy="72" r="2" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="36" cy="82" rx="4.5" ry="2.5" fill="#FF8BA7" opacity="0.85" />
        <ellipse cx="74" cy="82" rx="4.5" ry="2.5" fill="#FF8BA7" opacity="0.85" />

        {/* Happy Smiling Mouth */}
        <path
          d="M48 83 C48 83 55 91 62 83"
          stroke="#0B192C"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="#FF6584"
        />

        {/* Right Arm Waving */}
        <path
          d="M85 78 C93 72 98 62 96 55"
          stroke="#2D9CFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Little Splash Bubbles near waving hand */}
        <circle cx="98" cy="48" r="2.5" fill="#8ED3FF" />
        <circle cx="92" cy="42" r="1.5" fill="#56B7FF" />

        {/* Left Hand holding a Mini Glass of Water */}
        <path
          d="M24 82 C16 85 14 90 14 93"
          stroke="#2D9CFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Mini Glass in hand */}
        <g transform="translate(8, 70) scale(0.24)">
          <path
            d="M20 15 L28 102 C28.5 108 34 112 40 112 L60 112 C66 112 71.5 108 72 102 L80 15 Z"
            fill="#E6F4FF"
            stroke="#2D9CFF"
            strokeWidth="6"
          />
          <path
            d="M23 45 L77 45 L71 100 L29 100 Z"
            fill="#2D9CFF"
          />
        </g>
      </svg>
    </div>
  );
};

// Card 3: Friendly Reminder Clock with Water Droplets
export const WaterClockGraphic: React.FC<{ size?: number; className?: string }> = ({
  size = 120,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 110 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="clockOuterGrad" x1="15" y1="15" x2="95" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E6F4FF" />
            <stop offset="100%" stopColor="#CBE8FF" />
          </linearGradient>
          <linearGradient id="clockBorderGrad" x1="10" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#56B7FF" />
            <stop offset="100%" stopColor="#2D9CFF" />
          </linearGradient>
        </defs>

        {/* Clock Outer Ring */}
        <circle
          cx="55"
          cy="60"
          r="44"
          fill="url(#clockOuterGrad)"
          stroke="url(#clockBorderGrad)"
          strokeWidth="6"
        />

        {/* Clock Inner Bezel */}
        <circle cx="55" cy="60" r="36" fill="#FFFFFF" />

        {/* Hour Marks / Small Droplets at 12, 3, 6, 9 */}
        {/* 12 o'clock Droplet */}
        <path d="M55 30 C55 30 52 35 52 37 C52 38.6 53.3 40 55 40 C56.7 40 58 38.6 58 37 C58 35 55 30 55 30 Z" fill="#2D9CFF" />
        {/* 6 o'clock Droplet */}
        <circle cx="55" cy="86" r="2.5" fill="#2D9CFF" />
        {/* 3 o'clock Droplet */}
        <circle cx="81" cy="60" r="2.5" fill="#2D9CFF" />
        {/* 9 o'clock Droplet */}
        <circle cx="29" cy="60" r="2.5" fill="#2D9CFF" />

        {/* Other Hour Ticks */}
        <circle cx="68" cy="33.5" r="1.5" fill="#8ED3FF" />
        <circle cx="77.5" cy="43" r="1.5" fill="#8ED3FF" />
        <circle cx="77.5" cy="77" r="1.5" fill="#8ED3FF" />
        <circle cx="68" cy="86.5" r="1.5" fill="#8ED3FF" />
        <circle cx="42" cy="86.5" r="1.5" fill="#8ED3FF" />
        <circle cx="32.5" cy="77" r="1.5" fill="#8ED3FF" />
        <circle cx="32.5" cy="43" r="1.5" fill="#8ED3FF" />
        <circle cx="42" cy="33.5" r="1.5" fill="#8ED3FF" />

        {/* Clock Hands pointing to 10:10 (friendly smiling time) */}
        {/* Hour Hand */}
        <line x1="55" y1="60" x2="38" y2="48" stroke="#1E70E8" strokeWidth="4" strokeLinecap="round" />
        {/* Minute Hand */}
        <line x1="55" y1="60" x2="72" y2="42" stroke="#2D9CFF" strokeWidth="3" strokeLinecap="round" />
        {/* Center Pivot */}
        <circle cx="55" cy="60" r="4.5" fill="#1E70E8" />
        <circle cx="55" cy="60" r="2" fill="#FFFFFF" />

        {/* Top Alarm Bells / Droplet Top Accent */}
        <path
          d="M55 7 C55 7 51 12 51 14 C51 16.2 52.8 18 55 18 C57.2 18 59 16.2 59 14 C59 12 55 7 55 7 Z"
          fill="#2D9CFF"
        />
      </svg>
    </div>
  );
};

// Card 4: Rising Ocean Waves & Bubbles (Continuity / تداوم)
export const WaterWavesGraphic: React.FC<{ size?: number; className?: string }> = ({
  size = 120,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 110 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveBgGrad" x1="55" y1="0" x2="55" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#56B7FF" />
            <stop offset="50%" stopColor="#2D9CFF" />
            <stop offset="100%" stopColor="#1E70E8" />
          </linearGradient>
          <linearGradient id="waveLayerGrad1" x1="0" y1="60" x2="110" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8ED3FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2D9CFF" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="waveLayerGrad2" x1="0" y1="75" x2="110" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#CBE8FF" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Card Background Base */}
        <rect width="110" height="120" rx="18" fill="url(#waveBgGrad)" />

        {/* Wave Layer 1 */}
        <path
          d="M0 65 C25 55 45 75 70 65 C95 55 105 68 110 72 L110 120 L0 120 Z"
          fill="url(#waveLayerGrad1)"
        />

        {/* Wave Layer 2 */}
        <path
          d="M0 82 C30 72 50 92 80 80 C95 74 105 82 110 85 L110 120 L0 120 Z"
          fill="url(#waveLayerGrad2)"
        />

        {/* Floating Rising Bubbles */}
        <circle cx="55" cy="35" r="4.5" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="53.5" cy="33.5" r="1.5" fill="#FFFFFF" />

        <circle cx="32" cy="48" r="3" fill="#FFFFFF" fillOpacity="0.6" />
        <circle cx="78" cy="42" r="3.5" fill="#FFFFFF" fillOpacity="0.7" />
        <circle cx="68" cy="22" r="2" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="42" cy="24" r="2.5" fill="#FFFFFF" fillOpacity="0.5" />
      </svg>
    </div>
  );
};

export interface BrandCardItem {
  id: string;
  title: string;
  graphic: React.ReactNode;
  subtitle?: string;
  tag?: string;
}

export const BRAND_CARDS_DATA: BrandCardItem[] = [
  {
    id: 'glass',
    title: 'هر قطره، یک قدم به سلامتی',
    subtitle: 'آب بدن را هیدراته و سلول‌ها را شاداب نگه می‌دارد',
    tag: 'سلامتی و نشاط',
    graphic: <WaterGlassGraphic size={105} />,
  },
  {
    id: 'mascot',
    title: 'آب بخور، حال خوبت رو بساز',
    subtitle: 'نوشیدن آب سطح انرژی و تمرکزت رو چند برابر می‌کنه',
    tag: 'انرژی روزانه',
    graphic: <WaterMascotGraphic size={105} />,
  },
  {
    id: 'clock',
    title: 'یادآوری دوستانه: وقت آب خوردن',
    subtitle: 'فواصل منظم، بهترین بازدهی رو برای بدنت داره',
    tag: 'نظم و استمرار',
    graphic: <WaterClockGraphic size={105} />,
  },
  {
    id: 'waves',
    title: 'تداوم، کلید تغییر است',
    subtitle: 'عادت‌های کوچک روزانه، تغییرات بزرگ می‌سازند',
    tag: 'انگیزه و رشد',
    graphic: <WaterWavesGraphic size={105} />,
  },
];

// Reusable Brand Card Component
export const BrandCard: React.FC<{ item: BrandCardItem; className?: string }> = ({
  item,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className={`relative overflow-hidden rounded-3xl p-5 border border-[#E2E8F0] dark:border-[#334155] bg-gradient-to-b from-[#FFFFFF] to-[#F2F6FA] dark:from-[#1E293B] dark:to-[#0B192C] shadow-xs flex flex-col items-center text-center ${className}`}
    >
      {/* Soft background blue glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#2D9CFF]/10 rounded-full blur-xl pointer-events-none" />

      {/* Graphic Container */}
      <div className="py-2 flex items-center justify-center">
        {item.graphic}
      </div>

      {/* Tag */}
      {item.tag && (
        <span className="mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F4FF] text-[#0066CC] dark:bg-[#1E3A5F] dark:text-[#93C5FD]">
          {item.tag}
        </span>
      )}

      {/* Title */}
      <h4 className="text-sm font-black text-[#1E293B] dark:text-[#F8FAFC] mt-2">
        {item.title}
      </h4>

      {/* Heart Accent */}
      <span className="text-xs text-[#2D9CFF] mt-1 font-bold">💙</span>

      {/* Subtitle */}
      {item.subtitle && (
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 line-clamp-2 px-1 leading-relaxed">
          {item.subtitle}
        </p>
      )}
    </motion.div>
  );
};

// Carousel / Grid of Brand Cards
export const BrandCardsSection: React.FC<{
  title?: string;
  layout?: 'grid' | 'carousel';
}> = ({ title = 'پیام‌های سلامتی و انگیزه نوش', layout = 'carousel' }) => {
  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">✨</span>
            <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F8FAFC]">
              {title}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#2D9CFF]">
            نوشیدن آب، عشق به خودت
          </span>
        </div>
      )}

      {layout === 'carousel' ? (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar snap-x snap-mandatory">
          {BRAND_CARDS_DATA.map((item) => (
            <div key={item.id} className="min-w-[220px] max-w-[240px] shrink-0 snap-start">
              <BrandCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BRAND_CARDS_DATA.map((item) => (
            <BrandCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
