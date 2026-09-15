import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Header } from './Header';
import { WaterGlassGraphic } from './BrandIllustrations';
import { strings, formatNumber, formatGlasses, formatDate, localDayKey } from '../constants/strings';
import { WaterLog } from '../types';

export const HistoryScreen: React.FC = () => {
  const { logs, goalGlasses } = useApp();
  const [rangeDays, setRangeDays] = useState<7 | 30>(7);

  // Group logs by day
  const dailyData = useMemo(() => {
    const map = new Map<string, { date: Date; totalGlasses: number; logs: WaterLog[] }>();

    // Build days array for range
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = localDayKey(d);
      map.set(key, { date: d, totalGlasses: 0, logs: [] });
    }

    logs.forEach((log) => {
      const key = localDayKey(new Date(log.loggedAt));
      if (map.has(key)) {
        const item = map.get(key)!;
        item.totalGlasses += (log.amount || 1);
        item.logs.push(log);
      }
    });

    return Array.from(map.values());
  }, [logs, rangeDays]);

  return (
    <div className="space-y-6 pb-24">
      <Header
        title={strings.history}
        subtitle="مرور روزانه مصرف آب و روند روزهای گذشته"
        showLogo={true}
        right={
          <div className="flex bg-[#E6F4FF] dark:bg-[#1E3A5F] p-1 rounded-2xl">
            <button
              onClick={() => setRangeDays(7)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                rangeDays === 7
                  ? 'bg-white dark:bg-[#0B192C] text-[#2D9CFF] shadow-2xs'
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              {strings.last7}
            </button>
            <button
              onClick={() => setRangeDays(30)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                rangeDays === 30
                  ? 'bg-white dark:bg-[#0B192C] text-[#2D9CFF] shadow-2xs'
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              {strings.last30}
            </button>
          </div>
        }
      />

      {/* Brand Motivational Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#E6F4FF] via-[#F2F6FA] to-[#E6F4FF] dark:from-[#1E3A5F] dark:via-[#0B192C] dark:to-[#1E3A5F] border border-[#CBE8FF] dark:border-[#334155] shadow-2xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2D9CFF]/15 text-[#0066CC] dark:text-[#8ED3FF]">
            هویت سلامتی نوش
          </span>
          <h3 className="text-sm font-black text-[#1E293B] dark:text-[#F8FAFC]">
            هر قطره، یک قدم به سلامتی 
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            پایش پیوسته، بهترین راه برای تثبیت عادت نوشیدن آب است.
          </p>
        </div>
        <div className="shrink-0 -my-2 mr-2">
          <WaterGlassGraphic size={65} />
        </div>
      </div>

      <div className="space-y-3">
        {dailyData.map((item, index) => {
          const isToday = index === 0;
          const isGoalMet = item.totalGlasses >= goalGlasses;
          const percentage = goalGlasses > 0 ? Math.min(Math.round((item.totalGlasses / goalGlasses) * 100), 100) : 0;

          return (
            <motion.div
              key={localDayKey(item.date)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
                      {isToday ? strings.today : formatDate(item.date)}
                    </span>
                    {isGoalMet && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#10B981] dark:bg-[#064E3B] dark:text-[#34D399]">
                        <CheckCircle2 className="w-3 h-3" />
                        رسیده به هدف
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 block">
                    {item.logs.length > 0 ? `${formatNumber(item.logs.length)} مرتبه ثبت` : 'بدون ثبت مصرف'}
                  </span>
                </div>

                <div className="text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-[#1E293B] dark:text-[#F8FAFC]">
                      {formatNumber(Math.round(item.totalGlasses * 10) / 10)}
                    </span>
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      {strings.glass}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#2D9CFF] dark:text-[#56B7FF]">
                    {formatNumber(percentage)}٪
                  </span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="w-full bg-[#F1F5F9] dark:bg-[#0B192C] h-2.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isGoalMet
                      ? 'bg-gradient-to-r from-[#34D399] to-[#10B981]'
                      : 'bg-gradient-to-r from-[#56B7FF] to-[#2D9CFF]'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
