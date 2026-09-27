'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CloseIcon } from '@/components/icons/SiteIcons';


interface NewServiceData {
  slug: string;
  divisionCode: string;
  category: string;
  image: string;
  titleEn: string;
  titleAr: string;
  shortDescEn: string;
  shortDescAr: string;
  fullDescEn: string;
  fullDescAr: string;
  featuresEn: string[];
  featuresAr: string[];
  deliverablesEn: string[];
  deliverablesAr: string[];
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescEn: string;
  metaDescAr: string;
  keywords: string;
}

const SERVICE_IMAGE_PRESETS = [
  { label: 'Smart Irrigation Systems', url: '/images/hero-1.webp' },
  { label: 'Hardscape & SBC Structural', url: '/images/hero-2.webp' },
  { label: 'Landscape Architecture & Masterplanning', url: '/images/hero-3.webp' },
  { label: 'Commercial Irrigation & SCADA', url: '/images/water-irrigation.jpg' },
  { label: 'Paving, Plazas & SBC Masonry', url: '/images/hardscape-sbc.jpg' },
  { label: 'Royal Palm Health & IPM Logistics', url: '/images/palm-weevil.jpg' },
  { label: 'Water Features & Fountains', url: '/images/service-water-features.jpg' },
  { label: 'Pergolas & Shading Structures', url: '/images/service-pergola.jpg' },
];

const CATEGORY_PRESETS = [
  'Master Planning & Design',
  'Hardscape & Structures',
  'Living Green & Cultivation',
  'Smart Hydraulics & Water',
  'Agronomy & Maintenance',
  'Civil & Earthworks',
];

