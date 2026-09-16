// Mascot expressions and motivational messages in Persian

export const MASCOT_EXPRESSIONS = {
  HAPPY: 'happy',
  CELEBRATE: 'celebrate',
  MISS_YOU: 'miss_you',
  SAD: 'sad',
};

export function getMascotMessage(todayGlasses, goalGlasses = 8, hoursSinceLastDrink = 0) {
  const currentHour = new Date().getHours();
  const ratio = todayGlasses / (goalGlasses || 8);

  // 1. Goal completed: Celebrate!
  if (todayGlasses >= goalGlasses && goalGlasses > 0) {
    return {
      type: MASCOT_EXPRESSIONS.CELEBRATE,
      badge: 'قهرمان آب',
      title: 'فوق‌العاده‌اید!',
      quote: 'به هدف امروزتان رسیدید! بدنتان اکنون کاملاً شاداب و سرزنده‌ است.',
      color: '#10B981',
      bg: '#ECFDF5',
    };
  }

  // 2. Severe dehydration warning: Sad
  // - Haven't drank for more than 3.5 hours
  // - Or evening (after 20:00) with less than 50% goal
  // - Or afternoon (after 14:00) with 0 glasses
  if (
    hoursSinceLastDrink >= 3.5 ||
    (currentHour >= 20 && ratio < 0.5) ||
    (currentHour >= 14 && todayGlasses === 0)
  ) {
    return {
      type: MASCOT_EXPRESSIONS.SAD,
      badge: 'هشدار کم‌آبی',
      title: 'تشنه‌ام...',
      quote: 'خیلی وقته آب ننوشیدی! بدنت نیاز به انرژی و رطوبت داره.',
      color: '#EF4444',
      bg: '#FEF2F2',
    };
  }

  // 3. Moderate delay: Miss you (Thirst reminder)
  // - Between 2 and 3.5 hours without drinking
  // - Or mid-day (after 11:00) with 0 glasses
  if (
    hoursSinceLastDrink >= 2 ||
    (currentHour >= 11 && todayGlasses === 0)
  ) {
    return {
      type: MASCOT_EXPRESSIONS.MISS_YOU,
      badge: 'دلتنگ آب',
      title: 'یک جرعه سلامتی...',
      quote: 'سلول‌های بدنتان اکنون به آب گوارا نیاز دارند.',
      color: '#0284C7',
      bg: '#E0F2FE',
    };
  }

  // 4. On track and hydrated: Happy
  // - Recently drank (< 2 hours) or fresh morning start
  return {
    type: MASCOT_EXPRESSIONS.HAPPY,
    badge: 'همراه شاداب شما',
    title: 'سلام دوست من!',
    quote: 'نوشیدن آب، قشنگ‌ترین یادآوری عشق به خودتان است.',
    color: '#2D9CFF',
    bg: '#E6F4FF',
  };
}

