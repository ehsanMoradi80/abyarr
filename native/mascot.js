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
      badge: 'قهرمان آب',
      title: 'فوق‌العاده‌اید!',
      quote: 'به هدف امروزتان رسیدید! بدنتان اکنون کاملاً شاداب و سرزنده‌ است.',
      color: '#10B981',
      bg: '#ECFDF5',
    };
  }

  if (hoursSinceLastDrink >= 2.5 && todayGlasses > 0) {
    return {
      type: MASCOT_EXPRESSIONS.MISS_YOU,
      badge: 'دلتنگ آب',
      title: 'یک جرعه سلامتی...',
      quote: 'سلول‌های بدنتان اکنون به آب گوارا نیاز دارند.',
      color: '#0284C7',
      bg: '#E0F2FE',
    };
  }

  if (ratio >= 0.6) {
    return {
      type: MASCOT_EXPRESSIONS.ENERGIZED,
      badge: 'پرانرژی و نزدیک هدف',
      title: 'عالی پیش رفتید!',
      quote: 'بیشتر از نصف مسیر را رفته‌اید، فقط چند لیوان دیگر تا تکمیل هدف باقی مانده است.',
      color: '#2563EB',
      bg: '#EFF6FF',
    };
  }

  return {
    type: MASCOT_EXPRESSIONS.HAPPY,
    badge: 'همراه شاداب شما',
    title: 'سلام دوست من!',
    quote: 'نوشیدن آب، قشنگ‌ترین یادآوری عشق به خودتان است.',
    color: '#2D9CFF',
    bg: '#E6F4FF',
  };
}
