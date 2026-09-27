'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

export default function CountUp({ value, className = '', duration = 2000 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState('0');

  // Match optional prefix, numeric digits, and suffix (e.g., "25+" => ["25+", "", "25", "+"], "200k+" => ["200k+", "", "200", "k+"])
  const match = value.match(/^([^0-9]*)(\d[\d,.]*)(.*)$/);
  const prefix = match?.[1] || '';
  const numStr = match?.[2] ? match[2].replace(/,/g, '') : '0';
  const targetNum = parseFloat(numStr) || 0;
  const isFloat = numStr.includes('.');
  const decimals = isFloat ? numStr.split('.')[1].length : 0;
  const suffix = match?.[3] || '';

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out exponential curve
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = isFloat
        ? (eased * targetNum).toFixed(decimals)
        : Math.round(eased * targetNum).toLocaleString();

      setDisplayValue(`${prefix}${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, targetNum, prefix, suffix, duration, isFloat, decimals, value]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {isInView ? displayValue : '0'}
    </motion.span>
  );
}
