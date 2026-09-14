import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Sun,
  Moon,
  Monitor,
  Cloud,
  Users,
  LogOut,
  RefreshCw,
  Plus,
  Minus,
  Palette,
  Compass,
  HelpCircle,
  Volume2,
  Sparkles,
  Smartphone,
  Flame,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Header } from './Header';
import { AppLogo } from './AppLogo';
import { strings, relativeTimeFromNow, toEnglishDigits } from '../constants/strings';
import { WaterSoundEffect } from '../types';
import { WaterAlarmAudioService } from '../services/audioAlarm';
import { NOOSH_MASCOT_STATES, NooshExpression } from '../assets/mascotAssets';
import { NooshMascot } from './NooshMascot/NooshMascot';

interface SettingsScreenProps {
  onOpenSplash?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onOpenSplash }) => {
  const {
    name,
    setName,
    goalGlasses,
    setGoal,
    reminder,
    setReminder,
    themeMode,
    setThemeMode,
    setShowOnboarding,
    cloudUser,
    signOut,
    isSyncing,
    lastSyncAt,
    syncNow,
    partner,
    disconnectPartner,
    setSharing,
    setCurrentScreen,
    startTour,
    triggerNooshNotification,
  } = useApp();

  const [editingName, setEditingName] = useState(name);
  const [editingGoal, setEditingGoal] = useState(goalGlasses.toString());

  useEffect(() => {
    setEditingName(name);
  }, [name]);

  useEffect(() => {
    setEditingGoal(goalGlasses.toString());
  }, [goalGlasses]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setName(editingName.trim());
    const g = parseFloat(toEnglishDigits(editingGoal).replace(/[^0-9.]/g, ''));
    if (!isNaN(g) && g >= 2 && g <= 30) {
      setGoal(Math.round(g * 10) / 10);
    }
  };

  const handleGoalStep = (delta: number) => {
    const current = parseFloat(toEnglishDigits(editingGoal).replace(/[^0-9.]/g, '')) || goalGlasses;
    const next = Math.max(2, Math.min(30, Math.round((current + delta) * 10) / 10));
    setEditingGoal(next.toString());
  };

  return (
    <div className="space-y-6 pb-24">
      <Header
        title={strings.settings}
        subtitle="تنظیمات فردی، یادآورها، هویت بصری و تم"
        showLogo={true}
      />

      {/* Profile Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
            {strings.profile}
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1.5">
              {strings.name}
            </label>
            <input
              id="settings-name-input"
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder={strings.namePlaceholder}
              className="w-full h-12 px-4 rounded-2xl bg-[#F2F6FA] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-sm text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:ring-2 focus:ring-[#2D9CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1.5">
              هدف مصرف روزانه ({strings.glass})
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="settings-decrease-goal-btn"
                onClick={() => handleGoalStep(-1)}
                className="w-12 h-12 rounded-2xl bg-[#F2F6FA] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#2D9CFF] flex items-center justify-center hover:bg-[#E6F4FF] active:scale-95 transition-all cursor-pointer"
                title="کاهش یک لیوان"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="relative flex-1">
                <input
                  id="settings-goal-input"
                  type="text"
                  inputMode="decimal"
                  value={editingGoal}
                  onChange={(e) => setEditingGoal(toEnglishDigits(e.target.value).replace(/[^0-9.]/g, ''))}
                  dir="ltr"
                  className="w-full h-12 pl-14 pr-4 text-center text-lg font-extrabold bg-[#F2F6FA] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] rounded-2xl text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:ring-2 focus:ring-[#2D9CFF]"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#94A3B8] pointer-events-none select-none">
                  {strings.glass}
                </span>
              </div>

              <button
                type="button"
                id="settings-increase-goal-btn"
                onClick={() => handleGoalStep(1)}
                className="w-12 h-12 rounded-2xl bg-[#F2F6FA] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#2D9CFF] flex items-center justify-center hover:bg-[#E6F4FF] active:scale-95 transition-all cursor-pointer"
                title="افزایش یک لیوان"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            id="settings-save-profile-btn"
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#2D9CFF] hover:bg-[#1E70E8] text-white font-bold text-xs active:scale-98 transition-all cursor-pointer shadow-md shadow-[#2D9CFF]/20"
          >
            ذخیره مشخصات
          </button>
        </form>
      </div>

      {/* Reminders Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
              {strings.reminders}
            </h3>
          </div>
          <button
            id="settings-reminders-toggle"
            onClick={() => setReminder({ enabled: !reminder.enabled })}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              reminder.enabled ? 'bg-[#2D9CFF]' : 'bg-[#CBD5E1] dark:bg-[#475569]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                reminder.enabled ? 'left-1' : 'left-6'
              }`}
            />
          </button>
        </div>

        {reminder.enabled && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1">
                  {strings.startTime}
                </label>
                <input
                  type="time"
                  value={reminder.startTime}
                  onChange={(e) => setReminder({ startTime: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#F2F6FA] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-xs text-[#1E293B] dark:text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1">
                  {strings.endTime}
                </label>
                <input
                  type="time"
                  value={reminder.endTime}
                  onChange={(e) => setReminder({ endTime: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#F2F6FA] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-xs text-[#1E293B] dark:text-[#F8FAFC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1">
                فاصله یادآوری
              </label>
              <select
                value={reminder.intervalMinutes}
                onChange={(e) => setReminder({ intervalMinutes: parseInt(e.target.value, 10) })}
                className="w-full h-10 px-3 rounded-xl bg-[#F2F6FA] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-xs text-[#1E293B] dark:text-[#F8FAFC]"
              >
                <option value={30}>هر ۳۰ دقیقه</option>
                <option value={45}>هر ۴۵ دقیقه</option>
                <option value={60}>هر ۱ ساعت</option>
                <option value={90}>هر ۱.۵ ساعت</option>
                <option value={120}>هر ۲ ساعت</option>
              </select>
            </div>

            {/* Smart dynamic reminder notice */}
            <div className="p-3 rounded-2xl bg-[#E6F4FF]/70 dark:bg-[#1E3A5F]/50 border border-[#2D9CFF]/25 flex items-start gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#2D9CFF] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-[#0066CC] dark:text-[#8ED3FF] block">
                  لغو و تمدید هوشمند آلارم‌ها
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block leading-relaxed">
                  اگر زودتر از موعد آب بنوشید، آلارم آن نوبت بلافاصله لغو شده و زمان یادآور بعدی از لحظه نوشیدن آب دوباره آغاز می‌شود.
                </span>
              </div>
            </div>

            {/* Smart Escalating Alarm & Persian TTS Voice Controls */}
            <div className="pt-2 mt-2 border-t border-[#E2E8F0] dark:border-[#334155] space-y-3">
              {/* Voice Reminder with Name */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] block">
                    هشدار صوتی با نام شما (TTS فارسی)
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    پخش صدای «لیوان آبت رو نخوردی {name || 'عزیز'}»
                  </span>
                </div>
                <button
                  type="button"
                  id="settings-voice-toggle"
                  onClick={() => setReminder({ voiceReminderEnabled: !reminder.voiceReminderEnabled })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    reminder.voiceReminderEnabled ? 'bg-[#2D9CFF]' : 'bg-[#CBD5E1] dark:bg-[#475569]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                      reminder.voiceReminderEnabled ? 'left-0.5' : 'left-5.5'
                    }`}
                  />
                </button>
              </div>

              {/* Persistent 10-minute Escalating Alarm */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] block">
                    زنگ خوردن مکرر تا زمان ثبت آب
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    هر ۱۰ دقیقه زنگ می‌خورد تا زمانی که آب را ثبت کنید
                  </span>
                </div>
                <button
                  type="button"
                  id="settings-escalating-alarm-toggle"
                  onClick={() =>
                    setReminder({
                      repeatEvery10MinUntilLogged: !reminder.repeatEvery10MinUntilLogged,
                      escalatingAlarmEnabled: !reminder.escalatingAlarmEnabled,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    reminder.repeatEvery10MinUntilLogged ? 'bg-[#2D9CFF]' : 'bg-[#CBD5E1] dark:bg-[#475569]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                      reminder.repeatEvery10MinUntilLogged ? 'left-0.5' : 'left-5.5'
                    }`}
                  />
                </button>
              </div>

              {/* Water Drink Sound Effect Selection */}
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#2D9CFF]" />
                    <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC]">
                      صدای هنگام ثبت آب
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'crystal_drop' as WaterSoundEffect, label: 'قطره زلال', emoji: '💧' },
                    { id: 'gentle_bubble' as WaterSoundEffect, label: 'حباب آرام', emoji: '🫧' },
                    { id: 'crisp_pour' as WaterSoundEffect, label: 'جریان آب', emoji: '✨' },
                    { id: 'subtle_pop' as WaterSoundEffect, label: 'تیک نرم', emoji: '🔘' },
                    { id: 'silent' as WaterSoundEffect, label: 'بی‌صدا', emoji: '🔇' },
                  ].map((s) => {
                    const isSelected = (reminder.waterSoundEffect || 'crystal_drop') === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setReminder({ waterSoundEffect: s.id });
                          WaterAlarmAudioService.playWaterDrinkSound(s.id);
                        }}
                        className={`h-10 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2D9CFF] text-white shadow-xs'
                            : 'bg-[#F2F6FA] dark:bg-[#0B192C] text-[#64748B] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#475569] hover:border-[#2D9CFF]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{s.emoji}</span>
                          <span>{s.label}</span>
                        </span>
                        {isSelected && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Test Audio Alarm Button */}
              <div className="pt-1">
                <button
                  type="button"
                  id="test-audio-alarm-btn"
                  onClick={async () => {
                    WaterAlarmAudioService.triggerFullAlarm(name);
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🔊 تست پخش زنگ و صدای فارسی</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Noosh Mascot & Duolingo Notification States */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2D9CFF] to-[#0066CC] flex items-center justify-center text-white shadow-xs text-sm">
              💧
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
                کاراکتر نوش و نوتیفیکیشن‌ها (مشابه دولینگو)
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                حالات ۴ گانه چهره کاراکتر بر اساس یادآورها و اهداف
              </p>
            </div>
          </div>
        </div>

        {/* 4 Expressive States Mini Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {(['happy', 'miss_you', 'celebrate', 'sad'] as NooshExpression[]).map((exp) => {
            const item = NOOSH_MASCOT_STATES[exp];
            return (
              <button
                key={exp}
                type="button"
                onClick={() => triggerNooshNotification(exp)}
                className="p-3 rounded-2xl border text-right transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer relative overflow-hidden group flex flex-col justify-between"
                style={{
                  backgroundColor: `${item.themeColor}0C`,
                  borderColor: `${item.themeColor}30`,
                }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <NooshMascot
                      expression={exp}
                      size="sm"
                      interactive={false}
                      className="drop-shadow-sm"
                    />
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${item.themeColor}20`,
                      color: item.themeColor,
                    }}
                  >
                    {item.badgeText}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] block">
                    {item.persianTitle}
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block line-clamp-1 mt-0.5">
                    {item.persianSubtitle}
                  </span>
                </div>

                <div className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] font-bold text-[#2D9CFF]">
                  <span>تست نوتیفیکیشن</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cloud & Backup */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
            <Cloud className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
            {strings.cloud}
          </h3>
        </div>

        {cloudUser ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#1E293B] dark:text-[#F8FAFC] block">
                  {cloudUser.phone}
                </span>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {lastSyncAt ? `آخرین همگام‌سازی: ${relativeTimeFromNow(lastSyncAt)}` : strings.never}
                </span>
              </div>
              <button
                id="settings-sync-now-btn"
                onClick={syncNow}
                disabled={isSyncing}
                className="flex items-center gap-1 text-xs font-bold text-[#2D9CFF] px-3 py-1.5 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] hover:opacity-80 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{strings.syncNow}</span>
              </button>
            </div>

            <button
              id="settings-signout-btn"
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs font-bold text-[#EF4444] hover:underline pt-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{strings.logout}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              {strings.cloudPromo}
            </p>
            <button
              id="settings-login-btn"
              onClick={() => setCurrentScreen('auth')}
              className="w-full h-12 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] font-bold text-xs hover:opacity-90 cursor-pointer"
            >
              {strings.login}
            </button>
          </div>
        )}
      </div>

      {/* Sharing & Partner */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
            {strings.sharing}
          </h3>
        </div>

        {partner && partner.status === 'active' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1E293B] dark:text-[#F8FAFC]">
                همراه: {partner.partnerName || 'متصل'}
              </span>
              <button
                id="settings-disconnect-partner-btn"
                onClick={disconnectPartner}
                className="text-xs text-[#EF4444] font-semibold hover:underline cursor-pointer"
              >
                {strings.disconnect}
              </button>
            </div>

            {partner.canManageSharing && (
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] block">
                  دسترسی‌های اشتراک‌گذاری:
                </span>
                <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                  <span>{strings.shareProgress}</span>
                  <input
                    type="checkbox"
                    checked={partner.shareProgress}
                    onChange={(e) => setSharing('shareProgress', e.target.checked)}
                    className="accent-[#2D9CFF]"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                  <span>{strings.shareLastDrink}</span>
                  <input
                    type="checkbox"
                    checked={partner.shareLastDrink}
                    onChange={(e) => setSharing('shareLastDrink', e.target.checked)}
                    className="accent-[#2D9CFF]"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                  <span>{strings.shareHistory}</span>
                  <input
                    type="checkbox"
                    checked={partner.shareHistory}
                    onChange={(e) => setSharing('shareHistory', e.target.checked)}
                    className="accent-[#2D9CFF]"
                  />
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {strings.noPartner}
            </p>
            <button
              id="settings-connect-partner-btn"
              onClick={() => setCurrentScreen('partner')}
              className="w-full h-12 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] font-bold text-xs hover:opacity-90 cursor-pointer"
            >
              {strings.connectPerson}
            </button>
          </div>
        )}
      </div>

      {/* Guide, Tour & Achievements Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
              راهنما و دستاوردها
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            id="settings-open-celebration-btn"
            onClick={() => setCurrentScreen('goal-celebration')}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-[#2D9CFF] to-[#56B7FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>جشن تکمیل روز</span>
          </button>

          <button
            id="settings-open-achievements-btn"
            onClick={() => setCurrentScreen('gamification')}
            className="w-full h-11 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <Palette className="w-4 h-4" />
            <span>نشان‌ها</span>
          </button>

          <button
            id="settings-open-onboarding-btn"
            onClick={() => setShowOnboarding(true)}
            className="w-full h-11 rounded-2xl bg-white dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 hover:border-[#2D9CFF]"
          >
            <Compass className="w-4 h-4 text-[#2D9CFF]" />
            <span>معرفی</span>
          </button>

          <button
            id="settings-start-tour-btn"
            onClick={startTour}
            className="w-full h-11 rounded-2xl bg-white dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 hover:border-[#2D9CFF]"
          >
            <HelpCircle className="w-4 h-4 text-[#2D9CFF]" />
            <span>تور تعاملی</span>
          </button>
        </div>
      </div>

      {/* Android Widgets Hub & Simulator Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-tr from-[#E6F4FF] via-white to-[#EFF6FF] dark:from-[#1E293B] dark:via-[#1E3A5F]/40 dark:to-[#0B192C] border border-[#2D9CFF]/30 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066CC] to-[#2D9CFF] text-white flex items-center justify-center shadow-md shadow-[#2D9CFF]/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC] flex items-center gap-1.5">
                <span>ویجت‌های اندروید (Home Screen)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D9CFF] text-white">
                  جدید
                </span>
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                ویجت‌های ۴×۱، ۳×۱، ۲×۱ و ویجت استریک شعله تداوم
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
          می‌توانید ویجت اختصاصی آب‌یار و استریک را در صفحه اصلی گوشی خود قرار دهید و با یک لمس آب بنوشید.
        </p>

        <button
          id="settings-open-widgets-btn"
          onClick={() => setCurrentScreen('widgets')}
          className="w-full h-12 rounded-2xl bg-[#2D9CFF] hover:bg-[#1E70E8] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-md shadow-[#2D9CFF]/20"
        >
          <Smartphone className="w-4 h-4" />
          <span>مشاهده، شبیه‌ساز و راهنمای نصب ویجت‌ها</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Theme Selection */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-3 shadow-2xs">
        <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
          {strings.appearance}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            id="theme-light-btn"
            onClick={() => setThemeMode('light')}
            className={`flex items-center justify-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              themeMode === 'light'
                ? 'border-[#2D9CFF] bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF]'
                : 'border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>{strings.light}</span>
          </button>
          <button
            id="theme-dark-btn"
            onClick={() => setThemeMode('dark')}
            className={`flex items-center justify-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              themeMode === 'dark'
                ? 'border-[#2D9CFF] bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF]'
                : 'border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8]'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>{strings.dark}</span>
          </button>
          <button
            id="theme-system-btn"
            onClick={() => setThemeMode('system')}
            className={`flex items-center justify-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              themeMode === 'system'
                ? 'border-[#2D9CFF] bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF]'
                : 'border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>{strings.system}</span>
          </button>
        </div>
      </div>

      {/* App Info / Android Badge / Disclaimer */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center space-y-3 shadow-2xs">
        <div className="flex flex-col items-center justify-center gap-2">
          <AppLogo size={38} showHeart={true} animated={true} />
          <div>
            <h4 className="text-base font-black text-[#2D9CFF]">
              {strings.appName}
            </h4>
            <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              {strings.tagline}
            </p>
            <span className="inline-block mt-2 text-[11px] font-bold px-3 py-1 rounded-full bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF]">
              آماده برای اندروید (PWA & APK) • نسخه ۱.۰.۰
            </span>
          </div>
        </div>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
          {strings.disclaimer}
        </p>
      </div>
    </div>
  );
};

