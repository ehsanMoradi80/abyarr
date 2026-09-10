import React from 'react';
import { Flame, Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { formatNumber } from '../../constants/strings';

interface StreakWidget4x1Props {
  streakDays: number;
  targetStreakDays?: number;
  weekStatus?: boolean[];
  isDark?: boolean;
  onAddWater?: () => void;
  onOpenApp?: () => void;
  className?: string;
}

export const StreakWidget4x1: React.FC<StreakWidget4x1Props> = ({
  streakDays = 0,
  targetStreakDays = 7,
  weekStatus = [true, true, true, true, false, false, false],
  isDark = false,
  onAddWater,
  onOpenApp,
  className = '',
}) => {
  const isStreakActive = streakDays > 0;
  const daysOfWeekLabels = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  return (
    <div
      onClick={onOpenApp}
      className={`relative w-full rounded-3xl p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 select-none cursor-pointer ${
        isDark
          ? 'bg-[#0F172A] text-[#F8FAFC] border border-[#1E293B] shadow-lg shadow-black/40'
          : 'bg-white text-[#1E293B] border border-[#E2E8F0] shadow-md shadow-amber-500/5'
      } ${className}`}
    >
      {/* Left: Flame Icon + Streak Count */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EF4444] via-[#F59E0B] to-[#FBBF24] text-white flex items-center justify-center shadow-md shadow-amber-500/25">
          <Flame className="w-6 h-6 fill-current animate-pulse" />
        </div>

        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1 text-base sm:text-lg font-black tracking-tight leading-tight">
            <span className="text-[#F59E0B] dark:text-[#FBBF24]">
              {formatNumber(streakDays)}
            </span>
            <span>روز استریک</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F59E0B]" />
            هدف: {formatNumber(targetStreakDays)} روز پیوسته
          </span>
        </div>
      </div>

      {/* Middle: 7-Day Dot / Flame Mini Indicators */}
      <div className="flex-1 hidden xs:flex items-center justify-center gap-1.5 px-2">
        {daysOfWeekLabels.map((dayLabel, idx) => {
          const isDone = weekStatus[idx];
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold text-[#64748B] dark:text-[#94A3B8]">
                {dayLabel}
              </span>
              <div
                className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-gradient-to-tr from-[#EF4444] to-[#F59E0B] text-white shadow-2xs'
                    : isDark
                    ? 'bg-[#1E293B] text-[#475569] border border-[#334155]'
                    : 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0]'
                }`}
              >
                {isDone ? (
                  <Flame className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>
            </div>
          );
        })}
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
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl sm:rounded-[18px] bg-gradient-to-tr from-[#EF4444] via-[#F59E0B] to-[#FBBF24] text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30 hover:opacity-95 transition-all cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[2.8]" />
      </motion.button>
    </div>
  );
};
