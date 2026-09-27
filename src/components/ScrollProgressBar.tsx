'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useLocale } from 'next-intl';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1D8F2C] via-[#4CAF50] to-[#C9A34E] z-[9999] pointer-events-none shadow-[0_0_10px_rgba(29,143,44,0.6)]"
      style={{
        scaleX,
        transformOrigin: isAr ? '100% 50%' : '0% 50%',
      }}
    />
  );
}
