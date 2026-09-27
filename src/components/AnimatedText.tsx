'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
}

export default function AnimatedText({
  text,
  className = '',
  as = 'h2',
  delay = 0,
  duration = 0.75,
  stagger = 0.04,
  once = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  // Split lines by newline, then words
  const lines = text.split('\n');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '120%',
      opacity: 0,
      rotateX: 45,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1] as const, // Cubic bezier expo-out
      },
    },
  };

  const Component = motion[as] as any;

  return (
    <Component
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {lines.map((line, lineIdx) => {
        const words = line.split(' ');
        return (
          <span key={lineIdx} className="block overflow-hidden py-0.5">
            {words.map((word, wordIdx) => (
              <span
                key={wordIdx}
                className="inline-block overflow-hidden me-[0.25em] align-bottom"
                style={{ perspective: 1000 }}
              >
                <motion.span
                  variants={wordVariants}
                  className="inline-block"
                  style={{ transformOrigin: 'bottom center' }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        );
      })}
    </Component>
  );
}