export default function NewServicePage() {
  const router = useRouter();

  const [service, setService] = useState<NewServiceData>({
    slug: '',
    divisionCode: 'DIV 32-00',
    category: CATEGORY_PRESETS[0],
    image: '/images/hero-1.webp',
    titleEn: '',
    titleAr: '',
    shortDescEn: '',
    shortDescAr: '',
    fullDescEn: '',
    fullDescAr: '',
    featuresEn: [
      'Comprehensive Technical Site Assessment & Survey',
      'Engineering Specification & Method Statement Preparation',
      'Execution by Certified Field Engineers & Technicians',
    ],
    featuresAr: [
      'مسح وتقييم فني شامل لموقع المشروع',
      'إعداد المواصفات الهندسية وبيان طريقة التنفيذ',
      'تنفيذ مباشر بواسطة مهندسين وفنيين ميدانيين معتمدين',
    ],
    deliverablesEn: [
      'As-Built Technical CAD Drawings & Hydraulic Calculations',
      'Warranty Certification & Operation Manuals',
    ],
    deliverablesAr: [
      'مخططات تنفيذية As-Built وحسابات هيدروليكية',
      'شهادات الضمان وكتيبات التشغيل والصيانة',
    ],
    metaTitleEn: '',
    metaTitleAr: '',
    metaDescEn: '',
    metaDescAr: '',
    keywords: 'saudi commercial landscape, irrigation contracting riyadh',
  });

  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [activeTab, setActiveTab] = useState<'details' | 'scopes' | 'seo' | 'media'>('details');
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');

  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [newFeatureAr, setNewFeatureAr] = useState('');
  const [newDeliverableEn, setNewDeliverableEn] = useState('');
  const [newDeliverableAr, setNewDeliverableAr] = useState('');

  // Auto slug generation from English title
  useEffect(() => {
    if (autoSlug && service.titleEn) {
      const generated = service.titleEn
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setService((prev) => ({ ...prev, slug: generated }));
    }
  }, [service.titleEn, autoSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.titleEn || !service.slug) {
      setToast({ message: 'Title and URL slug are required', type: 'error' });
      return;
    }

    setSaving(true);
    setToast(null);

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create service');
      }

      setToast({ message: 'Service successfully created! Redirecting to catalog...', type: 'success' });
      setTimeout(() => {
        router.push('/admin/services');
      }, 1200);
    } catch (err: any) {
      setToast({ message: err.message || 'Error creating service', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (!newFeatureEn.trim() && !newFeatureAr.trim()) return;
    setService({
      ...service,
      featuresEn: [...service.featuresEn, newFeatureEn.trim() || 'Scope item'],
      featuresAr: [...service.featuresAr, newFeatureAr.trim() || 'بند نطاق عمل'],
    });
    setNewFeatureEn('');
    setNewFeatureAr('');
  };

  const removeFeature = (idx: number) => {
    setService({
      ...service,
      featuresEn: service.featuresEn.filter((_, i) => i !== idx),
      featuresAr: service.featuresAr.filter((_, i) => i !== idx),
    });
  };

  const addDeliverable = () => {
    if (!newDeliverableEn.trim() && !newDeliverableAr.trim()) return;
    setService({
      ...service,
      deliverablesEn: [...service.deliverablesEn, newDeliverableEn.trim() || 'Project deliverable'],
      deliverablesAr: [...service.deliverablesAr, newDeliverableAr.trim() || 'تسليم هندسي للمشروع'],
    });
    setNewDeliverableEn('');
    setNewDeliverableAr('');
  };

  const removeDeliverable = (idx: number) => {
    setService({
      ...service,
      deliverablesEn: service.deliverablesEn.filter((_, i) => i !== idx),
      deliverablesAr: service.deliverablesAr.filter((_, i) => i !== idx),
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition"
            title="Back to all services"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Add New Engineering Service
            </h1>
            <p className="text-xs text-neutral-500">
              Publish a new commercial service line with CSI division code, scope, and deliverables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-6 py-2 rounded-xl shadow transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Creating Service...</span>
              </>
            ) : (
              <span>Create & Publish Service</span>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between ${toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
            }`}
        >
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 gap-6 text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-3 border-b-2 transition ${activeTab === 'details'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
        >
          General & Descriptions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('scopes')}
          className={`pb-3 border-b-2 transition ${activeTab === 'scopes'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
        >
          Scope Features & Deliverables
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`pb-3 border-b-2 transition ${activeTab === 'seo'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
        >
          SEO Meta & SERP Preview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`pb-3 border-b-2 transition ${activeTab === 'media'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
        >
          Featured Image & Category
        </button>
      </div>

      {/* TAB 1: DETAILS & DESCRIPTIONS */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Division Code (CSI / SBC) *
              </label>
              <input
                type="text"
                value={service.divisionCode}
                onChange={(e) => setService({ ...service, divisionCode: e.target.value })}
                className="w-full font-mono text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary font-bold text-neutral-800"
                placeholder="e.g. DIV 32-90"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Discipline Category *
              </label>
              <select
                value={service.category}
                onChange={(e) => setService({ ...service, category: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary text-neutral-800"
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Permanent URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] text-primary hover:underline font-mono"
                >
                  {autoSlug ? 'Auto-sync ON' : 'Auto-sync OFF'}
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-mono text-neutral-600">
                <span className="text-neutral-400">/services/</span>
                <input
                  type="text"
                  value={service.slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setService({ ...service, slug: e.target.value });
                  }}
                  className="w-full bg-transparent outline-none pl-1 text-neutral-800 font-semibold"
                  placeholder="commercial-roof-gardens"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bilingual Switcher */}
          <div className="flex items-center justify-between bg-neutral-100 p-1.5 rounded-xl">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLangTab('en')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${langTab === 'en' ? 'bg-white text-primary shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
              >
                🇬🇧 English Content
              </button>
              <button
                type="button"
                onClick={() => setLangTab('ar')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${langTab === 'ar' ? 'bg-white text-primary shadow-sm font-arabic' : 'text-neutral-600 hover:text-neutral-900 font-arabic'
                  }`}
              >
                🇸🇦 المحتوى بالعربية
              </button>
            </div>
            <span className="text-[11px] text-neutral-500 pr-2">
              Both English & Arabic versions are required for full localization.
            </span>
          </div>

          {/* English Form */}
          {langTab === 'en' && (
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Service Title (English) *
                </label>
                <input
                  type="text"
                  value={service.titleEn}
                  onChange={(e) => setService({ ...service, titleEn: e.target.value })}
                  placeholder="e.g. Commercial Green Roof & Podium Landscaping"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-primary focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Short Summary (English) *
                </label>
                <textarea
                  rows={3}
                  value={service.shortDescEn}
                  onChange={(e) => setService({ ...service, shortDescEn: e.target.value })}
                  placeholder="Brief 2-3 sentence overview displayed on cards and catalogs..."
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary focus:bg-white transition leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Full Engineering Scope Description (English) *
                </label>
                <textarea
                  rows={8}
                  value={service.fullDescEn}
                  onChange={(e) => setService({ ...service, fullDescEn: e.target.value })}
                  placeholder="In-depth technical breakdown of engineering standards, drainage membranes, soil depth..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-primary focus:bg-white transition leading-relaxed"
                  required
                />
              </div>
            </div>
          )}

          {/* Arabic Form */}
          {langTab === 'ar' && (
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5" dir="rtl">
              <div>
                <label className="block text-xs font-bold text-neutral-700 font-arabic mb-1">
                  عنوان الخدمة (باللغة العربية) *
                </label>
                <input
                  type="text"
                  value={service.titleAr}
                  onChange={(e) => setService({ ...service, titleAr: e.target.value })}
                  placeholder="مثال: هندسة وتنسيق الأسطح الخضراء والمنصات التجارية"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 font-arabic focus:outline-none focus:border-primary focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 font-arabic mb-1">
                  الملخص الفني الموجز (باللغة العربية) *
                </label>
                <textarea
                  rows={3}
                  value={service.shortDescAr}
                  onChange={(e) => setService({ ...service, shortDescAr: e.target.value })}
                  placeholder="نبذة موجزة تظهر في بطاقات الخدمات وفهارس الأقسام..."
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-arabic focus:outline-none focus:border-primary focus:bg-white transition leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 font-arabic mb-1">
                  نطاق الأعمال الهندسية التفصيلي (باللغة العربية) *
                </label>
                <textarea
                  rows={8}
                  value={service.fullDescAr}
                  onChange={(e) => setService({ ...service, fullDescAr: e.target.value })}
                  placeholder="التفاصيل الفنية الكاملة ومعايير التنفيذ المطابقة للمواصفات السعودية..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 font-arabic focus:outline-none focus:border-primary focus:bg-white transition leading-relaxed"
                  required
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCOPES & DELIVERABLES */}
      {activeTab === 'scopes' && (
        <div className="space-y-8">
          {/* Features */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Scope Features (Capabilities & Methods)
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Bullet points displayed in the service feature breakdown cards.
              </p>
            </div>

            <div className="space-y-2">
              {service.featuresEn.map((featEn, idx) => {
                const featAr = service.featuresAr[idx] || '';
                return (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="font-semibold text-neutral-400 mr-1.5">{idx + 1}.</span>
                        <span className="text-neutral-800">{featEn}</span>
                      </div>
                      <div className="text-right font-arabic text-neutral-600" dir="rtl">
                        {featAr || '(لا يوجد نص عربي)'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-neutral-400 hover:text-red-600 p-1"
                      title="Remove feature"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-200">
              <span className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                + Add Scope Feature
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <input
                  type="text"
                  value={newFeatureEn}
                  onChange={(e) => setNewFeatureEn(e.target.value)}
                  placeholder="Feature description in English..."
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={newFeatureAr}
                  onChange={(e) => setNewFeatureAr(e.target.value)}
                  placeholder="وصف الميزة بالعربية..."
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-arabic focus:outline-none focus:border-primary text-right"
                  dir="rtl"
                />
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold rounded-xl transition"
              >
                Insert Feature
              </button>
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Engineering Deliverables & Documentation
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Outputs handed over to the client upon project completion.
              </p>
            </div>

            <div className="space-y-2">
              {service.deliverablesEn.map((delivEn, idx) => {
                const delivAr = service.deliverablesAr[idx] || '';
                return (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="font-semibold text-neutral-400 mr-1.5">{idx + 1}.</span>
                        <span className="text-neutral-800">{delivEn}</span>
                      </div>
                      <div className="text-right font-arabic text-neutral-600" dir="rtl">
                        {delivAr || '(لا يوجد تسليم بالعربية)'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDeliverable(idx)}
                      className="text-neutral-400 hover:text-red-600 p-1"
                      title="Remove deliverable"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-200">
              <span className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                + Add Engineering Deliverable
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <input
                  type="text"
                  value={newDeliverableEn}
                  onChange={(e) => setNewDeliverableEn(e.target.value)}
                  placeholder="Deliverable description in English..."
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={newDeliverableAr}
                  onChange={(e) => setNewDeliverableAr(e.target.value)}
                  placeholder="وصف التسليم بالعربية..."
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-arabic focus:outline-none focus:border-primary text-right"
                  dir="rtl"
                />
              </div>
              <button
                type="button"
                onClick={addDeliverable}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold rounded-xl transition"
              >
                Insert Deliverable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEO META & SERP */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Google Search Engine Result Snippet (Simulation)
            </h3>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 max-w-2xl font-sans">
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-1">
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] flex items-center justify-center font-bold">
                  GS
                </span>
                <span className="text-neutral-700 font-medium">greensolutionksa.com</span>
                <span className="text-neutral-400">›</span>
                <span className="text-neutral-500">services</span>
                <span className="text-neutral-400">›</span>
                <span className="text-neutral-500 font-semibold">{service.slug || 'service-slug'}</span>
              </div>

              <div className="text-blue-800 hover:underline cursor-pointer text-base font-semibold leading-snug line-clamp-1">
                {service.metaTitleEn || service.titleEn || 'New Engineering Service | Green Solution KSA'}
              </div>

              <div className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                {service.metaDescEn || service.shortDescEn || 'Specialized commercial contracting service by Green Solution KSA.'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>🇬🇧</span> English Search Optimization
              </h4>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Meta Title Tag (EN)
                </label>
                <input
                  type="text"
                  value={service.metaTitleEn}
                  onChange={(e) => setService({ ...service, metaTitleEn: e.target.value })}
                  placeholder={`${service.titleEn || 'Service Title'} | Green Solution KSA`}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Meta Description (EN)
                </label>
                <textarea
                  rows={3}
                  value={service.metaDescEn}
                  onChange={(e) => setService({ ...service, metaDescEn: e.target.value })}
                  placeholder={service.shortDescEn || 'Concise description for Google...'}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4" dir="rtl">
              <h4 className="text-xs font-bold text-neutral-900 font-arabic flex items-center gap-1.5">
                <span>🇸🇦</span> تحسين محركات البحث بالعربية
              </h4>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 font-arabic mb-1">
                  عنوان السيو (Meta Title AR)
                </label>
                <input
                  type="text"
                  value={service.metaTitleAr}
                  onChange={(e) => setService({ ...service, metaTitleAr: e.target.value })}
                  placeholder={`${service.titleAr || 'عنوان الخدمة'} | جرين سلوشن`}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-arabic focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 font-arabic mb-1">
                  وصف السيو (Meta Description AR)
                </label>
                <textarea
                  rows={3}
                  value={service.metaDescAr}
                  onChange={(e) => setService({ ...service, metaDescAr: e.target.value })}
                  placeholder={service.shortDescAr || 'وصف الميتا بالعربية...'}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-arabic focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Target SEO Keywords (Comma Separated)
            </label>
            <input
              type="text"
              value={service.keywords}
              onChange={(e) => setService({ ...service, keywords: e.target.value })}
              placeholder="e.g. landscape contracting riyadh, irrigation engineering KSA, hardscape contractor"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {/* TAB 4: FEATURED IMAGE & MEDIA */}
      {activeTab === 'media' && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Service Hero Image URL / Path
            </label>
            <input
              type="text"
              value={service.image}
              onChange={(e) => setService({ ...service, image: e.target.value })}
              placeholder="/images/hero-1.webp"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <span className="block text-xs font-semibold text-neutral-600 mb-2">Live Image Preview:</span>
              <div className="w-full h-64 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.titleEn || 'Preview'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero-1.webp';
                  }}
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-neutral-600 mb-2">
                Select from Engineering Asset Library:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {SERVICE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setService({ ...service, image: preset.url })}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition ${service.image === preset.url
                        ? 'border-primary bg-primary/5 text-primary font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                  >
                    <span>{preset.label}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{preset.url}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
