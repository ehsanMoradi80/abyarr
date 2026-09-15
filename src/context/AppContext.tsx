import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  AppScreen,
  AuthUser,
  BrandScreenKey,
  CelebrationModalPayload,
  PartnerConnection,
  ReminderSettings,
  TabType,
  ThemeMode,
  WaterLog,
} from '../types';
import { localDayKey, strings, formatGlasses, formatTime } from '../constants/strings';
import { WaterAlarmAudioService } from '../services/audioAlarm';
import { NativeBridgeService } from '../services/nativeBridge';
import { initAnalytics, setAnalyticsUserId, trackEvent } from '../services/analytics';
import { startAppTour } from '../utils/tour';
import { computeAchievements, STREAK_TARGET_OPTIONS } from '../data/badges';
import { NooshExpression, NOOSH_MASCOT_STATES } from '../assets/mascotAssets';
import { NooshNotificationPayload } from '../components/NooshMascot/NooshNotificationModal';
import { subscribeToPartnerRealtime, RealtimeStatus } from '../services/supabaseClient';
import { useUser } from '../lib/clerk';

interface AppContextType {
  // Navigation & UI
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  selectedBrandKey: BrandScreenKey | null;
  setSelectedBrandKey: (key: BrandScreenKey | null) => void;
  startTour: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Noosh Mascot & Duolingo Notifications
  nooshNotificationPayload: NooshNotificationPayload | null;
  triggerNooshNotification: (payloadOrExpression: NooshNotificationPayload | NooshExpression) => void;
  closeNooshNotification: () => void;

  // Streak Target & Celebrations
  targetStreakDays: number;
  setTargetStreakDays: (days: number) => void;
  celebrationModalPayload: CelebrationModalPayload | null;
  triggerCelebrationModal: (payload: CelebrationModalPayload) => void;
  closeCelebrationModal: () => void;

  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  finishOnboarding: (name: string, goalGlasses: number, remindersEnabled: boolean) => void;


  // Profile & Goal (in glasses / لیوان)
  name: string;
  setName: (name: string) => void;
  goalGlasses: number;
  goalMl: number; // alias for backwards compatibility
  setGoal: (glasses: number) => void;


  // Logs
  logs: WaterLog[];
  todayLogs: WaterLog[];
  todayTotalGlasses: number;
  todayTotalMl: number; // alias
  addWater: (glasses: number) => void;
  deleteWater: (id: string) => void;
  undoLastAdd: () => void;
  lastAddedLogId: string | null;
  lastDrinkTimestamp: number;
  lastDrinkGlasses: number;

  // Reminders
  reminder: ReminderSettings;
  setReminder: (settings: Partial<ReminderSettings>) => void;
  nextReminderFormattedTime: string | null;

  // Cloud & Auth
  cloudUser: AuthUser | null;
  signOut: () => Promise<void>;
  isSyncing: boolean;
  lastSyncAt: string | null;
  syncNow: () => Promise<void>;

