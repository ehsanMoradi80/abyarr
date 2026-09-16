import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  Watch,
  Activity,
  Heart,
  Send,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ThirdPartyScreen: React.FC = () => {
  const { setCurrentScreen, showToast } = useApp();

  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    googleFit: true,
    appleHealth: false,
    strava: true,
    telegramBot: true,
    calendar: false,
  });

  const toggleIntegration = (key: string, name: string) => {
    const next = !integrations[key];
    setIntegrations(prev => ({ ...prev, [key]: next }));
    showToast(next ? `${name} فعال شد` : `${name} غیرفعال شد`);
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            id="thirdparty-back-btn"
            onClick={() => setCurrentScreen('main')}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="بازگشت"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-[#1E293B] dark:text-white">
              اتصال به ساعت و گوشی
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              هماهنگی ساده با برنامه‌های سلامت
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
            <Watch className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-4">
        {/* Simple Friendly Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-l from-[#2D9CFF] to-[#0284C7] text-white shadow-md shadow-[#2D9CFF]/15 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-100">
            <Sparkles className="w-4 h-4" />
            <span>تنظیمات آسان و خودکار</span>
          </div>
          <h2 className="text-base font-extrabold">آب مصرفی‌تان را با ساعت هوشمند هماهنگ کنید</h2>
          <p className="text-xs text-white/90 leading-relaxed">
            با روشن کردن هر گزینه، اطلاعات قدم‌ها و ورزش شما خوانده می‌شود تا برنامه میزان آب لازم بدنتان را دقیق‌تر یادآوری کند.
          </p>
        </div>

        {/* 1. Google Fit / Health */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  ساعت هوشمند و گوگل فیت (Google Fit)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  برای گوشی‌های اندروید و ساعت‌های هوشمند
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.googleFit}
                onChange={() => toggleIntegration('googleFit', 'گوگل فیت')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D9CFF]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-13">
            تعداد قدم‌های روزانه شما از ساعت خوانده می‌شود تا در روزهای پرتحرک، آب بیشتری پیشنهاد داده شود.
          </p>
        </div>

        {/* 2. Apple Health */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  برنامه سلامت اپل (Apple Health)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  برای گوشی‌های آیفون و اپل‌واچ
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.appleHealth}
                onChange={() => toggleIntegration('appleHealth', 'سلامت اپل')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D9CFF]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-13">
            هر لیوان آبی که در برنامه ثبت می‌کنید، خودکار در حلقه سلامت آیفون شما هم ذخیره می‌شود.
          </p>
        </div>

        {/* 3. Strava / ورزش */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  برنامه‌های ورزشی و دویدن (Strava)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  تشخیص خودکار ورزش و جبران کم‌آبی
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.strava}
                onChange={() => toggleIntegration('strava', 'استراوا')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D9CFF]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-13">
            وقتی ورزش می‌کنید یا می‌دوید، برای جلوگیری از خستگی و سردرد، ۱ تا ۲ لیوان آب اضافه به هدف آن روز اضافه می‌شود.
          </p>
        </div>

        {/* 4. Telegram Reminder Bot */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  یادآوری در پیام‌رسان تلگرام
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ارسال پیام یادآور نوشیدن در چت
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.telegramBot}
                onChange={() => toggleIntegration('telegramBot', 'ربات تلگرام')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D9CFF]"></div>
            </label>
          </div>
          <div className="pr-13 space-y-1">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              اگر نوتیفیکیشن‌های گوشی را نمی‌بینید، ربات در تلگرام به شما پیام دوستانه می‌دهد و با یک دکمه نوشیدن ثبت می‌شود.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-mono dir-ltr">
              @NooshWaterBot
            </div>
          </div>
        </div>

        {/* 5. Calendar Reminder */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  تقویم کاری گوشی (Google Calendar)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ثبت زمان‌های استراحت و نوشیدن آب
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.calendar}
                onChange={() => toggleIntegration('calendar', 'تقویم گوشی')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D9CFF]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-13">
            برای افراد شاغل، فواصل نوشیدن آب بین جلسات کاری در تقویم نمایش داده می‌شود.
          </p>
        </div>

        {/* Safe notice */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>تمام اطلاعات با امنیت کامل ذخیره می‌شوند و نیاز به هیچ تنظیمات پیچیده‌ای ندارید.</span>
        </div>
      </div>
    </div>
  );
};
