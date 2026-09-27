'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface EcoLuxuryHeroProps {
  initialLocale?: 'en' | 'ar';
}

const heroContent = {
  en: {
    locale: 'en',
    dir: 'ltr',
    badge: 'Precision Ecological Agriculture',
    titleStart: 'Intelligent Land Stewardship for',
    titleHighlight: 'Arid Ecosystems',
    description:
      'We combine regenerative agronomy, sub-surface SCADA telemetry, and acclimatized botanical propagation to cultivate resilient landscapes across Saudi Arabia and the Gulf.',
    primaryCta: 'Explore Solutions',
    secondaryCta: 'Technical Brief',
    stats: [
      { value: '38%', label: 'Water Conserved' },
      { value: '120k+', label: 'Cultivated Hectares' },
      { value: '0.04%', label: 'Salinity Tolerance' },
    ],
    floatingCard: {
      title: 'Active Hydrological Telemetry',
      status: 'Optimal Soil Tension',
      metric: '22.4 cbar',
    },
  },
  ar: {
    locale: 'ar',
    dir: 'rtl',
    badge: 'حلول الزراعة البيئية الدقيقة',
    titleStart: 'إدارة ذكية للأراضي واستدامة',
    titleHighlight: 'الأنظمة البيئية الجافة',
    description:
      'نجمع بين الهندسة الزراعية التجديدية، شبكات الري الذكية المرتبطة بالأرصاد، وتقنيات الأقلمة البستانية لتشييد مسطحات خضراء مستدامة تزدهر في بيئات المملكة والخليج العربي.',
    primaryCta: 'استكشف حلولنا الهندسية',
    secondaryCta: 'الملف الفني والمواصفات',
    stats: [
      { value: '38%+', label: 'وفر مائي موثق' },
      { value: '120k+', label: 'هكتار تحت الإشراف' },
      { value: '0.04%', label: 'مقاومة تباين الملوحة' },
    ],
    floatingCard: {
      title: 'المراقبة الهيدروليكية الميدانية',
      status: 'ضغط رطوبة التربة المثالي',
      metric: '22.4 سنتيبار',
    },
  },
};

export default function EcoLuxuryHero({ initialLocale = 'en' }: EcoLuxuryHeroProps) {
  const [currentLocale, setCurrentLocale] = useState<'en' | 'ar'>(initialLocale);
  const data = heroContent[currentLocale];
  const isAr = currentLocale === 'ar';

  return (
    <section
      dir={data.dir}
      lang={data.locale}
      className="relative min-h-[92vh] flex items-center bg-[#F8F9F6] text-[#1A201C] overflow-hidden transition-all duration-300 border-b border-[#E3E8E1]"
    >
      {/* Background Micro-Gradient Glow */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#5C7C64]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-[30rem] h-[30rem] bg-[#D4A373]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Language Toggle Switcher (Top End) */}
      <div className="absolute top-6 end-8 z-30 flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#E3E8E1] shadow-sm">
        <button
          type="button"
          onClick={() => setCurrentLocale('en')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            !isAr ? 'bg-[#143823] text-[#F8F9F6]' : 'text-[#4A554E] hover:text-[#143823]'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setCurrentLocale('ar')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer font-[var(--font-cairo)] ${
            isAr ? 'bg-[#143823] text-[#F8F9F6]' : 'text-[#4A554E] hover:text-[#143823]'
          }`}
        >
          العربية
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text & Content Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Badge Indicator */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2F6F3] border border-[#D0DCD3] text-[#143823] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" />
                <span>{data.badge}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#143823] tracking-tight leading-tight">
              {data.titleStart}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#143823] via-[#1E4F32] to-[#5C7C64]">
                {data.titleHighlight}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#4A554E] max-w-2xl leading-relaxed">
              {data.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/${data.locale}/services`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#143823] text-[#F8F9F6] font-semibold text-sm shadow-md hover:bg-[#1E4F32] active:scale-[0.98] transition-all duration-200"
              >
                <span>{data.primaryCta}</span>
                <span className="rtl:rotate-180 transition-transform">→</span>
              </Link>
              <Link
                href={`/${data.locale}/contact`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full border border-[#D0DCD3] bg-white text-[#143823] font-semibold text-sm hover:bg-[#F2F6F3] hover:border-[#5C7C64] transition-all duration-200"
              >
                <span>{data.secondaryCta}</span>
              </Link>
            </div>

            {/* Performance Indicators */}
            <div className="pt-8 border-t border-[#E3E8E1] grid grid-cols-3 gap-4 sm:gap-8">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-[#143823] font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#6F7D74] font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Showcase & Telemetry Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl bg-[#0C2316] border border-[#E3E8E1]">
              {/* Precision Agri-Tech Image */}
              <img
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80"
                alt="Controlled Arid Agriculture and Soil Management"
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2316]/90 via-[#0C2316]/20 to-transparent" />

              {/* Floating Real-Time Telemetry Card */}
              <div className="absolute bottom-6 start-6 end-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E3E8E1] shadow-lg">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#143823] animate-ping" />
                    <span className="text-xs font-bold text-[#143823]">
                      {data.floatingCard.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#5C7C64]">
                    {data.floatingCard.metric}
                  </span>
                </div>
                <div className="text-xs text-[#4A554E]">
                  {data.floatingCard.status}
                </div>
              </div>
            </div>

            {/* Architectural Subtle Backdrop Ring */}
            <div className="absolute -inset-4 border border-[#D0DCD3]/50 rounded-[2rem] -z-10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
