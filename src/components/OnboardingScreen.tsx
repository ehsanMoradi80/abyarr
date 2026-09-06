import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Droplet,
  ChevronRight,
  Check,
  Bell,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  WaterGlassGraphic,
  WaterMascotGraphic,
  WaterClockGraphic,
  WaterWavesGraphic,
} from './BrandIllustrations';
import { useApp } from '../context/AppContext';
import { formatNumber } from '../constants/strings';

export const OnboardingScreen: React.FC = () => {
  const { name: currentName, goalGlasses: currentGoal, finishOnboarding } = useApp();

  const [step, setStep] = useState<number>(0);
  const [userName, setUserName] = useState<string>(currentName || '');
  const [selectedGoal, setSelectedGoal] = useState<number>(currentGoal || 8);
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  const goalOptions = [
    { glasses: 6, label: '۶ لیوان', desc: '۱.۵ لیتر • سبک' },
    { glasses: 8, label: '۸ لیوان', desc: '۲ لیتر • استاندارد', recommended: true },
    { glasses: 10, label: '۱۰ لیوان', desc: '۲.۵ لیتر • فعال' },
    { glasses: 12, label: '۱۲ لیوان', desc: '۳ لیتر • ورزشکار' },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      finishOnboarding(userName, selectedGoal, remindersEnabled);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F6FA] dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 select-none transition-colors duration-300">
      {/* Top Header - Icon Navigation */}
      <div className="w-full max-w-md mx-auto pt-2">
        <div className="flex items-center justify-between gap-3 mb-3">
          {step > 0 ? (
            <button
              id="onboarding-prev-btn"
              onClick={handlePrev}
              aria-label="قبلی"
              className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] shadow-2xs hover:border-[#2D9CFF] transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}

          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-1.5" dir="ltr">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-6 bg-[#2D9CFF]'
                    : i < step
                    ? 'w-2 bg-[#2D9CFF]/60'
                    : 'w-2 bg-[#CBD5E1] dark:bg-[#334155]'
                }`}
              />
            ))}
          </div>

          <button
            id="onboarding-skip-btn"
            onClick={() => finishOnboarding(userName, selectedGoal, remindersEnabled)}
            className="text-xs font-bold text-[#94A3B8] hover:text-[#2D9CFF] transition-colors cursor-pointer px-2 py-1"
          >
            رد کردن
          </button>
        </div>
      </div>

      {/* Main Step Content */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center py-2">
        <AnimatePresence mode="wait">
          {/* STEP 0: Welcome & Name */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-center space-y-5"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#2D9CFF] to-[#0066CC] flex items-center justify-center shadow-lg shadow-[#2D9CFF]/30 border-2 border-white/60 dark:border-white/20"
              >
                <Droplet className="w-11 h-11 text-white fill-white" />
              </motion.div>

              <div className="space-y-1">
                <h1 className="text-2xl font-black text-[#1E293B] dark:text-[#F8FAFC]">
                  نوش 💙
                </h1>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  یادآور و ردیاب هوشمند مصرف آب روزانه
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-2 text-right">
                <label className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                  نام شما چیست؟ (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: علی"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-sm font-bold text-center focus:outline-hidden focus:border-[#2D9CFF]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
                  <span className="text-xl block mb-1">⚡</span>
                  <span className="text-[11px] font-bold">ثبت با ۱ لمس</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
                  <span className="text-xl block mb-1">🔔</span>
                  <span className="text-[11px] font-bold">یادآور صوتی</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
                  <span className="text-xl block mb-1">🏆</span>
                  <span className="text-[11px] font-bold">نشان و انگیزه</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Daily Goal Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-center mb-2">
                  <Droplet className="w-6 h-6 fill-current" />
                </div>
                <h2 className="text-lg font-black text-[#1E293B] dark:text-[#F8FAFC]">
                  هدف مصرف روزانه شما
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  تعداد لیوان آب مورد نیاز بدنتان در هر روز
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {goalOptions.map((opt) => (
                  <button
                    key={opt.glasses}
                    type="button"
                    onClick={() => setSelectedGoal(opt.glasses)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                      selectedGoal === opt.glasses
                        ? 'bg-[#E6F4FF] dark:bg-[#1E3A5F] border-[#2D9CFF] shadow-xs'
                        : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] hover:border-[#2D9CFF]'
                    }`}
                  >
                    {opt.recommended && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-[#2D9CFF] text-white text-[9px] font-black">
                        پیشنهادی
                      </span>
                    )}
                    <span className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC] block">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block mt-0.5">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Reminders & Voice */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-center mb-2">
                  <Bell className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-[#1E293B] dark:text-[#F8FAFC]">
                  یادآورهای روزانه
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  تنظیم اعلان‌ها در ساعات بیداری
                </p>
              </div>

              <div className="space-y-2.5">
                <div
                  onClick={() => setRemindersEnabled(!remindersEnabled)}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between cursor-pointer hover:border-[#2D9CFF]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                        اعلان یادآوری آب
                      </h4>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                        هر ۹۰ دقیقه یکبار در طول روز
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={remindersEnabled}
                    onChange={() => {}}
                    className="w-5 h-5 rounded accent-[#2D9CFF] cursor-pointer"
                  />
                </div>

                <div
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between cursor-pointer hover:border-[#2D9CFF]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-center">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                        صوت دوستانه فارسی
                      </h4>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                        پخش صدای صمیمانه «وقت نوشیدن آب»
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={() => {}}
                    className="w-5 h-5 rounded accent-[#2D9CFF] cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Visual Milestone Badges Preview */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <h2 className="text-lg font-black text-[#1E293B] dark:text-[#F8FAFC]">
                  آماده شروع سفر سلامتی! 🏆
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  با هر لیوان آب، نشان‌های افتخار را باز کنید
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 py-2">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center shadow-2xs">
                  <div className="h-12 flex items-center justify-center">
                    <WaterGlassGraphic size={40} />
                  </div>
                  <span className="text-[10px] font-bold mt-1 block">جرعه اول</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center shadow-2xs">
                  <div className="h-12 flex items-center justify-center">
                    <WaterMascotGraphic size={40} />
                  </div>
                  <span className="text-[10px] font-bold mt-1 block">نشاط</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center shadow-2xs">
                  <div className="h-12 flex items-center justify-center">
                    <WaterClockGraphic size={40} />
                  </div>
                  <span className="text-[10px] font-bold mt-1 block">نظم</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-gradient-to-b from-[#56B7FF] to-[#1E70E8] text-white border border-[#2D9CFF] text-center shadow-2xs">
                  <div className="h-12 flex items-center justify-center">
                    <WaterWavesGraphic size={40} />
                  </div>
                  <span className="text-[10px] font-bold mt-1 block">تداوم</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Button */}
      <div className="w-full max-w-md mx-auto pt-2">
        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2D9CFF] to-[#56B7FF] text-white font-bold text-xs shadow-md shadow-[#2D9CFF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          {step === 3 ? (
            <>
              <Check className="w-4 h-4" />
              <span>شروع برنامه</span>
            </>
          ) : (
            <span>مرحله بعد</span>
          )}
        </button>
      </div>
    </div>
  );
};
