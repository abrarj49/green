'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  onOpenQuote?: () => void;
}

export default function Footer({ onOpenQuote }: FooterProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const services = [
    { slug: 'landscape-design-planning', en: 'Landscape Master Planning', ar: 'تخطيط وتصميم المناظر الطبيعية' },
    { slug: 'irrigation-water-systems', en: 'Smart Telemetry Irrigation', ar: 'شبكات الري الذكية وتوفير المياه' },
    { slug: 'lawn-development-maintenance', en: 'Hybrid Sports Pitch Turf', ar: 'إنشاء وصيانة الملاعب الرياضية' },
    { slug: 'outdoor-paving-hardscape', en: 'Architectural Hardscape & Pergolas', ar: 'الأعمال الصلبة والممرات والبرجولات' },
    { slug: 'vertical-gardens-rooftops', en: 'Living Walls & Green Roofs', ar: 'الحدائق الرأسية والأسطح الخضراء' },
    { slug: 'urban-green-space-management', en: 'Commercial Estate Care (SLA)', ar: 'عقود التشغيل والصيانة الشاملة' },
  ];

  const quickLinks = [
    { href: `/${locale}`, en: 'Home', ar: 'الرئيسية' },
    { href: `/${locale}/about`, en: 'About Us', ar: 'عن الشركة' },
    { href: `/${locale}/services`, en: 'Our Services', ar: 'خدماتنا' },
    { href: `/${locale}/projects`, en: 'Projects Portfolio', ar: 'سجل المشاريع' },
    { href: `/${locale}/clients`, en: 'Our Clients', ar: 'شركاء النجاح' },
    { href: `/${locale}/blog`, en: 'Our Blogs', ar: 'المقالات والأخبار' },
    { href: `/${locale}/contact`, en: 'Contact Us', ar: 'اتصل بنا' },
  ];

  return (
    <footer className="footer-section bg-[#1E202B] text-[#9CA3AF] relative overflow-hidden font-sans border-t border-neutral-800">
      {/* 1. Sungo Contact Info Area (3 Columns Strip with Dashed Icons) */}
      <div className="border-b border-white/10 py-10 sm:py-12 bg-[#171922]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border border-dashed border-[#1D8F2C] flex items-center justify-center shrink-0 bg-white/5">
                <svg className="w-7 h-7 text-[#1D8F2C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-neutral-400 tracking-wider font-[var(--font-display)]">
                  {isAr ? 'اتصل بنا 24/7' : 'Call Us 24/7'}
                </p>
                <h4 className="text-lg sm:text-xl font-bold text-white font-[var(--font-display)] mt-0.5">
                  <a href="tel:+966595998808" className="hover:text-[#1D8F2C] transition-colors dir-ltr inline-block">
                    +966 59 599 8808
                  </a>
                </h4>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border border-dashed border-[#1D8F2C] flex items-center justify-center shrink-0 bg-white/5">
                <svg className="w-7 h-7 text-[#1D8F2C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-neutral-400 tracking-wider font-[var(--font-display)]">
                  {isAr ? 'طلب عرض سعر واستشارة' : 'Make A Quote'}
                </p>
                <h4 className="text-sm sm:text-base font-bold text-white font-[var(--font-display)] mt-0.5 truncate max-w-[220px]">
                  <a href="mailto:chhameed@greensolutionksa.com" className="hover:text-[#1D8F2C] transition-colors">
                    chhameed@greensolutionksa.com
                  </a>
                </h4>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border border-dashed border-[#1D8F2C] flex items-center justify-center shrink-0 bg-white/5">
                <svg className="w-7 h-7 text-[#1D8F2C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-neutral-400 tracking-wider font-[var(--font-display)]">
                  {isAr ? 'المقر الرئيسي' : 'Headquarters'}
                </p>
                <h4 className="text-sm sm:text-base font-bold text-white font-[var(--font-display)] mt-0.5">
                  {isAr ? 'جدة والرياض، المملكة العربية السعودية' : 'Jeddah & Riyadh, Saudi Arabia'}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sungo Footer Widgets Wrapper (4 Columns) */}
      <div className="relative py-16 sm:py-20">
        <div className="absolute top-0 right-0 pointer-events-none opacity-20">
          <img src="/img/sungo/footer-shape-1.png" alt="shape" className="w-96" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Col 1: About Brand (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Link
                href={`/${locale}`}
                className="inline-block group"
                aria-label="Green Solution Co. - Home"
              >
                <div className="bg-white rounded-xl px-5 py-3 shadow-md border border-white/20 inline-flex items-center transition-all duration-300 group-hover:shadow-green-500/20 group-hover:border-[#1D8F2C]/50">
                  <Image
                    src="/images/logo.png"
                    alt={isAr ? 'شركة جرين سلوشن لتنسيق الحدائق وشبكات الري' : 'Green Solution Co. - Landscaping & Irrigation Systems'}
                    width={280}
                    height={110}
                    className="h-14 sm:h-16 w-auto max-w-[240px] sm:max-w-[280px] object-contain"
                  />
                </div>
              </Link>

              <p className="text-sm text-neutral-400 leading-relaxed">
                {isAr
                  ? 'شركة جرين سلوشن للمقاولات الزراعية — خبراء هندسة وتطوير المناظر الطبيعية الفاخرة، شبكات الري المؤتمتة، والمشاتل الزراعية المعتمدة للمشاريع الكبرى في المملكة العربية السعودية.'
                  : 'Green Solution Co. — Premier landscape engineering, automated irrigation systems, and acclimatized nursery stock for landmark developments across Saudi Arabia.'}
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://facebook.com/greensolutionksa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-[#1D8F2C] text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-[#1D8F2C] text-white flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/966595998808"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-[#1D8F2C] text-white flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <span className="text-base font-bold">W</span>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white font-[var(--font-display)] relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 rtl:after:left-auto rtl:after:right-0 after:w-10 after:h-[2px] after:bg-[#1D8F2C]">
                {isAr ? 'روابط سريعة' : 'Quick Links'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm pt-2">
                {quickLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-neutral-400 hover:text-white hover:text-[#1D8F2C] transition-colors inline-flex items-center gap-2 group"
                    >
                      <svg className="w-3 h-3 text-[#1D8F2C] rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                      <span>{isAr ? item.ar : item.en}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Services (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-lg font-bold text-white font-[var(--font-display)] relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 rtl:after:left-auto rtl:after:right-0 after:w-10 after:h-[2px] after:bg-[#1D8F2C]">
                {isAr ? 'خدماتنا الهندسية' : 'Services'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm pt-2">
                {services.map((svc) => (
                  <li key={svc.slug}>
                    <Link
                      href={`/${locale}/services/${svc.slug}`}
                      className="text-neutral-400 hover:text-white hover:text-[#1D8F2C] transition-colors inline-flex items-center gap-2 group"
                    >
                      <svg className="w-3 h-3 text-[#1D8F2C] rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                      <span>{isAr ? svc.ar : svc.en}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Recent Posts & Licensure (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-lg font-bold text-white font-[var(--font-display)] relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 rtl:after:left-auto rtl:after:right-0 after:w-10 after:h-[2px] after:bg-[#1D8F2C]">
                {isAr ? 'المشاريع والاعتمادات' : 'Accreditations & BoQs'}
              </h3>
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[11px] text-[#1D8F2C] font-mono font-bold uppercase block">
                    {isAr ? 'كود البناء السعودي SBC' : 'Saudi Building Code SBC'}
                  </span>
                  <p className="text-xs text-neutral-300">
                    {isAr
                      ? 'جميع مخططاتنا وجداول الكميات معتمدة وتتوافق مع كود البناء واشتراطات المشهد الحضري.'
                      : 'All engineering blueprints and BoQs are certified and compliant with SBC 02-L.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                  <span>{isAr ? 'المعاينة الفنية الميدانية:' : 'Technical Audits:'}</span>
                  <span className="text-[#1D8F2C] font-bold">{isAr ? 'متاحة بالمملكة' : 'Kingdom-Wide'}</span>
                </div>

                {onOpenQuote && (
                  <button
                    onClick={onOpenQuote}
                    className="w-full theme-btn py-3 text-center text-xs uppercase font-bold"
                  >
                    <span>{isAr ? 'طلب معاينة الموقع' : 'Request Site Audit'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sungo Footer Bottom Bar */}
      <div className="border-t border-white/10 py-6 bg-[#171922] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="text-center md:text-start">
            &copy; {new Date().getFullYear()} {isAr ? 'جميع الحقوق محفوظة لشركة جرين سلوشن (Green Solution Co.)' : 'All Copyright Reserved by Green Solution Co. — Landscaping & Irrigation Systems'}
          </p>

          <div className="flex items-center gap-6">
            <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
              {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-[#1D8F2C] text-white flex items-center justify-center hover:bg-white hover:text-[#232434] transition-all cursor-pointer"
              aria-label="Scroll to top"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
