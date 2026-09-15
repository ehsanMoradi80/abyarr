import React, { useMemo } from 'react';
import { Trophy, TrendingUp, Flame, CalendarCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Header } from './Header';
import { WaterWavesGraphic } from './BrandIllustrations';
import { GamificationSection } from './GamificationSection';
import { strings, formatNumber, formatGlasses, localDayKey } from '../constants/strings';

export const StatisticsScreen: React.FC = () => {
  const { logs, goalGlasses } = useApp();

  const stats = useMemo(() => {
    // 7 Days
    const last7DaysMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7DaysMap.set(localDayKey(d), 0);
    }

    logs.forEach((log) => {
      const key = localDayKey(new Date(log.loggedAt));
      if (last7DaysMap.has(key)) {
        last7DaysMap.set(key, (last7DaysMap.get(key) || 0) + (log.amount || 1));
      }
    });

    const values7 = Array.from(last7DaysMap.values());
    const total7 = values7.reduce((a, b) => a + b, 0);
    const avg7 = Math.round((total7 / 7) * 10) / 10;
    const bestDayGlasses = Math.max(...values7, 0);
    const goalDaysCount = values7.filter((v) => v >= goalGlasses).length;

    // Total lifetime glasses
    const totalLifetimeGlasses = logs.reduce((sum, l) => sum + (l.amount || 1), 0);

    return {
      total7,
      avg7,
      bestDayGlasses,
      goalDaysCount,
      totalLifetimeGlasses,
      chartData: Array.from(last7DaysMap.entries()).reverse(),
    };
  }, [logs, goalGlasses]);

  return (
    <div className="space-y-6 pb-24">
      <Header
        title={strings.statistics}
        subtitle={strings.sevenDaySummary}
        showLogo={true}
      />

      {/* Brand Identity Continuity Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#2D9CFF] via-[#1E70E8] to-[#2D9CFF] text-white shadow-md flex items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-2xs">
            رشد و تداوم
          </span>
          <h3 className="text-sm font-black text-white">
            تداوم، کلید تغییر است 
          </h3>
          <p className="text-xs text-[#E6F4FF] leading-relaxed max-w-[200px]">
            نوشیدن منظم آب انرژی روزانه‌ات رو پایدار نگه می‌داره.
          </p>
        </div>
        <div className="shrink-0 -my-2 mr-2 relative z-10">
          <WaterWavesGraphic size={68} />
        </div>
      </div>

      {/* Gamification & Unlocked Brand Screens */}
      <GamificationSection />

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF] mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-semibold">
            {strings.average}
          </span>
          <div className="text-xl font-extrabold text-[#1E293B] dark:text-[#F8FAFC] mt-1">
            {formatNumber(stats.avg7)} <span className="text-xs font-normal">{strings.glass}</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] dark:bg-[#064E3B] flex items-center justify-center text-[#10B981] dark:text-[#34D399] mb-2">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-semibold">
            {strings.bestDay}
          </span>
          <div className="text-xl font-extrabold text-[#1E293B] dark:text-[#F8FAFC] mt-1">
            {formatNumber(Math.round(stats.bestDayGlasses * 10) / 10)} <span className="text-xs font-normal">{strings.glass}</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] dark:bg-[#78350F] flex items-center justify-center text-[#F59E0B] mb-2">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-semibold">
            {strings.goalDays}
          </span>
          <div className="text-xl font-extrabold text-[#1E293B] dark:text-[#F8FAFC] mt-1">
            {formatNumber(stats.goalDaysCount)} <span className="text-xs font-normal">از ۷ روز</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF] mb-2">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-semibold">
            کل لیوان‌های ثبت‌شده
          </span>
          <div className="text-xl font-extrabold text-[#1E293B] dark:text-[#F8FAFC] mt-1">
            {formatNumber(Math.round(stats.totalLifetimeGlasses * 10) / 10)} <span className="text-xs font-normal">{strings.glass}</span>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Bar Chart */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
        <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-4">
          نمودار ۷ روز گذشته
        </h3>

        <div className="flex items-end justify-between gap-2 h-40 pt-4 pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          {stats.chartData.map(([dayKey, amount]) => {
            const heightPercent = goalGlasses > 0 ? Math.min(Math.round((amount / (goalGlasses * 1.2)) * 100), 100) : 0;
            const isGoal = amount >= goalGlasses;
            const dateObj = new Date(dayKey);
            const dayName = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'short' }).format(dateObj);

            return (
              <div key={dayKey} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatNumber(Math.round(amount * 10) / 10)}
                </div>
                <div
                  className={`w-full max-w-[28px] rounded-t-xl transition-all duration-500 ${
                    isGoal
                      ? 'bg-gradient-to-t from-[#10B981] to-[#34D399]'
                      : amount > 0
                      ? 'bg-gradient-to-t from-[#1E70E8] to-[#56B7FF]'
                      : 'bg-[#F1F5F9] dark:bg-[#334155]'
                  }`}
                  style={{ height: `${Math.max(heightPercent, 6)}%` }}
                />
                <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] mt-2">
                  {dayName}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span>هدف: {formatGlasses(goalGlasses)}</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            سبز: رسیدن به هدف
          </span>
        </div>
      </div>
    </div>
  );
};
