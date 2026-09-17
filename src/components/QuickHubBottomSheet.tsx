import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Smartphone,
  Watch,
  Trophy,
  Cloud,
  HelpCircle,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

interface QuickHubBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPartner: () => void;
  onOpenWidgets: () => void;
  onOpenThirdParty: () => void;
  onOpenRewards: () => void;
  onOpenCloud?: () => void;
  onOpenTour: () => void;
  isPartnerActive?: boolean;
}

export const QuickHubBottomSheet: React.FC<QuickHubBottomSheetProps> = ({
  isOpen,
  onClose,
  onOpenPartner,
  onOpenWidgets,
  onOpenThirdParty,
  onOpenRewards,
  onOpenCloud,
  onOpenTour,
  isPartnerActive = false,
}) => {
  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  const items = [
    {
      id: 'partner',
      title: 'همراه سلامت',
      subtitle: isPartnerActive ? 'متصل و در حال نوشیدن' : 'نوشیدن دونفره و رقابت دوستانه',
      icon: Users,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-100 dark:border-emerald-900/40',
      badge: isPartnerActive ? 'فعال' : null,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
      action: () => {
        onClose();
        onOpenPartner();
      },
    },
    {
      id: 'widgets',
      title: 'ویجت‌های گوشی',
      subtitle: 'دکمه ثبت سریع آب روی صفحه اصلی گوشی',
      icon: Smartphone,
      iconColor: 'text-[#2D9CFF] dark:text-[#56B7FF]',
      bgColor: 'bg-[#E6F4FF] dark:bg-[#1E3A5F]/50',
      borderColor: 'border-sky-100 dark:border-sky-900/40',
      badge: 'کاربردی',
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',
      action: () => {
        onClose();
        onOpenWidgets();
      },
    },
    {
      id: 'thirdparty',
      title: 'اتصال به ساعت و گوشی',
      subtitle: 'هماهنگی با گوگل فیت، اپل هلث و استراوا',
      icon: Watch,
      iconColor: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-100 dark:border-teal-900/40',
      badge: null,
      action: () => {
        onClose();
        onOpenThirdParty();
      },
    },
    {
      id: 'rewards',
      title: 'مدال‌ها و افتخار',
      subtitle: 'مشاهده جوایز، سطح تندرستی و رکوردها',
      icon: Trophy,
      iconColor: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-100 dark:border-amber-900/40',
      badge: null,
      action: () => {
        onClose();
        onOpenRewards();
      },
    },
    ...(onOpenCloud
      ? [
          {
            id: 'cloud',
            title: 'پشتیبان و همگام ابری',
            subtitle: 'ذخیره خودکار داده‌ها و بازیابی آسان',
            icon: Cloud,
            iconColor: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-950/40',
            borderColor: 'border-blue-100 dark:border-blue-900/40',
            badge: null,
            action: () => {
              onClose();
              onOpenCloud();
            },
          },
        ]
      : []),
    {
      id: 'tour',
      title: 'راهنمای برنامه',
      subtitle: 'آموزش کوتاه و گام‌به‌گام بخش‌ها',
      icon: HelpCircle,
      iconColor: 'text-rose-500 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-100 dark:border-rose-900/40',
      badge: null,
      action: () => {
        onClose();
        onOpenTour();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            aria-label="بستن"
          />

          {/* Bottom Sheet Panel with Drag-to-Close gesture */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 0.7 }}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 80 || info.velocity.y > 250) {
                onClose();
              }
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-t-[32px] border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 pb-8 max-h-[85vh] flex flex-col z-10 touch-pan-y"
          >
            {/* Top Drag Handle Area */}
            <div className="w-full flex flex-col items-center justify-center pt-1 pb-3 cursor-grab active:cursor-grabbing select-none">
              <div className="w-14 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors" />
            </div>

            {/* Header without Close Button */}
            <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 dark:border-slate-800 select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#2D9CFF] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E293B] dark:text-white">
                    امکانات و ابزارها
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    دسترسی سریع به بخش‌های جانبی برنامه
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                بستن با کشیدن به پایین ↓
              </span>
            </div>

            {/* List of Actions (Thumb-friendly full-width items) */}
            <div className="space-y-2.5 py-1 overflow-y-auto">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.action}
                    className={`w-full p-3.5 rounded-2xl bg-white dark:bg-[#152336] border ${item.borderColor} hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-2xs transition-all flex items-center justify-between text-right cursor-pointer group`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl ${item.bgColor} ${item.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-[#1E293B] dark:text-[#F8FAFC]">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-[#2D9CFF] transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
