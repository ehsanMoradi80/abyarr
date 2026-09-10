import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Droplets, Volume2 } from 'lucide-react';
import {
  NooshExpression,
  NOOSH_MASCOT_STATES,
} from '../../assets/mascotAssets';
import { WaterAlarmAudioService } from '../../services/audioAlarm';
import { removeWhiteBackground } from '../../utils/removeWhiteBackground';

interface NooshMascotProps {
  expression?: NooshExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showBubble?: boolean;
  customMessage?: string;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  showStateBadge?: boolean;
  frame?: 'circle' | 'free';
  stripBackground?: boolean;
}

export const NooshMascot: React.FC<NooshMascotProps> = ({
  expression = 'happy',
  size = 'md',
  showBubble = true,
  customMessage,
  interactive = true,
  onClick,
  className = '',
  showStateBadge = false,
  frame = 'circle',
  stripBackground = false,
}) => {
  const meta = NOOSH_MASCOT_STATES[expression] || NOOSH_MASCOT_STATES.happy;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTapped, setIsTapped] = useState(false);
  const [imageSrc, setImageSrc] = useState(meta.image);

  // Map sizes
  let dimension = 140;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'sm':
        dimension = 90;
        break;
      case 'md':
        dimension = 140;
        break;
      case 'lg':
        dimension = 200;
        break;
      case 'xl':
        dimension = 260;
        break;
    }
  }

  const handleTap = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);

    // Play quick sound effect
    if (expression === 'celebrate') {
      WaterAlarmAudioService.playBadgeUnlockedSound();
    } else {
      WaterAlarmAudioService.playWaterDrinkSound('gentle_bubble');
    }

    // Cycle through phrases
    setPhraseIndex((prev) => (prev + 1) % meta.phrases.length);

    if (onClick) {
      onClick();
    }
  };

  const currentPhrase = customMessage || meta.phrases[phraseIndex] || meta.defaultPhrase;

  useEffect(() => {
    let active = true;
    setImageSrc(meta.image);

    if (!stripBackground) {
      return () => {
        active = false;
      };
    }

    removeWhiteBackground(meta.image)
      .then((cleanSrc) => {
        if (active) {
          setImageSrc(cleanSrc);
        }
      })
      .catch(() => {
        if (active) {
          setImageSrc(meta.image);
        }
      });

    return () => {
      active = false;
    };
  }, [meta.image, stripBackground]);

  // Animation variants per expression
  const idleAnimation = useMemo(() => {
    switch (expression) {
      case 'celebrate':
        return {
          y: [0, -12, 0, -6, 0],
          rotate: [0, -3, 3, -1, 0],
          scale: [1, 1.05, 1, 1.02, 1],
          transition: {
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        };
      case 'miss_you':
        return {
          y: [0, 4, 0],
          rotate: [0, 0, 0],
          scale: [1, 0.98, 1],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        };
      case 'sad':
        return {
          y: [0, 5, 0],
          rotate: [0, -1, 1, 0],
          scale: [1, 1, 1],
          transition: {
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        };
      case 'happy':
      default:
        return {
          y: [0, -6, 0],
          rotate: [0, 0, 0],
          scale: [1, 1.02, 1],
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        };
    }
  }, [expression]);

  const mascotVariants: any = {
    idle: idleAnimation,
    tapped: {
      scale: [1, 1.15, 0.95, 1.05, 1],
      rotate: [0, -6, 6, -3, 0],
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* State Badge if enabled */}
      {showStateBadge && (
        <div className="mb-2">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border border-current/20 ${meta.badgeBg} ${meta.badgeText}`}
          >
            <span>{meta.bubbleIcon}</span>
            <span>{meta.persianTitle}</span>
          </span>
        </div>
      )}

      {/* Speech / Thought Bubble */}
      {showBubble && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${expression}-${phraseIndex}-${customMessage}`}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`relative mb-3 max-w-[280px] p-3 rounded-2xl shadow-sm text-center border ${
              expression === 'celebrate'
                ? 'bg-[#FEF3C7] dark:bg-[#78350F]/60 border-[#F59E0B]/40 text-[#92400E] dark:text-[#FEF3C7]'
                : expression === 'miss_you'
                ? 'bg-[#E0F2FE] dark:bg-[#075985]/50 border-[#0284C7]/40 text-[#075985] dark:text-[#E0F2FE]'
                : expression === 'sad'
                ? 'bg-[#FEE2E2] dark:bg-[#7F1D1D]/50 border-[#EF4444]/40 text-[#991B1B] dark:text-[#FEE2E2]'
                : 'bg-white dark:bg-[#1E293B] border-[#2D9CFF]/30 text-[#1E293B] dark:text-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-base">{meta.bubbleIcon}</span>
              <span className="text-xs font-black tracking-wide text-[#2D9CFF]">
                کاراکتر نوش
              </span>
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              {currentPhrase}
            </p>

            {/* Bubble Tail Arrow */}
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 ${
                expression === 'celebrate'
                  ? 'border-t-[#FEF3C7] dark:border-t-[#78350F]/60'
                  : expression === 'miss_you'
                  ? 'border-t-[#E0F2FE] dark:border-t-[#075985]/50'
                  : expression === 'sad'
                  ? 'border-t-[#FEE2E2] dark:border-t-[#7F1D1D]/50'
                  : 'border-t-white dark:border-t-[#1E293B]'
              }`}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Main Mascot Character Body */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div
          className="absolute -inset-2 rounded-full blur-xl opacity-30 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: meta.themeColor }}
        />

        {/* Celebratory Confetti / Sparkle Decorators for Celebrate state */}
        {expression === 'celebrate' && (
          <>
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-3 -right-3 text-amber-400 pointer-events-none"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-2 -left-2 text-cyan-400 pointer-events-none"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </>
        )}

        {/* Floating Heart for Happy state */}
        {expression === 'happy' && (
          <motion.div
            animate={{ y: [-2, -8, -2], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-1 text-[#2D9CFF] pointer-events-none drop-shadow-sm"
          >
            <Heart className="w-5 h-5 fill-current" />
          </motion.div>
        )}

        {/* Floating Water Droplet for Sad state */}
        {expression === 'sad' && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.9, 0.4, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="absolute -bottom-1 right-2 text-blue-400 pointer-events-none"
          >
            <Droplets className="w-5 h-5 fill-current" />
          </motion.div>
        )}

        {/* Main 3D Mascot Image with Dynamic Physics */}
        <motion.div
          animate={isTapped ? 'tapped' : 'idle'}
          variants={mascotVariants}
          onClick={interactive ? handleTap : undefined}
          whileHover={interactive ? { scale: 1.06 } : undefined}
          whileTap={interactive ? { scale: 0.92 } : undefined}
          className={`relative z-10 ${
            frame === 'circle' ? 'overflow-hidden rounded-full' : 'overflow-visible'
          } cursor-${interactive ? 'pointer' : 'default'} filter drop-shadow-lg transition-transform`}
          style={{ width: dimension, height: dimension }}
        >
          <img
            src={imageSrc}
            alt={`کاراکتر نوش - ${meta.persianTitle}`}
            className={`w-full h-full ${
              frame === 'circle' ? 'object-cover rounded-full' : 'object-contain'
            }`}
            loading="eager"
            draggable={false}
            style={stripBackground ? { backgroundColor: 'transparent' } : undefined}
          />
        </motion.div>
      </div>

      {/* Ground Oval Contact Shadow */}
      <motion.div
        animate={{
          scaleX: expression === 'celebrate' ? [1, 0.7, 1] : [1, 1.05, 1],
          opacity: expression === 'celebrate' ? [0.4, 0.2, 0.4] : [0.35, 0.45, 0.35],
        }}
        transition={{
          duration: expression === 'celebrate' ? 2.2 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-3/5 h-2.5 bg-black/25 dark:bg-black/40 rounded-full blur-xs mt-1 pointer-events-none"
      />

      {/* Tap hint if interactive */}
      {interactive && (
        <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1 opacity-70">
          برای گفت‌وگو لمس کن 👆
        </span>
      )}
    </div>
  );
};
