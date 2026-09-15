import React from 'react';
import { Flame, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { formatNumber } from '../constants/strings';

interface CompactStreakBarProps {
  streakDays: number;
  weekStatus: boolean[]; // 7 booleans for the past 7 days
  onClick?: () => void;
}

const DAY_LABELS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export const CompactStreakBar: React.FC<CompactStreakBarProps> = ({
  streakDays,
  weekStatus,
  onClick,
}) => {
  // Normalize week status to 7 items
  const days = weekStatus.length === 7 ? weekStatus : [false, false, false, false, false, false, false];

  return (
    <motion.div
      id="compact-streak-bar"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="group w-full h-12 px-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2D9CFF] dark:hover:border-[#2D9CFF] shadow-2xs flex items-center justify-between cursor-pointer transition-all duration-200"
      title="مشاهده نشان‌ها و دستاوردها"
    >
      {/* Left side in RTL (Flame + Streak Count) */}
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
            streakDays > 0
              ? 'bg-[#FEF3C7] dark:bg-[#78350F]/40 text-[#D97706] dark:text-[#FBBF24]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}
        >
          <Flame className={`w-4 h-4 ${streakDays > 0 ? 'fill-current animate-pulse' : ''}`} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
            {streakDays > 0 ? `${formatNumber(streakDays)} روز مداوم` : 'آغاز زنجیره'}
          </span>
          {streakDays >= 3 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#F59E0B]/15 text-[#D97706] dark:text-[#FBBF24]">
              آتشین 
            </span>
          )}
        </div>
      </div>

      {/* Right side in RTL (7 Compact Week Dots + Mini Arrow) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {days.map((isDone, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-0.5"
              title={DAY_LABELS[idx]}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-[#2D9CFF] ring-2 ring-[#2D9CFF]/20 shadow-xs'
                    : 'bg-[#CBD5E1] dark:bg-[#475569]'
                }`}
              />
            </div>
          ))}
        </div>

        <ChevronLeft className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2D9CFF] group-hover:-translate-x-0.5 transition-all" />
      </div>
    </motion.div>
  );
};
