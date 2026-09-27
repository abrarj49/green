'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AnimatedText from './AnimatedText';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'dark' | 'light';
  className?: string;
}

export default function SectionHeader({
  kicker,
  title,
  description,
  align = 'left',
  theme = 'light',
  className = '',
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div
      ref={ref}
      className={`space-y-3 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'text-start max-w-2xl'} ${className}`}
    >
      {/* Kicker badge with animated green dot and line */}
      <motion.div
        initial={{ opacity: 0, x: isCenter ? 0 : -20, y: isCenter ? -10 : 0 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-flex items-center gap-2 ${isCenter ? 'justify-center' : ''}`}
      >
        <span className="w-3 h-3 bg-[#1D8F2C] inline-block animate-pulse-glow" />
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D8F2C] font-[var(--font-display)]">
          {kicker}
        </span>
      </motion.div>

      {/* Main Display Title with masked word-by-word reveal */}
      <AnimatedText
        text={title}
        as="h2"
        className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[var(--font-display)] leading-[1.18] tracking-tight ${
          isDark ? 'text-white' : 'text-[#232434]'
        }`}
        delay={0.1}
      />

      {/* Description text with soft blur fade */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`text-sm sm:text-base leading-relaxed font-normal pt-1 ${
            isDark ? 'text-neutral-300' : 'text-[#585858]'
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
