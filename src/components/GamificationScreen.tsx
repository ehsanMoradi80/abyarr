import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Flame,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Award,
  CheckCircle2,
  Lock,
  Check,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { BRAND_SCREENS_CONFIG } from './BrandScreens';
import { BrandScreenKey } from '../types';
import { computeAchievements, AchievementBadge, STREAK_TARGET_OPTIONS } from '../data/badges';
import { formatNumber } from '../constants/strings';
import { CELEBRATION_IMAGES } from '../assets/celebrationAssets';
import { CustomBadgeVector } from './Badges/CustomBadgeVector';
import { WaterAlarmAudioService } from '../services/audioAlarm';

type FilterCategory = 'all' | 'milestone' | 'streak' | 'volume' | 'timing';

export const GamificationScreen: React.FC = () => {
  const {
    todayTotalGlasses,
    goalGlasses,
    logs,
    partner,
    targetStreakDays,
    setTargetStreakDays,
    triggerCelebrationModal,
    setSelectedBrandKey,
    setCurrentScreen,
    startTour,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  const { badges, streakDays, totalXP, unlockedCount } = computeAchievements(
    logs,
    todayTotalGlasses,
    goalGlasses,
    partner
  );

  const filteredBadges =
    activeFilter === 'all'
      ? badges
      : badges.filter((b) => b.category === activeFilter);

  const handleOpenBrand = (key: BrandScreenKey) => {
    setSelectedBrandKey(key);
    setCurrentScreen('brand-detail');
  };

  const handleCelebrate = () => {
    WaterAlarmAudioService.playCelebrationFanfare();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2D9CFF', '#56B7FF', '#8ED3FF', '#10B981', '#F59E0B'],
    });
  };

  const handlePreviewCelebration = (badge?: AchievementBadge) => {
    WaterAlarmAudioService.playCelebrationFanfare();
    if (badge) {
      triggerCelebrationModal({
        type: badge.category === 'milestone' ? 'milestone_unlocked' : 'badge_unlocked',
        title: `نشان افتخار: ${badge.title} 🏅`,
        subtitle: badge.description,
        badgeTitle: badge.title,
        badgeDescription: badge.description,
        iconEmoji: badge.iconEmoji,
        xpGained: badge.xp,
        currentStreak: streakDays,
        targetStreak: targetStreakDays,
        imageKey: badge.category === 'milestone' ? 'milestoneDiamond' : 'badgeTrophy',
      });
    } else {
      triggerCelebrationModal({
        type: 'streak_target_completed',
        title: `هدف استریک ${formatNumber(targetStreakDays)} روزه! 🏆`,
        subtitle: 'شما با تداوم در نوشیدن آب به سطح عالی از تندرستی دست یافته‌اید.',
        xpGained: 500,
        currentStreak: Math.max(streakDays, targetStreakDays),
        targetStreak: targetStreakDays,
        showUpgradeTarget: true,
        imageKey: 'streakUpgrade',
      });
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#F2F6FA] dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300">
      {/* Top Header - Icon Only Back Button */}
      <div className="w-full max-w-md mx-auto pt-2 mb-4">
        <div className="flex items-center justify-between">
          <button
            id="gamification-back-btn"
            onClick={() => setCurrentScreen('main')}
            aria-label="بازگشت"
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] shadow-2xs hover:border-[#2D9CFF] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <h1 className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC]">
            دستاوردها و نشان‌ها
          </h1>

          <div className="flex items-center gap-1.5">
            <button
              onClick={startTour}
              aria-label="راهنما"
              className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:text-[#2D9CFF] hover:border-[#2D9CFF] shadow-2xs transition-all cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={handleCelebrate}
              aria-label="جشن افتخار"
              className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#F59E0B] hover:border-[#F59E0B] shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-md mx-auto space-y-4 pb-8">
        {/* Compact Level & XP Summary Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#2D9CFF] via-[#0066CC] to-[#004B99] text-white shadow-lg shadow-[#2D9CFF]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs text-[#E6F4FF] block font-medium">مجموع نشان‌ها</span>
                <span className="text-sm font-black text-white">
                  {formatNumber(unlockedCount)} از {formatNumber(badges.length)} دریافت شده
                </span>
              </div>
            </div>

            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs border border-white/30">
              سطح {formatNumber(Math.max(1, Math.floor(totalXP / 100)))}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 relative z-10">
            <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#E6F4FF] block">امتیاز (XP)</span>
                <span className="text-base font-black text-white">{formatNumber(totalXP)}</span>
              </div>
              <span className="text-lg">💧</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#E6F4FF] block">زنجیره مداوم</span>
                <span className="text-base font-black text-white">{formatNumber(streakDays)} روز</span>
              </div>
              <Flame className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
            </div>
          </div>
        </div>

        {/* Graphical Icon Badges Showcase (بدون متن اضافه) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
              <Sparkles className="w-4 h-4 text-[#2D9CFF]" />
              <span>ویترین آیکون‌های وکتور اختصاصی نشان‌ها</span>
            </div>
            <span className="text-[11px] font-bold text-[#0066CC] dark:text-[#56B7FF] px-2 py-0.5 rounded-full bg-[#E6F4FF] dark:bg-[#1E3A5F]">
              {formatNumber(unlockedCount)} / {formatNumber(badges.length)}
            </span>
          </div>

          {/* Minimalist Graphic Icon Grid with Custom Vector Badges */}
          <div className="grid grid-cols-5 gap-2.5">
            {badges.map((b) => {
              const isUnlocked = b.unlocked;
              return (
                <motion.button
                  key={b.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (b.brandKey) {
                      handleOpenBrand(b.brandKey);
                    } else {
                      setSelectedBadge(b);
                    }
                  }}
                  className={`aspect-square rounded-2xl relative p-1.5 flex items-center justify-center transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-[#E6F4FF] to-[#CBE8FF] dark:from-[#1E3A5F] dark:to-[#172E4C] border-2 border-[#2D9CFF] shadow-xs shadow-[#2D9CFF]/30'
                      : 'bg-[#F2F6FA] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] opacity-80'
                  }`}
                  title={b.title}
                >
                  {/* Custom Vector Badge Art */}
                  <CustomBadgeVector badgeId={b.id} unlocked={isUnlocked} size={42} />

                  {/* Tiny Status Indicator Badge */}
                  <div className="absolute -top-1 -right-1">
                    {isUnlocked ? (
                      <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                        ✓
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[#64748B] text-white flex items-center justify-center shadow-xs">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Audio Effects Preview Bar */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
            <Zap className="w-4 h-4 text-[#2D9CFF]" />
            <span>آزمایش افکت‌های صوتی</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                WaterAlarmAudioService.playCelebrationFanfare();
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.7 },
                  colors: ['#2D9CFF', '#F59E0B', '#10B981'],
                });
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#56B7FF] text-[11px] font-bold hover:bg-[#2D9CFF] hover:text-white transition-all cursor-pointer flex items-center gap-1"
            >
              <span>🎉 صدای سلبریشن</span>
            </button>

            <button
              onClick={() => {
                WaterAlarmAudioService.playStreakBrokenSadSound();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8] text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>📉 صدای قطع استریک</span>
            </button>
          </div>
        </div>

        {/* 4 Flagship Illustrated Milestones */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
              <Award className="w-4 h-4 text-[#2D9CFF]" />
              <span>مدال‌های شاخص سلامت</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['glass', 'mascot', 'clock', 'waves'] as BrandScreenKey[]).map((key) => {
              const cfg = BRAND_SCREENS_CONFIG[key];
              const b = badges.find((item) => item.brandKey === key);
              const isUnlocked = b?.unlocked || false;
              const isDarkBlueWave = key === 'waves';

              return (
                <motion.div
                  key={key}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenBrand(key)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between cursor-pointer transition-all duration-200 shadow-2xs ${
                    isDarkBlueWave
                      ? 'bg-gradient-to-b from-[#56B7FF] to-[#1E70E8] text-white border-[#2D9CFF]'
                      : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] hover:border-[#2D9CFF]'
                  }`}
                  style={{ minHeight: '140px' }}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[10px] font-bold opacity-80">سطح {formatNumber(cfg.level)}</span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    ) : (
                      <Lock className="w-3 h-3 text-[#94A3B8]" />
                    )}
                  </div>

                  <div className="my-1 scale-85 flex items-center justify-center">
                    {cfg.renderGraphic(55)}
                  </div>

                  <span className="text-[11px] font-black tracking-tight leading-tight line-clamp-1">
                    {cfg.badgeTitle.replace('نشان ', '')}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Streak Target Goal & XP Multiplier Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
              <Flame className="w-4 h-4 text-[#F59E0B] fill-current" />
              <span>چالش هدف استریک و پاداش تصاعدی</span>
            </div>
            <button
              onClick={() => handlePreviewCelebration()}
              className="text-[11px] font-bold text-[#0066CC] dark:text-[#56B7FF] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>پیش‌نمایش جشن</span>
            </button>
          </div>

          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            با انتخاب استریک‌های طولانی‌تر، انگیزه و پاداش‌های چندبرابری XP کسب می‌کنی:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STREAK_TARGET_OPTIONS.map((opt) => {
              const isSelected = targetStreakDays === opt.days;
              const isPassed = streakDays >= opt.days;

              return (
                <button
                  key={opt.days}
                  onClick={() => setTargetStreakDays(opt.days)}
                  className={`p-2.5 rounded-2xl border text-right transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#2D9CFF] bg-[#E6F4FF] dark:bg-[#1E3A5F] ring-2 ring-[#2D9CFF]/30 shadow-xs'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B192C] hover:border-[#2D9CFF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{opt.icon}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#2D9CFF]/15 text-[#0066CC] dark:text-[#8ED3FF]">
                      +{formatNumber(opt.bonusXp)} XP
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC] block">
                      {opt.title}
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">
                      {opt.badgeTitle}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-[#2D9CFF] text-white flex items-center justify-center text-[9px]">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'همه', icon: '🏆' },
            { id: 'streak', label: 'زنجیره', icon: '🔥' },
            { id: 'volume', label: 'حجم مصرف', icon: '🌊' },
            { id: 'timing', label: 'زمان‌بندی', icon: '⏰' },
            { id: 'milestone', label: 'شاخص‌ها', icon: '⭐' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as FilterCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === f.id
                  ? 'bg-[#2D9CFF] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:border-[#2D9CFF]'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredBadges.map((badge) => (
            <motion.div
              key={badge.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                if (badge.brandKey) {
                  handleOpenBrand(badge.brandKey);
                } else {
                  setSelectedBadge(badge);
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs ${
                badge.unlocked
                  ? 'bg-white dark:bg-[#1E293B] border-[#2D9CFF]/30 dark:border-[#2D9CFF]/30 hover:border-[#2D9CFF]'
                  : 'bg-slate-50/70 dark:bg-[#111C2B] border-[#E2E8F0] dark:border-[#334155] opacity-80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <CustomBadgeVector badgeId={badge.id} unlocked={badge.unlocked} size={44} />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                      {badge.title}
                    </h4>
                    {badge.unlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    )}
                  </div>

                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] line-clamp-1">
                    {badge.description}
                  </p>

                  {/* Tiny progress bar */}
                  {!badge.unlocked && (
                    <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#2D9CFF] rounded-full transition-all"
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-left shrink-0">
                <span className="text-[11px] font-black text-[#0066CC] dark:text-[#56B7FF] block">
                  +{formatNumber(badge.xp)} XP
                </span>
                {!badge.unlocked && (
                  <span className="text-[10px] text-[#94A3B8]">
                    {formatNumber(badge.progressPercent)}٪
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Badge Artwork Info Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] p-5 text-center space-y-4 shadow-xl"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center border-2 border-[#2D9CFF]/30 shadow-md bg-[#E6F4FF] dark:bg-[#0B192C]">
                <CustomBadgeVector badgeId={selectedBadge.id} unlocked={selectedBadge.unlocked} size={76} />
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <h3 className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC]">
                    {selectedBadge.title}
                  </h3>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {selectedBadge.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F2F6FA] dark:bg-[#0B192C] text-xs font-bold text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-between">
                <span>پاداش دستیابی:</span>
                <span className="px-2.5 py-1 rounded-xl bg-[#2D9CFF] text-white">
                  +{formatNumber(selectedBadge.xp)} XP
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    const b = selectedBadge;
                    setSelectedBadge(null);
                    handlePreviewCelebration(b);
                  }}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-[#2D9CFF] to-[#0066CC] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>مشاهده جشن افتخار این نشان 🎉</span>
                </button>

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8] font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
