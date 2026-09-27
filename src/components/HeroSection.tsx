'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CountUp from '@/components/CountUp';

interface HeroSlide {
  id: string;
  image: string;
  categoryEn: string;
  categoryAr: string;
  headlineEn: string;
  headlineAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

const slides: HeroSlide[] = [
  {
    id: 'landscape',
    image: '/img/hero-royal-palace.jpg',
    categoryEn: 'GREEN SOLUTION KSA • EST. 1998',
    categoryAr: 'جرين سلوشن السعودية • تأسست عام ١٩٩٨',
    headlineEn: 'Enduring Landscapes.\nSustainable Engineering.',
    headlineAr: 'عمارة الطبيعة المستدامة.\nهندسة بيئية تعيش للأجيال.',
    descriptionEn:
      'Turnkey commercial landscaping, automated telemetry irrigation, and proprietary acclimatized nursery stock for premier royal and urban developments across the Kingdom.',
    descriptionAr:
      'تصميم وتنفيذ متكامل للمناظر الطبيعية، شبكات الري الذكية المؤتمتة، ومشاتل الأقلمة المتخصصة للمشاريع الكبرى والقصور في المملكة العربية السعودية.',
  },
  {
    id: 'irrigation',
    image: '/img/hero-smart-irrigation.jpg',
    categoryEn: 'PRECISION HYDRAULIC ENGINEERING',
    categoryAr: 'هندسة الري الذكي وترشيد المياه',
    headlineEn: 'Smart Irrigation Saving\nUp to 30% Water.',
    headlineAr: 'شبكات ري ذكية متقدمة\nتوفر حتى 30% من استهلاك المياه.',
    descriptionEn:
      'Weather-synchronized central telemetry and precision subsurface networks engineered to preserve precious groundwater reserves under extreme desert climates.',
    descriptionAr:
      'محطات تحكم مركزية متصلة بالأرصاد الجوية وشبكات ري بالتنقيط صُممت خصيصاً لحماية الموارد المائية ومطابقة كود البناء السعودي SBC.',
  },
  {
    id: 'sports-turf',
    image: '/img/hero-stadium.jpg',
    categoryEn: 'CHAMPIONSHIP ARENAS & URBAN GREENING',
    categoryAr: 'الملاعب الدولية والتشجير البيئي المستدام',
    headlineEn: 'FIFA-Standard Arenas &\nBotanical Masterplans.',
    headlineAr: 'ملاعب معتمدة بمواصفات دولية\nومخططات بيئية رائدة.',
    descriptionEn:
      'From King Abdullah Sports City stadium turf to large-scale municipal plazas, delivering enduring living environments aligned with the Saudi Green Initiative.',
    descriptionAr:
      'من ملاعب مدينة الملك عبدالله الرياضية (الجوهرة) إلى الساحات الحضرية الكبرى، نبتكر معالم خضراء تعزز جودة الحياة وتواكب رؤية السعودية 2030.',
  },
];

const SLIDE_INTERVAL = 7000;

export default function HeroSection({ onOpenQuote }: { onOpenQuote?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const locale = useLocale();
  const isAr = locale === 'ar';

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const activeSlide = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="relative overflow-hidden bg-[#1E202B] text-white pt-44 sm:pt-48 pb-20 sm:pb-24 min-h-[680px] lg:min-h-[820px] flex flex-col justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-width Background Image Slider */}
      <AnimatePresence initial={false}>
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeSlide.image})` }}
          />
          {/* Sungo Style Dark Overlay */}
          <div className="absolute inset-0 bg-[#1E202B]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E202B]/90 via-[#1E202B]/60 to-transparent" />
        </motion.div>
      </AnimatePresence>



      {/* Main Container Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-6 text-start">
          {/* Sungo Subtitle / Kicker (h6 uppercase with green accent) */}
          <div className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1D8F2C] inline-block animate-pulse-glow" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#1D8F2C] font-[var(--font-display)]">
              {isAr ? activeSlide.categoryAr : activeSlide.categoryEn}
            </span>
          </div>

          {/* Sungo Display Heading with Masked Word Slide-up Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.04, delayChildren: 0.05 },
                },
                exit: {
                  opacity: 0,
                  y: -15,
                  transition: { duration: 0.3 },
                },
              }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-[var(--font-display)] whitespace-pre-line">
                {(isAr ? activeSlide.headlineAr : activeSlide.headlineEn)
                  .split('\n')
                  .map((line, lIdx) => (
                    <span key={lIdx} className="block overflow-hidden py-0.5">
                      {line.split(' ').map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className="inline-block overflow-hidden me-[0.25em] align-bottom"
                          style={{ perspective: 1000 }}
                        >
                          <motion.span
                            variants={{
                              hidden: { y: '125%', opacity: 0, rotateX: 35 },
                              visible: {
                                y: '0%',
                                opacity: 1,
                                rotateX: 0,
                                transition: {
                                  duration: 0.7,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                              },
                            }}
                            className="inline-block"
                            style={{ transformOrigin: 'bottom center' }}
                          >
                            {word}
                          </motion.span>
                        </span>
                      ))}
                    </span>
                  ))}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Subtitle / Description with Soft Blur Fade */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeSlide.id}
              initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-neutral-200 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed font-normal"
            >
              {isAr ? activeSlide.descriptionAr : activeSlide.descriptionEn}
            </motion.p>
          </AnimatePresence>

          {/* Buttons: Sungo theme-btn Split-Wipe with Pop Entrance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 flex flex-wrap items-center gap-4"
          >
            {onOpenQuote ? (
              <button
                onClick={onOpenQuote}
                className="theme-btn cursor-pointer inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-wide uppercase font-[var(--font-display)] hover-lift"
              >
                <span>{isAr ? 'طلب معاينة ودراسة فنية' : 'Request Consultation'}</span>
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <Link
                href={`/${locale}/contact`}
                className="theme-btn inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-wide uppercase font-[var(--font-display)] hover-lift"
              >
                <span>{isAr ? 'طلب معاينة ودراسة فنية' : 'Request Consultation'}</span>
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}

            <Link
              href={`/${locale}/projects`}
              className="theme-btn-2 inline-flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-wide uppercase text-white bg-transparent border-2 border-white/30 hover:border-[#1D8F2C] hover:bg-[#1D8F2C] transition-all font-[var(--font-display)] hover-lift"
            >
              <span>{isAr ? 'سجل المشاريع' : 'Our Projects'}</span>
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Sungo Bottom Slide Indicator Dots */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-8 text-neutral-300 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-[#1D8F2C] font-extrabold text-base font-[var(--font-display)]">
              <CountUp value="25+" />
            </span>
            <span>{isAr ? 'عاماً خبرة' : 'Years Experience'}</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-[#1D8F2C] font-extrabold text-base font-[var(--font-display)]">
              <CountUp value="55+" />
            </span>
            <span>{isAr ? 'مشروعاً منجزاً' : 'Completed Projects'}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/20" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#1D8F2C] font-extrabold text-base font-[var(--font-display)]">
              <CountUp value="100%" />
            </span>
            <span>{isAr ? 'كود البناء السعودي' : 'SBC Compliant'}</span>
          </div>
        </div>

        {/* Controls: Slide Indicators + Navigation Arrows */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Slide Indicator Pills */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2.5 transition-all duration-300 cursor-pointer rounded-full ${
                  idx === currentIndex
                    ? 'w-8 bg-[#1D8F2C]'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <div className="h-5 w-px bg-white/20 hidden sm:block" />

          {/* Navigation Arrows Group */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label={isAr ? 'الشريحة السابقة' : 'Previous Slide'}
              className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-[#1D8F2C] hover:border-[#1D8F2C] text-white flex items-center justify-center transition-all duration-200 cursor-pointer group shadow-sm active:scale-95"
            >
              <svg
                className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label={isAr ? 'الشريحة التالية' : 'Next Slide'}
              className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-[#1D8F2C] hover:border-[#1D8F2C] text-white flex items-center justify-center transition-all duration-200 cursor-pointer group shadow-sm active:scale-95"
            >
              <svg
                className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
