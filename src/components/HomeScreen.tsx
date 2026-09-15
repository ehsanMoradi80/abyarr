import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, Users, Droplet, Sparkles, Trophy, Bell, Smartphone } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '../lib/clerk';
import { useApp } from '../context/AppContext';
import { Header } from './Header';
import { ProgressRing } from './ProgressRing';
import { CupSelector } from './CupSelector';
import { TodayLogs } from './TodayLogs';
import { CompactStreakBar } from './CompactStreakBar';
import { DrinkWaveEffect } from './DrinkWaveEffect';
import { computeAchievements } from '../data/badges';
import { strings, formatNumber, formatGlasses, relativeTimeFromNow } from '../constants/strings';

export const HomeScreen: React.FC = () => {
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
  } = useApp();

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
      {/* Top Header */}
      <Header
        title={name ? `سلام ${name}! ` : 'سلام! '}
        subtitle={strings.greeting}
        showLogo={true}
        right={
          <div className="flex items-center gap-1.5">
            <button
              id="open-widgets-btn"
              onClick={() => setCurrentScreen('widgets')}
              aria-label="ویجت‌های اندروید"
              title="ویجت‌های اندروید"
              className="p-2.5 rounded-2xl border bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#2D9CFF] hover:bg-[#E6F4FF] dark:hover:bg-[#1E3A5F] transition-all cursor-pointer shadow-2xs relative"
            >
              <Smartphone className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2D9CFF] ring-2 ring-white dark:ring-[#0B192C]" />
            </button>

            <button
              id="open-gamification-btn"
              onClick={() => setCurrentScreen('gamification')}
              aria-label="دستاوردها"
              className="p-2.5 rounded-2xl border bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#2D9CFF] hover:bg-[#E6F4FF] dark:hover:bg-[#1E3A5F] transition-all cursor-pointer shadow-2xs"
            >
              <Trophy className="w-5 h-5" />
            </button>

            <button
              id="open-partner-modal-btn"
              onClick={() => setCurrentScreen('partner')}
              aria-label="همراه"
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                partner && partner.status === 'active'
                  ? 'bg-[#E6F4FF] dark:bg-[#1E3A5F] border-[#2D9CFF]/40 text-[#2D9CFF]'
                  : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>

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
                aria-label="ورود"
                onClick={() => setCurrentScreen('auth')}
                className="p-2.5 rounded-2xl border bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E6F4FF] dark:hover:bg-[#1E3A5F] transition-all cursor-pointer shadow-2xs"
              >
                <Cloud className="w-5 h-5" />
              </button>
            </SignedOut>
          </div>
        }
      />

      {/* Super Compact 1-Row Streak Bar */}
      <CompactStreakBar
        streakDays={streakDays}
        weekStatus={streakWeekStatus}
        onClick={() => setCurrentScreen('gamification')}
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