  // Partner
  partner: PartnerConnection | null;
  partnerRealtimeStatus: RealtimeStatus | null;
  createPartnerInvite: () => Promise<string>;
  connectPartner: (inviteCode: string) => Promise<void>;
  setSharing: (key: 'shareProgress' | 'shareLastDrink' | 'shareHistory', value: boolean) => Promise<void>;
  disconnectPartner: () => Promise<void>;
  getPartnerShared: () => Promise<any>;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_REMINDER: ReminderSettings = {
  enabled: true,
  startTime: '09:00',
  endTime: '23:00',
  intervalMinutes: 90,
  quietHoursEnabled: true,
  quietHoursStart: '23:30',
  quietHoursEnd: '08:30',
  voiceReminderEnabled: true,
  escalatingAlarmEnabled: true,
  repeatEvery10MinUntilLogged: true,
  waterSoundEffect: 'crystal_drop',
};

const STORAGE_KEYS = {
  LOGS: 'abyar_logs',
  PROFILE: 'abyar_profile',
  REMINDERS: 'abyar_reminders',
  THEME: 'abyar_theme',
  ONBOARDING_DONE: 'abyar_onboarding_done',
  LAST_SYNC: 'abyar_last_sync',
  TARGET_STREAK: 'abyar_target_streak_days',
  UNLOCKED_BADGES: 'abyar_unlocked_badges',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isFirstTimeUser = !localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE);
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  // Basic states
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    return isFirstTimeUser ? 'onboarding' : 'main';
  });
  const [selectedBrandKey, setSelectedBrandKey] = useState<BrandScreenKey | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode) || 'light';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return isFirstTimeUser;
  });

  // Noosh Mascot & Duolingo Notifications
  const [nooshNotificationPayload, setNooshNotificationPayload] = useState<NooshNotificationPayload | null>(null);

  const triggerNooshNotification = (payloadOrExpression: NooshNotificationPayload | NooshExpression) => {
    if (typeof payloadOrExpression === 'string') {
      const meta = NOOSH_MASCOT_STATES[payloadOrExpression] || NOOSH_MASCOT_STATES.happy;
      void trackEvent('noosh_notification_shown', {
        expression: payloadOrExpression,
        title: meta.persianTitle,
      });
      setNooshNotificationPayload({
        expression: payloadOrExpression,
        title: meta.persianTitle,
        message: meta.defaultPhrase,
        actionText: '+۱ لیوان نوشیدم ',
        autoPlaySound: true,
      });
    } else {
      void trackEvent('noosh_notification_shown', {
        expression: payloadOrExpression.expression,
        title: payloadOrExpression.title,
      });
      setNooshNotificationPayload(payloadOrExpression);
    }
  };

  const closeNooshNotification = () => {
    if (nooshNotificationPayload) {
      void trackEvent('noosh_notification_closed', {
        expression: nooshNotificationPayload.expression,
      });
    }
    setNooshNotificationPayload(null);
  };

  // Streak Target & Celebrations
  const [targetStreakDays, setTargetStreakDaysState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TARGET_STREAK);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 7;
  });

  const [celebrationModalPayload, setCelebrationModalPayload] = useState<CelebrationModalPayload | null>(null);

  const triggerCelebrationModal = (payload: CelebrationModalPayload) => {
    setCelebrationModalPayload(payload);
  };

  const closeCelebrationModal = () => {
    setCelebrationModalPayload(null);
  };

  const setTargetStreakDays = (days: number) => {
    setTargetStreakDaysState(days);
    localStorage.setItem(STORAGE_KEYS.TARGET_STREAK, days.toString());
    const opt = STREAK_TARGET_OPTIONS.find((o) => o.days === days);
    showToast(` هدف استریک روی ${days} روز تنظیم شد (+${opt?.bonusXp || 100} XP)`);
  };



  // Profile & Goal (default 8 glasses of water)
  const [name, setNameState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved).name || '';
      } catch {}
    }
    return '';
  });

  const [goalGlasses, setGoalState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.dailyGoal) return parsed.dailyGoal;
        // Migration from ml (e.g. 2000ml -> 8 glasses)
        if (parsed.dailyGoalMl) return Math.max(4, Math.round(parsed.dailyGoalMl / 250));
      } catch {}
    }
    return 8;
  });

  const [logs, setLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try {
        const raw = JSON.parse(saved);
        if (Array.isArray(raw)) {
          return raw.map((item: any) => ({
            id: item.id || 'log_' + Math.random().toString(36).substr(2),
            amount: item.amount !== undefined 
              ? item.amount 
              : item.amountMl 
              ? Math.max(0.5, Math.round((item.amountMl / 250) * 2) / 2) 
              : 1,
            amountMl: item.amountMl,
            loggedAt: item.loggedAt || new Date().toISOString(),
          }));
        }
      } catch {}
    }
    return [];
  });

  const [reminder, setReminderState] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (saved) {
      try {
        return { ...DEFAULT_REMINDER, ...JSON.parse(saved) };
      } catch {}
    }
    return DEFAULT_REMINDER;
  });

  const [lastAddedLogId, setLastAddedLogId] = useState<string | null>(null);
  const [lastDrinkTimestamp, setLastDrinkTimestamp] = useState<number>(0);
  const [lastDrinkGlasses, setLastDrinkGlasses] = useState<number>(1);
  const activeAlarmTimeoutRef = useRef<any>(null);
  const lastNotificationSentAtRef = useRef<number>(0);

  // Cloud auth & partner states
  const [cloudUser, setCloudUser] = useState<AuthUser | null>(null);
  const [partner, setPartner] = useState<PartnerConnection | null>(null);
  const [partnerRealtimeStatus, setPartnerRealtimeStatus] = useState<RealtimeStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  });

  // Sync Clerk user with cloudUser
  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      setCloudUser({
        id: clerkUser.id,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || '',
        name: clerkUser.fullName || clerkUser.firstName || null,
      });
    } else if (clerkLoaded && !clerkUser) {
      setCloudUser(null);
    }
  }, [clerkLoaded, clerkUser]);

  // Subscribe to Supabase Realtime for partner watching
  useEffect(() => {
    if (!partner || partner.status !== 'active' || !partner.id) {
      setPartnerRealtimeStatus(null);
      return;
    }

    const unsubscribe = subscribeToPartnerRealtime(partner.id, (status) => {
      setPartnerRealtimeStatus(status);
    });

    return () => {
      unsubscribe();
    };
  }, [partner?.id, partner?.status]);

  useEffect(() => {
    void initAnalytics();
  }, []);

  useEffect(() => {
    void setAnalyticsUserId(cloudUser?.id || null);
  }, [cloudUser?.id]);

  // Apply theme class
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      themeMode === 'dark' ||
      (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Check if previous streak was broken (e.g. user had streak >= 2, but day was skipped and streak fell to 0)
  useEffect(() => {
    try {
      const todayKey = localDayKey(new Date());
      const lastRecordedDay = localStorage.getItem('abyar_last_recorded_day');
      const lastStreakCount = parseInt(localStorage.getItem('abyar_last_streak_count') || '0', 10);

      // Compute current streak from logs
      const currentAch = computeAchievements(logs, 0, goalGlasses, partner);
      const currentStreak = currentAch.streakDays;

      if (lastRecordedDay && lastRecordedDay !== todayKey) {
        // If user had a streak of at least 2 days and now has 0 (streak broken)
        if (lastStreakCount >= 2 && currentStreak === 0) {
          // Play Fotmob-style disappointed goal conceded sound effect
          WaterAlarmAudioService.playStreakBrokenSadSound();
          showToast('زنجیره تداوم قبلی متوقف شد. نگران نباش، از نو بساز!');
        }
      }

      localStorage.setItem('abyar_last_recorded_day', todayKey);
      localStorage.setItem('abyar_last_streak_count', currentStreak.toString());
    } catch (e) {
      console.warn('Streak tracker check error:', e);
    }
  }, [logs, goalGlasses, partner]);

  // Profile actions
  const setName = (newName: string) => {
    setNameState(newName);
    const updated = { name: newName, dailyGoal: goalGlasses };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    showToast(strings.saved);
    if (cloudUser) triggerSync();
  };

  const setGoal = (newGoal: number) => {
    setGoalState(newGoal);
    const updated = { name, dailyGoal: newGoal };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    void trackEvent('goal_updated', {
      goal_glasses: newGoal,
    });
    showToast(`${strings.saved} (هدف: ${formatGlasses(newGoal)})`);
    if (cloudUser) triggerSync();
  };

  const setReminder = (updates: Partial<ReminderSettings>) => {
    const updated = { ...reminder, ...updates };
    setReminderState(updated);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
    void trackEvent('reminder_updated', {
      enabled: updated.enabled,
      interval_minutes: updated.intervalMinutes,
      quiet_hours_enabled: updated.quietHoursEnabled,
      voice_enabled: Boolean(updated.voiceReminderEnabled),
      alarm_enabled: Boolean(updated.escalatingAlarmEnabled),
    });
    showToast(strings.saved);
    if (cloudUser) triggerSync();
  };

  // Filter today's logs
  const todayKey = localDayKey(new Date());
  const todayLogs = useMemo(() => {
    return logs
      .filter((log) => localDayKey(new Date(log.loggedAt)) === todayKey)
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
  }, [logs, todayKey]);

  const todayTotalGlasses = useMemo(() => {
    const sum = todayLogs.reduce((acc, item) => acc + (item.amount || 1), 0);
    return Math.round(sum * 10) / 10;
  }, [todayLogs]);

  // Dynamically compute the exact time of the next scheduled reminder
  const nextReminderFormattedTime = useMemo(() => {
    if (!reminder.enabled) return null;
    const now = new Date();

    // If quiet hours currently active, next reminder is after quiet hours end
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

    if (reminder.quietHoursEnabled) {
      const inQuiet =
        reminder.quietHoursStart < reminder.quietHoursEnd
          ? currentTimeStr >= reminder.quietHoursStart && currentTimeStr <= reminder.quietHoursEnd
          : currentTimeStr >= reminder.quietHoursStart || currentTimeStr <= reminder.quietHoursEnd;

      if (inQuiet) {
        return `پس از ساعت آرامش (${reminder.quietHoursEnd})`;
      }
    }

    const lastDrink = todayLogs[0];
    let nextDate: Date;
    if (lastDrink) {
      const lastDrinkMs = new Date(lastDrink.loggedAt).getTime();
      nextDate = new Date(lastDrinkMs + reminder.intervalMinutes * 60 * 1000);
    } else {
      const [sh, sm] = (reminder.startTime || '08:00').split(':').map(Number);
      nextDate = new Date();
      nextDate.setHours(sh || 8, sm || 0, 0, 0);
      if (nextDate.getTime() < now.getTime()) {
        nextDate = now;
      }
    }

    if (nextDate.getTime() <= now.getTime()) {
      return 'هم‌اکنون';
    }

    return formatTime(nextDate);
  }, [
    reminder.enabled,
    reminder.intervalMinutes,
    reminder.startTime,
    reminder.quietHoursEnabled,
    reminder.quietHoursStart,
    reminder.quietHoursEnd,
    todayLogs,
  ]);

  // Add water action (in glasses)
  const addWater = (glasses: number) => {
    const newLog: WaterLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      amount: glasses,
      loggedAt: new Date().toISOString(),
    };

    const previousTotal = todayTotalGlasses;
    const newTotal = previousTotal + glasses;

    const nextLogs = [newLog, ...logs];
    setLogs(nextLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(nextLogs));
    setLastAddedLogId(newLog.id);
    setLastDrinkTimestamp(Date.now());
    setLastDrinkGlasses(glasses);

    showToast(`+${formatGlasses(glasses)} ${strings.added}`);
    void trackEvent('water_added', {
      glasses,
      previous_total_glasses: previousTotal,
      new_total_glasses: newTotal,
    });

    // Play soothing natural water sound effect based on preference
    const soundEffect = reminder.waterSoundEffect || 'crystal_drop';
    WaterAlarmAudioService.playWaterDrinkSound(soundEffect, glasses);

    // CRITICAL: Cancel any active persistent alarm, web speech, or recurring 10-min timeouts.
    // Drinking water early automatically resets the interval timer from the current moment!
    lastNotificationSentAtRef.current = 0;
    NativeBridgeService.cancelPersistentAlarm();
    if (activeAlarmTimeoutRef.current) {
      clearTimeout(activeAlarmTimeoutRef.current);
      activeAlarmTimeoutRef.current = null;
    }

    // 1. Calculate achievements before and after
    const prevAch = computeAchievements(logs, previousTotal, goalGlasses, partner);
    const nextAch = computeAchievements(nextLogs, newTotal, goalGlasses, partner);

    // Check newly unlocked badges
    const prevUnlockedIds = new Set(prevAch.badges.filter((b) => b.unlocked).map((b) => b.id));
    const newlyUnlockedBadge = nextAch.badges.find((b) => b.unlocked && !prevUnlockedIds.has(b.id));

    // Check streak advancement
    const prevStreak = prevAch.streakDays;
    const nextStreak = nextAch.streakDays;

    // Check daily goal completion
    const goalJustCompleted = previousTotal < goalGlasses && newTotal >= goalGlasses;

    if (goalJustCompleted) {
      void trackEvent('goal_completed', {
        goal_glasses: goalGlasses,
        total_glasses: newTotal,
        streak_days: nextStreak,
      });
      // Trigger full Duolingo-style celebration screen (includes streak preservation celebration)
      setTimeout(() => {
        setCurrentScreen('goal-celebration');
      }, 400);
    } else if (newlyUnlockedBadge) {
      void trackEvent('badge_unlocked', {
        badge_id: newlyUnlockedBadge.id,
        badge_title: newlyUnlockedBadge.title,
        badge_xp: newlyUnlockedBadge.xp,
      });
      setTimeout(() => {
        setCelebrationModalPayload({
          type: newlyUnlockedBadge.category === 'milestone' ? 'milestone_unlocked' : 'badge_unlocked',
          title: `تبریک! ${newlyUnlockedBadge.title} را کسب کردی `,
          subtitle: newlyUnlockedBadge.description,
          badgeTitle: newlyUnlockedBadge.title,
          badgeDescription: newlyUnlockedBadge.description,
          iconEmoji: newlyUnlockedBadge.iconEmoji,
          xpGained: newlyUnlockedBadge.xp,
          currentStreak: nextStreak,
          targetStreak: targetStreakDays,
        });
      }, 450);
    } else if (nextStreak >= targetStreakDays && prevStreak < targetStreakDays) {
      void trackEvent('streak_target_completed', {
        target_streak_days: targetStreakDays,
        streak_days: nextStreak,
      });
      setTimeout(() => {
        const targetOpt = STREAK_TARGET_OPTIONS.find((o) => o.days === targetStreakDays);
        setCelebrationModalPayload({
          type: 'streak_target_completed',
          title: `شاهکار کردی! به هدف استریک ${targetStreakDays} روزه رسیدی `,
          subtitle: `تداوم شگفت‌انگیزت نشان‌دهنده اراده و سبک زندگی سالم توست. هدف بعدی را انتخاب کن!`,
          xpGained: targetOpt?.bonusXp || 300,
          currentStreak: nextStreak,
          targetStreak: targetStreakDays,
          showUpgradeTarget: true,
        });
      }, 450);
    } else if (nextStreak > prevStreak && nextStreak > 1 && nextStreak === targetStreakDays - 1) {
      void trackEvent('streak_progress', {
        target_streak_days: targetStreakDays,
        streak_days: nextStreak,
      });
      setTimeout(() => {
        setCelebrationModalPayload({
          type: 'streak_progress',
          title: `فقط ۱ روز تا فتح هدف استریک! `,
          subtitle: `تنها ۱ روز با هدف ${targetStreakDays} روزه فاصله داری. فردا هم ادامه بده تا پاداش بزرگ را بگیری!`,
          currentStreak: nextStreak,
          targetStreak: targetStreakDays,
        });
      }, 450);
    }

    if (cloudUser) triggerSync(nextLogs);
  };

  // Delete water action
  const deleteWater = (id: string) => {
    const nextLogs = logs.filter((l) => l.id !== id);
    setLogs(nextLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(nextLogs));
    if (lastAddedLogId === id) setLastAddedLogId(null);
    void trackEvent('water_deleted', { log_id: id });
    
    // Reset notification tracker so if deleting the log puts the user overdue,
    // the system immediately recalculates and triggers the reminder appropriately.
    lastNotificationSentAtRef.current = 0;

    showToast('ثبت مورد نظر حذف شد');
    if (cloudUser) triggerSync(nextLogs);
  };

  // Undo action
  const undoLastAdd = () => {
    if (lastAddedLogId) {
      void trackEvent('water_undo', {
        log_id: lastAddedLogId,
      });
      deleteWater(lastAddedLogId);
      setLastAddedLogId(null);
      showToast('عملیات لغو شد');
    }
  };

  // Finish Onboarding & trigger driver.js tour
  const finishOnboarding = (userName: string, userGoal: number, remindersEnabled: boolean) => {
    if (userName.trim()) {
      setNameState(userName.trim());
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify({ name: userName.trim(), dailyGoal: userGoal }));
    } else {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify({ name, dailyGoal: userGoal }));
    }
    setGoalState(userGoal);
    setReminderState((prev) => {
      const updated = { ...prev, enabled: remindersEnabled };
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      return updated;
    });

    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
    setShowOnboarding(false);
    setCurrentScreen('main');
    void trackEvent('onboarding_complete', {
      goal_glasses: userGoal,
      reminders_enabled: remindersEnabled,
    });

    // Launch driver.js tour smoothly after DOM mounts main screen
    setTimeout(() => {
      startAppTour();
    }, 400);
  };

  const handleSetShowOnboarding = (show: boolean) => {
    setShowOnboarding(show);
    if (show) {
      setCurrentScreen('onboarding');
    } else {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
      setCurrentScreen('main');
    }
  };

  const startTour = () => {
    setCurrentScreen('main');
    setTimeout(() => {
      startAppTour();
    }, 200);
  };


  // Auth & Cloud Sync
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCloudUser(data.user);
        if (data.partner) setPartner(data.partner);
      } else {
        setCloudUser(null);
        setPartner(null);
      }
    } catch {
      // offline / demo fallback
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Smart Reminder & Escalating 10-Minute Alarm Loop
  useEffect(() => {
    if (!reminder.enabled) {
      if (activeAlarmTimeoutRef.current) {
        clearTimeout(activeAlarmTimeoutRef.current);
        activeAlarmTimeoutRef.current = null;
      }
      return;
    }

    // Request notification permission if not yet granted
    NativeBridgeService.requestNotificationPermission();

    const checkReminderInterval = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

      // Check quiet hours
      if (reminder.quietHoursEnabled) {
        if (reminder.quietHoursStart < reminder.quietHoursEnd) {
          if (currentTimeStr >= reminder.quietHoursStart && currentTimeStr <= reminder.quietHoursEnd) {
            return;
          }
        } else {
          // Crosses midnight (e.g. 23:30 to 08:30)
          if (currentTimeStr >= reminder.quietHoursStart || currentTimeStr <= reminder.quietHoursEnd) {
            return;
          }
        }
      }

      // Check start/end hours
      if (currentTimeStr < reminder.startTime || currentTimeStr > reminder.endTime) {
        return;
      }

      // Check time elapsed since last water drink
      const lastDrinkTime = logs.length > 0 ? new Date(logs[0].loggedAt).getTime() : 0;
      const minutesSinceLastDrink = (Date.now() - lastDrinkTime) / (1000 * 60);

      // If user drank water earlier than interval, DO NOT trigger alarm or notification.
      if (minutesSinceLastDrink < reminder.intervalMinutes) {
        return;
      }

      // Avoid duplicate trigger within the same interval window
      if (
        lastNotificationSentAtRef.current &&
        Date.now() - lastNotificationSentAtRef.current < (reminder.intervalMinutes * 60 * 1000 - 30000)
      ) {
        return;
      }

      lastNotificationSentAtRef.current = Date.now();
      void trackEvent('reminder_notification_triggered', {
        expression: minutesSinceLastDrink > 180 || (todayTotalGlasses === 0 && now.getHours() >= 17) ? 'sad' : 'miss_you',
        minutes_since_last_drink: Math.round(minutesSinceLastDrink),
        glasses_today: todayTotalGlasses,
      });

      // Step 1: Fire Initial Notification & Noosh In-App Modal
      NativeBridgeService.showNotification(
        ' وقت نوشیدن آب',
        name ? `${name} عزیز، وقته که یه لیوان آب بنوشی!` : 'وقتشه یه لیوان آب تازه بنوشی!'
      );

      // Trigger In-App Duolingo Noosh Mascot Notification
      const isUrgent = minutesSinceLastDrink > 180 || (todayTotalGlasses === 0 && now.getHours() >= 17);
      triggerNooshNotification({
        expression: isUrgent ? 'sad' : 'miss_you',
        title: 'یادآوری نوشیدن آب ',
        message: name
          ? `${name} عزیز، دلم برات تنگ شده! خیلی وقته آب نخوردی `
          : 'دلم برات تنگ شده! خیلی وقته آب نخوردی ',
        actionText: '+۱ لیوان نوشیدم ',
        autoPlaySound: true,
      });

      // Step 2: If escalating alarm is enabled, trigger voice / ring
      if (reminder.voiceReminderEnabled || reminder.escalatingAlarmEnabled) {
        NativeBridgeService.schedulePersistentAlarm(name, 10);
      }

      // Step 3: If repeatEvery10MinUntilLogged is enabled, schedule recurring check in 10 minutes
      if (reminder.repeatEvery10MinUntilLogged) {
        if (activeAlarmTimeoutRef.current) clearTimeout(activeAlarmTimeoutRef.current);
        activeAlarmTimeoutRef.current = setTimeout(() => {
          checkReminderInterval();
        }, 10 * 60 * 1000);
      }
    };

    const intervalId = setInterval(checkReminderInterval, 60 * 1000);
    return () => {
      clearInterval(intervalId);
      if (activeAlarmTimeoutRef.current) clearTimeout(activeAlarmTimeoutRef.current);
      NativeBridgeService.cancelPersistentAlarm();
    };
  }, [reminder, logs, name]);

  // Sync state to Android widgets / PWA cache
  useEffect(() => {
    const { streakDays } = computeAchievements(logs, todayTotalGlasses, goalGlasses, partner);
    const percent = Math.min(100, Math.round((todayTotalGlasses / (goalGlasses || 8)) * 100));
    NativeBridgeService.updateWidgetData({
      todayGlasses: todayTotalGlasses,
      goalGlasses,
      streakDays,
      percent,
      lastDrinkTime: todayLogs[0]?.loggedAt,
    });
  }, [logs, todayTotalGlasses, goalGlasses, partner, todayLogs]);

  const signOut = async () => {
    // Clerk sign out is handled by ClerkProvider, just clear local state
    setCloudUser(null);
    setPartner(null);
    void trackEvent('sign_out');
    showToast('از حساب ابری خارج شدی');
  };

  const syncNow = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientUpdatedAt: new Date().toISOString(),
          state: {
            profile: { name, dailyGoal: goalGlasses },
            reminder,
            logs,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          if (data.state.profile) {
            setNameState(data.state.profile.name || '');
            setGoalState(data.state.profile.dailyGoal || data.state.profile.dailyGoalMl ? Math.round((data.state.profile.dailyGoalMl || 2000) / 250) : 8);
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.state.profile));
          }
          if (data.state.reminder) {
            setReminderState(data.state.reminder);
            localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(data.state.reminder));
          }
          if (data.state.logs) {
            setLogs(data.state.logs);
            localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data.state.logs));
          }
        }
        if (data.partner) {
          setPartner(data.partner);
        }
        const nowStr = new Date().toISOString();
        setLastSyncAt(nowStr);
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, nowStr);
        showToast('اطلاعات با سرور همگام شد');
      }
    } catch {
      showToast(strings.syncFailed);
    } finally {
      setIsSyncing(false);
    }
  };

  const triggerSync = async (customLogs?: WaterLog[]) => {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientUpdatedAt: new Date().toISOString(),
          state: {
            profile: { name, dailyGoal: goalGlasses },
            reminder,
            logs: customLogs || logs,
          },
        }),
      });
    } catch {}
  };

  // Partner APIs
  const createPartnerInvite = async (): Promise<string> => {
    const res = await fetch('/api/partner/invite', { method: 'POST' });
    if (!res.ok) throw new Error('Invite creation failed');
    const data = await res.json();
    setPartner(data.partner);
    void trackEvent('partner_invite_created');
    return data.inviteCode;
  };

  const connectPartner = async (inviteCode: string) => {
    const res = await fetch('/api/partner/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode }),
    });
    if (!res.ok) throw new Error('Invalid code');
    const data = await res.json();
    setPartner(data.partner);
    showToast(strings.connectSuccess);
    void trackEvent('partner_connected');
  };

  const setSharing = async (
    key: 'shareProgress' | 'shareLastDrink' | 'shareHistory',
    value: boolean,
  ) => {
    if (!partner) return;
    const updated = { ...partner, [key]: value };
    setPartner(updated);

    await fetch('/api/partner/sharing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shareProgress: updated.shareProgress,
        shareLastDrink: updated.shareLastDrink,
        shareHistory: updated.shareHistory,
      }),
    });
    showToast(strings.saved);
    void trackEvent('partner_sharing_updated', {
      share_key: key,
      enabled: value,
    });
  };

  const disconnectPartner = async () => {
    await fetch('/api/partner/disconnect', { method: 'POST' });
    setPartner(null);
    void trackEvent('partner_disconnected');
    showToast('ارتباط با همراه قطع شد');
  };

  const getPartnerShared = async () => {
    const res = await fetch('/api/partner/shared');
    if (!res.ok) return null;
    return await res.json();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentScreen,
        setCurrentScreen,
        selectedBrandKey,
        setSelectedBrandKey,
        startTour,
        themeMode,
        setThemeMode,
        toastMessage,
        showToast,
        nooshNotificationPayload,
        triggerNooshNotification,
        closeNooshNotification,
        showOnboarding,
        setShowOnboarding: handleSetShowOnboarding,
        finishOnboarding,
        name,
        setName,
        goalGlasses,

        goalMl: goalGlasses, // backward-compat alias
        setGoal,
        logs,
        todayLogs,
        todayTotalGlasses,
        todayTotalMl: todayTotalGlasses, // backward-compat alias
        addWater,
        deleteWater,
        undoLastAdd,
        lastAddedLogId,
        lastDrinkTimestamp,
        lastDrinkGlasses,
        reminder,
        setReminder,
        nextReminderFormattedTime,
        targetStreakDays,
        setTargetStreakDays,
        celebrationModalPayload,
        triggerCelebrationModal,
        closeCelebrationModal,
        cloudUser,
        signOut,
        isSyncing,
        lastSyncAt,
        syncNow,
        partner,
        partnerRealtimeStatus,
        createPartnerInvite,
        connectPartner,
        setSharing,
        disconnectPartner,
        getPartnerShared,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
