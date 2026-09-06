import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell } from 'lucide-react';
import { NooshMascot } from './NooshMascot';
import {
  NooshExpression,
  NOOSH_MASCOT_STATES,
} from '../../assets/mascotAssets';

interface NooshCompanionCardProps {
  todayGlasses: number;
  goalGlasses: number;
  lastDrinkTimestamp: number;
  streakDays: number;
  onTriggerNotification: (expression: NooshExpression) => void;
}

export const NooshCompanionCard: React.FC<NooshCompanionCardProps> = ({
  todayGlasses,
  goalGlasses,
  lastDrinkTimestamp,
  streakDays,
  onTriggerNotification,
}) => {
  // Determine dynamic Duolingo-style expression
  const [manualExpression, setManualExpression] = useState<NooshExpression | null>(null);

  const getDynamicExpression = (): NooshExpression => {
    if (manualExpression) return manualExpression;

    const now = Date.now();
    const hoursSinceLastDrink = lastDrinkTimestamp > 0
      ? (now - lastDrinkTimestamp) / (1000 * 60 * 60)
      : 3;
    const currentHour = new Date().getHours();

    // 1. Goal completed -> Celebrate!
    if (todayGlasses >= goalGlasses && goalGlasses > 0) {
      return 'celebrate';
    }

    // 2. Night time & significantly behind -> Sad/Warning
    if (currentHour >= 20 && todayGlasses < goalGlasses * 0.5) {
      return 'sad';
    }

    // 3. Haven't drank for more than 2 hours or no drink by afternoon -> Miss you (thirst reminder)
    if (hoursSinceLastDrink >= 2 || (todayGlasses === 0 && currentHour >= 12)) {
      return 'miss_you';
    }

    // 4. On track & active -> Happy
    return 'happy';
  };

  const currentExpression = getDynamicExpression();
  const meta = NOOSH_MASCOT_STATES[currentExpression];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-4 sm:p-5 border border-[#E2E8F0] dark:border-[#334155] bg-gradient-to-br from-white via-[#F8FBFF] to-[#EDF6FF] dark:from-[#1E293B] dark:via-[#16273F] dark:to-[#0B192C] shadow-xs"
    >
      {/* Background Soft Glow */}
      <div
        className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-2xl opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: meta.themeColor }}
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.bubbleIcon}</span>
          <div>
            <h3 className="text-sm font-extrabold text-[#1E293B] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <span>کاراکتر نوش</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#93C5FD]">
                {meta.persianTitle}
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Main Mascot & Speech Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 my-2">
        {/* Animated Mascot */}
        <div className="shrink-0">
          <NooshMascot
            expression={currentExpression}
            size="md"
            showBubble={false}
            interactive={true}
          />
        </div>

        {/* Mascot Message & Duolingo Advice */}
        <div className="flex-1 text-center sm:text-right space-y-2">
          <div className="p-3 rounded-2xl bg-white dark:bg-[#0B192C]/80 border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
            <p className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] leading-relaxed">
              « {meta.defaultPhrase} »
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
            {/* Quick Test Notification Button */}
            <button
              onClick={() => onTriggerNotification(currentExpression)}
              className="text-[11px] font-bold text-[#2D9CFF] hover:text-white px-2.5 py-1.5 rounded-xl border border-[#2D9CFF]/40 hover:bg-[#2D9CFF] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Bell className="w-3 h-3" />
              <span>تست نوتیفیکیشن {meta.persianTitle}</span>
            </button>

            {/* Switch expression quick buttons */}
            <div className="flex items-center gap-1">
              {(['happy', 'miss_you', 'celebrate', 'sad'] as NooshExpression[]).map((exp) => (
                <button
                  key={exp}
                  onClick={() => setManualExpression(exp === manualExpression ? null : exp)}
                  title={NOOSH_MASCOT_STATES[exp].persianTitle}
                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all cursor-pointer ${
                    currentExpression === exp
                      ? 'ring-2 ring-[#2D9CFF] scale-110 font-bold bg-white dark:bg-[#1E293B] shadow-xs'
                      : 'opacity-60 hover:opacity-100 bg-[#F1F5F9] dark:bg-[#334155]'
                  }`}
                >
                  {NOOSH_MASCOT_STATES[exp].bubbleIcon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
