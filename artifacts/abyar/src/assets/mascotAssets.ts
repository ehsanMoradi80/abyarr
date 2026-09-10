import nooshHappyImg from './images/noosh_mascot_happy_1788352192771.png';
import nooshMissYouImg from './images/noosh_mascot_missyou_1788352208455.png';
import nooshCelebrateImg from './images/noosh_mascot_celebrate_1788352221766.png';
import nooshSadImg from './images/noosh_mascot_sad_1788352236506.png';

export type NooshExpression = 'happy' | 'miss_you' | 'celebrate' | 'sad';

export interface NooshStateMeta {
  id: NooshExpression;
  persianTitle: string;
  persianSubtitle: string;
  image: string;
  bubbleType: 'speech' | 'thought' | 'celebration' | 'alert';
  bubbleIcon: string;
  defaultPhrase: string;
  phrases: string[];
  themeColor: string;
  badgeBg: string;
  badgeText: string;
  animationType: 'bounce' | 'plead' | 'celebrate' | 'sigh';
}

export const NOOSH_MASCOT_STATES: Record<NooshExpression, NooshStateMeta> = {
  happy: {
    id: 'happy',
    persianTitle: 'حالت خوشحال',
    persianSubtitle: 'همراه شاداب تو برای شروع روز و ثبت آب',
    image: nooshHappyImg,
    bubbleType: 'speech',
    bubbleIcon: '💙',
    defaultPhrase: 'سلام دوست من! آماده‌ای امروز بدنت رو پرانرژی نگه داریم؟ 🌊',
    phrases: [
      'سلام! آب خوردن یادت نره 💙',
      'یک لیوان آب خنک، حال دلت رو خوب می‌کنه!',
      'همراهتم تا همیشه شاداب و پرانرژی باشی ✨',
      'نوشیدن آب، قشنگ‌ترین یادآوری عشق به خودته!',
    ],
    themeColor: '#2D9CFF',
    badgeBg: 'bg-[#E6F4FF] dark:bg-[#1E3A5F]',
    badgeText: 'text-[#0066CC] dark:text-[#93C5FD]',
    animationType: 'bounce',
  },
  miss_you: {
    id: 'miss_you',
    persianTitle: 'حالت دلتنگی',
    persianSubtitle: 'یادآوری دوستانه وقتی مدتیه آب ننوشیدی',
    image: nooshMissYouImg,
    bubbleType: 'thought',
    bubbleIcon: '🥛',
    defaultPhrase: 'دلم برات تنگ شده! خیلی وقته یه لیوان آب نخوردی... 🥺',
    phrases: [
      'خیلی وقته منتظرم بیای آب بنوشی 🥺🥛',
      'سلول‌های بدنت الان به آب نیاز دارن!',
      'فقط یک لیوان کوچیک، بیا با هم بنوشیم 💙',
      'نذار تشنگی خسته‌ات کنه، وقتشه یه جرعه آب بنوشی!',
    ],
    themeColor: '#0284C7',
    badgeBg: 'bg-[#E0F2FE] dark:bg-[#075985]/40',
    badgeText: 'text-[#0369A1] dark:text-[#7DD3FC]',
    animationType: 'plead',
  },
  celebrate: {
    id: 'celebrate',
    persianTitle: 'حالت جشن و موفقیت',
    persianSubtitle: 'تبریک تکمیل هدف روزانه، ارتقای استریک و مدال‌ها',
    image: nooshCelebrateImg,
    bubbleType: 'celebration',
    bubbleIcon: '🎉',
    defaultPhrase: 'هورااا! فوق‌العاده بودی! به هدفت رسیدی 🎉🥳',
    phrases: [
      'آفرین به اراده و پشتکارت! 🎉💧',
      'امروز رو ترکوندی! بدنت ازت ممنونه 🥳',
      'زنجیره استریکت حفظ شد، ادامه بده قهرمان! 🔥',
      'یک قدم بزرگ به سمت سلامتی کامل برداشتی! ✨',
    ],
    themeColor: '#F59E0B',
    badgeBg: 'bg-[#FEF3C7] dark:bg-[#78350F]/40',
    badgeText: 'text-[#B45309] dark:text-[#FDE68A]',
    animationType: 'celebrate',
  },
  sad: {
    id: 'sad',
    persianTitle: 'حالت ناراحت',
    persianSubtitle: 'هشدار جدی تشنگی و از دست رفتن زنجیره استریک',
    image: nooshSadImg,
    bubbleType: 'alert',
    bubbleIcon: '💧',
    defaultPhrase: 'ناراحتم که امروز آب کم خوردی... حواست به بدنت هست؟ 😢',
    phrases: [
      'امروز خیلی کم آب خوردی، نگرانتم 😢',
      'نذار زنجیره استریکت خاموش بشه! فقط ۱ لیوان بنوش 🔥',
      'بدنت تشنه مونده، بیا همین الان یه لیوان بنوشیم 💧',
      'من همیشه مراقبتم، لطفا به خودت اهمیت بده 💙',
    ],
    themeColor: '#EF4444',
    badgeBg: 'bg-[#FEE2E2] dark:bg-[#7F1D1D]/40',
    badgeText: 'text-[#B91C1C] dark:text-[#FCA5A5]',
    animationType: 'sigh',
  },
};
