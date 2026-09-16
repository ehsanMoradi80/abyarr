import React from 'react';
import { motion } from 'motion/react';
import { NooshMascot } from './NooshMascot';
import {
  NooshExpression,
  NOOSH_MASCOT_STATES,
} from '../../assets/mascotAssets';

interface NooshCompanionCardProps {
  todayGlasses: number;
  goalGlasses: number;
  lastDrinkTimestamp: number;
  streakDays?: number;
  onTriggerNotification?: (expression: NooshExpression) => void;
}

export const NooshCompanionCard: React.FC<NooshCompanionCardProps> = ({
  todayGlasses,
  goalGlasses,
  lastDrinkTimestamp,
}) => {
  const getDynamicExpression = (): NooshExpression => {
    const now = Date.now();
    const currentHour = new Date().getHours();
    const hoursSinceLastDrink = lastDrinkTimestamp > 0
      ? (now - lastDrinkTimestamp) / (1000 * 60 * 60)
      : (currentHour >= 8 ? currentHour - 8 : 0);

    // 1. Goal completed -> Celebrate!
    if (todayGlasses >= goalGlasses && goalGlasses > 0) {
      return 'celebrate';
    }

    // 2. Severe dehydration warning -> Sad
    if (
      hoursSinceLastDrink >= 3.5 ||
      (currentHour >= 20 && todayGlasses < goalGlasses * 0.5) ||
      (currentHour >= 14 && todayGlasses === 0)
    ) {
      return 'sad';
    }

    // 3. Haven't drank for 2+ hours or mid-day with 0 glasses -> Miss you
    if (
      hoursSinceLastDrink >= 2 ||
      (currentHour >= 11 && todayGlasses === 0)
    ) {
      return 'miss_you';
    }

    // 4. On track & fresh -> Happy
    return 'happy';
  };

  const currentExpression = getDynamicExpression();
  const meta = NOOSH_MASCOT_STATES[currentExpression];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl py-2 px-4 border border-[#E2E8F0] dark:border-[#334155] bg-gradient-to-br from-white via-[#F8FBFF] to-[#EDF6FF] dark:from-[#1E293B] dark:via-[#16273F] dark:to-[#0B192C] shadow-xs flex items-center justify-center"
    >
      {/* Background Soft Glow */}
      <div
        className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-2xl opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: meta.themeColor }}
      />

      {/* Main Mascot Character without any text */}
      <div className="relative z-10 py-1">
        <NooshMascot
          expression={currentExpression}
          size="md"
          showBubble={false}
          interactive={true}
        />
      </div>
    </motion.div>
  );
};

