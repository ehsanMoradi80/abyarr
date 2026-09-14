// Mascot expressions and motivational messages in Persian

export const MASCOT_EXPRESSIONS = {
  HAPPY: 'happy',
  CELEBRATE: 'celebrate',
  MISS_YOU: 'miss_you',
  ENERGIZED: 'energized',
};

export function getMascotMessage(todayGlasses, goalGlasses, hoursSinceLastDrink = 0) {
  const ratio = todayGlasses / (goalGlasses || 8);

  if (ratio >= 1) {
    return {
      type: MASCOT_EXPRESSIONS.CELEBRATE,
      badge: 'قهرمان آب 🎉',
      title: 'فوق‌العاده‌ای!',
      quote: 'هورا! به هدف امروزت رسیدی! بدنت الان کاملاً شاداب و سرزنده‌ست ✨💧',
      color: '#10B981',
      bg: '#ECFDF5',
    };
  }

  if (hoursSinceLastDrink >= 2.5 && todayGlasses > 0) {
    return {
      type: MASCOT_EXPRESSIONS.MISS_YOU,
      badge: 'دلتنگ آب 🥺',
      title: 'یه جرعه عشق...',
      quote: 'خیلی وقته منتظرتم بیای آب بنوشی! سلول‌های بدنت الان به آب نیاز دارن 💙',
      color: '#0284C7',
      bg: '#E0F2FE',
    };
  }

  if (ratio >= 0.6) {
    return {
      type: MASCOT_EXPRESSIONS.ENERGIZED,
      badge: 'پرانرژی و نزدیک هدف 🚀',
      title: 'عالی پیش رفتی!',
      quote: 'بیشتر از نصف مسیر رو رفتی، فقط چند لیوان دیگه تا درخشش کامل بدنت باقی مونده!',
      color: '#2563EB',
      bg: '#EFF6FF',
    };
  }

  return {
    type: MASCOT_EXPRESSIONS.HAPPY,
    badge: 'همراه شاداب تو 🌊',
    title: 'سلام دوست من!',
    quote: 'نوشیدن آب، قشنگ‌ترین یادآوری عشق به خودته. آماده‌ای امروز بدنت رو پرانرژی نگه داریم؟',
    color: '#2D9CFF',
    bg: '#E6F4FF',
  };
}
