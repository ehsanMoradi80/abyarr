import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Bell, Volume2, Trophy, Heart } from 'lucide-react';
import { AppLogo } from './AppLogo';
import {
  WaterGlassGraphic,
  WaterMascotGraphic,
  WaterClockGraphic,
  WaterWavesGraphic,
} from './BrandIllustrations';
import { strings, formatNumber, formatGlasses } from '../constants/strings';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: (name: string, goalGlasses: number, remindersEnabled: boolean) => void;
}

const GOALS = [6, 8, 10, 12];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onFinish }) => {
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [goal, setGoal] = useState<number>(8);
  const [reminders, setReminders] = useState<boolean>(true);
  const [reminderInterval, setReminderInterval] = useState<number>(90);

  if (!isOpen) return null;

  const totalSteps = 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 dark:bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full max-w-sm rounded-[36px] overflow-hidden border shadow-2xl p-6 sm:p-7 text-center select-none flex flex-col justify-between min-h-[580px] my-auto transition-colors duration-500 ${
          step === 4
            ? 'bg-gradient-to-b from-[#56B7FF] via-[#2D9CFF] to-[#1E70E8] text-white border-[#2D9CFF]'
            : 'bg-gradient-to-b from-[#EBF5FF] via-[#F4F9FF] to-[#FFFFFF] dark:from-[#1E293B] dark:via-[#162235] dark:to-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] border-[#CBE8FF] dark:border-[#334155]'
        }`}
      >
        {/* Soft background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#2D9CFF]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Progress Dots & Skip */}
        <div className="w-full flex items-center justify-between z-10 mb-2">
          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === step
                    ? step === 4
                      ? 'w-6 bg-white'
                      : 'w-6 bg-[#2D9CFF]'
                    : step === 4
                    ? 'w-2 bg-white/30'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {step > 0 && step < totalSteps - 1 && (
            <button
              type="button"
              onClick={() => onFinish(name, goal, reminders)}
              className={`text-xs font-bold transition-opacity hover:opacity-80 cursor-pointer ${
                step === 4 ? 'text-white/80' : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              رد کردن
            </button>
          )}
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 z-10">
          <AnimatePresence mode="wait">
            {/* STEP 0: Welcome & Splash Hero */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="w-full space-y-4 flex flex-col items-center"
              >
                <div className="py-2">
                  <AppLogo size={96} animated={true} showHeart={true} />
                </div>

                <div className="space-y-1">
                  <h1 className="text-3xl font-black text-[#2D9CFF] tracking-tight">
                    {strings.appName}
                  </h1>
                  <p className="text-xs font-bold text-[#56B7FF]">
                    {strings.tagline}
                  </p>
                </div>

                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed px-2">
                  نوش بهت کمک می‌کنه تا به صورت منظم آب بنوشی و سبک زندگی سالم، شاداب و پرانرژی‌تری داشته باشی.
                </p>

                <div className="pt-3 w-full">
                  <button
                    id="onboarding-start-btn"
                    onClick={() => setStep(1)}
                    className="w-full h-12 rounded-2xl bg-[#2D9CFF] hover:bg-[#1E70E8] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2D9CFF]/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>شروع کنیم </span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1: Screen 1: هر قطره، یک قدم به سلامتی (Goal Setup) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="w-full space-y-3 flex flex-col items-center"
              >
                <div className="py-1">
                  <WaterGlassGraphic size={110} />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#2D9CFF]/15 text-[#0066CC] dark:bg-[#1E3A5F] dark:text-[#8ED3FF]">
                    صفحه ۱ • هیدراتاسیون
                  </span>
                  <h2 className="text-lg font-black text-[#1E293B] dark:text-[#F8FAFC]">
                    هر قطره، یک قدم به سلامتی
                  </h2>
                  <div className="text-sm font-bold text-[#2D9CFF]"></div>
                </div>

                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] px-1">
                  هدف مصرف آب روزانه‌ات رو مشخص کن (استاندارد ۸ لیوان در روز):
                </p>

                {/* Goals Grid */}
                <div className="grid grid-cols-4 gap-2 w-full pt-1">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      id={`onboarding-goal-${g}`}
                      type="button"
                      onClick={() => setGoal(g)}
                      className={`py-2.5 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                        goal === g
                          ? 'border-[#2D9CFF] bg-[#2D9CFF] text-white font-black shadow-md shadow-[#2D9CFF]/30 scale-105'
                          : 'border-[#CBD5E1] dark:border-[#475569] bg-white dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC]'
                      }`}
                    >
                      <span className="text-lg block font-black">{formatNumber(g)}</span>
                      <span className="text-[10px] block opacity-80">{strings.glass}</span>
                    </button>
                  ))}
                </div>

                <button
                  id="onboarding-step1-next-btn"
                  onClick={() => setStep(2)}
                  className="w-full h-12 rounded-2xl bg-[#2D9CFF] hover:bg-[#1E70E8] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2D9CFF]/25 active:scale-[0.98] mt-2 cursor-pointer"
                >
                  <span>ادامه</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Screen 2: آب بخور، حال خوبت رو بساز (Personal Name) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="w-full space-y-3 flex flex-col items-center"
              >
                <div className="py-1">
                  <WaterMascotGraphic size={110} />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#2D9CFF]/15 text-[#0066CC] dark:bg-[#1E3A5F] dark:text-[#8ED3FF]">
                    صفحه ۲ • نشاط و انگیزه
                  </span>
                  <h2 className="text-lg font-black text-[#1E293B] dark:text-[#F8FAFC]">
                    آب بخور، حال خوبت رو بساز
                  </h2>
                  <div className="text-sm font-bold text-[#2D9CFF]"></div>
                </div>

                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  دوست داری در اعلان‌ها و یادآورهای صوتی چی صدات کنیم؟
                </p>

                <div className="w-full text-right pt-1">
                  <input
                    id="onboarding-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={strings.namePlaceholder}
                    className="w-full h-12 px-4 rounded-2xl bg-white dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-sm text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:ring-2 focus:ring-[#2D9CFF]"
                  />
                </div>

                <div className="w-full flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8] font-bold text-xs cursor-pointer"
                  >
                    قبلی
                  </button>
                  <button
                    id="onboarding-step2-next-btn"
                    onClick={() => setStep(3)}
                    className="flex-1 h-12 rounded-2xl bg-[#2D9CFF] hover:bg-[#1E70E8] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2D9CFF]/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>ادامه</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Screen 3: یادآوری دوستانه: وقت آب خوردن (Reminders & Timing) */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="w-full space-y-3 flex flex-col items-center"
              >
                <div className="py-1">
                  <WaterClockGraphic size={110} />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#2D9CFF]/15 text-[#0066CC] dark:bg-[#1E3A5F] dark:text-[#8ED3FF]">
                    صفحه ۳ • نظم و استمرار
                  </span>
                  <h2 className="text-lg font-black text-[#1E293B] dark:text-[#F8FAFC]">
                    یادآوری دوستانه: وقت آب خوردن
                  </h2>
                  <div className="text-sm font-bold text-[#2D9CFF]"></div>
                </div>

                {/* Reminder Option Card */}
                <div
                  id="onboarding-reminders-toggle"
                  onClick={() => setReminders(!reminders)}
                  className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] flex items-center justify-between cursor-pointer"
                >
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] block">
                      یادآورهای هوشمند و زنگ صوتی
                    </span>
                    <span className="text-[10.5px] text-[#64748B] dark:text-[#94A3B8]">
                      پخش هشدار با نام شما در صورت فراموشی
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      reminders
                        ? 'bg-[#2D9CFF] text-white'
                        : 'border border-[#CBD5E1] dark:border-[#475569]'
                    }`}
                  >
                    {reminders && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <div className="w-full flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8] font-bold text-xs cursor-pointer"
                  >
                    قبلی
                  </button>
                  <button
                    id="onboarding-step3-next-btn"
                    onClick={() => setStep(4)}
                    className="flex-1 h-12 rounded-2xl bg-[#2D9CFF] hover:bg-[#1E70E8] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2D9CFF]/25 active:scale-[0.98] cursor-pointer"
                  >
                    <span>ادامه به گیمیفیکیشن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Screen 4: تداوم، کلید تغییر است (Gamification & Continuity Finish) */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="w-full space-y-3 flex flex-col items-center text-white"
              >
                <div className="py-1">
                  <WaterWavesGraphic size={110} />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-2xs">
                    صفحه ۴ • گیمیفیکیشن و دستاوردها
                  </span>
                  <h2 className="text-xl font-black text-white">
                    تداوم، کلید تغییر است
                  </h2>
                  <div className="text-sm font-bold text-[#E6F4FF]"></div>
                </div>

                <div className="w-full p-3 rounded-2xl bg-white/15 backdrop-blur-xs text-right text-xs space-y-1.5 border border-white/20">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Trophy className="w-4 h-4 text-[#FDE047]" />
                    <span>سیستم نشان‌ها و امتیاز قطره (XP) فعال شد!</span>
                  </div>
                  <p className="text-[11px] text-[#E6F4FF] leading-relaxed">
                    با نوشیدن هر لیوان آب، سطح خودت رو ارتقا بده و ۴ نشان طلایی سلامتی رو آزاد کن.
                  </p>
                </div>

                <div className="w-full flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 h-12 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
                  >
                    قبلی
                  </button>
                  <button
                    id="onboarding-finish-btn"
                    onClick={() => onFinish(name, goal, reminders)}
                    className="flex-1 h-12 rounded-2xl bg-white text-[#1E70E8] hover:bg-[#E6F4FF] font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    <span>شروع سفر سلامتی </span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
