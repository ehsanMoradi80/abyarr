export interface WaterLog {
  id: string;
  amount: number; // in glasses (لیوان)
  amountMl?: number; // legacy fallback
  loggedAt: string;
}

export type WaterSoundEffect = 'crystal_drop' | 'gentle_bubble' | 'crisp_pour' | 'subtle_pop' | 'silent';

export interface ReminderSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
  intervalMinutes: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  voiceReminderEnabled?: boolean; // پخش صدای فارسی با نام کاربر
  escalatingAlarmEnabled?: boolean; // زنگ خوردن در صورت عدم ثبت
  repeatEvery10MinUntilLogged?: boolean; // زنگ خوردن مداوم هر ۱۰ دقیقه تا زمان ثبت آب
  waterSoundEffect?: WaterSoundEffect; // صدای هنگام ثبت آب
}

export interface UserProfile {
  name: string;
  dailyGoal: number; // in glasses (لیوان)
  dailyGoalMl?: number; // legacy fallback
}

export interface AuthUser {
  id: string;
  phone: string;
  name: string | null;
}

export interface PartnerConnection {
  id: string;
  status: 'pending' | 'active';
  role: 'owner' | 'partner';
  partnerName: string | null;
  inviteCode: string | null;
  canManageSharing: boolean;
  shareProgress: boolean;
  shareLastDrink: boolean;
  shareHistory: boolean;
}

export interface PartnerSharedData {
  partnerName: string;
  progress?: {
    totalGlasses: number;
    goalGlasses: number;
    percent: number;
  };
  lastDrink?: WaterLog | null;
  history?: WaterLog[];
}

export interface GamificationBadge {
  id: 'glass' | 'mascot' | 'clock' | 'waves';
  level: number;
  title: string;
  slogan: string;
  description: string;
  requirement: string;
  unlocked: boolean;
  progressPercent: number;
  xpPoints: number;
}

export type BrandScreenKey = 'glass' | 'mascot' | 'clock' | 'waves';
export type TabType = 'home' | 'history' | 'stats' | 'settings';
export type AppScreen =
  | 'main'
  | 'onboarding'
  | 'gamification'
  | 'brand-detail'
  | 'auth'
  | 'partner'
  | 'splash'
  | 'goal-celebration'
  | 'widgets';
export type ThemeMode = 'light' | 'dark' | 'system';

export type CelebrationTriggerType =
  | 'badge_unlocked'
  | 'milestone_unlocked'
  | 'streak_progress'
  | 'streak_target_completed'
  | 'streak_maintained';

export interface CelebrationModalPayload {
  type: CelebrationTriggerType;
  title: string;
  subtitle: string;
  badgeTitle?: string;
  badgeDescription?: string;
  iconEmoji?: string;
  imageKey?: 'cheer' | 'heart' | 'sleep' | 'splash' | 'streakFire' | 'badgeTrophy' | 'milestoneDiamond' | 'streakUpgrade';
  xpGained?: number;
  currentStreak?: number;
  targetStreak?: number;
  showUpgradeTarget?: boolean;
}



