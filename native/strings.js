// Persian strings and formatting utilities for Noosh React Native App

export const strings = {
  appName: 'نوش',
  tagline: 'نوشیدن آب، یادآوری عشق به خودت',
  greeting: 'آب خوردن یادت نره',
  dailyGoal: 'هدف روزانه',
  progress: 'پیشرفت امروز',
  remaining: 'مانده تا هدف',
  completed: 'هدف امروز کامل شد!',
  quickAdd: 'ثبت سریع مصرف آب',
  todayLogs: 'گزارش مصرف امروز',
  noLogsToday: 'امروز هنوز آبی ثبت نشده است. با یک لیوان شروع کنید!',
  customAmount: 'ثبت مقدار دلخواه',
  history: 'تاریخچه',
  stats: 'گزارش و آمار',
  settings: 'تنظیمات',
  home: 'خانه',
  streak: 'زنجیره پیوستگی',
  cupsConsumed: 'لیوان‌های مصرفی',
  delete: 'حذف',
  undo: 'بازگردانی آخرین ثبت',
  justNow: 'همین حالا',
  minutesAgo: 'دقیقه پیش',
  hoursAgo: 'ساعت پیش',
  daysAgo: 'روز پیش',
  save: 'ذخیره',
  cancel: 'انصراف',
  resetToday: 'صفر کردن مصرف امروز',
  resetConfirm: 'آیا مطمئن هستید که می‌خواهید آمار مصرف امروز را صفر کنید؟',
  reminderTitle: 'وقت نوشیدن آب!',
  reminderBody: 'یک لیوان آب تازه برای سلامتی و شادابیت بنوشید!',
  drinkWater: 'نوشیدن',
  ml: 'میلی‌لیتر',
  glass: 'لیوان',
};

export function formatNumber(num) {
  if (num === null || num === undefined) return '۰';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (d) => persianDigits[Number(d)]);
}

export function formatGlasses(count) {
  if (count === 0.5) return 'نصف لیوان';
  if (count === 1) return '۱ لیوان';
  return `${formatNumber(count)} لیوان`;
}

export function formatTime(dateOrIso) {
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
  try {
    return new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(date);
  } catch (e) {
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${formatNumber(hours)}:${formatNumber(mins)}`;
  }
}

export function formatDate(dateOrIso) {
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      day: 'numeric',
      month: 'long',
    }).format(date);
  } catch (e) {
    return date.toLocaleDateString();
  }
}

export function formatDayOfWeek(dateOrIso) {
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'short' }).format(date);
  } catch (e) {
    const days = ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    return days[date.getDay()];
  }
}

export function relativeTimeFromNow(isoString) {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));

  if (diffMins < 1) return strings.justNow;
  if (diffMins < 60) return `${formatNumber(diffMins)} ${strings.minutesAgo}`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${formatNumber(diffHours)} ${strings.hoursAgo}`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${formatNumber(diffDays)} ${strings.daysAgo}`;
  return formatDate(date);
}

export function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
