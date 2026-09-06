import React from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BrandScreenKey,
  BrandScreenCard,
} from './BrandScreens';
import { formatNumber, localDayKey } from '../constants/strings';

interface GamificationSectionProps {
  layout?: 'compact' | 'full';
  className?: string;
}

export const GamificationSection: React.FC<GamificationSectionProps> = ({
  className = '',
}) => {
  const {
    logs,
    todayTotalGlasses,
    goalGlasses,
    setCurrentScreen,
    setSelectedBrandKey,
  } = useApp();

  // Compute stats
  const totalGlasses = logs.reduce((sum, l) => sum + (l.amount || 1), 0);
  const xpPoints = Math.round(totalGlasses * 10);

  // Streak
  const dayMap = new Map<string, number>();
  logs.forEach((log) => {
    const key = localDayKey(new Date(log.loggedAt));
    dayMap.set(key, (dayMap.get(key) || 0) + (log.amount || 1));
  });

  let currentStreak = 0;
  const today = new Date();
  let checkDate = new Date(today);
  const todayKey = localDayKey(checkDate);
  if ((dayMap.get(todayKey) || 0) >= goalGlasses) currentStreak++;

  for (let i = 1; i <= 30; i++) {
    const prevDate = new Date(today);
    prevDate.setDate(prevDate.getDate() - i);
    const prevKey = localDayKey(prevDate);
    if ((dayMap.get(prevKey) || 0) >= goalGlasses) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Badges status
  const badge1Unlocked = totalGlasses >= 1 || todayTotalGlasses >= 1;
  const badge1Progress = Math.min(100, Math.round(((todayTotalGlasses > 0 ? todayTotalGlasses : totalGlasses) / 1) * 100));

  const halfGoal = Math.max(1, Math.floor(goalGlasses / 2));
  const badge2Unlocked = todayTotalGlasses >= halfGoal;
  const badge2Progress = Math.min(100, Math.round((todayTotalGlasses / halfGoal) * 100));

  const badge3Unlocked = todayTotalGlasses >= goalGlasses;
  const badge3Progress = Math.min(100, Math.round((todayTotalGlasses / goalGlasses) * 100));

  const badge4Unlocked = currentStreak >= 3 || totalGlasses >= 20;
  const badge4Progress = Math.min(
    100,
    Math.round(Math.max((currentStreak / 3) * 100, (totalGlasses / 20) * 100))
  );

  const unlockedCount =
    (badge1Unlocked ? 1 : 0) +
    (badge2Unlocked ? 1 : 0) +
    (badge3Unlocked ? 1 : 0) +
    (badge4Unlocked ? 1 : 0);

  const badgesMap: Record<BrandScreenKey, { unlocked: boolean; progress: number }> = {
    glass: { unlocked: badge1Unlocked, progress: badge1Progress },
    mascot: { unlocked: badge2Unlocked, progress: badge2Progress },
    clock: { unlocked: badge3Unlocked, progress: badge3Progress },
    waves: { unlocked: badge4Unlocked, progress: badge4Progress },
  };

  const handleOpenBrandScreen = (key: BrandScreenKey) => {
    setSelectedBrandKey(key);
    setCurrentScreen('brand-detail');
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#2D9CFF] flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1E293B] dark:text-[#F8FAFC]">
              گیمیفیکیشن و صفحات برند
            </h3>
            <span className="text-[10.5px] text-[#64748B] dark:text-[#94A3B8]">
              {formatNumber(unlockedCount)} از ۴ صفحه باز شده • {formatNumber(xpPoints)} امتیاز قطره
            </span>
          </div>
        </div>

        <button
          id="open-gamification-modal-btn"
          onClick={() => setCurrentScreen('gamification')}
          className="text-xs font-bold text-[#2D9CFF] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>مشاهده همه</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Carousel of Brand Screen Cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar snap-x snap-mandatory">
        {(['glass', 'mascot', 'clock', 'waves'] as BrandScreenKey[]).map((key) => {
          const b = badgesMap[key];
          return (
            <div key={key} className="min-w-[200px] max-w-[220px] shrink-0 snap-start">
              <BrandScreenCard
                screenKey={key}
                isUnlocked={b.unlocked}
                progressPercent={b.progress}
                onClick={() => handleOpenBrandScreen(key)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

