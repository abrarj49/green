'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import AnimatedText from '@/components/AnimatedText';

interface PageHeroProps {
  badge?: {
    en: string;
    ar: string;
  };
  title: {
    en: string;
    ar: string;
  };
  subtitle: {
    en: string;
    ar: string;
  };
  breadcrumbs?: Array<{
    labelEn: string;
    labelAr: string;
    href?: string;
  }>;
  stats?: Array<{
    value: string;
    labelEn: string;
    labelAr: string;
  }>;
  backgroundImage?: string;
}

export default function PageHero({
  badge,
  title,
  subtitle,
  breadcrumbs = [],
  stats,
  backgroundImage = '/img/sungo/breadcrumb.jpg',
}: PageHeroProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="relative pt-36 sm:pt-44 pb-16 sm:pb-20 bg-[#12141D] text-white overflow-hidden border-b border-white/10">
      {/* Background with deep dark overlay and subtle texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#12141D]/90 via-[#12141D]/80 to-[#12141D] pointer-events-none" />

      {/* Ambient Radial Glows matching Home Page */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1D8F2C]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-5 font-[var(--font-display)]"
          >
            <Link
              href={`/${locale}`}
              className="hover:text-white transition-colors duration-200"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <span className="text-[#1D8F2C]">/</span>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {isAr ? crumb.labelAr : crumb.labelEn}
                  </Link>
                ) : (
                  <span className="text-white font-bold">
                    {isAr ? crumb.labelAr : crumb.labelEn}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Solid Architectural Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-none bg-white/[0.07] border-s-2 border-[#1D8F2C] text-[#22c55e] text-xs font-bold uppercase tracking-wider mb-5 font-[var(--font-display)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D8F2C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D8F2C]"></span>
              </span>
              <span>{isAr ? badge.ar : badge.en}</span>
            </div>
          )}

          {/* Main Headline */}
          <AnimatedText
            text={isAr ? title.ar : title.en}
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4 font-[var(--font-display)]"
          />

          {/* Short, Punchy Subtitle - No Text Rush */}
          <p className="text-sm sm:text-base text-neutral-300/90 leading-relaxed max-w-2xl font-normal">
            {isAr ? subtitle.ar : subtitle.en}
          </p>

          {/* Optional Quick Stats Row */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-white/10 max-w-xl">
              {stats.map((stat, i) => (
                <div key={i} className="text-start">
                  <div className="text-xl sm:text-2xl font-black text-white font-[var(--font-display)]">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5">
                    {isAr ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
