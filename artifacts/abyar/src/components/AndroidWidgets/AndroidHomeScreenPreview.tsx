import React from 'react';
import { Wifi, Signal, Battery, Phone, MessageSquare, Camera } from 'lucide-react';
import { WaterWidget4x1 } from './WaterWidget4x1';
import { StreakWidget4x1 } from './StreakWidget4x1';

interface AndroidHomeScreenPreviewProps {
  widgetType: 'water' | 'streak';
  todayGlasses: number;
  goalGlasses: number;
  streakDays: number;
  targetStreakDays?: number;
  weekStatus?: boolean[];
  isDark?: boolean;
  onAddWater: () => void;
  onOpenApp?: () => void;
}

export const AndroidHomeScreenPreview: React.FC<AndroidHomeScreenPreviewProps> = ({
  widgetType,
  todayGlasses,
  goalGlasses,
  streakDays,
  targetStreakDays = 7,
  weekStatus,
  isDark = false,
  onAddWater,
  onOpenApp,
}) => {
  return (
    <div className="relative w-full max-w-[320px] sm:max-w-[340px] mx-auto aspect-[9/17] rounded-[44px] overflow-hidden border-[6px] border-[#1E293B] dark:border-[#334155] shadow-2xl bg-gradient-to-b from-[#7FB3FF] via-[#94C6FF] to-[#609DE6] flex flex-col justify-between p-3 select-none">
      {/* Top Status Bar */}
      <div className="pt-2 px-3 flex items-center justify-between text-white font-sans text-xs font-bold drop-shadow-sm">
        <span>11:30</span>
        {/* Android camera hole punch */}
        <div className="w-3.5 h-3.5 rounded-full bg-[#0F172A] border border-white/20" />
        <div className="flex items-center gap-1.5 text-white/90">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 fill-white" />
        </div>
      </div>

      {/* Main Screen Grid Area */}
      <div className="flex-1 pt-6 flex flex-col gap-4">
        {/* Placed Active Widget */}
        <div className="w-full">
          {widgetType === 'water' ? (
            <WaterWidget4x1
              todayGlasses={todayGlasses}
              goalGlasses={goalGlasses}
              isDark={isDark}
              onAddWater={onAddWater}
              onOpenApp={onOpenApp}
            />
          ) : (
            <StreakWidget4x1
              streakDays={streakDays}
              targetStreakDays={targetStreakDays}
              weekStatus={weekStatus}
              isDark={isDark}
              onAddWater={onAddWater}
              onOpenApp={onOpenApp}
            />
          )}
        </div>

        {/* 4 App Grid Placeholders (As in user image) */}
        <div className="grid grid-cols-4 gap-2.5 px-1 mt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-2xl bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xs"
            />
          ))}
        </div>
      </div>

      {/* Bottom App Dock */}
      <div className="pb-3 pt-2">
        <div className="w-full py-2.5 px-3 rounded-3xl bg-white/20 backdrop-blur-lg border border-white/25 flex items-center justify-around shadow-lg">
          {/* Phone */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#22C55E] to-[#4ADE80] text-white flex items-center justify-center shadow-md">
            <Phone className="w-5 h-5 fill-white" />
          </div>

          {/* Messages */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5 fill-white" />
          </div>

          {/* Chrome / Browser Icon */}
          <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-md overflow-hidden relative">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#EA4335] via-[#FBBC05] to-[#34A853] flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-[#4285F4] border-2 border-white" />
            </div>
          </div>

          {/* Camera */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#475569] to-[#64748B] text-white flex items-center justify-center shadow-md">
            <Camera className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
