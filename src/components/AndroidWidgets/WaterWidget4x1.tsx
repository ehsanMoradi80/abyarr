import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { WidgetDropletIcon } from './WidgetDropletIcon';
import { WidgetWaterGlass } from './WidgetWaterGlass';
import { formatNumber } from '../../constants/strings';

interface WaterWidget4x1Props {
  todayGlasses: number;
  goalGlasses: number;
  isDark?: boolean;
  onAddWater?: () => void;
  onOpenApp?: () => void;
  className?: string;
}

export const WaterWidget4x1: React.FC<WaterWidget4x1Props> = ({
  todayGlasses,
  goalGlasses = 8,
  isDark = false,
  onAddWater,
  onOpenApp,
  className = '',
}) => {
  // Determine number of glasses to show (default 8, min 6, max 10 for clean grid)
  const displayGoal = Math.min(10, Math.max(6, goalGlasses || 8));
  const filledCount = Math.min(displayGoal, Math.floor(todayGlasses));

  const glassesArray = Array.from({ length: displayGoal }, (_, i) => i < filledCount);

  return (
    <div
      onClick={onOpenApp}
      className={`relative w-full rounded-3xl p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 select-none cursor-pointer ${
        isDark
          ? 'bg-[#0F172A] text-[#F8FAFC] border border-[#1E293B] shadow-lg shadow-black/40'
          : 'bg-white text-[#1E293B] border border-[#E2E8F0] shadow-md shadow-blue-500/5'
      } ${className}`}
    >
      {/* Left: Droplet Icon + Count */}
      <div className="flex items-center gap-2.5 shrink-0">
        <WidgetDropletIcon size={38} isDark={isDark} />
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-0.5 text-base sm:text-lg font-black tracking-tight leading-tight">
            <span className="text-[#2D9CFF] dark:text-[#56B7FF]">
              {formatNumber(Math.round(todayGlasses * 10) / 10)}
            </span>
            <span className="text-[#94A3B8]">/</span>
            <span>{formatNumber(goalGlasses)}</span>
          </div>
          <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8]">
            لیوان
          </span>
        </div>
      </div>

      {/* Center: Row of Visual Water Glasses */}
      <div className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2 overflow-hidden">
        {glassesArray.map((isFilled, idx) => (
          <WidgetWaterGlass
            key={idx}
            filled={isFilled}
            isDark={isDark}
            size="md"
          />
        ))}
      </div>

      {/* Right: Quick Action (+) Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={(e) => {
          e.stopPropagation();
          if (onAddWater) onAddWater();
        }}
        title="ثبت ۱ لیوان آب"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl sm:rounded-[18px] bg-gradient-to-tr from-[#0066CC] via-[#2D9CFF] to-[#56B7FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#2D9CFF]/30 hover:opacity-95 transition-all cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[2.8]" />
      </motion.button>
    </div>
  );
};
