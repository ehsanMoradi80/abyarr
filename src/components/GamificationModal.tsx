import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  Droplets,
  CheckCircle2,
  Lock,
  ChevronLeft,
  X,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import {
  BrandScreenKey,
  BrandScreenCard,
  BrandFullScreenModal,
  BRAND_SCREENS_CONFIG,
} from './BrandScreens';
import { formatNumber, formatGlasses, localDayKey, strings } from '../constants/strings';

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamificationModal: React.FC<GamificationModalProps> = ({ isOpen, onClose }) => {
  const { logs, todayTotalGlasses, goalGlasses, name } = useApp();
  const [selectedScreen, setSelectedScreen] = useState<BrandScreenKey | null>(null);

  // Compute Gamification Stats
  const stats = useMemo(() => {
    // 1. Total Glasses & XP
    const totalGlasses = logs.reduce((sum, l) => sum + (l.amount || 1), 0);
    const xpPoints = Math.round(totalGlasses * 10);

    // 2. Compute Streak (Consecutive days goal was met)
    const dayMap = new Map<string, number>();
    logs.forEach((log) => {
      const key = localDayKey(new Date(log.loggedAt));
      dayMap.set(key, (dayMap.get(key) || 0) + (log.amount || 1));
    });

    let currentStreak = 0;
    const today = new Date();
    // check today or yesterday start
    let checkDate = new Date(today);
    const todayKey = localDayKey(checkDate);
    const todayMet = (dayMap.get(todayKey) || 0) >= goalGlasses;
    if (todayMet) currentStreak++;

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

    // 3. Badges Status
    // Badge 1 (Glass): First glass ever or today
    const badge1Unlocked = totalGlasses >= 1 || todayTotalGlasses >= 1;
    const badge1Progress = Math.min(100, Math.round(((todayTotalGlasses > 0 ? todayTotalGlasses : totalGlasses) / 1) * 100));

    // Badge 2 (Mascot): Halfway daily goal (50%)
    const halfGoal = Math.max(1, Math.floor(goalGlasses / 2));
    const badge2Unlocked = todayTotalGlasses >= halfGoal;
    const badge2Progress = Math.min(100, Math.round((todayTotalGlasses / halfGoal) * 100));

    // Badge 3 (Clock): 100% daily goal completed
    const badge3Unlocked = todayTotalGlasses >= goalGlasses;
    const badge3Progress = Math.min(100, Math.round((todayTotalGlasses / goalGlasses) * 100));

    // Badge 4 (Waves): Streak >= 3 or lifetime total >= 20
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

    return {
      totalGlasses,
      xpPoints,
      currentStreak,
      unlockedCount,
      badges: {
        glass: { unlocked: badge1Unlocked, progress: badge1Progress },
        mascot: { unlocked: badge2Unlocked, progress: badge2Progress },
        clock: { unlocked: badge3Unlocked, progress: badge3Progress },
        waves: { unlocked: badge4Unlocked, progress: badge4Progress },
      },
    };
  }, [logs, todayTotalGlasses, goalGlasses]);

  if (!isOpen) return null;

  const handleNextScreen = () => {
    if (!selectedScreen) return;
    const keys: BrandScreenKey[] = ['glass', 'mascot', 'clock', 'waves'];
    const idx = keys.indexOf(selectedScreen);
    const nextIdx = (idx + 1) % keys.length;
    setSelectedScreen(keys[nextIdx]);
  };

  const handlePrevScreen = () => {
    if (!selectedScreen) return;
    const keys: BrandScreenKey[] = ['glass', 'mascot', 'clock', 'waves'];
    const idx = keys.indexOf(selectedScreen);
    const prevIdx = (idx - 1 + keys.length) % keys.length;
    setSelectedScreen(keys[prevIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative w-full max-w-md rounded-[32px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xl p-5 sm:p-6 my-auto text-right overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Soft blue glow backdrop */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#2D9CFF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#334155] z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC]">
                نشان‌ها و دستاوردهای نوش
              </h3>
              <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                گیمیفیکیشن و صفحات هویت برند
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F2F6FA] dark:bg-[#0B192C] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 transition-opacity cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-3 space-y-4 no-scrollbar flex-1 z-10">
          {/* Main User Level & Stats Overview */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#2D9CFF] via-[#1E70E8] to-[#2D9CFF] text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-2xs">
                  سطح شما در نوش
                </span>
                <h4 className="text-lg font-black text-white">
                  {stats.unlockedCount === 4
                    ? '🌊 استاد اقیانوس تداوم'
                    : stats.unlockedCount >= 2
                    ? '✨ همراه شاداب نوش'
                    : '💧 رهروی آغازین سلامتی'}
                </h4>
              </div>

              <div className="text-center bg-white/15 px-3 py-1.5 rounded-2xl backdrop-blur-2xs border border-white/20">
                <span className="text-[10px] block text-[#E6F4FF]">امتیاز قطره</span>
                <span className="text-base font-black text-white">{formatNumber(stats.xpPoints)} 💧</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/15 text-center">
              <div className="p-1.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-[#E6F4FF] block">نشان‌های بازشده</span>
                <span className="text-xs font-black text-white">{formatNumber(stats.unlockedCount)} از ۴</span>
              </div>
              <div className="p-1.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-[#E6F4FF] block">رگه تداوم (Streak)</span>
                <span className="text-xs font-black text-white">{formatNumber(stats.currentStreak)} روز 🔥</span>
              </div>
              <div className="p-1.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-[#E6F4FF] block">کل لیوان‌ها</span>
                <span className="text-xs font-black text-white">{formatNumber(Math.round(stats.totalGlasses))} لیوان</span>
              </div>
            </div>
          </div>

          {/* Section: The 4 Brand Screen Badges */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-sm font-bold text-[#1E293B] dark:text-[#F8FAFC]">
                ۴ مرحله و صفحه اصلی برند نوش:
              </h4>
              <span className="text-[11px] text-[#2D9CFF] font-medium">
                برای مشاهده صفحه کامل کلیک کنید
              </span>
            </div>

            {/* 2x2 Grid of Brand Screens */}
            <div className="grid grid-cols-2 gap-3">
              {(['glass', 'mascot', 'clock', 'waves'] as BrandScreenKey[]).map((key) => {
                const b = stats.badges[key];
                return (
                  <BrandScreenCard
                    key={key}
                    screenKey={key}
                    isUnlocked={b.unlocked}
                    progressPercent={b.progress}
                    onClick={() => setSelectedScreen(key)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
          با هر لیوان آبی که می‌نوشی، نشان‌های بعدی آزاد شده و سلامتی‌ات پایدارتر می‌شود 💙
        </div>
      </motion.div>

      {/* Full Screen Brand View Modal when a card is clicked */}
      <BrandFullScreenModal
        screenKey={selectedScreen}
        isOpen={Boolean(selectedScreen)}
        onClose={() => setSelectedScreen(null)}
        isUnlocked={selectedScreen ? stats.badges[selectedScreen].unlocked : false}
        progressPercent={selectedScreen ? stats.badges[selectedScreen].progress : 0}
        onNext={handleNextScreen}
        onPrev={handlePrevScreen}
      />
    </div>
  );
};
