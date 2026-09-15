import { WaterLog, BrandScreenKey, PartnerConnection } from '../types';
import { localDayKey } from '../constants/strings';

export interface StreakTargetOption {
  days: number;
  title: string;
  badgeTitle: string;
  bonusXp: number;
  icon: string;
  difficultyLabel: string;
  color: string;
  gradient: string;
}

export const STREAK_TARGET_OPTIONS: StreakTargetOption[] = [
  {
    days: 3,
    title: '۳ روز پیوسته',
    badgeTitle: 'شعله تداوم',
    bonusXp: 100,
    icon: '',
    difficultyLabel: 'شروع پرانرژی',
    color: '#F59E0B',
    gradient: 'from-[#FEF3C7] to-[#FDE68A] dark:from-[#78350F]/50 dark:to-[#92400E]/50',
  },
  {
    days: 7,
    title: '۷ روز طلایی',
    badgeTitle: 'هفته طلایی',
    bonusXp: 300,
    icon: '',
    difficultyLabel: 'محبوب‌ترین',
    color: '#2D9CFF',
    gradient: 'from-[#E6F4FF] to-[#CBE8FF] dark:from-[#1E3A5F] dark:to-[#172E4C]',
  },
  {
    days: 14,
    title: '۱۴ روز استواری',
    badgeTitle: 'استاد عادت',
    bonusXp: 700,
    icon: '',
    difficultyLabel: 'پیشرفته',
    color: '#8B5CF6',
    gradient: 'from-[#F3E8FF] to-[#DDD6FE] dark:from-[#581C87]/40 dark:to-[#6B21A8]/40',
  },
  {
    days: 21,
    title: '۲۱ روز تحول',
    badgeTitle: 'تثبیت سبک زندگی',
    bonusXp: 1200,
    icon: '',
    difficultyLabel: 'تثبیت پایدار',
    color: '#10B981',
    gradient: 'from-[#D1FAE5] to-[#A7F3D0] dark:from-[#064E3B]/40 dark:to-[#065F46]/40',
  },
  {
    days: 30,
    title: '۳۰ روز قهرمانی',
    badgeTitle: 'ماه قهرمانی',
    bonusXp: 2000,
    icon: '',
    difficultyLabel: 'حرفه‌ای و مانا',
    color: '#EC4899',
    gradient: 'from-[#FCE7F3] to-[#FBCFE8] dark:from-[#831843]/40 dark:to-[#9D174D]/40',
  },
  {
    days: 60,
    title: '۶۰ روز الماس',
    badgeTitle: 'الماس استواری',
    bonusXp: 4500,
    icon: '',
    difficultyLabel: 'افسانه‌ای',
    color: '#06B6D4',
    gradient: 'from-[#CFFAFE] to-[#A5F3FC] dark:from-[#164E63]/40 dark:to-[#155E75]/40',
  },
  {
    days: 100,
    title: '۱۰۰ روز بی‌پایان',
    badgeTitle: 'افسانه صد روزه',
    bonusXp: 10000,
    icon: '',
    difficultyLabel: 'ابرقهرمان سلامت',
    color: '#EAB308',
    gradient: 'from-[#FEF9C3] to-[#FEF08A] dark:from-[#713F12]/40 dark:to-[#854D0E]/40',
  },
];

export function getNextStreakTarget(currentDays: number): StreakTargetOption {
  const next = STREAK_TARGET_OPTIONS.find((opt) => opt.days > currentDays);
  return next || STREAK_TARGET_OPTIONS[STREAK_TARGET_OPTIONS.length - 1];
}

export interface AchievementBadge {
  id: string;
  category: 'milestone' | 'streak' | 'volume' | 'timing' | 'special';
  title: string;
  description: string;
  iconEmoji: string;
  xp: number;
  unlocked: boolean;
  progressPercent: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  brandKey?: BrandScreenKey;
}


