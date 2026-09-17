import React from 'react';
import { motion } from 'motion/react';
import { AppLogo } from './AppLogo';
import { ArrowLeft, UserCheck, X } from 'lucide-react';
import { strings } from '../constants/strings';

interface SplashScreenProps {
  onStart?: () => void;
  onHaveAccount?: () => void;
  onClose?: () => void;
  isDismissable?: boolean;
  autoTransitionMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStart,
  onHaveAccount,
  onClose,
  isDismissable = false,
  autoTransitionMs,
}) => {
  React.useEffect(() => {
    if (!autoTransitionMs || !onStart) return;
    const timer = setTimeout(() => {
      onStart();
    }, autoTransitionMs);
    return () => clearTimeout(timer);
  }, [autoTransitionMs, onStart]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#EBF5FF] via-[#D5EDFF] to-[#8ED3FF] text-[#1E293B] select-none"
    >
      {/* Background Soft Glows and Water Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top radial ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-white/70 rounded-full blur-3xl" />

        {/* Ambient floating water bubbles */}
        <motion.div
          animate={{ y: [0, -14, 0], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] left-[12%] w-4 h-4 rounded-full border border-[#2D9CFF]/40 bg-white/40 shadow-xs backdrop-blur-2xs"
        />
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-[24%] right-[14%] w-6 h-6 rounded-full border border-[#2D9CFF]/35 bg-white/50 shadow-xs"
        >
          <div className="w-1.5 h-1.5 bg-white/90 rounded-full absolute top-1 left-1" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -16, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[48%] left-[18%] w-3.5 h-3.5 rounded-full border border-[#2D9CFF]/30 bg-white/40"
        />
        <motion.div
          animate={{ y: [0, -22, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}
          className="absolute top-[56%] right-[20%] w-5 h-5 rounded-full border border-[#2D9CFF]/35 bg-white/45"
        >
          <div className="w-1 h-1 bg-white/90 rounded-full absolute top-1 left-1" />
        </motion.div>
      </div>

      {/* Dismiss / Close button if opened as preview */}
      {isDismissable && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/70 hover:bg-white text-[#1E293B] shadow-sm backdrop-blur-xs transition-all cursor-pointer"
          title="بستن اسپلش"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Top / Center Branding Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-8 pb-4 px-6 text-center">
        {/* Animated App Logo with Heart */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 relative"
        >
          <div className="absolute inset-0 bg-[#2D9CFF]/20 rounded-full blur-2xl transform scale-150 pointer-events-none" />
          <AppLogo size={105} showHeart={true} animated={true} />
        </motion.div>

        {/* Brand Name "نوش" */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl font-black text-[#2D9CFF] tracking-tight drop-shadow-xs font-sans"
        >
          {strings.appName}
        </motion.h1>

        {/* Slogan "نوشیدن آب، یادآوری عشق به خودت" */}
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-sm sm:text-base font-semibold text-[#1E70E8] mt-2 tracking-normal"
        >
          {strings.tagline}
        </motion.p>

        {/* Center Water Drop and Ripple Graphic */}
        <div className="relative w-72 h-44 my-4 flex items-center justify-center pointer-events-none">
          {/* Falling / Suspended Droplets */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 flex flex-col items-center gap-1.5"
          >
            <div className="w-2.5 h-3 bg-gradient-to-b from-[#8ED3FF] to-[#2D9CFF] rounded-full shadow-xs" />
            <div className="w-1.5 h-2 bg-[#2D9CFF] rounded-full opacity-80" />
            <div className="w-1 h-1.5 bg-[#1E70E8] rounded-full opacity-70" />
          </motion.div>

          {/* Central Water Drop Splash Pillar */}
          <div className="absolute bottom-10 flex flex-col items-center">
            <motion.div
              animate={{ height: [18, 26, 18], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2.5 bg-gradient-to-t from-[#2D9CFF] to-[#8ED3FF] rounded-t-full shadow-xs"
            />
          </div>

          {/* Water Surface Ripples */}
          <svg className="w-64 h-24 absolute bottom-2" viewBox="0 0 260 90">
            <defs>
              <radialGradient id="rippleGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2D9CFF" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#56B7FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8ED3FF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ripple Ring 1 */}
            <motion.ellipse
              cx="130"
              cy="45"
              rx="40"
              ry="14"
              fill="none"
              stroke="#2D9CFF"
              strokeWidth="2"
              animate={{ rx: [30, 80], ry: [10, 26], opacity: [0.8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            />

            {/* Ripple Ring 2 */}
            <motion.ellipse
              cx="130"
              cy="45"
              rx="55"
              ry="18"
              fill="none"
              stroke="#56B7FF"
              strokeWidth="1.8"
              animate={{ rx: [45, 110], ry: [15, 36], opacity: [0.7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
            />

            {/* Ripple Ring 3 */}
            <motion.ellipse
              cx="130"
              cy="45"
              rx="60"
              ry="20"
              fill="url(#rippleGrad)"
              animate={{ scale: [0.85, 1.15, 0.85] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        {/* Motivational Footnote: "هر قطره، یک قدم به سلامتی " */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0066CC] mt-1"
        >
          <span>هر قطره، یک قدم به سلامتی</span>
          <span className="text-[#2D9CFF]"></span>
        </motion.div>
      </div>

      {/* Bottom Wave Layers & Action Buttons */}
      <div className="relative z-10 w-full">
        {/* Soft Wave SVG */}
        <div className="w-full h-16 pointer-events-none relative -mb-1">
          <svg
            className="w-full h-full text-[#2D9CFF]/20 fill-current"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,202.7C960,203,1056,181,1152,176C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          <svg
            className="w-full h-full text-white/40 fill-current absolute inset-0"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Buttons Bar */}
        <div className="bg-white/90 dark:bg-[#1E293B]/95 backdrop-blur-md p-6 rounded-t-3xl border-t border-white/50 dark:border-slate-700 shadow-2xl max-w-md mx-auto w-full space-y-3">
          {autoTransitionMs && (
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden mb-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: autoTransitionMs / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-[#56B7FF] to-[#1E70E8]"
              />
            </div>
          )}

          {onStart && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="splash-start-btn"
              onClick={onStart}
              className="w-full h-13 rounded-2xl bg-[#2D9CFF] hover:bg-[#1E70E8] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#2D9CFF]/30 transition-all cursor-pointer"
            >
              <span>{strings.start}</span>
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}

          {onHaveAccount && (
            <button
              id="splash-have-account-btn"
              onClick={onHaveAccount}
              className="w-full h-11 rounded-2xl bg-transparent hover:bg-[#F2F6FA] dark:hover:bg-slate-800 text-[#0066CC] dark:text-[#56B7FF] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>قبلاً حساب دارم</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
