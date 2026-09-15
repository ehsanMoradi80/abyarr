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
    persianSubtitle: 'همراه شاداب شما برای شروع روز و ثبت آب',
    image: nooshHappyImg,
    bubbleType: 'speech',
    bubbleIcon: '',
    defaultPhrase: 'سلام دوست من! آماده‌اید امروز بدنتان را پرانرژی و هیدراته نگه دارید؟',
    phrases: [
      'سلام! نوشیدن آب، قشنگ‌ترین یادآوری عشق به خودتان است.',
      'یک لیوان آب خنک، حال و هوای بدنتان را تازه می‌کند.',
      'همراه شمایم تا همیشه پرانرژی و سرزنده بمانید.',
      'هر قطره آب، سلامتی و شادابی سلول‌های بدن شماست.',
    ],
    themeColor: '#2D9CFF',
    badgeBg: 'bg-[#E6F4FF] dark:bg-[#1E3A5F]',
    badgeText: 'text-[#0066CC] dark:text-[#93C5FD]',
    animationType: 'bounce',
  },
  miss_you: {
    id: 'miss_you',
    persianTitle: 'حالت دلتنگی',
    persianSubtitle: 'یادآوری دوستانه وقتی مدتی است آب ننوشیده‌اید',
    image: nooshMissYouImg,
    bubbleType: 'thought',
    bubbleIcon: '',
    defaultPhrase: 'دلتنگتان شده‌ام! مدتی گذشته و بدنتان به یک لیوان آب خنک نیاز دارد.',
    phrases: [
      'منتظرتان هستم تا یک لیوان آب گوارا بنوشید.',
      'سلول‌های بدنتان اکنون تشنه و چشم‌به‌راه آب هستند.',
      'فقط یک لیوان کوچک، بیایید با هم بنوشیم.',
      'اجازه ندهید خستگی غلبه کند؛ یک جرعه آب شادابتان می‌کند.',
    ],
    themeColor: '#0284C7',
    badgeBg: 'bg-[#E0F2FE] dark:bg-[#075985]/40',
    badgeText: 'text-[#0369A1] dark:text-[#7DD3FC]',
    animationType: 'plead',
  },
  celebrate: {
    id: 'celebrate',
    persianTitle: 'حالت جشن و موفقیت',
    persianSubtitle: 'تبریک تکمیل هدف روزانه و ارتقای استریک',
    image: nooshCelebrateImg,
    bubbleType: 'celebration',
    bubbleIcon: '',
    defaultPhrase: 'فوق‌العاده بودید! به هدف روزانه رسیدید و بدنتان کاملاً هیدراته است.',
    phrases: [
      'آفرین به اراده و نظم شما در حفظ سلامتی!',
      'هدف روزانه را تکمیل کردید، بدنتان قدردان شماست.',
      'زنجیره استریک شما با موفقیت تداوم یافت؛ عالی پیش رفتید.',
      'یک گام ارزشمند دیگر به سوی تندرستی و نشاط برداشتید.',
    ],
    themeColor: '#F59E0B',
    badgeBg: 'bg-[#FEF3C7] dark:bg-[#78350F]/40',
    badgeText: 'text-[#B45309] dark:text-[#FDE68A]',
    animationType: 'celebrate',
  },
  sad: {
    id: 'sad',
    persianTitle: 'حالت ناراحت',
    persianSubtitle: 'هشدار جدی کم‌آبی و خطر از دست رفتن زنجیره استریک',
    image: nooshSadImg,
    bubbleType: 'alert',
    bubbleIcon: '',
    defaultPhrase: 'نگرانم که امروز آب کافی ننوشیده‌اید... مراقب سلامت بدنتان باشید.',
    phrases: [
      'امروز بسیار کم آب نوشیده‌اید؛ بدنتان نیازمند توجه است.',
      'نگذارید زنجیره استریک متوقف شود، همین حالا ۱ لیوان بنوشید.',
      'بدنتان تشنه است، بیایید اکنون یک لیوان آب خنک میل کنید.',
      'من همراه و مراقب شمایم؛ لطفاً سلامتی‌تان را جدی بگیرید.',
    ],
    themeColor: '#EF4444',
    badgeBg: 'bg-[#FEE2E2] dark:bg-[#7F1D1D]/40',
    badgeText: 'text-[#B91C1C] dark:text-[#FCA5A5]',
    animationType: 'sigh',
  },
};
