import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { formatNumber, formatGlasses, strings } from '../constants/strings';

interface ProgressRingProps {
  currentMl: number; // glasses count
  goalMl: number; // goal glasses
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ currentMl: currentGlasses, goalMl: goalGlasses }) => {
  const percentage = goalGlasses > 0 ? Math.min(Math.round((currentGlasses / goalGlasses) * 100), 100) : 0;
  const isCompleted = currentGlasses >= goalGlasses;
  const remainingGlasses = Math.max(0, Math.round((goalGlasses - currentGlasses) * 10) / 10);
  const fillLevel = Math.min(Math.max(percentage / 100, 0.1), 0.9);

  // SVG circle math
  const size = 250;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-5">
      {/* Background radial glow */}
      <div
        className={`absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isCompleted
            ? 'bg-[#10B981]/15 dark:bg-[#34D399]/15'
            : 'bg-[#2D9CFF]/15 dark:bg-[#56B7FF]/15'
        }`}
      />

      <div className="relative w-[250px] h-[250px] flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="ringProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#56B7FF" />
              <stop offset="100%" stopColor="#2D9CFF" />
            </linearGradient>
            <linearGradient id="ringCompleteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="stroke-[#E6F4FF] dark:stroke-[#1E3A5F]"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Progress Circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isCompleted ? 'url(#ringCompleteGrad)' : 'url(#ringProgressGrad)'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={currentGlasses}
            className="flex flex-col items-center"
          >
            {/* Illustrated Water Glass */}
            <div className="relative w-12 h-14 mb-2 flex items-end justify-center">
              <div className="w-10 h-13 border-2 border-[#2D9CFF] dark:border-[#56B7FF] rounded-b-lg rounded-t-sm relative overflow-hidden bg-white/40 dark:bg-[#1E293B]/40 shadow-xs">
                {/* Water Level inside Glass */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2D9CFF] to-[#8ED3FF] opacity-90 rounded-b-md"
                  initial={{ height: '0%' }}
                  animate={{ height: `${fillLevel * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <div className="w-full h-1 bg-white/40" />
                </motion.div>
                {/* Glass Reflection Highlight */}
                <div className="absolute top-1 left-1 bottom-1 w-0.5 bg-white/60 rounded-full pointer-events-none" />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black text-[#1E293B] dark:text-[#F8FAFC] tracking-tight">
                {formatNumber(currentGlasses)}
              </span>
            </div>

            <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              از {formatNumber(goalGlasses)} {strings.glass}
            </span>
            <span className="text-[11px] font-medium text-[#2D9CFF] dark:text-[#56B7FF]">
              {strings.today}
            </span>

            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4FF] text-[#0066CC] dark:bg-[#1E3A5F] dark:text-[#93C5FD]">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{strings.completed}</span>
                </>
              ) : (
                <>
                  <span>{formatNumber(percentage)}٪</span>
                  <span>•</span>
                  <span>{formatGlasses(remainingGlasses)} {strings.remaining}</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

