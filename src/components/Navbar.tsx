'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeIcon } from './icons/SiteIcons';

const navLinks = [
  { key: 'home', href: '' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'clients', href: '/clients' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/contact' },
];

export default function Navbar({ onOpenQuote }: { onOpenQuote?: () => void }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isAr = locale === 'ar';
  const otherLocale = isAr ? 'en' : 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Derive equivalent path for language switcher
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
  const targetLocalePath = `/${otherLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 font-sans">
      {/* Sungo Top Contact Bar */}
      <div
        className={`bg-[#232434] text-neutral-300 text-xs px-4 sm:px-8 transition-all duration-300 overflow-hidden border-b border-white/10 ${
          isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-12 opacity-100 py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left / Contact List */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:chhameed@greensolutionksa.com"
              className="flex items-center gap-2 hover:text-[#1D8F2C] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#1D8F2C]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>chhameed@greensolutionksa.com</span>
            </a>
            <a
              href="tel:+966595998808"
              className="hidden sm:flex items-center gap-2 hover:text-[#1D8F2C] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#1D8F2C]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
              </svg>
              <span className="dir-ltr font-mono">+966 59 599 8808</span>
            </a>
          </div>

          {/* Right / Social + Language */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-3 text-neutral-400">
              <span className="text-[11px] font-medium text-white/70">
                {isAr ? 'تابعنا:' : 'Follow Us:'}
              </span>
              <a
                href="https://facebook.com/greensolutionksa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/5 hover:bg-[#1D8F2C] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/5 hover:bg-[#1D8F2C] hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

            {/* Language Switch Button */}
            <Link
              href={targetLocalePath}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-[#1D8F2C] hover:text-white text-white rounded transition-colors text-xs font-semibold"
            >
              <GlobeIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sungo Main Sticky Navbar */}
      <nav className={`bg-white transition-all duration-300 ${isScrolled ? 'shadow-md py-1' : 'border-b border-neutral-100 py-2'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
          {/* Brand Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center group py-1 shrink-0"
            aria-label="Green Solution Co. - Home"
          >
            <Image
              src="/images/logo.png"
              alt={isAr ? 'شركة جرين سلوشن لتنسيق الحدائق وشبكات الري' : 'Green Solution Co. - Landscaping & Irrigation Systems'}
              width={300}
              height={120}
              priority
              className={`${
                isScrolled ? 'h-12 sm:h-13' : 'h-14 sm:h-16 lg:h-[68px]'
              } w-auto max-w-[200px] sm:max-w-[260px] lg:max-w-[300px] object-contain transition-all duration-200 group-hover:scale-[1.02]`}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const fullHref = `/${locale}${link.href}`;
              const isActive =
                link.href === ''
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname.startsWith(fullHref);

              return (
                <Link
                  key={link.key}
                  href={fullHref}
                  className={`text-[15px] font-bold transition-colors relative py-1.5 font-[var(--font-display)] ${
                    isActive
                      ? 'text-[#1D8F2C]'
                      : 'text-[#232434] hover:text-[#1D8F2C]'
                  }`}
                >
                  {t(link.key)}
                  {isActive && (
                    <span className="absolute -bottom-1 inset-x-0 h-[2px] bg-[#1D8F2C]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sungo Style Action CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onOpenQuote}
              className="theme-btn cursor-pointer inline-flex items-center gap-3 px-7 py-3.5 text-sm font-bold tracking-wide uppercase font-[var(--font-display)]"
            >
              <span>{isAr ? 'طلب عرض سعر' : 'Get A Quote'}</span>
              <svg
                className="w-4 h-4 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          {/* Mobile Actions: Quote + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenQuote}
              className="theme-btn text-xs px-3.5 py-2 uppercase font-bold"
            >
              <span>{isAr ? 'عرض سعر' : 'Quote'}</span>
            </button>
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-[#232434] hover:text-[#1D8F2C] transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Sungo Offcanvas Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 z-50 lg:hidden"
            />

            {/* Offcanvas Content */}
            <motion.div
              initial={{ x: isAr ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${
                isAr ? 'right-0' : 'left-0'
              } w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden p-6`}
            >
              <div>
                {/* Header with Close */}
                <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                  <Link
                    href={`/${locale}`}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center"
                    aria-label="Green Solution Co. - Home"
                  >
                    <Image
                      src="/images/logo.png"
                      alt={isAr ? 'شركة جرين سلوشن' : 'Green Solution Co.'}
                      width={180}
                      height={70}
                      className="h-10 sm:h-11 w-auto object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="w-9 h-9 bg-neutral-100 text-[#232434] hover:bg-[#1D8F2C] hover:text-white flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Nav Links */}
                <div className="py-6 space-y-1">
                  {navLinks.map((link) => {
                    const fullHref = `/${locale}${link.href}`;
                    const isActive =
                      link.href === ''
                        ? pathname === `/${locale}` || pathname === `/${locale}/`
                        : pathname.startsWith(fullHref);

                    return (
                      <Link
                        key={link.key}
                        href={fullHref}
                        onClick={() => setIsMobileOpen(false)}
                        className={`block py-3 px-3 text-base font-bold border-b border-neutral-100 font-[var(--font-display)] transition-colors ${
                          isActive
                            ? 'text-[#1D8F2C] bg-neutral-50'
                            : 'text-[#232434] hover:text-[#1D8F2C]'
                        }`}
                      >
                        {t(link.key)}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Offcanvas Contact & Info */}
              <div className="pt-6 border-t border-neutral-200 space-y-4">
                <div className="space-y-2 text-xs text-[#585858]">
                  <p className="font-bold text-[#232434] text-sm mb-2">{isAr ? 'معلومات التواصل' : 'Contact Info'}</p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#1D8F2C]">📍</span>
                    <span>{isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#1D8F2C]">📞</span>
                    <span className="dir-ltr font-mono">+966 59 599 8808</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#1D8F2C]">✉️</span>
                    <span>chhameed@greensolutionksa.com</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    onOpenQuote?.();
                  }}
                  className="w-full theme-btn py-3 text-center text-xs uppercase font-bold"
                >
                  <span>{isAr ? 'طلب عرض سعر' : 'Get A Quote'}</span>
                </button>

                <div className="pt-2">
                  <Link
                    href={targetLocalePath}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-neutral-100 text-xs font-bold text-[#232434] hover:bg-[#1D8F2C] hover:text-white transition-colors"
                  >
                    <GlobeIcon className="w-4 h-4" />
                    <span>{isAr ? 'Switch to English' : 'التحويل إلى العربية'}</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
