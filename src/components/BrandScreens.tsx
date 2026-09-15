import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Trophy, CheckCircle2, ArrowRight, Share2, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  WaterGlassGraphic,
  WaterMascotGraphic,
  WaterClockGraphic,
  WaterWavesGraphic,
} from './BrandIllustrations';
import { formatNumber } from '../constants/strings';

export type BrandScreenKey = 'glass' | 'mascot' | 'clock' | 'waves';

export interface BrandScreenConfig {
  id: BrandScreenKey;
  level: number;
  badgeTitle: string;
  slogan: string;
  subtext: string;
  benefit: string;
  requirement: string;
  xpPoints: number;
  bgGradientLight: string;
  bgGradientDark: string;
  renderGraphic: (size?: number) => React.ReactNode;
}

export const BRAND_SCREENS_CONFIG: Record<BrandScreenKey, BrandScreenConfig> = {
  glass: {
    id: 'glass',
    level: 1,
    badgeTitle: 'نشان قطره آغازین',
    slogan: 'هر قطره، یک قدم به سلامتی',
    subtext: 'اولین لیوان آب، بیداری انرژی و طراوت سلول‌های بدن شماست.',
    benefit: 'تنظیم متابولیسم، شفافیت پوست و هیدراتاسیون پایه',
    requirement: 'نوشیدن اولین لیوان آب روزانه',
    xpPoints: 25,
    bgGradientLight: 'from-[#EBF5FF] via-[#F2F8FD] to-[#FFFFFF]',
    bgGradientDark: 'from-[#10243E] via-[#0D1C30] to-[#081220]',
    renderGraphic: (size = 140) => <WaterGlassGraphic size={size} />,
  },
  mascot: {
    id: 'mascot',
    level: 2,
    badgeTitle: 'نشان نشاط و انرژی',
    slogan: 'آب بخور، حال خوبت رو بساز',
    subtext: 'وقتی بدنت پر از آب تازه است، خستگی از بین می‌رود و لبخند می‌زنی.',
    benefit: 'افزایش انرژی طبیعی، بهبود تمرکز و کاهش سردردهای روزانه',
    requirement: 'رسیدن به نیمی از هدف روزانه (۵۰٪)',
    xpPoints: 50,
    bgGradientLight: 'from-[#EBF5FF] via-[#F2F8FD] to-[#FFFFFF]',
    bgGradientDark: 'from-[#10243E] via-[#0D1C30] to-[#081220]',
    renderGraphic: (size = 140) => <WaterMascotGraphic size={size} />,
  },
  clock: {
    id: 'clock',
    level: 3,
    badgeTitle: 'نشان نظم و تعادل',
    slogan: 'یادآوری دوستانه: وقت آب خوردن',
    subtext: 'نوشیدن آب در فواصل زمانی منظم، بهترین جذب را در بدن تضمین می‌کند.',
    benefit: 'حفظ آب پایدار در طول روز و تنظیم سیستم گوارش',
    requirement: 'تکمیل ۱۰۰٪ هدف مصرف روزانه',
    xpPoints: 100,
    bgGradientLight: 'from-[#EBF5FF] via-[#F2F8FD] to-[#FFFFFF]',
    bgGradientDark: 'from-[#10243E] via-[#0D1C30] to-[#081220]',
    renderGraphic: (size = 140) => <WaterClockGraphic size={size} />,
  },
  waves: {
    id: 'waves',
    level: 4,
    badgeTitle: 'نشان اقیانوس تداوم',
    slogan: 'تداوم، کلید تغییر است',
    subtext: 'عادت‌های کوچک و مداوم روزانه، رودخانه‌ای خروشان از سلامتی می‌سازند.',
    benefit: 'تثبیت عادات سلامتی پایدار و انرژی دائم در کل زندگی',
    requirement: 'حفظ رگه تداوم (Streak) ۳ روزه یا بیشتر',
    xpPoints: 200,
    bgGradientLight: 'from-[#2D9CFF] via-[#1E70E8] to-[#1258C4]',
    bgGradientDark: 'from-[#0B3B75] via-[#082852] to-[#041630]',
    renderGraphic: (size = 140) => <WaterWavesGraphic size={size} />,
  },
};

