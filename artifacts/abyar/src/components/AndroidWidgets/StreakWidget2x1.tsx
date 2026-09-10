import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { formatNumber } from '../../constants/strings';
import { WidgetAbyarFlameIcon } from './WidgetAbyarFlameIcon';

interface StreakWidget2x1Props {
  streakDays: number;
  isDark?: boolean;
  onAddWater?: () => void;
  onOpenApp?: () => void;
  className?: string;
}

export const StreakWidget2x1: React.FC<StreakWidget2x1Props> = ({
  streakDays = 0,
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
          : 'bg-white text-[#1E293B] border border-[#E2E8F0] shadow-md shadow-amber-500/5'
      } ${className}`}
    >
      {/* Left: Abyar Flame Icon + Count */}
      <div className="flex items-center gap-2">
        <WidgetAbyarFlameIcon size={34} isDark={isDark} />

        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1 text-sm font-black tracking-tight leading-tight">
            <span className="text-[#F59E0B] dark:text-[#FBBF24]">
              {formatNumber(streakDays)}
            </span>
            <span className="text-xs">روز</span>
          </div>
          <span className="text-[10px] font-bold text-[#0284C7] dark:text-[#38BDF8]">
            تداوم نوشیدن آب
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
        className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-[#2D9CFF] to-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
      >
        <Plus className="w-5 h-5 stroke-[2.8]" />
      </motion.button>
    </div>
  );
};
