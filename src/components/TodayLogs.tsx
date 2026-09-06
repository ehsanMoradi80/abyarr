import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Clock, Droplets } from 'lucide-react';
import { WaterLog } from '../types';
import { formatGlasses, formatTime, relativeTimeFromNow, strings } from '../constants/strings';

interface TodayLogsProps {
  logs: WaterLog[];
  onDelete: (id: string) => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export const TodayLogs: React.FC<TodayLogsProps> = ({
  logs,
  onDelete,
  onUndo,
  canUndo,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
          {strings.todayLog}
        </h3>
        {canUndo && onUndo && (
          <button
            id="undo-last-log-btn"
            onClick={onUndo}
            className="text-xs font-semibold text-[#2D9CFF] hover:underline"
          >
            {strings.undo}
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center">
          <div className="w-12 h-12 rounded-full bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center mx-auto mb-2 text-[#2D9CFF]">
            <Droplets className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[#1E293B] dark:text-[#F8FAFC]">
            {strings.noWaterToday}
          </p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            {strings.gentleTip}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF] font-bold text-base">
                    🥛
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-extrabold text-[#1E293B] dark:text-[#F8FAFC]">
                        {formatGlasses(log.amount || 1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(new Date(log.loggedAt))}</span>
                      <span>•</span>
                      <span>{relativeTimeFromNow(log.loggedAt)}</span>
                    </div>
                  </div>
                </div>

                <button
                  id={`delete-log-${log.id}`}
                  onClick={() => onDelete(log.id)}
                  title={strings.delete}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#450A0A] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

