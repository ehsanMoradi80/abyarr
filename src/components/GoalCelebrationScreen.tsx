import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Sparkles, ChevronRight, ChevronLeft, Award, Flame, ArrowUpRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { CELEBRATION_IMAGES } from '../assets/celebrationAssets';
import { formatNumber, formatGlasses } from '../constants/strings';
import { computeAchievements, STREAK_TARGET_OPTIONS, getNextStreakTarget } from '../data/badges';
import { WaterAlarmAudioService } from '../services/audioAlarm';

interface GoalCelebrationScreenProps {
  onClose?: () => void;
}

export const GoalCelebrationScreen: React.FC<GoalCelebrationScreenProps> = ({ onClose }) => {
  const {
    todayTotalGlasses,
    goalGlasses,
    logs,
    partner,
    targetStreakDays,
    setTargetStreakDays,
    setCurrentScreen,
    showToast,
  } = useApp();

  const [activeSlide, setActiveSlide] = useState<number>(0);

  const { streakDays } = computeAchievements(logs, todayTotalGlasses, goalGlasses, partner);

  // Trigger celebratory confetti & audio fanfare on screen entry
  useEffect(() => {
    WaterAlarmAudioService.playCelebrationFanfare();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#2D9CFF', '#56B7FF', '#8ED3FF', '#F4C95D', '#34D399'],
    });
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setCurrentScreen('main');
    }
  };

  const handleShare = async () => {
    const text = ` امروز تمام هدف نوشیدن آب روزانه‌ام (${formatNumber(todayTotalGlasses)} لیوان) رو در برنامه «نوش» کامل کردم و زنجیره استریکم به ${formatNumber(streakDays)} روز رسید! `;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'دستاورد نوشیدن آب در نوش',
          text,
          url: window.location.href,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(text);
      showToast('متن دستاورد کپی شد ');
    }
  };

  const nextTarget = getNextStreakTarget(streakDays);

  const slides = [
    // Slide 0: جشن و تبریک اولیه
    {
      id: 'cheer',
      title: 'آفرین به اراده‌ات! ',
      subtitle: 'گام مهمی برای تندرستی و نشاط برداشتی',
      image: CELEBRATION_IMAGES.cheer,
      alt: 'کاراکتر شاداب نوش',
      bgTheme: 'from-[#E6F4FF] via-[#D0ECFF] to-[#F2F6FA] dark:from-[#0B192C] dark:via-[#172E4C] dark:to-[#0B192C]',
      showMascotImage: true,
    },
    // Slide 1: حفظ استرایک و تداوم زنجیره
    {
      id: 'streak_saved',
      title: 'شعله استریکت شعله‌ور ماند! ',
      subtitle: `با تکمیل امروز، زنجیره ${formatNumber(streakDays)} روزه تو تثبیت شد`,
      image: CELEBRATION_IMAGES.streakFire,
      alt: 'آتش زنجیره استریک',
      bgTheme: 'from-[#FEF3C7] via-[#FDE68A] to-[#E6F4FF] dark:from-[#0B192C] dark:via-[#78350F]/40 dark:to-[#0B192C]',
      showMascotImage: true,
    },
    // Slide 2: قدردانی و سلامت بدن
    {
      id: 'heart_love',
      title: 'تو فوق‌العاده‌ای!',
      subtitle: 'بدنت ازت ممنونه ',
      image: CELEBRATION_IMAGES.heart,
      alt: 'آغوش قلب و آب',
      bgTheme: 'from-[#F0F7FF] via-[#E1F0FF] to-[#F2F6FA] dark:from-[#0B192C] dark:via-[#162D4A] dark:to-[#0B192C]',
      showMascotImage: true,
    },
    // Slide 3: آرامش شبانه
    {
      id: 'night_peace',
      title: 'استراحت کن قهرمان ',
      subtitle: 'فردا روز قشنگتریه ',
      image: CELEBRATION_IMAGES.sleep,
      alt: 'خواب آرام در شب',
      bgTheme: 'from-[#0B192C] via-[#10223D] to-[#081220] text-white',
      isNight: true,
      showMascotImage: true,
    },
    // Slide 4: خلاصه عملکرد و ارتقای هدف استریک
    {
      id: 'summary',
      title: 'عملکرد امروز و چالش بعدی ',
      subtitle: 'تداوم رمز اصلی سلامتی و شادابی است',
      bgTheme: 'from-[#E6F4FF] via-[#F2F6FA] to-[#E6F4FF] dark:from-[#0B192C] dark:via-[#1E293B] dark:to-[#0B192C]',
      isSummary: true,
    },
  ];


  const current = slides[activeSlide];

  return (
    <div
      id="goal-celebration-screen"
      className={`fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b ${current.bgTheme} transition-colors duration-500 overflow-y-auto select-none`}
    >
      {/* Top Header Controls */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2">
        <button
          id="close-celebration-btn"
          onClick={handleClose}
          aria-label="بستن"
          className="w-10 h-10 rounded-full bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-md border border-white/50 dark:border-white/10 flex items-center justify-center text-[#1E293B] dark:text-[#F8FAFC] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-2xs">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === idx
                  ? 'w-6 bg-[#2D9CFF]'
                  : 'w-2 bg-[#CBD5E1] dark:bg-[#475569] hover:bg-[#8ED3FF]'
              }`}
              aria-label={`اسلاید ${idx + 1}`}
            />
          ))}
        </div>

        <button
          id="share-celebration-btn"
          onClick={handleShare}
          aria-label="اشتراک‌گذاری"
          className="w-10 h-10 rounded-full bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-md border border-white/50 dark:border-white/10 flex items-center justify-center text-[#2D9CFF] dark:text-[#56B7FF] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Slide Carousel Content */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center my-4 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full flex flex-col items-center text-center space-y-4"
          >
            {/* Graphic Illustration or Summary Display */}
            {current.showMascotImage && current.image && (
              <motion.div
                className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-3xl overflow-hidden shadow-xl border-4 border-white/70 dark:border-white/10 bg-white/30 dark:bg-black/30"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <img
                  src={current.image}
                  alt={current.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            )}

            {/* Slide 4: Interactive Summary Card */}
            {current.isSummary && (
              <div className="w-full space-y-4">
                {/* Big Circular Glass Gauge */}
                <div className="relative w-48 h-48 mx-auto rounded-full bg-gradient-to-b from-[#E6F4FF] to-white dark:from-[#1E3A5F] dark:to-[#0B192C] border-4 border-[#2D9CFF] dark:border-[#56B7FF] flex flex-col items-center justify-center shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-[#2D9CFF]/15 flex items-center justify-center text-[#2D9CFF] mb-1">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-4xl font-black text-[#1E293B] dark:text-[#F8FAFC]">
                    {formatGlasses(todayTotalGlasses)}
                  </span>
                  <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                    آب گوارا نوشیده شد
                  </span>
                </div>

                {/* Summary Info Cards */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-[#E2E8F0] dark:border-[#334155] shadow-xs text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mb-1">
                      <Award className="w-4 h-4 text-[#2D9CFF]" />
                      <span>هدف روزانه</span>
                    </div>
                    <div className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC]">
                      {formatNumber(goalGlasses)} لیوان
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-[#E2E8F0] dark:border-[#334155] shadow-xs text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mb-1">
                      <Flame className="w-4 h-4 text-[#FF9500]" />
                      <span>زنجیره تداوم</span>
                    </div>
                    <div className="text-base font-black text-[#FF9500]">
                      {formatNumber(streakDays)} روز متوالی
                    </div>
                  </div>
                </div>

                {/* Streak Preservation & Next Target Incentive */}
                <div className="p-3.5 rounded-2xl bg-[#E6F4FF]/90 dark:bg-[#1E3A5F]/90 border border-[#2D9CFF]/30 text-right space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0066CC] dark:text-[#8ED3FF] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#2D9CFF]" />
                      <span>هدف استریک شما: {formatNumber(targetStreakDays)} روز پیوسته</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-md">
                      تضمین تداوم 
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {STREAK_TARGET_OPTIONS.slice(0, 4).map((opt) => (
                      <button
                        key={opt.days}
                        onClick={() => {
                          setTargetStreakDays(opt.days);
                          showToast(`هدف به ${opt.days} روز ارتقا یافت `);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                          targetStreakDays === opt.days
                            ? 'bg-[#2D9CFF] text-white shadow-xs'
                            : 'bg-white/80 dark:bg-[#0B192C]/80 border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC]'
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.days} روزه</span>
                        <span className="text-[9px] opacity-80">(+{formatNumber(opt.bonusXp)} XP)</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Typography Section */}
            <div className="space-y-1.5 px-2">
              <h2
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  current.isNight ? 'text-white' : 'text-[#1E293B] dark:text-[#F8FAFC]'
                }`}
              >
                {current.title}
              </h2>
              <p
                className={`text-sm sm:text-base font-bold ${
                  current.isNight ? 'text-[#8ED3FF]' : 'text-[#2D9CFF] dark:text-[#56B7FF]'
                }`}
              >
                {current.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Interactive Navigation & Action Button */}
      <div className="w-full max-w-md mx-auto space-y-2.5 pb-2">
        <div className="flex items-center gap-2">
          {/* Previous Slide Button */}
          {activeSlide > 0 && (
            <button
              onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
              className="h-13 px-4 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC] font-bold text-sm flex items-center justify-center gap-1 hover:border-[#2D9CFF] transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <ChevronRight className="w-5 h-5" />
              <span>قبلی</span>
            </button>
          )}

          {/* Next Slide or Continue CTA */}
          {activeSlide < slides.length - 1 ? (
            <button
              id="celebration-next-btn"
              onClick={() => setActiveSlide((prev) => prev + 1)}
              className="flex-1 h-13 rounded-2xl bg-gradient-to-r from-[#2D9CFF] to-[#56B7FF] text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-98"
            >
              <span>بعدی</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              id="celebration-finish-btn"
              onClick={handleClose}
              className="flex-1 h-13 rounded-2xl bg-gradient-to-r from-[#2D9CFF] via-[#0066CC] to-[#2D9CFF] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-98"
            >
              <span>عالی بود! ادامه بده </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
