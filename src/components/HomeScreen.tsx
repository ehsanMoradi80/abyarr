import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, Users, Droplet, Sparkles, Trophy, Bell, Smartphone, HelpCircle, LayoutGrid, Watch } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '../lib/clerk';
import { useApp } from '../context/AppContext';
import { Header } from './Header';
import { ProgressRing } from './ProgressRing';
import { CupSelector } from './CupSelector';
import { TodayLogs } from './TodayLogs';
import { CompactStreakBar } from './CompactStreakBar';
import { DrinkWaveEffect } from './DrinkWaveEffect';
import { NooshCompanionCard } from './NooshMascot/NooshCompanionCard';
import { PWAInstallButton } from './PWAInstallButton';
import { QuickHub } from './QuickHub';
import { computeAchievements } from '../data/badges';
import { strings, formatNumber, formatGlasses, relativeTimeFromNow } from '../constants/strings';

export const HomeScreen: React.FC = () => {
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const {
    name,
    goalGlasses,
    todayTotalGlasses,
    todayLogs,
    logs,
    addWater,
    deleteWater,
    undoLastAdd,
    lastAddedLogId,
    lastDrinkTimestamp,
    lastDrinkGlasses,
    reminder,
    nextReminderFormattedTime,
    cloudUser,
    partner,
    partnerRealtimeStatus,
    setCurrentScreen,
    triggerNooshNotification,
    startTour,
  } = useApp();

  // Close menu on outside click
  useEffect(() => {
    if (!quickMenuOpen) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#quick-menu-container')) {
        setQuickMenuOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [quickMenuOpen]);

  // Calculate streak status
  const { streakDays, streakWeekStatus } = computeAchievements(
    logs,
    todayTotalGlasses,
    goalGlasses,
    partner
  );

  const lastDrink = todayLogs[0] || null;

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header - Clean and uncrowded */}
      <Header
        title={name ? `سلام ${name}! ` : 'سلام! '}
        subtitle={strings.greeting}
        showLogo={true}
        right={
          <div id="quick-menu-container" className="flex items-center gap-2 relative">
            {/* Single Combined Quick Menu Button */}
            <div className="relative">
              <button
                id="open-quick-menu-btn"
                onClick={() => setQuickMenuOpen(!quickMenuOpen)}
                aria-label="امکانات و ابزارها"
                title="امکانات و ابزارها"
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer shadow-2xs flex items-center justify-center ${
                  quickMenuOpen
                    ? 'bg-[#2D9CFF] text-white border-[#2D9CFF]'
                    : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#2D9CFF] hover:bg-[#E6F4FF] dark:hover:bg-[#1E3A5F]'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {quickMenuOpen && (
                <div
                  id="quick-menu-dropdown"
                  className="absolute left-0 mt-2 w-52 p-2 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100"
                >
                  <button
                    onClick={() => { setQuickMenuOpen(false); setCurrentScreen('partner'); }}
                    className="w-full px-3 py-2 rounded-xl text-right flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>همراه سلامت</span>
                    </div>
                    {partner && partner.status === 'active' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>

                  <button
                    onClick={() => { setQuickMenuOpen(false); setCurrentScreen('widgets'); }}
                    className="w-full px-3 py-2 rounded-xl text-right flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#2D9CFF]" />
                      <span>ویجت‌های گوشی</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setQuickMenuOpen(false); setCurrentScreen('third-party'); }}
                    className="w-full px-3 py-2 rounded-xl text-right flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Watch className="w-4 h-4 text-teal-500" />
                      <span>اتصال به ساعت</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setQuickMenuOpen(false); setCurrentScreen('gamification'); }}
                    className="w-full px-3 py-2 rounded-xl text-right flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>مدال‌ها و افتخارات</span>
                    </div>
                  </button>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                  <button
                    onClick={() => { setQuickMenuOpen(false); startTour(); }}
                    className="w-full px-3 py-2 rounded-xl text-right flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-rose-500" />
                      <span>راهنمای برنامه</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Clerk Authentication */}
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-9 h-9',
                    userButtonTrigger: 'p-1 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#E6F4FF] dark:hover:bg-[#1E3A5F] transition-all',
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <button
                aria-label="ورود به حساب"
                title="ورود به حساب"
                onClick={() => setCurrentScreen('auth')}
                className="p-2.5 rounded-2xl border bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E6F4FF] dark:hover:bg-[#1E3A5F] transition-all cursor-pointer shadow-2xs"
              >
                <Cloud className="w-5 h-5" />
              </button>
            </SignedOut>
          </div>
        }
      />

      {/* PWA Install Button if installable */}
      <div className="flex justify-end -mt-2">
        <PWAInstallButton />
      </div>

      {/* Super Compact 1-Row Streak Bar */}
      <CompactStreakBar
        streakDays={streakDays}
        weekStatus={streakWeekStatus}
        onClick={() => setCurrentScreen('gamification')}
      />

      {/* Health Companion Noosh Mascot Card */}
      <div id="noosh-mascot-card">
        <NooshCompanionCard
          todayGlasses={todayTotalGlasses}
          goalGlasses={goalGlasses}
          lastDrinkTimestamp={lastDrinkTimestamp}
          streakDays={streakDays}
          onTriggerNotification={triggerNooshNotification}
        />
      </div>

      {/* Quick Access Tools & Hub directly in Content */}
      <QuickHub
        onOpenPartner={() => setCurrentScreen('partner')}
        onOpenWidgets={() => setCurrentScreen('widgets')}
        onOpenThirdParty={() => setCurrentScreen('third-party')}
        onOpenRewards={() => setCurrentScreen('gamification')}
        onOpenTour={startTour}
        isPartnerActive={Boolean(partner && partner.status === 'active')}
      />

      {/* Shared Partner Card (if connected) - Live via Supabase Realtime */}
      {partner && partner.status === 'active' && partnerRealtimeStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#E6F4FF] to-[#D5EDFF] dark:from-[#1E3A5F] dark:to-[#172E4C] border border-[#2D9CFF]/30 shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC]">
              {partner.partnerName || 'همراه'}
            </span>
            {partnerRealtimeStatus.partnerLastDrinkAt && (
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                ({relativeTimeFromNow(partnerRealtimeStatus.partnerLastDrinkAt)})
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] text-[#2D9CFF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D9CFF] animate-pulse" />
              زنده
            </span>
          </div>
          {partnerRealtimeStatus.partnerTodayMl > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#2D9CFF]/20 text-[#0066CC] dark:text-[#8ED3FF]">
              {formatNumber(Math.round(partnerRealtimeStatus.partnerTodayMl / 250))} لیوان
            </span>
          )}
        </motion.div>
      )}

      {/* Progress Ring Main Widget */}
      <div id="progress-ring-card" className="rounded-3xl bg-white dark:bg-[#1E293B] p-5 border border-[#E2E8F0] dark:border-[#334155] shadow-xs relative overflow-hidden">
        {/* Animated Water Waves & Ripple Effect on drink */}
        <DrinkWaveEffect triggerKey={lastDrinkTimestamp} glassesAdded={lastDrinkGlasses} />

        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D9CFF]/10 rounded-full blur-2xl pointer-events-none" />

        <ProgressRing currentMl={todayTotalGlasses} goalMl={goalGlasses} />

        {/* Daily Goal Banner Card */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-[#F2F6FA] via-[#E6F4FF] to-[#F2F6FA] dark:from-[#0B192C] dark:via-[#1E3A5F] dark:to-[#0B192C] border border-[#CBE8FF] dark:border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2D9CFF] text-white flex items-center justify-center shadow-xs">
              <Droplet className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC]">
                هدف: {formatNumber(goalGlasses)} لیوان
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#0066CC] dark:text-[#56B7FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{formatNumber(Math.round((todayTotalGlasses / (goalGlasses || 1)) * 100)) || 0}٪</span>
          </div>
        </div>

        {lastDrink && (
          <div className="mt-2.5 text-center text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            {strings.lastDrink}: {formatGlasses(lastDrink.amount || 1)} ({relativeTimeFromNow(lastDrink.loggedAt)})
          </div>
        )}

        {/* Smart Dynamic Reminder Indicator */}
        {reminder.enabled && nextReminderFormattedTime && (
          <div className="mt-2.5 flex items-center justify-between px-3 py-2 rounded-2xl bg-[#E6F4FF]/70 dark:bg-[#1E3A5F]/50 border border-[#2D9CFF]/25 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#0066CC] dark:text-[#8ED3FF]">
              <Bell className="w-3.5 h-3.5 text-[#2D9CFF]" />
              <span>یادآور بعدی: {nextReminderFormattedTime}</span>
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
              (تمدید خودکار با نوشیدن زودتر)
            </span>
          </div>
        )}
      </div>

      {/* Cup Selector Section */}
      <div id="cup-selector-section">
        <CupSelector onAddWater={addWater} />
      </div>

      {/* Today Logs List */}
      <TodayLogs
        logs={todayLogs}
        onDelete={deleteWater}
        onUndo={undoLastAdd}
        canUndo={Boolean(lastAddedLogId)}
      />
    </div>
  );
};
