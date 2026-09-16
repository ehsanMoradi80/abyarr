import React from 'react';
import { motion } from 'motion/react';
import { Users, Smartphone, Watch, Trophy, HelpCircle, ChevronLeft } from 'lucide-react';

interface QuickHubProps {
  onOpenPartner: () => void;
  onOpenWidgets: () => void;
  onOpenThirdParty: () => void;
  onOpenRewards: () => void;
  onOpenTour: () => void;
  isPartnerActive?: boolean;
}

export const QuickHub: React.FC<QuickHubProps> = ({
  onOpenPartner,
  onOpenWidgets,
  onOpenThirdParty,
  onOpenRewards,
  onOpenTour,
  isPartnerActive = false,
}) => {
  const items = [
    {
      id: 'partner',
      title: 'همراه سلامت',
      subtitle: isPartnerActive ? 'متصل و فعال' : 'نوشیدن دونفره',
      icon: Users,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-100 dark:border-emerald-900/40',
      action: onOpenPartner,
    },
    {
      id: 'widgets',
      title: 'ویجت‌های گوشی',
      subtitle: 'دکمه روی صفحه اصلی',
      icon: Smartphone,
      iconColor: 'text-[#2D9CFF] dark:text-[#56B7FF]',
      bgColor: 'bg-[#E6F4FF] dark:bg-[#1E3A5F]/50',
      borderColor: 'border-sky-100 dark:border-sky-900/40',
      action: onOpenWidgets,
    },
    {
      id: 'thirdparty',
      title: 'اتصال به ساعت',
      subtitle: 'گوگل فیت و اپل هلث',
      icon: Watch,
      iconColor: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-100 dark:border-teal-900/40',
      action: onOpenThirdParty,
    },
    {
      id: 'rewards',
      title: 'مدال‌ها و افتخار',
      subtitle: 'جوایز و سطح شما',
      icon: Trophy,
      iconColor: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-100 dark:border-amber-900/40',
      action: onOpenRewards,
    },
    {
      id: 'tour',
      title: 'راهنمای برنامه',
      subtitle: 'آشنایی آسان با بخش‌ها',
      icon: HelpCircle,
      iconColor: 'text-rose-500 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-100 dark:border-rose-900/40',
      action: onOpenTour,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
          امکانات و ابزارهای سریع
        </h3>
        <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B]">
          دسترسی یک‌لمسی
        </span>
      </div>

      {/* Horizontal scrollable row for mobile & tablet */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none snap-x">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.96 }}
              onClick={item.action}
              className={`shrink-0 min-w-[130px] p-3 rounded-2xl bg-white dark:bg-[#1E293B] border ${item.borderColor} shadow-2xs hover:shadow-xs transition-all text-right flex flex-col justify-between gap-2.5 cursor-pointer snap-start`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 rounded-xl ${item.bgColor} ${item.iconColor} flex items-center justify-center`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#1E293B] dark:text-[#F8FAFC] leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5 whitespace-nowrap">
                  {item.subtitle}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
