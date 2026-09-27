'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocale } from 'next-intl';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';
  distance?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.75,
  direction = 'up',
  distance = 35,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-60px' });
  const locale = useLocale();
  const isAr = locale === 'ar';

  const getInitialVariants = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        // Account for RTL: in Arabic, left comes from the opposite direction
        return { opacity: 0, x: isAr ? distance : -distance };
      case 'right':
        return { opacity: 0, x: isAr ? -distance : distance };
      case 'zoom':
        return { opacity: 0, scale: 0.92 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateVariants = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'zoom':
        return { opacity: 1, scale: 1 };
      case 'fade':
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialVariants()}
      animate={isInView ? getAnimateVariants() : getInitialVariants()}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Expo-out curve
      }}
    >
      {children}
    </motion.div>
  );
}
