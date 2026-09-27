'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

const serviceOptions = [
  'general',
  'landscape-design-planning',
  'outdoor-paving-hardscape',
  'urban-green-space-management',
  'vertical-gardens-rooftops',
  'plantation-supplies',
  'pest-control',
  'lawn-development-maintenance',
  'irrigation-water-systems',
  'vegetable-fruit-gardens',
  'patio-pergola-gazebo',
  'park-garden-landscaping',
  'outdoor-lighting',
  'termite-control',
];

interface QuotePopupProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  preselectedService?: string;
  defaultService?: string;
}

export default function QuotePopup({
  isOpen,
  onClose,
  source = 'homepage-popup',
  preselectedService,
  defaultService,
}: QuotePopupProps) {
  const effectiveService = defaultService || preselectedService || 'general';
  const t = useTranslations();
  const locale = useLocale();
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: effectiveService,
    message: '',
    _honey: '', // honeypot
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData._honey) return; // honeypot triggered

    setFormState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          locale,
          source,
        }),
      });

      if (res.ok) {
        setFormState('success');
        setFormData({ name: '', email: '', phone: '', service: 'general', message: '', _honey: '' });
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  const getServiceLabel = (slug: string) => {
    if (slug === 'general') return t('contact.form.serviceGeneral');
    return t(`services.items.${slug}.title`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-popup)]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:start-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 rtl:sm:translate-x-1/2 bg-white rounded-none border-t-4 border-[#1D8F2C] shadow-2xl z-[var(--z-popup)] max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#232434] font-[var(--font-display)]">
                  {t('quotePopup.title')}
                </h2>
                <p className="text-xs text-[#585858] mt-0.5">
                  {t('quotePopup.subtitle')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-none transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-6">
              {formState === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-[#1D8F2C] text-white rounded-none flex items-center justify-center mx-auto mb-4 text-xl">
                    ✓
                  </div>
                  <p className="text-[#232434] font-bold">{t('contact.form.success')}</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2.5 bg-[#1D8F2C] text-white rounded-none text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {locale === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot — hidden from users */}
                  <input
                    type="text"
                    name="_honey"
                    value={formData._honey}
                    onChange={(e) => setFormData({ ...formData, _honey: e.target.value })}
                    className="absolute -top-[9999px] -start-[9999px]"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label htmlFor="quote-name" className="block text-xs font-bold text-[#232434] mb-1 font-[var(--font-display)]">
                      {t('contact.form.name')}
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-none focus:outline-none focus:border-[#1D8F2C] bg-[#F3F7FB] text-[#232434] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-email" className="block text-xs font-bold text-[#232434] mb-1 font-[var(--font-display)]">
                        {t('contact.form.email')}
                      </label>
                      <input
                        id="quote-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-none focus:outline-none focus:border-[#1D8F2C] bg-[#F3F7FB] text-[#232434] text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="quote-phone" className="block text-xs font-bold text-[#232434] mb-1 font-[var(--font-display)]">
                        {t('contact.form.phone')}
                      </label>
                      <input
                        id="quote-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-none focus:outline-none focus:border-[#1D8F2C] bg-[#F3F7FB] text-[#232434] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quote-service" className="block text-xs font-bold text-[#232434] mb-1 font-[var(--font-display)]">
                      {t('contact.form.service')}
                    </label>
                    <select
                      id="quote-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-none focus:outline-none focus:border-[#1D8F2C] bg-[#F3F7FB] text-[#232434] text-xs font-medium"
                    >
                      {serviceOptions.map((slug) => (
                        <option key={slug} value={slug}>
                          {getServiceLabel(slug)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quote-message" className="block text-xs font-bold text-[#232434] mb-1 font-[var(--font-display)]">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="quote-message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-none focus:outline-none focus:border-[#1D8F2C] bg-[#F3F7FB] text-[#232434] text-xs resize-none"
                    />
                  </div>

                  {formState === 'error' && (
                    <p className="text-red-600 text-xs">{t('contact.form.error')}</p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full py-3 bg-[#1D8F2C] text-white font-bold rounded-none hover:bg-[#167423] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider cursor-pointer"
                  >
                    {formState === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
