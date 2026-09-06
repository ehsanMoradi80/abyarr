import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Flame, Award, ChevronLeft, Check, Share2, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CelebrationModalPayload } from '../types';
import { CELEBRATION_IMAGES } from '../assets/celebrationAssets';
import { STREAK_TARGET_OPTIONS, StreakTargetOption, getNextStreakTarget } from '../data/badges';
import { formatNumber } from '../constants/strings';
import { WaterAlarmAudioService } from '../services/audioAlarm';

interface CelebrationMotivationModalProps {
  payload: CelebrationModalPayload | null;
  targetStreakDays: number;
  onSetTargetStreak: (days: number) => void;
  onClose: () => void;
}

export const CelebrationMotivationModal: React.FC<CelebrationMotivationModalProps> = ({
  payload,
  targetStreakDays,
  onSetTargetStreak,
  onClose,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<number>(targetStreakDays);
  const [isUpgraded, setIsUpgraded] = useState(false);

  useEffect(() => {
    if (payload) {
      // Play appropriate gamification sound effect
      if (payload.type === 'badge_unlocked' || payload.type === 'milestone_unlocked') {
        WaterAlarmAudioService.playBadgeUnlockedSound();
      } else {
        WaterAlarmAudioService.playCelebrationFanfare();
      }

      // Trigger confetti on modal open
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#2D9CFF', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'],
      });
      setSelectedTarget(targetStreakDays);
      setIsUpgraded(false);
    }
  }, [payload, targetStreakDays]);

  if (!payload) return null;

  // Resolve appropriate mascot image based on payload type or imageKey
  let mascotImage = CELEBRATION_IMAGES.cheer;
  if (payload.imageKey && CELEBRATION_IMAGES[payload.imageKey]) {
    mascotImage = CELEBRATION_IMAGES[payload.imageKey];
  } else if (payload.type === 'badge_unlocked') {
    mascotImage = CELEBRATION_IMAGES.badgeTrophy;
  } else if (payload.type === 'milestone_unlocked') {
    mascotImage = CELEBRATION_IMAGES.milestoneDiamond;
  } else if (payload.type === 'streak_target_completed') {
    mascotImage = CELEBRATION_IMAGES.streakUpgrade;
  } else if (payload.type === 'streak_progress' || payload.type === 'streak_maintained') {
    mascotImage = CELEBRATION_IMAGES.streakFire;
  }

  const currentStreak = payload.currentStreak || 1;
  const isTargetCompleted = payload.type === 'streak_target_completed';
  const nextTargetOption = getNextStreakTarget(currentStreak);

  const handleApplyTargetUpgrade = (option: StreakTargetOption) => {
    setSelectedTarget(option.days);
    onSetTargetStreak(option.days);
    setIsUpgraded(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: [option.color, '#2D9CFF', '#F59E0B'],
    });
  };

  const handleShare = async () => {
    const text = `🎉 دستاورد جدید در برنامه «نوش»: ${payload.title} - ${payload.subtitle} 💧✨`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'دستاورد تندرستی در نوش',
          text,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md my-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xl overflow-hidden text-[#1E293B] dark:text-[#F8FAFC]"
        >
          {/* Top Decorative Banner */}
          <div className="relative h-28 bg-gradient-to-r from-[#2D9CFF] via-[#56B7FF] to-[#0066CC] overflow-hidden flex items-center justify-between px-5">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            
            {/* Header Tag */}
            <div className="z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {payload.type === 'badge_unlocked' && 'نشان جدید باز شد! 🏅'}
                {payload.type === 'milestone_unlocked' && 'فتح مایل‌استون 💎'}
                {payload.type === 'streak_target_completed' && 'هدف استریک تکمیل شد! 🏆'}
                {payload.type === 'streak_progress' && 'پیشرفت عالی استریک 🔥'}
                {payload.type === 'streak_maintained' && 'تداوم زنجیره سلامت ✨'}
              </span>
            </div>

            {/* Actions */}
            <div className="z-10 flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
                title="اشتراک‌گذاری"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
                title="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central 3D Mascot Image */}
          <div className="relative -mt-16 flex justify-center px-4">
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white dark:border-[#1E293B] shadow-xl bg-white dark:bg-[#0B192C]"
            >
              <img
                src={mascotImage}
                alt="کاراکتر شاداب نوش"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Main Content Info */}
          <div className="p-5 text-center space-y-4">
            {/* Title and Subtitle */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] dark:text-[#F8FAFC]">
                {payload.title}
              </h2>
              <p className="text-sm font-bold text-[#64748B] dark:text-[#94A3B8]">
                {payload.subtitle}
              </p>
            </div>

            {/* Badge Title & XP Reward if available */}
            {payload.badgeTitle && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#E6F4FF] via-[#D5EDFF] to-[#E6F4FF] dark:from-[#1E3A5F]/70 dark:to-[#172E4C]/70 border border-[#2D9CFF]/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-right">
                  <span className="text-2xl">{payload.iconEmoji || '🏅'}</span>
                  <div>
                    <span className="text-xs font-black block text-[#1E293B] dark:text-[#F8FAFC]">
                      {payload.badgeTitle}
                    </span>
                    {payload.badgeDescription && (
                      <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block">
                        {payload.badgeDescription}
                      </span>
                    )}
                  </div>
                </div>

                {payload.xpGained && (
                  <div className="px-3 py-1 rounded-xl bg-[#2D9CFF] text-white text-xs font-black shadow-xs flex items-center gap-1">
                    <span>+{formatNumber(payload.xpGained)}</span>
                    <span className="text-[10px]">XP</span>
                  </div>
                )}
              </div>
            )}

            {/* Streak Progress Box if relevant */}
            {(payload.type === 'streak_progress' || payload.type === 'streak_maintained' || payload.type === 'streak_target_completed') && (
              <div className="p-3.5 rounded-2xl bg-[#FEF3C7]/80 dark:bg-[#78350F]/20 border border-[#F59E0B]/30 flex items-center justify-between text-right">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shadow-xs">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#92400E] dark:text-[#FDE68A] block">
                      زنجیره تداوم شما: {formatNumber(currentStreak)} روز
                    </span>
                    <span className="text-[11px] text-[#B45309] dark:text-[#FCD34D]">
                      هدف فعلی: {formatNumber(targetStreakDays)} روز پیوسته
                    </span>
                  </div>
                </div>

                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-white/80 dark:bg-[#1E293B] text-[#D97706] dark:text-[#FBBF24] border border-[#F59E0B]/30">
                  {Math.min(100, Math.round((currentStreak / targetStreakDays) * 100))}%
                </span>
              </div>
            )}

            {/* Streak Target Upgrade / Picker Section */}
            <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] space-y-2.5 text-right">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                  <Award className="w-4 h-4 text-[#2D9CFF]" />
                  <span>
                    {isTargetCompleted ? 'انتخاب چالش استریک بزرگتر 🚀' : 'هدف‌گذاری استریک با پاداش XP بالا'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md">
                  امتیاز تصاعدی ✨
                </span>
              </div>

              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                با انتخاب هدف استریک بالاتر، پاداش‌های XP و نشان‌های افتخار بزرگتری دریافت می‌کنی:
              </p>

              {/* Grid of Streak Target Choices */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {STREAK_TARGET_OPTIONS.map((opt) => {
                  const isSelected = selectedTarget === opt.days;
                  const isReached = currentStreak >= opt.days;

                  return (
                    <button
                      key={opt.days}
                      onClick={() => handleApplyTargetUpgrade(opt)}
                      className={`p-2.5 rounded-2xl border text-right transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2D9CFF] bg-[#E6F4FF] dark:bg-[#1E3A5F] ring-2 ring-[#2D9CFF]/30 shadow-xs'
                          : 'border-[#CBD5E1] dark:border-[#475569] bg-white dark:bg-[#0B192C] hover:border-[#2D9CFF]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{opt.icon}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#2D9CFF]/15 text-[#0066CC] dark:text-[#8ED3FF]">
                          +{formatNumber(opt.bonusXp)} XP
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC] block leading-tight">
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

              {isUpgraded && (
                <div className="p-2 rounded-xl bg-[#D1FAE5] dark:bg-[#064E3B]/40 text-[#065F46] dark:text-[#A7F3D0] text-center text-xs font-bold animate-pulse">
                  ✓ هدف استریک با موفقیت به {formatNumber(selectedTarget)} روز ارتقا یافت!
                </div>
              )}
            </div>

            {/* Bottom Action Button */}
            <button
              onClick={onClose}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2D9CFF] to-[#0066CC] hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
            >
              <span>ادامه با انرژی و انگیزه 💧</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
