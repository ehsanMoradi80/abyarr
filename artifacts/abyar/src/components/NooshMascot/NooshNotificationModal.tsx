import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Droplets, Clock, BellRing, Sparkles, CheckCircle2 } from 'lucide-react';
import { NooshMascot } from './NooshMascot';
import {
  NooshExpression,
  NOOSH_MASCOT_STATES,
} from '../../assets/mascotAssets';
import { WaterAlarmAudioService } from '../../services/audioAlarm';

export interface NooshNotificationPayload {
  expression: NooshExpression;
  title: string;
  message: string;
  actionText?: string;
  glassesToAdd?: number;
  autoPlaySound?: boolean;
}

interface NooshNotificationModalProps {
  payload: NooshNotificationPayload | null;
  userName?: string;
  onDrinkWater: (glasses: number) => void;
  onSnooze?: () => void;
  onClose: () => void;
}

export const NooshNotificationModal: React.FC<NooshNotificationModalProps> = ({
  payload,
  userName = '',
  onDrinkWater,
  onSnooze,
  onClose,
}) => {
  useEffect(() => {
    if (!payload) return;

    if (payload.autoPlaySound === false) return;

    if (payload.expression === 'celebrate') {
      WaterAlarmAudioService.playCelebrationFanfare();
      return;
    }

    WaterAlarmAudioService.playWaterDropNotification();
    if (payload.expression === 'sad' || payload.expression === 'miss_you') {
      if (userName) {
        WaterAlarmAudioService.speakPersianReminder(userName);
      }
    }
  }, [payload, userName]);

  if (!payload) return null;

  const meta = NOOSH_MASCOT_STATES[payload.expression] || NOOSH_MASCOT_STATES.happy;

  const handleDrink = () => {
    const amount = payload.glassesToAdd ?? 1;
    onDrinkWater(amount);
    onClose();
  };

  const handleSnooze = () => {
    onSnooze?.();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-[720px] overflow-hidden rounded-[32px] border border-white/70 dark:border-white/10 bg-gradient-to-br from-white via-[#F7FBFF] to-[#EAF5FF] dark:from-[#0B192C] dark:via-[#12243A] dark:to-[#08111D] shadow-[0_28px_90px_rgba(15,23,42,0.35)]"
        >
          <div
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ backgroundColor: meta.themeColor }}
          />
          <div
            className="absolute -top-24 -right-16 h-60 w-60 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: meta.themeColor }}
          />
          <div className="absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-white/25 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[150px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="relative flex items-center justify-center border-r border-white/70 dark:border-white/10 bg-white/55 dark:bg-white/5 px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
              <div className="absolute inset-4 rounded-[28px] bg-gradient-to-b from-white/70 to-white/10 dark:from-white/10 dark:to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-1/2 h-4 w-28 -translate-x-1/2 rounded-full bg-black/10 blur-xl pointer-events-none" />

              <div className="relative flex flex-col items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black ${meta.badgeBg} ${meta.badgeText}`}
                >
                  <BellRing className="h-3.5 w-3.5" />
                  <span>{meta.persianTitle}</span>
                </span>

                <NooshMascot
                  expression={payload.expression}
                  size={172}
                  showBubble={false}
                  interactive={false}
                  frame="free"
                  stripBackground={true}
                  className="drop-shadow-[0_18px_36px_rgba(45,156,255,0.22)]"
                />

                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute right-6 top-5 text-white/85"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              </div>
            </div>

            <div className="relative flex flex-col justify-between gap-5 p-5 sm:p-6 lg:p-7">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#2D9CFF]">
                      <span className="h-2 w-2 rounded-full bg-[#2D9CFF] animate-pulse" />
                      <span>Push notification</span>
                    </div>
                    <h3 className="text-2xl sm:text-[28px] font-black leading-tight text-[#0F172A] dark:text-[#F8FAFC]">
                      {payload.title}
                    </h3>
                  </div>

                  <button
                    onClick={onClose}
                    aria-label="بستن"
                    className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-[#0B192C]/80 text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155] hover:bg-white dark:hover:bg-[#0B192C] transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="max-w-xl text-sm sm:text-[15px] leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
                  {payload.message}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${meta.badgeBg} ${meta.badgeText}`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{meta.persianSubtitle}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-[#475569] dark:bg-white/10 dark:text-[#CBD5E1]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Horizontal card layout</span>
                  </span>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-[1.3fr_0.7fr]">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDrink}
                  className="w-full rounded-2xl bg-[#2D9CFF] px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-[#2D9CFF]/25 transition-colors hover:bg-[#1E8BE8] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Droplets className="h-4 w-4" />
                  <span>{payload.actionText || 'ثبت ۱ لیوان آب'}</span>
                </motion.button>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                  <button
                    type="button"
                    onClick={handleSnooze}
                    className="rounded-2xl bg-[#F2F6FA] px-4 py-3.5 text-xs font-bold text-[#64748B] dark:bg-[#0B192C] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] transition-all cursor-pointer"
                  >
                    ۱۰ دقیقه بعد
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl border border-[#E2E8F0] px-4 py-3.5 text-xs font-semibold text-[#64748B] dark:border-[#334155] dark:text-[#94A3B8] hover:bg-[#F2F6FA] dark:hover:bg-[#0B192C] transition-all cursor-pointer"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
