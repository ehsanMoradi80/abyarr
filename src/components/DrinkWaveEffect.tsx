import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DrinkWaveEffectProps {
  triggerKey: number; // changes whenever user logs water
  glassesAdded?: number;
}

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export const DrinkWaveEffect: React.FC<DrinkWaveEffectProps> = ({ triggerKey, glassesAdded = 1 }) => {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (triggerKey > 0) {
      setActive(true);

      // Generate random buoyant water bubble particles
      const count = Math.min(12, Math.max(6, Math.round(glassesAdded * 5)));
      const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i,
        x: 10 + Math.random() * 80, // % from left
        size: 6 + Math.random() * 12, // px
        delay: Math.random() * 0.25,
        duration: 0.9 + Math.random() * 0.7,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setActive(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [triggerKey, glassesAdded]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-10">
      <AnimatePresence>
        {active && (
          <>
            {/* 1. Concentric expanding liquid ripple rings from center */}
            <motion.div
              key={`ripple-1-${triggerKey}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2D9CFF]/60 dark:border-[#56B7FF]/70"
              initial={{ width: 40, height: 40, opacity: 0.9, scale: 0.8 }}
              animate={{ width: 340, height: 340, opacity: 0, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
            <motion.div
              key={`ripple-2-${triggerKey}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8ED3FF]/70 dark:border-[#8ED3FF]/60 bg-[#2D9CFF]/10 dark:bg-[#56B7FF]/15"
              initial={{ width: 20, height: 20, opacity: 0.8, scale: 0.6 }}
              animate={{ width: 270, height: 270, opacity: 0, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            />

            {/* 2. Rising fluid liquid wave surge at bottom */}
            <motion.div
              key={`wave-surge-${triggerKey}`}
              className="absolute bottom-0 left-0 right-0 h-28 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Back Wave Layer */}
              <svg
                className="absolute bottom-0 w-[200%] h-24 text-[#8ED3FF]/30 dark:text-[#1E3A5F]/40 animate-[wave_3s_linear_infinite]"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 C150,90 350,-40 500,50 C650,140 900,-30 1200,30 L1200,120 L0,120 Z"
                  fill="currentColor"
                />
              </svg>

              {/* Front Wave Layer */}
              <svg
                className="absolute bottom-0 w-[200%] h-20 text-[#2D9CFF]/25 dark:text-[#2D9CFF]/35"
                style={{ transform: 'translateX(-25%)' }}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,30 C200,-20 400,80 600,20 C800,-40 1000,70 1200,10 L1200,120 L0,120 Z"
                  fill="currentColor"
                />
              </svg>
            </motion.div>

            {/* 3. Buoyant rising water bubbles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute bottom-4 rounded-full bg-gradient-to-t from-[#2D9CFF] to-[#CBE8FF] dark:from-[#56B7FF] dark:to-white shadow-[0_0_8px_rgba(45,156,255,0.6)] border border-white/60"
                style={{
                  left: `${p.x}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                initial={{ y: 20, opacity: 0, scale: 0.4 }}
                animate={{
                  y: -180 - Math.random() * 60,
                  x: (Math.random() - 0.5) * 30,
                  opacity: [0, 0.9, 0.7, 0],
                  scale: [0.4, 1.1, 0.9, 0.3],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* 4. Soft vibrant water splash flash */}
            <motion.div
              key={`glow-flash-${triggerKey}`}
              className="absolute inset-0 bg-radial from-[#2D9CFF]/20 via-transparent to-transparent pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.05, 1] }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
