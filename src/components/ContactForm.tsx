'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { servicesData } from '@/data/services';
import {
  FileTextIcon,
  RulerIcon,
  LeafIcon,
  WrenchIcon,
  ChatBubbleIcon,
  CheckIcon,
} from './icons/SiteIcons';

export default function ContactForm({ initialService }: { initialService?: string }) {
  const locale = useLocale();
  const t = useTranslations('contact.form');
  const isAr = locale === 'ar';

  const [inquiryType, setInquiryType] = useState<string>('tender');
  const [projectLocation, setProjectLocation] = useState<string>('jeddah');
  const [projectScale, setProjectScale] = useState<string>('medium');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService || 'general',
    message: '',
    honeypot: '', // bot trap
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const inquiryTypes = [
    { id: 'tender', labelEn: 'Tender & BoQ Review', labelAr: 'مناقصة ومراجعة كميات', icon: FileTextIcon },
    { id: 'inspection', labelEn: 'Site Inspection', labelAr: 'طلب معاينة موقع', icon: RulerIcon },
    { id: 'nursery', labelEn: 'Nursery Plants Supply', labelAr: 'توريد نباتات مشاتل', icon: LeafIcon },
    { id: 'maintenance', labelEn: 'Annual SLA Contract', labelAr: 'عقد تشغيل وصيانة', icon: WrenchIcon },
    { id: 'general', labelEn: 'General Inquiry', labelAr: 'استفسار عام', icon: ChatBubbleIcon },
  ];

  const saudiCities = [
    { id: 'jeddah', labelEn: 'Jeddah (Western Region)', labelAr: 'جدة (المنطقة الغربية)' },
    { id: 'riyadh', labelEn: 'Riyadh (Central Region)', labelAr: 'الرياض (المنطقة الوسطى)' },
    { id: 'makkah', labelEn: 'Makkah Al-Mukarramah', labelAr: 'مكة المكرمة' },
    { id: 'madinah', labelEn: 'Al-Madinah Al-Munawwarah', labelAr: 'المدينة المنورة' },
    { id: 'yanbu', labelEn: 'Yanbu Industrial City', labelAr: 'ينبع الصناعية' },
    { id: 'eastern', labelEn: 'Dammam & Khobar (Eastern)', labelAr: 'الدمام والخبر (الشرقية)' },
    { id: 'other', labelEn: 'Other City / Region in KSA', labelAr: 'مدينة / منطقة أخرى بالمملكة' },
  ];

  const scaleOptions = [
    { id: 'small', labelEn: 'Compact (< 1,000 m²)', labelAr: 'مساحة صغيرة (أقل من 1,000 م²)' },
    { id: 'medium', labelEn: 'Medium (1,000 – 5,000 m²)', labelAr: 'مساحة متوسطة (1,000 – 5,000 م²)' },
    { id: 'large', labelEn: 'Large Estate (5,000 – 25,000 m²)', labelAr: 'مساحة كبرى (5,000 – 25,000 م²)' },
    { id: 'mega', labelEn: 'Mega Project (> 25,000 m²)', labelAr: 'مشروع استراتيجي (أكبر من 25,000 م²)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.honeypot) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const enrichedMessage = `[Type: ${inquiryType.toUpperCase()} | City: ${projectLocation} | Scale: ${projectScale}]\n\n${formData.message}`;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: enrichedMessage,
          locale,
          source: 'contact-page-executive',
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'general',
          message: '',
          honeypot: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection error. Please try again or WhatsApp us.');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 border-t-4 border-[#1D8F2C] shadow-sm">
      <div className="mb-8">
        <span className="text-[#1D8F2C] text-xs font-bold uppercase tracking-widest block mb-1 font-[var(--font-display)]">
          {isAr ? 'نموذج الاستشارة المباشرة' : 'Direct Engineering Consultation'}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#232434] font-[var(--font-display)]">
          {isAr ? 'أرسل تفاصيل مشروعك وتسعير الكميات' : 'Submit Project Specs & Tender Review'}
        </h3>
        <p className="text-xs sm:text-sm text-[#585858] mt-2 leading-relaxed">
          {isAr
            ? 'يقوم مهندسونا الاستشاريون بمراجعة جداول الكميات والمخططات والرد خلال 24 ساعة عمل.'
            : 'Our licensed engineers review drawings and tender BoQs with guaranteed 24-hour turnaround.'}
        </p>
      </div>

      {status === 'success' ? (
        <div className="p-8 bg-[#F3F7FB] border-t-4 border-[#1D8F2C] text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-[#1D8F2C] text-white flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h4 className="text-xl font-bold font-[var(--font-display)] text-[#232434]">
            {isAr ? 'تم استلام طلبكم الهندسي بنجاح!' : 'Inquiry Successfully Received!'}
          </h4>
          <p className="text-sm text-[#585858] max-w-md mx-auto leading-relaxed">
            {isAr
              ? 'شكراً لتواصلكم مع شركة جرين سلوشن. تم تحويل طلبكم إلى الإدارة الفنية المختصة وسيقوم مستشارنا بالرد عليكم خلال 24 ساعة عمل.'
              : 'Thank you for consulting Green Solution Co. Your project specifications have been routed to our chief estimator.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setStatus('idle')}
              className="theme-btn"
            >
              <span>{isAr ? 'إرسال استفسار آخر' : 'Submit Another Request'}</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* 1. Inquiry Type Selector (Pill Tabs) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#232434] font-[var(--font-display)]">
              {isAr ? 'نوع الطلب أو الاستشارة:' : 'Inquiry Category:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {inquiryTypes.map((type) => {
                const IconComp = type.icon;
                const isSelected = inquiryType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInquiryType(type.id)}
                    className={`flex items-center gap-2 p-3 text-xs font-semibold border transition-all text-start cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D8F2C] text-white border-[#1D8F2C] shadow-sm'
                        : 'bg-[#F3F7FB] hover:bg-neutral-200/60 text-[#232434] border-neutral-200'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#1D8F2C]'}`} />
                    <span className="truncate font-medium">{isAr ? type.labelAr : type.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Contact details: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#232434] mb-1.5 font-[var(--font-display)]">
                {t('name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] text-[#232434]"
                placeholder={isAr ? 'الاسم الكريم / اسم المنشأة' : 'Full Name or Company'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#232434] mb-1.5 font-[var(--font-display)]">
                {t('phone')} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] text-[#232434]"
                placeholder={isAr ? '05XXXXXXXX' : '+966 5X XXX XXXX'}
              />
            </div>
          </div>

          {/* 3. Email & Service Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#232434] mb-1.5 font-[var(--font-display)]">
                {t('email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] text-[#232434]"
                placeholder="engineer@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#232434] mb-1.5 font-[var(--font-display)]">
                {isAr ? 'القسم الهندسي المطلوب:' : 'Specialized Division:'}
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] text-[#232434] font-medium"
              >
                <option value="general">{isAr ? 'استشارة عامة / مناقصة شاملة' : 'General EPC / Turnkey Scope'}</option>
                {servicesData.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {isAr ? s.titleAr : s.titleEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Project City & Approximate Scale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#232434] mb-1.5 font-[var(--font-display)]">
                {isAr ? 'موقع المشروع بالمملكة:' : 'Project City / Hub:'}
              </label>
              <select
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] text-[#232434]"
              >
                {saudiCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isAr ? c.labelAr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#232434] mb-1.5 font-[var(--font-display)]">
                {isAr ? 'المساحة التقديرية للمشروع:' : 'Approximate Site Area:'}
              </label>
              <select
                value={projectScale}
                onChange={(e) => setProjectScale(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] text-[#232434]"
              >
                {scaleOptions.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {isAr ? sc.labelAr : sc.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-[#232434] mb-1.5 font-[var(--font-display)]">
              {t('message')} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] text-[#232434]"
              placeholder={
                isAr
                  ? 'اكتب نبذة عن موقع المشروع، المتطلبات الهندسية، الموعد المستهدف للتنفيذ، أو مواصفات جداول الكميات المطلوبة...'
                  : 'Specify project location, scope requirements, timeline, or tender BoQ details...'
              }
            />
          </div>

          {/* Trust assurances strip */}
          <div className="p-3.5 bg-[#F3F7FB] border border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#585858]">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C]" />
              <span>{isAr ? 'رد رسمي خلال 24 ساعة عمل' : 'Guaranteed 24h response'}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C]" />
              <span>{isAr ? 'سرية تامة للرسومات والمخططات' : 'Strict commercial NDA'}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C]" />
              <span>{isAr ? 'دراسة مطابقة لكود البناء السعودي' : 'SBC compliant review'}</span>
            </span>
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Submit button with Sungo .theme-btn */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="theme-btn w-full py-4 text-center disabled:opacity-50"
          >
            <span>
              {status === 'loading'
                ? isAr
                  ? 'جارٍ إرسال المخططات والطلب...'
                  : 'Submitting Project Details...'
                : isAr
                ? 'إرسال طلب الاستشارة والتسعير'
                : 'Submit Inquiry & Request Estimates'}
              <i className="fa-solid fa-arrow-right-long ms-2">→</i>
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
