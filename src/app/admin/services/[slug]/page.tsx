'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ServiceImage from '@/components/ServiceImage';

interface CmsServiceData {
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
  updatedAt?: string;
}

const SERVICE_IMAGE_PRESETS = [
  { label: 'No Image / بدون صورة (Placeholder)', url: '' },
  { label: 'Landscape Architecture & Masterplanning', url: '/img/services/landscape-design.jpg' },
  { label: 'Smart Irrigation & Water Systems', url: '/img/services/irrigation-networks.jpg' },
  { label: 'Turf Grass & Lawn Solutions', url: '/img/services/turf-grass.jpg' },
  { label: 'Outdoor Paving & Hardscape', url: '/img/services/outdoor-paving.jpg' },
  { label: 'Garden Pergolas & Architectural Shade', url: '/img/services/pergolas-shade.jpg' },
  { label: 'Swimming Pools & Water Features', url: '/img/services/water-features.jpg' },
  { label: 'Urban Green Space & Public Parks', url: '/img/services/urban-green.jpg' },
  { label: 'Botanical Care & Plant Health', url: '/img/services/botanical-care.jpg' },
  { label: 'Architectural Outdoor Lighting', url: '/img/services/architectural-outdoor-lighting.jpg' },
];

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [service, setService] = useState<CmsServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [activeTab, setActiveTab] = useState<'details' | 'scopes' | 'seo' | 'media'>('details');
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');

  // New item draft inputs for features & deliverables
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [newFeatureAr, setNewFeatureAr] = useState('');
  const [newDeliverableEn, setNewDeliverableEn] = useState('');
  const [newDeliverableAr, setNewDeliverableAr] = useState('');

  useEffect(() => {
    async function loadService() {
      try {
        const res = await fetch(`/api/admin/services/${slug}`);
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        const data = await res.json();
        if (data.success && data.service) {
          setService(data.service);
        } else {
          setError(data.error || 'Service not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch service');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadService();
    }
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch(`/api/admin/services/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update service');
      }

      setService(data.service);
      setToast({ message: 'Service successfully updated! Changes are live immediately.', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Error updating service', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (!service || (!newFeatureEn.trim() && !newFeatureAr.trim())) return;
    setService({
      ...service,
      featuresEn: newFeatureEn.trim() ? [...service.featuresEn, newFeatureEn.trim()] : service.featuresEn,
      featuresAr: newFeatureAr.trim() ? [...service.featuresAr, newFeatureAr.trim()] : service.featuresAr,
    });
    setNewFeatureEn('');
    setNewFeatureAr('');
  };

  const removeFeature = (idx: number) => {
    if (!service) return;
    setService({
      ...service,
      featuresEn: service.featuresEn.filter((_, i) => i !== idx),
      featuresAr: service.featuresAr.filter((_, i) => i !== idx),
    });
  };

  const addDeliverable = () => {
    if (!service || (!newDeliverableEn.trim() && !newDeliverableAr.trim())) return;
    setService({
      ...service,
      deliverablesEn: newDeliverableEn.trim() ? [...service.deliverablesEn, newDeliverableEn.trim()] : service.deliverablesEn,
      deliverablesAr: newDeliverableAr.trim() ? [...service.deliverablesAr, newDeliverableAr.trim()] : service.deliverablesAr,
    });
    setNewDeliverableEn('');
    setNewDeliverableAr('');
  };

  const removeDeliverable = (idx: number) => {
    if (!service) return;
    setService({
      ...service,
      deliverablesEn: service.deliverablesEn.filter((_, i) => i !== idx),
      deliverablesAr: service.deliverablesAr.filter((_, i) => i !== idx),
    });
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Loading service engineering specifications...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center max-w-md mx-auto my-12">
        <p className="text-sm font-bold text-red-600 mb-2">Service Not Found</p>
        <p className="text-sm text-neutral-600 mb-4">{error || 'Could not find the requested service record.'}</p>
        <Link href="/admin/services" className="text-xs font-semibold text-primary hover:underline">
          ← Back to All Services
        </Link>
      </div>
    );
  }

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
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                {service.divisionCode}
              </span>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                {service.titleEn}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">/services/{service.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/en/services/${service.slug}`}
            target="_blank"
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition"
          >
            View Live Site ↗
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-6 py-2 rounded-xl shadow transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Service Changes</span>
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
                Division Code (CSI / SBC)
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
                Discipline Category
              </label>
              <input
                type="text"
                value={service.category}
                onChange={(e) => setService({ ...service, category: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary text-neutral-800"
                placeholder="e.g. Smart Irrigation & Water"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Permanent Slug (Immutable)
              </label>
              <input
                type="text"
                value={service.slug}
                disabled
                className="w-full font-mono text-xs px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed"
              />
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
                🇬🇧 English Specifications
              </button>
              <button
                type="button"
                onClick={() => setLangTab('ar')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${langTab === 'ar' ? 'bg-white text-primary shadow-sm font-arabic' : 'text-neutral-600 hover:text-neutral-900 font-arabic'
                  }`}
              >
                🇸🇦 المواصفات بالعربية
              </button>
            </div>
            <span className="text-[11px] text-neutral-500 pr-2">
              Updates reflect immediately across both localized site versions.
            </span>
          </div>

          {/* English Content Form */}
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
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-primary focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Short Technical Summary (English) *
                </label>
                <textarea
                  rows={3}
                  value={service.shortDescEn}
                  onChange={(e) => setService({ ...service, shortDescEn: e.target.value })}
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
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-primary focus:bg-white transition leading-relaxed"
                  required
                />
              </div>
            </div>
          )}

          {/* Arabic Content Form */}
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
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 font-arabic focus:outline-none focus:border-primary focus:bg-white transition leading-relaxed"
                  required
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCOPE FEATURES & DELIVERABLES */}
      {activeTab === 'scopes' && (
        <div className="space-y-8">
          {/* Features Section */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Key Scope Features (Methodology & Capabilities)
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Bullet points displayed in the service feature breakdown cards.
              </p>
            </div>

            {/* List */}
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

            {/* Add New Feature */}
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

          {/* Deliverables Section */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Engineering Deliverables & Documentation
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Physical, CAD, testing, and operational outputs delivered to the client upon milestone completion.
              </p>
            </div>

            {/* List */}
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

            {/* Add New Deliverable */}
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

      {/* TAB 3: SEO META & SERP PREVIEW */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Live Google SERP Simulation */}
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
                <span className="text-neutral-500 font-semibold">{service.slug}</span>
              </div>

              <div className="text-blue-800 hover:underline cursor-pointer text-base font-semibold leading-snug line-clamp-1">
                {service.metaTitleEn || `${service.titleEn} | Green Solution KSA`}
              </div>

              <div className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                {service.metaDescEn || service.shortDescEn || 'Specialized commercial contracting service by Green Solution KSA.'}
              </div>
            </div>
          </div>

          {/* Inputs */}
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
                  placeholder={`${service.titleEn} | Green Solution KSA`}
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
                  placeholder={service.shortDescEn}
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
                  placeholder={`${service.titleAr} | جرين سليوشن`}
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
                  placeholder={service.shortDescAr}
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

          {/* Preview & Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <span className="block text-xs font-semibold text-neutral-600 mb-2">Live Image Preview:</span>
              <div className="w-full h-64 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shadow-inner">
                <ServiceImage
                  src={service.image}
                  alt={service.titleEn}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full relative overflow-hidden bg-[#1E202B]"
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
