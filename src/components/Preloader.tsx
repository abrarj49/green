'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Check session storage
    const seen = sessionStorage.getItem('gs_intro_seen');
    if (seen === '1') {
      setHasDismissed(true);
      return;
    }

    // Animate progress 0 to 100 quickly
    const startTime = Date.now();
    const duration = 1200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          sessionStorage.setItem('gs_intro_seen', '1');
          setTimeout(() => setHasDismissed(true), 900);
        }, 150);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  if (hasDismissed) return null;

  return (
    <AnimatePresence>
      {!isLoaded && (
        <div className="fixed inset-0 z-[99999] pointer-events-none select-none flex flex-col justify-between overflow-hidden">
          {/* Top Shutter Curtain */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="w-full h-1/2 bg-[#171822] border-b border-[#1D8F2C]/30 relative"
          >
            {/* Top decorative glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#1D8F2C] to-transparent opacity-60" />
          </motion.div>

          {/* Center Intro Branding (Overlaid) */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white px-4"
          >
            {/* Rotating Emblem Ring */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#1D8F2C] animate-spin-slow flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 shadow-lg shadow-[#1D8F2C]/30 border border-white/20">
                  <Image
                    src="/images/logo-mark.png"
                    alt="GS Monogram"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Brand Title with Spacing */}
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-[0.2em] uppercase font-[var(--font-display)] text-white text-center mb-2">
              Green Solution <span className="text-[#1D8F2C]">CO.</span>
            </h1>

            <p className="text-xs text-neutral-300 font-semibold tracking-wider uppercase mb-6 font-[var(--font-display)]">
              {isAr ? 'لاندسكيبينج وشبكات ري • Landscaping & Irrigation Systems' : 'Landscaping & Irrigation Systems • KSA'}
            </p>

            {/* Progress Bar & Percentage */}
            <div className="w-56 sm:w-64 max-w-full">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2 font-bold">
                <span className="text-[#1D8F2C] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D8F2C] animate-ping" />
                  <span>{isAr ? 'تهيئة النظام' : 'INITIALIZING'}</span>
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#1D8F2C] via-[#4CAF50] to-[#C9A34E]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Bottom Shutter Curtain */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="w-full h-1/2 bg-[#171822] border-t border-[#1D8F2C]/30 relative"
          >
            {/* Bottom decorative glow */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#1D8F2C] to-transparent opacity-60" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
