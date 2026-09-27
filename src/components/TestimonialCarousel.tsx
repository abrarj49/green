'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

const clientImages = [
  '/img/testimonial-1.jpg',
  '/img/testimonial-2.jpg',
  '/img/team-1.jpg',
];

export default function TestimonialCarousel() {
  const t = useTranslations('testimonials');
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [0, 1, 2].map((i) => ({
    quote: t(`items.${i}.quote`),
    author: t(`items.${i}.author`),
    role: t(`items.${i}.role`),
    company: t(`items.${i}.company`),
    image: clientImages[i],
  }));

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const item = testimonials[current];

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-neutral-100 relative overflow-hidden">
        {/* Subtle decorative leaf background */}
        <div className="absolute -top-10 -end-10 w-40 h-40 bg-accent-tint rounded-full -z-0 opacity-60 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-start"
          >
            {/* Client Portrait */}
            <div className="shrink-0 relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
                <img
                  src={item.image}
                  alt={item.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -end-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>

            {/* Testimonial Body */}
            <div className="flex-1 space-y-4">
              {/* Star Rating */}
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote text */}
              <p className="text-neutral-700 text-base sm:text-lg italic leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author Info */}
              <div>
                <h4 className="text-lg font-bold text-primary-dark">
                  {item.author}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  {item.role} &bull; <span className="text-primary font-semibold">{item.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next Buttons & Indicators */}
      <div className="flex items-center justify-between mt-6 px-2">
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                i === current ? 'bg-primary w-8' : 'bg-neutral-300 w-2.5 hover:bg-neutral-400'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white hover:bg-primary hover:text-white text-neutral-700 border border-neutral-200 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            aria-label="Previous testimonial"
          >
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white hover:bg-primary hover:text-white text-neutral-700 border border-neutral-200 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            aria-label="Next testimonial"
          >
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
