import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { WidgetDropletIcon } from './WidgetDropletIcon';
import { formatNumber } from '../../constants/strings';

interface WaterWidget2x1Props {
  todayGlasses: number;
  goalGlasses: number;
  isDark?: boolean;
  onAddWater?: () => void;
  onOpenApp?: () => void;
  className?: string;
}

export const WaterWidget2x1: React.FC<WaterWidget2x1Props> = ({
  todayGlasses,
  goalGlasses = 8,
  isDark = false,
  onAddWater,
  onOpenApp,
  className = '',
}) => {
  return (
    <div
      onClick={onOpenApp}
      className={`relative w-full max-w-[210px] rounded-3xl p-3 flex items-center justify-between gap-3 transition-all duration-300 select-none cursor-pointer ${
        isDark
          ? 'bg-[#0F172A] text-[#F8FAFC] border border-[#1E293B] shadow-lg shadow-black/40'
          : 'bg-white text-[#1E293B] border border-[#E2E8F0] shadow-md shadow-blue-500/5'
      } ${className}`}
    >
      {/* Left: Droplet Icon + Count */}
      <div className="flex items-center gap-2">
        <WidgetDropletIcon size={36} isDark={isDark} />
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-0.5 text-base font-black tracking-tight leading-tight">
            <span className="text-[#2D9CFF] dark:text-[#56B7FF]">
              {formatNumber(Math.round(todayGlasses * 10) / 10)}
            </span>
            <span className="text-[#94A3B8]">/</span>
            <span>{formatNumber(goalGlasses)}</span>
          </div>
          <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8]">
            لیوان
          </span>
        </div>
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
        className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066CC] via-[#2D9CFF] to-[#56B7FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#2D9CFF]/30 hover:opacity-95 transition-all cursor-pointer"
      >
        <Plus className="w-5 h-5 stroke-[2.8]" />
      </motion.button>
    </div>
  );
};
