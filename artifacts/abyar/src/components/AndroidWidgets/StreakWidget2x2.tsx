import React from 'react';
import { Plus, Trophy, Droplets } from 'lucide-react';
import { motion } from 'motion/react';
import { formatNumber } from '../../constants/strings';
import { WidgetAbyarFlameIcon } from './WidgetAbyarFlameIcon';

interface StreakWidget2x2Props {
  streakDays: number;
  targetStreakDays?: number;
  isDark?: boolean;
  onAddWater?: () => void;
  onOpenApp?: () => void;
  className?: string;
}

export const StreakWidget2x2: React.FC<StreakWidget2x2Props> = ({
  streakDays = 0,
  targetStreakDays = 7,
  isDark = false,
  onAddWater,
  onOpenApp,
  className = '',
}) => {
  const percent = Math.min(100, Math.round((streakDays / (targetStreakDays || 7)) * 100));

  return (
    <div
      onClick={onOpenApp}
      className={`relative w-full max-w-[220px] aspect-square rounded-[32px] p-4 flex flex-col justify-between transition-all duration-300 select-none cursor-pointer ${
        isDark
          ? 'bg-[#0F172A] text-[#F8FAFC] border border-[#1E293B] shadow-lg shadow-black/40'
          : 'bg-white text-[#1E293B] border border-[#E2E8F0] shadow-md shadow-amber-500/5'
      } ${className}`}
    >
      {/* Top row: App Water Brand & Quick + */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-black text-[#0284C7] dark:text-[#38BDF8]">
          <Droplets className="w-3.5 h-3.5" />
          <span>آب‌یار • {formatNumber(targetStreakDays)} روزه</span>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onAddWater) onAddWater();
          }}
          title="ثبت ۱ لیوان آب"
          className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284C7] via-[#2D9CFF] to-[#F59E0B] text-white flex items-center justify-center shadow-xs shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.8]" />
        </motion.button>
      </div>

      {/* Center: Abyar Flame & Count */}
      <div className="flex flex-col items-center justify-center my-auto py-1">
        <div className="relative mb-1">
          <WidgetAbyarFlameIcon size={52} isDark={isDark} />
        </div>

        <div className="text-2xl font-black tracking-tight text-[#1E293B] dark:text-[#F8FAFC]">
          {formatNumber(streakDays)} <span className="text-sm font-bold text-[#F59E0B]">روز</span>
        </div>
        <span className="text-[11px] font-black text-[#0284C7] dark:text-[#38BDF8]">
          تداوم نوشیدن آب
        </span>
      </div>

      {/* Bottom: Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0284C7] via-[#2D9CFF] to-[#F59E0B] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
          <span>پیشرفت هدف</span>
          <span>{formatNumber(percent)}٪</span>
        </div>
      </div>
    </div>
  );
};