interface BrandScreenCardProps {
  screenKey: BrandScreenKey;
  isUnlocked?: boolean;
  progressPercent?: number;
  onClick?: () => void;
  className?: string;
}

/**
 * Mobile Screen Preview (styled exactly as the 4 visual screens in the design sheet)
 */
export const BrandScreenCard: React.FC<BrandScreenCardProps> = ({
  screenKey,
  isUnlocked = false,
  progressPercent = 0,
  onClick,
  className = '',
}) => {
  const config = BRAND_SCREENS_CONFIG[screenKey];
  const isDarkBlueWave = screenKey === 'waves';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-[28px] border transition-all duration-300 flex flex-col items-center justify-between text-center p-5 select-none shadow-md ${
        isDarkBlueWave
          ? 'bg-gradient-to-b from-[#56B7FF] via-[#2D9CFF] to-[#1E70E8] text-white border-[#2D9CFF]'
          : 'bg-gradient-to-b from-[#EBF5FF] via-[#F4F9FF] to-[#FFFFFF] dark:from-[#1E293B] dark:via-[#162235] dark:to-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] border-[#CBE8FF] dark:border-[#334155]'
      } ${className}`}
      style={{ minHeight: '280px' }}
    >
      {/* Top Level / XP Ribbon */}
      <div className="w-full flex items-center justify-between mb-2">
        <span
          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
            isDarkBlueWave
              ? 'bg-white/20 text-white backdrop-blur-xs'
              : 'bg-[#2D9CFF]/15 text-[#0066CC] dark:bg-[#1E3A5F] dark:text-[#8ED3FF]'
          }`}
        >
          <Award className="w-3 h-3" />
          <span>سطح {formatNumber(config.level)}</span>
        </span>

        {isUnlocked ? (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isDarkBlueWave
                ? 'bg-white/25 text-white'
                : 'bg-[#10B981]/15 text-[#059669] dark:text-[#34D399]'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>کسب شده</span>
          </span>
        ) : (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isDarkBlueWave
                ? 'bg-white/10 text-white/80'
                : 'bg-slate-200 dark:bg-slate-700 text-[#64748B] dark:text-[#94A3B8]'
            }`}
          >
            {formatNumber(Math.round(progressPercent))}٪
          </span>
        )}
      </div>

      {/* Center Graphic */}
      <div className="my-auto py-2 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
        {config.renderGraphic(115)}
      </div>

      {/* Bottom Slogan and Blue Heart */}
      <div className="w-full mt-2 pt-1 flex flex-col items-center">
        <h4
          className={`text-sm font-black tracking-tight leading-snug px-1 ${
            isDarkBlueWave ? 'text-white' : 'text-[#1E293B] dark:text-[#F8FAFC]'
          }`}
        >
          {config.slogan}
        </h4>
        <span
          className={`text-sm mt-1.5 font-bold ${
            isDarkBlueWave ? 'text-[#E6F4FF]' : 'text-[#2D9CFF]'
          }`}
        >
          
        </span>
      </div>
    </motion.div>
  );
};

interface BrandFullScreenModalProps {
  screenKey: BrandScreenKey | null;
  isOpen: boolean;
  onClose: () => void;
  isUnlocked?: boolean;
  progressPercent?: number;
  onNext?: () => void;
  onPrev?: () => void;
}

/**
 * Full Immersive Screen for Brand Gamification Milestone & Story
 */
export const BrandFullScreenModal: React.FC<BrandFullScreenModalProps> = ({
  screenKey,
  isOpen,
  onClose,
  isUnlocked = true,
  progressPercent = 100,
  onNext,
  onPrev,
}) => {
  if (!isOpen || !screenKey) return null;

  const config = BRAND_SCREENS_CONFIG[screenKey];
  const isDarkBlueWave = screenKey === 'waves';

  const triggerCelebrate = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2D9CFF', '#56B7FF', '#8ED3FF', '#10B981', '#F59E0B'],
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative w-full max-w-sm rounded-[36px] overflow-hidden border shadow-2xl flex flex-col items-center text-center p-6 sm:p-7 select-none ${
            isDarkBlueWave
              ? 'bg-gradient-to-b from-[#56B7FF] via-[#2D9CFF] to-[#1E70E8] text-white border-[#2D9CFF]/50 shadow-[#1E70E8]/40'
              : 'bg-gradient-to-b from-[#EBF5FF] via-[#F4F9FF] to-[#FFFFFF] dark:from-[#1E293B] dark:via-[#162235] dark:to-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] border-[#CBE8FF] dark:border-[#334155]'
          }`}
        >
          {/* Soft background radial glows */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#2D9CFF]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar with Close button & Level Badge */}
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                isDarkBlueWave
                  ? 'bg-white/20 text-white backdrop-blur-xs'
                  : 'bg-[#2D9CFF]/15 text-[#0066CC] dark:bg-[#1E3A5F] dark:text-[#8ED3FF]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{config.badgeTitle} • سطح {formatNumber(config.level)}</span>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDarkBlueWave
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-slate-200/70 dark:bg-slate-800/70 hover:bg-slate-300 dark:hover:bg-slate-700 text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Illustration Hero */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="my-3 py-2 flex items-center justify-center"
          >
            {config.renderGraphic(150)}
          </motion.div>

          {/* Slogan Banner */}
          <div className="space-y-1.5 z-10">
            <h2
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                isDarkBlueWave ? 'text-white' : 'text-[#1E293B] dark:text-[#F8FAFC]'
              }`}
            >
              {config.slogan}
            </h2>
            <div className="text-lg text-[#2D9CFF] font-bold"></div>
          </div>

          {/* Subtext and Benefit Card */}
          <div
            className={`w-full mt-3 p-3.5 rounded-2xl text-right space-y-1.5 z-10 ${
              isDarkBlueWave
                ? 'bg-white/15 backdrop-blur-xs text-white border border-white/20'
                : 'bg-white dark:bg-[#0B192C]/80 border border-[#E2E8F0] dark:border-[#334155]'
            }`}
          >
            <p
              className={`text-xs font-semibold leading-relaxed ${
                isDarkBlueWave ? 'text-[#E6F4FF]' : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              {config.subtext}
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] font-bold border-t border-white/10 dark:border-slate-800">
              <span className={isDarkBlueWave ? 'text-white' : 'text-[#2D9CFF]'}>
                 شرط کسب: {config.requirement}
              </span>
              <span className={isDarkBlueWave ? 'text-[#E6F4FF]' : 'text-[#10B981]'}>
                +{formatNumber(config.xpPoints)} امتیاز قطره
              </span>
            </div>
          </div>

          {/* Progress / Status Bar */}
          <div className="w-full mt-3 space-y-1 z-10">
            <div className="flex items-center justify-between text-xs font-bold px-1">
              <span>{isUnlocked ? 'وضعیت: باز شده ' : 'پیشرفت تا باز شدن'}</span>
              <span>{isUnlocked ? '۱۰۰٪' : `${formatNumber(Math.round(progressPercent))}٪`}</span>
            </div>
            <div
              className={`w-full h-2.5 rounded-full overflow-hidden ${
                isDarkBlueWave ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isUnlocked
                    ? isDarkBlueWave
                      ? 'bg-white'
                      : 'bg-gradient-to-r from-[#10B981] to-[#34D399]'
                    : isDarkBlueWave
                    ? 'bg-[#E6F4FF]'
                    : 'bg-gradient-to-r from-[#2D9CFF] to-[#56B7FF]'
                }`}
                style={{ width: `${Math.min(100, Math.max(isUnlocked ? 100 : progressPercent, 5))}%` }}
              />
            </div>
          </div>

          {/* Actions: Celebrate / Next / Close */}
          <div className="w-full mt-4 flex items-center gap-2 z-10">
            <button
              onClick={triggerCelebrate}
              className={`flex-1 h-11 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer ${
                isDarkBlueWave
                  ? 'bg-white text-[#1E70E8] hover:bg-[#E6F4FF]'
                  : 'bg-[#2D9CFF] text-white hover:bg-[#1E70E8]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>جشن و شادباش </span>
            </button>

            {onNext && (
              <button
                onClick={onNext}
                className={`px-3.5 h-11 rounded-2xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isDarkBlueWave
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF]'
                }`}
                title="صفحه بعد"
              >
                <span>بعدی</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
