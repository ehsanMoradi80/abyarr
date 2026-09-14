// Badges and achievements calculation

export const BADGES = [
  {
    id: 'first_drink',
    title: 'نخستین گام آب',
    desc: 'اولین لیوان آب را ثبت کردی',
    icon: '🌊',
    unlocked: (logs) => logs.length >= 1,
  },
  {
    id: 'goal_met',
    title: 'شادابی کامل',
    desc: 'رسیدن به ۱۰۰٪ هدف روزانه',
    icon: '🎯',
    unlocked: (logs, todayGlasses, goalGlasses) => todayGlasses >= goalGlasses && goalGlasses > 0,
  },
  {
    id: 'streak_3',
    title: 'عادت پایدار',
    desc: '۳ روز متوالی ثبت آب',
    icon: '🔥',
    unlocked: (logs, todayGlasses, goalGlasses, streak) => streak >= 3,
  },
  {
    id: 'streak_7',
    title: 'هفته طلایی',
    desc: '۷ روز زنجیره پیوستگی کامل',
    icon: '🌟',
    unlocked: (logs, todayGlasses, goalGlasses, streak) => streak >= 7,
  },
  {
    id: 'water_master',
    title: 'استاد هیدراتاسیون',
    desc: 'ثبت بیش از ۵۰ لیوان آب در مجموع',
    icon: '💎',
    unlocked: (logs) => {
      const total = logs.reduce((sum, item) => sum + (item.amountGlasses || 1), 0);
      return total >= 50;
    },
  },
];
