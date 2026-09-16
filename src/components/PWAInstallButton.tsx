import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Chromium / Android / Desktop flow */}
      {isInstallable && (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2D9CFF] to-[#0284C7] text-white text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          title="نصب نسخه پیشرفته وب (PWA)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>نصب اپلیکیشن</span>
        </button>
      )}

      {/* iOS Safari flow */}
      {isIOS && !isInstallable && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2D9CFF]/30 bg-[#E6F4FF] dark:bg-[#1E3A5F]/50 text-[#0284C7] dark:text-[#38BDF8] text-xs font-bold hover:bg-[#D0EBFF] transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>نصب در iOS</span>
        </button>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1E293B] p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-[#1E293B] dark:text-white">
                  نصب روی آیفون و آیپد
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                <div className="w-6 h-6 rounded-full bg-[#2D9CFF]/10 text-[#2D9CFF] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ۱
                </div>
                <div className="flex-1">
                  در نوار ابزار پایین سافاری، دکمه <span className="font-bold text-[#0284C7]">اشتراک‌گذاری (Share <Share2 className="w-3.5 h-3.5 inline mx-0.5" />)</span> را لمس کنید.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                <div className="w-6 h-6 rounded-full bg-[#2D9CFF]/10 text-[#2D9CFF] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ۲
                </div>
                <div className="flex-1">
                  کمی به پایین اسکرول کرده و گزینه <span className="font-bold text-[#0284C7]">افزودن به صفحه اصلی (Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline mx-0.5" />)</span> را بزنید.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                <div className="w-6 h-6 rounded-full bg-[#2D9CFF]/10 text-[#2D9CFF] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ۳
                </div>
                <div className="flex-1">
                  در بالای گوشه راست، روی <span className="font-bold text-[#10B981]">Add</span> ضربه بزنید تا آیکون نوش در صفحه اصلی قرار گیرد.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-2xl bg-[#2D9CFF] py-3 text-sm font-bold text-white hover:bg-[#1E70E8] shadow-md shadow-[#2D9CFF]/20 transition-all cursor-pointer"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </>
  );
};
