import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const startAppTour = (onComplete?: () => void) => {
  // Give DOM a tick to ensure elements are rendered
  setTimeout(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: '#0B192C',
      overlayOpacity: 0.75,
      stagePadding: 8,
      stageRadius: 20,
      nextBtnText: 'بعدی',
      prevBtnText: 'قبلی',
      doneBtnText: 'شروع!',
      progressText: 'گام {{current}} از {{total}}',
      steps: [
        {
          element: '#app-header',
          popover: {
            title: 'نوش',
            description: 'دسترسی سریع به نشان‌ها، همراه سلامت و وضعیت همگام‌سازی ابری.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#compact-streak-bar',
          popover: {
            title: 'زنجیره تداوم روزانه',
            description: 'روزهای متوالی مصرف آب را دنبال کنید و با کلیک روی آن، به تالار افتخارات و نشان‌ها بروید.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#noosh-mascot-card',
          popover: {
            title: 'همراه سلامت نوش',
            description: 'کاراکتر هوشمند نوش که با حالت‌های چهره و واکنش‌های بصری متناسب با وضعیت آب بدنتان همراهی‌تان می‌کند.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#progress-ring-card',
          popover: {
            title: 'حلقه هوشمند پیشرفت',
            description: 'میزان آب نوشیده شده امروز و درصد دستیابی به هدف روزانه.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#cup-selector-section',
          popover: {
            title: 'انتخاب اندازه لیوان',
            description: 'اندازه لیوان یا ماگ دلخواه را انتخاب و با یک لمس ثبت کنید.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#nav-quick-add-btn',
          popover: {
            title: 'ثبت سریع (+۱ لیوان)',
            description: 'دکمه شناور همیشه آماده برای ثبت سریع یک لیوان آب.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#app-navigation-bar',
          popover: {
            title: 'ناوبری برنامه',
            description: 'مشاهده تاریخچه، آمار تحلیلی و تنظیمات یادآورهای صوتی.',
            side: 'top',
            align: 'center',
          },
        },
      ],
      onDestroyed: () => {
        if (onComplete) onComplete();
      },
    });

    driverObj.drive();
  }, 100);
};
