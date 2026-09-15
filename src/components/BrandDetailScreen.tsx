import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Sparkles, Trophy, CheckCircle2, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { BRAND_SCREENS_CONFIG } from './BrandScreens';
import { BrandScreenKey } from '../types';
import { formatNumber } from '../constants/strings';

const SCREEN_KEYS: BrandScreenKey[] = ['glass', 'mascot', 'clock', 'waves'];

export const BrandDetailScreen: React.FC = () => {
  const {
    selectedBrandKey,
    setSelectedBrandKey,
    setCurrentScreen,
    todayTotalGlasses,
    goalGlasses,
    logs,
  } = useApp();

  const currentKey = selectedBrandKey || 'glass';
  const config = BRAND_SCREENS_CONFIG[currentKey];
  const isDarkBlueWave = currentKey === 'waves';

  // Status calculation
  const isGlassUnlocked = logs.length > 0;
  const isMascotUnlocked = todayTotalGlasses >= goalGlasses * 0.5;
  const isClockUnlocked = todayTotalGlasses >= goalGlasses && goalGlasses > 0;
  const isWavesUnlocked = logs.length >= 3;

  const unlockedMap: Record<BrandScreenKey, boolean> = {
    glass: isGlassUnlocked,
    mascot: isMascotUnlocked,
    clock: isClockUnlocked,
    waves: isWavesUnlocked,
  };

  const isUnlocked = unlockedMap[currentKey];

  const handleBack = () => {
    setSelectedBrandKey(null);
    setCurrentScreen('gamification');
  };

  const currentIndex = SCREEN_KEYS.indexOf(currentKey);
  const handlePrevScreen = () => {
    if (currentIndex > 0) {
      setSelectedBrandKey(SCREEN_KEYS[currentIndex - 1]);
    }
  };
  const handleNextScreen = () => {
    if (currentIndex < SCREEN_KEYS.length - 1) {
      setSelectedBrandKey(SCREEN_KEYS[currentIndex + 1]);
    }
  };

  const triggerCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#2D9CFF', '#56B7FF', '#8ED3FF', '#10B981', '#F59E0B'],
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F6FA] dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300">
      {/* Top Header with Icon-Only Back Navigation */}
      <div className="w-full max-w-md mx-auto pt-2 mb-2">
        <div className="flex items-center justify-between">
          <button
            id="brand-detail-back-btn"
            onClick={handleBack}
            aria-label="بازگشت"
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] shadow-2xs hover:border-[#2D9CFF] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] text-xs font-bold">
            <Trophy className="w-4 h-4" />
            <span>سطح {formatNumber(config.level)} از ۴</span>
          </div>
        </div>
      </div>

      {/* Center Immersive Card */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center py-2">
        <motion.div
          key={currentKey}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className={`relative rounded-[32px] overflow-hidden border shadow-xl p-6 text-center flex flex-col items-center justify-between select-none ${
            isDarkBlueWave
              ? 'bg-gradient-to-b from-[#56B7FF] via-[#2D9CFF] to-[#1E70E8] text-white border-[#2D9CFF]/50 shadow-[#1E70E8]/30'
              : 'bg-gradient-to-b from-[#EBF5FF] via-[#F4F9FF] to-[#FFFFFF] dark:from-[#1E293B] dark:via-[#162235] dark:to-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] border-[#CBE8FF] dark:border-[#334155]'
          }`}
          style={{ minHeight: '440px' }}
        >
          {/* Status badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span
              className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 ${
                isDarkBlueWave
                  ? 'bg-white/20 text-white'
                  : 'bg-[#2D9CFF]/15 text-[#0066CC] dark:bg-[#1E3A5F] dark:text-[#8ED3FF]'
              }`}
            >
              <span>{config.badgeTitle}</span>
            </span>

            {isUnlocked && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>کسب شده</span>
              </span>
            )}
          </div>

          {/* Graphic Icon */}
          <div className="my-auto py-4 transform hover:scale-105 transition-transform">
            {config.renderGraphic(150)}
          </div>

          {/* Slogan */}
          <div className="w-full space-y-2 z-10">
            <h2 className="text-lg font-black tracking-tight leading-snug">
              {config.slogan} 
            </h2>
            <p
              className={`text-xs leading-relaxed max-w-xs mx-auto ${
                isDarkBlueWave ? 'text-[#E6F4FF]' : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              {config.benefit}
            </p>
          </div>

          {/* Action button if unlocked */}
          {isUnlocked && (
            <div className="w-full pt-4 z-10">
              <button
                onClick={triggerCelebrate}
                className="w-full h-11 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xs font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>جشن گرفتن افتخار</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Bottom Paging Controls - Clean Icons */}
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            onClick={handlePrevScreen}
            disabled={currentIndex === 0}
            aria-label="قبلی"
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              currentIndex === 0
                ? 'opacity-30 border-transparent cursor-not-allowed'
                : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] hover:border-[#2D9CFF]'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {SCREEN_KEYS.map((k, idx) => (
              <button
                key={k}
                onClick={() => setSelectedBrandKey(k)}
                aria-label={`صفحه ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentKey === k
                    ? 'w-7 bg-[#2D9CFF]'
                    : 'w-2.5 bg-[#CBD5E1] dark:bg-[#475569]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextScreen}
            disabled={currentIndex === SCREEN_KEYS.length - 1}
            aria-label="بعدی"
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              currentIndex === SCREEN_KEYS.length - 1
                ? 'opacity-30 border-transparent cursor-not-allowed'
                : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] hover:border-[#2D9CFF]'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
