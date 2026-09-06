import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Smartphone,
  Flame,
  Droplet,
  Sun,
  Moon,
  CheckCircle2,
  HelpCircle,
  Layers,
  Plus,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { computeAchievements } from '../data/badges';
import { WaterWidget4x1 } from './AndroidWidgets/WaterWidget4x1';
import { WaterWidget3x1 } from './AndroidWidgets/WaterWidget3x1';
import { WaterWidget2x1 } from './AndroidWidgets/WaterWidget2x1';
import { StreakWidget4x1 } from './AndroidWidgets/StreakWidget4x1';
import { StreakWidget2x2 } from './AndroidWidgets/StreakWidget2x2';
import { StreakWidget2x1 } from './AndroidWidgets/StreakWidget2x1';
import { AndroidHomeScreenPreview } from './AndroidWidgets/AndroidHomeScreenPreview';
import { formatNumber } from '../constants/strings';

export const WidgetsScreen: React.FC = () => {
  const {
    setCurrentScreen,
    logs,
    todayTotalGlasses,
    goalGlasses,
    partner,
    targetStreakDays,
    addWater,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'water' | 'streak'>('water');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'catalog' | 'simulator' | 'guide'>('catalog');

  const { streakDays, streakWeekStatus } = computeAchievements(
    logs,
    todayTotalGlasses,
    goalGlasses,
    partner
  );

  const handleQuickAdd = () => {
    addWater(1);
    showToast('💧 ۱ لیوان آب از طریق ویجت ثبت شد!');
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] pb-20 selection:bg-[#2D9CFF] selection:text-white">
      {/* Top App Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B192C]/80 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#334155] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCurrentScreen('main')}
              className="p-2 rounded-2xl bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white transition-all cursor-pointer"
              aria-label="بازگشت"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-[#1E293B] dark:text-[#F8FAFC]">
                ویجت‌های اندروید (Home Screen)
              </h1>
              <p className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                پیگیری آب و استریک مستقیماً در صفحه گوشی
              </p>
            </div>
          </div>

          {/* Theme switcher for widget previews */}
          <div className="flex items-center bg-[#F1F5F9] dark:bg-[#1E293B] p-1 rounded-2xl border border-[#E2E8F0] dark:border-[#334155]">
            <button
              onClick={() => setPreviewTheme('light')}
              className={`p-1.5 rounded-xl transition-all ${
                previewTheme === 'light'
                  ? 'bg-white text-[#2D9CFF] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
              title="سبک روشن"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewTheme('dark')}
              className={`p-1.5 rounded-xl transition-all ${
                previewTheme === 'dark'
                  ? 'bg-[#0F172A] text-[#2D9CFF] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
              title="سبک تیره"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Navigation Tabs (Catalog / Simulator / Guide) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#2D9CFF] text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>اندازه‌ها</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-[#2D9CFF] text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>صفحه گوشی</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-[#2D9CFF] text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>آموزش نصب</span>
          </button>
        </div>

        {/* Category Filter (Water vs Streak) */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setActiveCategory('water')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeCategory === 'water'
                  ? 'bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] border border-[#2D9CFF]/40 font-black'
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              <Droplet className="w-4 h-4 text-[#2D9CFF]" />
              <span>ویجت مصرف آب</span>
            </button>
            <button
              onClick={() => setActiveCategory('streak')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeCategory === 'streak'
                  ? 'bg-[#FEF3C7] dark:bg-[#78350F]/40 text-[#D97706] dark:text-[#FBBF24] border border-[#F59E0B]/40 font-black'
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              <Flame className="w-4 h-4 text-[#F59E0B]" />
              <span>ویجت تداوم روزانه</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CATALOG OF SIZES */}
        {activeTab === 'catalog' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Live Interactive Notice */}
            <div className="p-3 rounded-2xl bg-[#E6F4FF]/70 dark:bg-[#1E3A5F]/50 border border-[#2D9CFF]/25 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#0066CC] dark:text-[#8ED3FF] font-bold">
                <Sparkles className="w-4 h-4 text-[#2D9CFF] shrink-0" />
                <span>ویجت‌ها کاملاً تعاملی و زنده هستند! روی دکمه + بزنید.</span>
              </div>
            </div>

            {/* WATER WIDGETS */}
            {activeCategory === 'water' && (
              <div className="space-y-4">
                {/* 4x1 Recommended */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                      اندازه ۴×۱ (پیشنهادی)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D9CFF]/15 text-[#0066CC] dark:text-[#8ED3FF]">
                      کامل‌ترین دید
                    </span>
                  </div>
                  <WaterWidget4x1
                    todayGlasses={todayTotalGlasses}
                    goalGlasses={goalGlasses}
                    isDark={previewTheme === 'dark'}
                    onAddWater={handleQuickAdd}
                    onOpenApp={() => setCurrentScreen('main')}
                  />
                </div>

                {/* 3x1 Compact */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                      اندازه ۳×۱ (فشرده)
                    </span>
                  </div>
                  <WaterWidget3x1
                    todayGlasses={todayTotalGlasses}
                    goalGlasses={goalGlasses}
                    isDark={previewTheme === 'dark'}
                    onAddWater={handleQuickAdd}
                    onOpenApp={() => setCurrentScreen('main')}
                  />
                </div>

                {/* 2x1 Minimal */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                      اندازه ۲×۱ (مینیمال)
                    </span>
                  </div>
                  <WaterWidget2x1
                    todayGlasses={todayTotalGlasses}
                    goalGlasses={goalGlasses}
                    isDark={previewTheme === 'dark'}
                    onAddWater={handleQuickAdd}
                    onOpenApp={() => setCurrentScreen('main')}
                  />
                </div>
              </div>
            )}

            {/* STREAK WIDGETS */}
            {activeCategory === 'streak' && (
              <div className="space-y-4">
                {/* 4x1 Streak Banner */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                      اندازه ۴×۱ (افقی با تاریخچه ۷ روز)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#D97706] dark:text-[#FBBF24]">
                      پیشنهادی
                    </span>
                  </div>
                  <StreakWidget4x1
                    streakDays={streakDays}
                    targetStreakDays={targetStreakDays}
                    weekStatus={streakWeekStatus}
                    isDark={previewTheme === 'dark'}
                    onAddWater={handleQuickAdd}
                    onOpenApp={() => setCurrentScreen('main')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  {/* 2x2 Square Streak */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between px-1">
                      <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                        اندازه ۲×۲ (مربعی با انیمیشن شعله)
                      </span>
                    </div>
                    <StreakWidget2x2
                      streakDays={streakDays}
                      targetStreakDays={targetStreakDays}
                      isDark={previewTheme === 'dark'}
                      onAddWater={handleQuickAdd}
                      onOpenApp={() => setCurrentScreen('main')}
                    />
                  </div>

                  {/* 2x1 Streak */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between px-1">
                      <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                        اندازه ۲×۱ (فشرده استریک)
                      </span>
                    </div>
                    <StreakWidget2x1
                      streakDays={streakDays}
                      isDark={previewTheme === 'dark'}
                      onAddWater={handleQuickAdd}
                      onOpenApp={() => setCurrentScreen('main')}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE ANDROID HOME SCREEN SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                شبیه‌ساز زنده صفحه اصلی گوشی (Android Home Screen)
              </span>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                ظاهر ویجت انتخاب‌شده روی تصویر پس‌زمینه گوشی شما
              </p>
            </div>

            <AndroidHomeScreenPreview
              widgetType={activeCategory}
              todayGlasses={todayTotalGlasses}
              goalGlasses={goalGlasses}
              streakDays={streakDays}
              targetStreakDays={targetStreakDays}
              weekStatus={streakWeekStatus}
              isDark={previewTheme === 'dark'}
              onAddWater={handleQuickAdd}
              onOpenApp={() => setCurrentScreen('main')}
            />
          </div>
        )}

        {/* TAB 3: STEP BY STEP INSTALLATION GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Action Cards (As in user reference image) */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-3.5 shadow-2xs">
              <h3 className="text-sm font-black text-[#1E293B] dark:text-[#F8FAFC] pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
                راهنمای عملکرد روی ویجت
              </h3>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#2D9CFF] flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC] block">
                    برای باز کردن برنامه
                  </span>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    کافیست روی هر نقطه از بدنه ویجت ضربه بزنید تا برنامه باز شود.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066CC] to-[#2D9CFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Plus className="w-5 h-5 stroke-[2.8]" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC] block">
                    برای ثبت یک لیوان آب
                  </span>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    روی دکمه + آبی‌رنگ بزنید؛ بدون نیاز به باز کردن کامل برنامه، آب فورا ثبت می‌شود.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC] block">
                    لیوان‌های شفاف و پر
                  </span>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    هر لیوان آبی که پر است، نشانگر ۱ لیوان آب نوشیده شده در طول روز جاری است.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EF4444] to-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC] block">
                    ویجت تداوم نوشیدن آب
                  </span>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    تعداد روزهای متوالی پایبندی شما به نوشیدن آب را به همراه پیشرفت نمایش می‌دهد.
                  </p>
                </div>
              </div>
            </div>

            {/* How to add to phone steps */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-3 shadow-2xs">
              <h3 className="text-sm font-black text-[#1E293B] dark:text-[#F8FAFC]">
                مراحل قرار دادن ویجت روی صفحه گوشی اندروید
              </h3>

              <div className="space-y-2.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2D9CFF] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    ۱
                  </span>
                  <p>
                    در صفحه اصلی گوشی خود (Home Screen)، انگشت خود را روی یک فضای خالی نگه دارید.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2D9CFF] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    ۲
                  </span>
                  <p>
                    از گزینه‌های ظاهر شده، روی گزینه <strong>ویجت‌ها (Widgets)</strong> ضربه بزنید.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2D9CFF] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    ۳
                  </span>
                  <p>
                    در لیست برنامه‌ها، برنامه <strong>آب‌یار (Abyar)</strong> را انتخاب کنید.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2D9CFF] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    ۴
                  </span>
                  <p>
                    ویجت دلخواه (۴×۱ لیوان‌ها یا استریک) را لمس کرده و به محل مورد نظر در صفحه بکشید.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