export function computeAchievements(
  logs: WaterLog[],
  todayGlasses: number,
  goalGlasses: number,
  partner: PartnerConnection | null
): {
  badges: AchievementBadge[];
  streakDays: number;
  totalXP: number;
  unlockedCount: number;
  streakWeekStatus: boolean[]; // 7 days status for compact bar
} {
  // 1. Calculate streak
  const dayTotals: Record<string, number> = {};
  logs.forEach((log) => {
    const day = localDayKey(new Date(log.loggedAt));
    dayTotals[day] = (dayTotals[day] || 0) + (log.amount || 1);
  });

  const today = new Date();
  let streak = 0;

  // Check today or yesterday
  const todayKey = localDayKey(today);
  let checkDate = new Date();
  
  // If today has reached at least 1 glass, count today, otherwise start checking from yesterday
  if ((dayTotals[todayKey] || 0) > 0) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayKey = localDayKey(checkDate);
    if ((dayTotals[yesterdayKey] || 0) > 0) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Count backwards
  while (true) {
    const k = localDayKey(checkDate);
    if ((dayTotals[k] || 0) > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      if (streak > 365) break;
    } else {
      break;
    }
  }

  // 7-day status (past 7 days including today)
  const streakWeekStatus: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = localDayKey(d);
    streakWeekStatus.push((dayTotals[k] || 0) > 0);
  }

  // Aggregate stats
  const totalGlassesEver = logs.reduce((sum, l) => sum + (l.amount || 1), 0);
  const totalLogsEver = logs.length;

  // Days with goal completed
  const completedDaysCount = Object.values(dayTotals).filter((v) => v >= goalGlasses && goalGlasses > 0).length;
  
  // Check timing
  const hasEarlyMorning = logs.some((l) => {
    const h = new Date(l.loggedAt).getHours();
    return h >= 5 && h <= 8;
  });

  const hasMidday = logs.some((l) => {
    const h = new Date(l.loggedAt).getHours();
    return h >= 11 && h <= 14;
  });

  const hasAfternoon = logs.some((l) => {
    const h = new Date(l.loggedAt).getHours();
    return h >= 14 && h <= 18;
  });

  const hasNight = logs.some((l) => {
    const h = new Date(l.loggedAt).getHours();
    return h >= 20 && h <= 23;
  });

  const hasWeekendLog = logs.some((l) => {
    const day = new Date(l.loggedAt).getDay();
    return day === 4 || day === 5 || day === 0 || day === 6; // Thursday, Friday or weekend
  });

  const todayLogsCount = logs.filter(
    (l) => localDayKey(new Date(l.loggedAt)) === todayKey
  ).length;

  const isPartnerConnected = partner?.status === 'active';

  // Define full rich badge catalog with diverse milestones
  const badges: AchievementBadge[] = [
    // 4 Flagship Milestones
    {
      id: 'brand-glass',
      category: 'milestone',
      title: 'قطره آغازین',
      description: 'نوشیدن اولین لیوان آب روزانه',
      iconEmoji: '',
      xp: 25,
      unlocked: totalLogsEver > 0,
      progressPercent: totalLogsEver > 0 ? 100 : 0,
      currentValue: Math.min(1, totalLogsEver),
      targetValue: 1,
      unit: 'لیوان',
      brandKey: 'glass',
    },
    {
      id: 'brand-mascot',
      category: 'milestone',
      title: 'نشاط و انرژی',
      description: 'رسیدن به ۵۰٪ هدف مصرف روزانه',
      iconEmoji: '',
      xp: 50,
      unlocked: todayGlasses >= goalGlasses * 0.5 && goalGlasses > 0,
      progressPercent: Math.min(100, Math.round((todayGlasses / (goalGlasses * 0.5 || 1)) * 100)),
      currentValue: todayGlasses,
      targetValue: Math.ceil(goalGlasses * 0.5),
      unit: 'لیوان',
      brandKey: 'mascot',
    },
    {
      id: 'brand-clock',
      category: 'milestone',
      title: 'نظم و تعادل',
      description: 'تکمیل ۱۰۰٪ هدف مصرف روزانه',
      iconEmoji: '⏰',
      xp: 100,
      unlocked: todayGlasses >= goalGlasses && goalGlasses > 0,
      progressPercent: Math.min(100, Math.round((todayGlasses / (goalGlasses || 1)) * 100)),
      currentValue: todayGlasses,
      targetValue: goalGlasses,
      unit: 'لیوان',
      brandKey: 'clock',
    },
    {
      id: 'brand-waves',
      category: 'milestone',
      title: 'اقیانوس تداوم',
      description: 'حفظ زنجیره مصرف ۳ روزه یا بیشتر',
      iconEmoji: '',
      xp: 200,
      unlocked: streak >= 3,
      progressPercent: Math.min(100, Math.round((streak / 3) * 100)),
      currentValue: streak,
      targetValue: 3,
      unit: 'روز',
      brandKey: 'waves',
    },

    // Daily Goal Completion Milestones
    {
      id: 'goal-1',
      category: 'milestone',
      title: 'نخستین فتح',
      description: 'تکمیل ۱۰۰٪ هدف روزانه برای ۱ روز',
      iconEmoji: '',
      xp: 50,
      unlocked: completedDaysCount >= 1,
      progressPercent: Math.min(100, Math.round((completedDaysCount / 1) * 100)),
      currentValue: completedDaysCount,
      targetValue: 1,
      unit: 'روز کامل',
    },
    {
      id: 'goal-5',
      category: 'milestone',
      title: 'پنجگانه طلایی',
      description: '۵ روز تکمیل کامل هدف روزانه',
      iconEmoji: '',
      xp: 120,
      unlocked: completedDaysCount >= 5,
      progressPercent: Math.min(100, Math.round((completedDaysCount / 5) * 100)),
      currentValue: completedDaysCount,
      targetValue: 5,
      unit: 'روز کامل',
    },
    {
      id: 'goal-15',
      category: 'milestone',
      title: 'استاد تعادل',
      description: '۱۵ روز تکمیل کامل هدف روزانه',
      iconEmoji: '',
      xp: 250,
      unlocked: completedDaysCount >= 15,
      progressPercent: Math.min(100, Math.round((completedDaysCount / 15) * 100)),
      currentValue: completedDaysCount,
      targetValue: 15,
      unit: 'روز کامل',
    },
    {
      id: 'goal-30',
      category: 'milestone',
      title: 'سی روز پیروزی',
      description: '۳۰ روز تکمیل کامل هدف مصرف آب',
      iconEmoji: '',
      xp: 500,
      unlocked: completedDaysCount >= 30,
      progressPercent: Math.min(100, Math.round((completedDaysCount / 30) * 100)),
      currentValue: completedDaysCount,
      targetValue: 30,
      unit: 'روز کامل',
    },

    // Streak Milestones
    {
      id: 'streak-1',
      category: 'streak',
      title: 'گام نخست',
      description: 'شروع سفر سلامت و ثبت اولین روز تداوم',
      iconEmoji: '',
      xp: 30,
      unlocked: streak >= 1,
      progressPercent: Math.min(100, Math.round((streak / 1) * 100)),
      currentValue: streak,
      targetValue: 1,
      unit: 'روز',
    },
    {
      id: 'streak-3',
      category: 'streak',
      title: 'شعله تداوم',
      description: '۳ روز نوشیدن مداوم آب',
      iconEmoji: '',
      xp: 75,
      unlocked: streak >= 3,
      progressPercent: Math.min(100, Math.round((streak / 3) * 100)),
      currentValue: streak,
      targetValue: 3,
      unit: 'روز',
    },
    {
      id: 'streak-7',
      category: 'streak',
      title: 'هفته طلایی',
      description: '۷ روز تداوم بی‌وقفه مصرف آب',
      iconEmoji: '',
      xp: 150,
      unlocked: streak >= 7,
      progressPercent: Math.min(100, Math.round((streak / 7) * 100)),
      currentValue: streak,
      targetValue: 7,
      unit: 'روز',
    },
    {
      id: 'streak-14',
      category: 'streak',
      title: 'استاد عادت',
      description: '۱۴ روز حفظ ریتم سلامت',
      iconEmoji: '',
      xp: 300,
      unlocked: streak >= 14,
      progressPercent: Math.min(100, Math.round((streak / 14) * 100)),
      currentValue: streak,
      targetValue: 14,
      unit: 'روز',
    },
    {
      id: 'streak-21',
      category: 'streak',
      title: 'تثبیت عادت',
      description: '۲۱ روز پیوستگی برای ساخت سبک زندگی پایدار',
      iconEmoji: '',
      xp: 450,
      unlocked: streak >= 21,
      progressPercent: Math.min(100, Math.round((streak / 21) * 100)),
      currentValue: streak,
      targetValue: 21,
      unit: 'روز',
    },
    {
      id: 'streak-30',
      category: 'streak',
      title: 'ماه قهرمانی',
      description: '۳۰ روز تداوم کامل و درخشان',
      iconEmoji: '',
      xp: 600,
      unlocked: streak >= 30,
      progressPercent: Math.min(100, Math.round((streak / 30) * 100)),
      currentValue: streak,
      targetValue: 30,
      unit: 'روز',
    },
    {
      id: 'streak-60',
      category: 'streak',
      title: 'الماس استواری',
      description: '۶۰ روز حفظ پیوسته سلامت و هیدراتاسیون',
      iconEmoji: '',
      xp: 900,
      unlocked: streak >= 60,
      progressPercent: Math.min(100, Math.round((streak / 60) * 100)),
      currentValue: streak,
      targetValue: 60,
      unit: 'روز',
    },
    {
      id: 'streak-100',
      category: 'streak',
      title: 'افسانه صد روزه',
      description: '۱۰۰ روز رکورد بی‌نظیر نوشیدن آب',
      iconEmoji: '',
      xp: 1500,
      unlocked: streak >= 100,
      progressPercent: Math.min(100, Math.round((streak / 100) * 100)),
      currentValue: streak,
      targetValue: 100,
      unit: 'روز',
    },

    // Volume Milestones
    {
      id: 'vol-5',
      category: 'volume',
      title: 'نخستین جوانه',
      description: 'نوشیدن ۵ لیوان آب در برنامه',
      iconEmoji: '',
      xp: 25,
      unlocked: totalGlassesEver >= 5,
      progressPercent: Math.min(100, Math.round((totalGlassesEver / 5) * 100)),
      currentValue: totalGlassesEver,
      targetValue: 5,
      unit: 'لیوان',
    },
    {
      id: 'vol-10',
      category: 'volume',
      title: 'چشمه پاکی',
      description: 'نوشیدن ۱۰ لیوان در کل تاریخچه',
      iconEmoji: '',
      xp: 40,
      unlocked: totalGlassesEver >= 10,
      progressPercent: Math.min(100, Math.round((totalGlassesEver / 10) * 100)),
      currentValue: totalGlassesEver,
      targetValue: 10,
      unit: 'لیوان',
    },
    {
      id: 'vol-25',
      category: 'volume',
      title: 'جویبار زلال',
      description: 'ثبت ۲۵ لیوان آب گوارا',
      iconEmoji: '',
      xp: 80,
      unlocked: totalGlassesEver >= 25,
      progressPercent: Math.min(100, Math.round((totalGlassesEver / 25) * 100)),
      currentValue: totalGlassesEver,
      targetValue: 25,
      unit: 'لیوان',
    },
    {
      id: 'vol-50',
      category: 'volume',
      title: 'رودخانه سلامت',
      description: 'ثبت ۵۰ لیوان آب',
      iconEmoji: '',
      xp: 120,
      unlocked: totalGlassesEver >= 50,
      progressPercent: Math.min(100, Math.round((totalGlassesEver / 50) * 100)),
      currentValue: totalGlassesEver,
      targetValue: 50,
      unit: 'لیوان',
    },
    {
      id: 'vol-100',
      category: 'volume',
      title: 'باشگاه ۱۰۰ تایی',
      description: 'ثبت ۱۰۰ لیوان آب گوارا',
      iconEmoji: '',
      xp: 250,
      unlocked: totalGlassesEver >= 100,
      progressPercent: Math.min(100, Math.round((totalGlassesEver / 100) * 100)),
      currentValue: totalGlassesEver,
      targetValue: 100,
      unit: 'لیوان',
    },
    {
      id: 'vol-250',
      category: 'volume',
      title: 'دریاچه فیروزه‌ای',
      description: 'ثبت ۲۵۰ لیوان آب گوارا',
      iconEmoji: '',
      xp: 500,
      unlocked: totalGlassesEver >= 250,
      progressPercent: Math.min(100, Math.round((totalGlassesEver / 250) * 100)),
      currentValue: totalGlassesEver,
      targetValue: 250,
      unit: 'لیوان',
    },
    {
      id: 'vol-500',
      category: 'volume',
      title: 'اقیانوس گوارا',
      description: 'ثبت ۵۰۰ لیوان آب گوارا',
      iconEmoji: '',
      xp: 1000,
      unlocked: totalGlassesEver >= 500,
      progressPercent: Math.min(100, Math.round((totalGlassesEver / 500) * 100)),
      currentValue: totalGlassesEver,
      targetValue: 500,
      unit: 'لیوان',
    },
    {
      id: 'vol-1000',
      category: 'volume',
      title: 'افسانه هیدراتاسیون',
      description: 'رسیدن به مرز ۱۰۰۰ لیوان آب',
      iconEmoji: '',
      xp: 2000,
      unlocked: totalGlassesEver >= 1000,
      progressPercent: Math.min(100, Math.round((totalGlassesEver / 1000) * 100)),
      currentValue: totalGlassesEver,
      targetValue: 1000,
      unit: 'لیوان',
    },

    // Timing & Routine Badges
    {
      id: 'time-morning',
      category: 'timing',
      title: 'سحرخیز باطراوت',
      description: 'نوشیدن آب بین ۵ تا ۸:۳۰ صبح',
      iconEmoji: '',
      xp: 60,
      unlocked: hasEarlyMorning,
      progressPercent: hasEarlyMorning ? 100 : 0,
      currentValue: hasEarlyMorning ? 1 : 0,
      targetValue: 1,
      unit: 'بار',
    },
    {
      id: 'time-midday',
      category: 'timing',
      title: 'انرژی نیمروزی',
      description: 'نوشیدن آب در ساعات میانی روز (۱۱:۳۰ تا ۱۴)',
      iconEmoji: '',
      xp: 40,
      unlocked: hasMidday,
      progressPercent: hasMidday ? 100 : 0,
      currentValue: hasMidday ? 1 : 0,
      targetValue: 1,
      unit: 'بار',
    },
    {
      id: 'time-afternoon',
      category: 'timing',
      title: 'تجدید قوای عصرگاهی',
      description: 'نوشیدن آب در ساعات بعدازظهر (۱۴ تا ۱۸)',
      iconEmoji: '',
      xp: 40,
      unlocked: hasAfternoon,
      progressPercent: hasAfternoon ? 100 : 0,
      currentValue: hasAfternoon ? 1 : 0,
      targetValue: 1,
      unit: 'بار',
    },
    {
      id: 'time-night',
      category: 'timing',
      title: 'شب‌آرام هیدراته',
      description: 'نوشیدن یک لیوان آب بعد از ساعت ۸ شب',
      iconEmoji: '',
      xp: 40,
      unlocked: hasNight,
      progressPercent: hasNight ? 100 : 0,
      currentValue: hasNight ? 1 : 0,
      targetValue: 1,
      unit: 'بار',
    },
    {
      id: 'routine-4',
      category: 'timing',
      title: 'ریتم چهارگانه',
      description: 'ثبت حداقل ۴ وعده آب مجزا در یک روز',
      iconEmoji: '',
      xp: 80,
      unlocked: todayLogsCount >= 4,
      progressPercent: Math.min(100, Math.round((todayLogsCount / 4) * 100)),
      currentValue: todayLogsCount,
      targetValue: 4,
      unit: 'وعده',
    },
    {
      id: 'routine-6',
      category: 'timing',
      title: 'هیدراتاسیون پیوسته',
      description: 'ثبت ۶ وعده منظم آب در طول یک شبانه‌روز',
      iconEmoji: '⏳',
      xp: 120,
      unlocked: todayLogsCount >= 6,
      progressPercent: Math.min(100, Math.round((todayLogsCount / 6) * 100)),
      currentValue: todayLogsCount,
      targetValue: 6,
      unit: 'وعده',
    },

    // Social / Special Badges
    {
      id: 'partner-linked',
      category: 'special',
      title: 'هم‌مسیر سلامتی',
      description: 'اتصال حساب با همراه سلامت',
      iconEmoji: '',
      xp: 100,
      unlocked: isPartnerConnected,
      progressPercent: isPartnerConnected ? 100 : 0,
      currentValue: isPartnerConnected ? 1 : 0,
      targetValue: 1,
      unit: 'اتصال',
    },
    {
      id: 'weekend-care',
      category: 'special',
      title: 'تعطیلات باطراوت',
      description: 'نوشیدن و ثبت آب در ایام آخر هفته و تعطیل',
      iconEmoji: '',
      xp: 80,
      unlocked: hasWeekendLog,
      progressPercent: hasWeekendLog ? 100 : 0,
      currentValue: hasWeekendLog ? 1 : 0,
      targetValue: 1,
      unit: 'ثبت',
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalXP = badges
    .filter((b) => b.unlocked)
    .reduce((sum, b) => sum + b.xp, 0);

  return {
    badges,
    streakDays: streak,
    totalXP,
    unlockedCount,
    streakWeekStatus,
  };
}
