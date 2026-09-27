'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ColumnsIcon,
  BuildingIcon,
  RulerIcon,
  CraneIcon,
  HandshakeIcon,
  MailIcon,
  NewspaperIcon,
  FileTextIcon,
} from '@/components/icons/SiteIcons';

interface SiteSeoRecord {
  pageKey: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  keywordsEn: string;
  keywordsAr: string;
  ogImage: string;
  canonicalUrl: string;
  updatedAt: string;
}

const PAGE_LABELS: Record<string, { label: string; path: string; icon: React.FC<{ className?: string }> }> = {
  home: { label: 'Homepage (Overview)', path: '/', icon: ColumnsIcon },
  about: { label: 'About GS / Heritage', path: '/about', icon: BuildingIcon },
  services: { label: 'Services Catalog', path: '/services', icon: RulerIcon },
  projects: { label: 'Projects & Portfolio', path: '/projects', icon: CraneIcon },
  clients: { label: 'Clients & Partners', path: '/clients', icon: HandshakeIcon },
  contact: { label: 'Contact & RFP Inquiries', path: '/contact', icon: MailIcon },
  blog: { label: 'Technical Blog & Insights', path: '/blog', icon: NewspaperIcon },
};

export default function AdminSeoPage() {
  const [seoRecords, setSeoRecords] = useState<SiteSeoRecord[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state for current selected page
  const [currentForm, setCurrentForm] = useState<SiteSeoRecord | null>(null);

  const fetchSeo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success && data.seoRecords) {
        setSeoRecords(data.seoRecords);
        const active = data.seoRecords.find((r: SiteSeoRecord) => r.pageKey === selectedKey) || data.seoRecords[0];
        if (active) {
          setSelectedKey(active.pageKey);
          setCurrentForm(active);
        }
      }
    } catch (err) {
      console.error('Fetch SEO error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  const handleSelectPage = (pageKey: string) => {
    setSelectedKey(pageKey);
    const found = seoRecords.find((r) => r.pageKey === pageKey);
    if (found) {
      setCurrentForm(found);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentForm) return;
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update SEO settings');
      }

      // Update local state
      setSeoRecords((prev) =>
        prev.map((item) => (item.pageKey === currentForm.pageKey ? data.seo : item))
      );
      setToast({
        message: `SEO settings for "${PAGE_LABELS[currentForm.pageKey]?.label || currentForm.pageKey}" saved!`,
        type: 'success',
      });
    } catch (err: any) {
      setToast({ message: err.message || 'Error saving SEO data', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Centralized SEO Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configure primary search metadata, OpenGraph cards, and Google SERP snippets for all public pages.
          </p>
        </div>
        <div className="text-xs text-neutral-500 bg-neutral-100 px-3.5 py-1.5 rounded-xl border border-neutral-200">
          Target Engine: <span className="font-semibold text-neutral-800">Google Saudi Arabia (google.com.sa)</span>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between ${
            toast.type === 'success'
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

      {loading ? (
        <div className="py-24 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Loading page SEO configurations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Page Selector Sidebar */}
          <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="block px-3 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Website Pages
            </span>
            {seoRecords.map((r) => {
              const meta = PAGE_LABELS[r.pageKey] || {
                label: r.pageKey,
                path: `/${r.pageKey}`,
                icon: FileTextIcon,
              };
              const IconComp = meta.icon;
              const isSelected = r.pageKey === selectedKey;
              return (
                <button
                  key={r.pageKey}
                  type="button"
                  onClick={() => handleSelectPage(r.pageKey)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-primary'}`} />
                    <span>{meta.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] ${
                      isSelected ? 'text-accent-light' : 'text-neutral-400'
                    }`}
                  >
                    {meta.path}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form Editor for Selected Page */}
          {currentForm && (
            <form onSubmit={handleSave} className="lg:col-span-3 space-y-6">
              {/* Google SERP Live Simulation */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    Live Google Search Snippet Simulation
                  </h3>
                  <Link
                    href={`/en${PAGE_LABELS[currentForm.pageKey]?.path || ''}`}
                    target="_blank"
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Open Live Page ↗
                  </Link>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 font-sans">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-1">
                    <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] flex items-center justify-center font-bold">
                      GS
                    </span>
                    <span className="text-neutral-700 font-medium">greensolutionksa.com</span>
                    <span className="text-neutral-400">›</span>
                    <span className="text-neutral-500">en</span>
                    {PAGE_LABELS[currentForm.pageKey]?.path !== '/' && (
                      <>
                        <span className="text-neutral-400">›</span>
                        <span className="text-neutral-500 font-semibold">{currentForm.pageKey}</span>
                      </>
                    )}
                  </div>

                  <div className="text-blue-800 hover:underline cursor-pointer text-base font-semibold leading-snug line-clamp-1">
                    {currentForm.titleEn || 'Green Solution KSA | Commercial Landscape'}
                  </div>

                  <div className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                    {currentForm.descEn || 'Saudi Arabia specialized commercial landscape contractor.'}
                  </div>
                </div>
              </div>

              {/* English & Arabic Meta Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English SEO */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                    <span>🇬🇧</span> English Search Meta
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Meta Title Tag (EN)
                    </label>
                    <input
                      type="text"
                      value={currentForm.titleEn}
                      onChange={(e) => setCurrentForm({ ...currentForm, titleEn: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 font-medium focus:outline-none focus:border-primary"
                      required
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>Optimal: 50-60 characters</span>
                      <span className={currentForm.titleEn.length > 60 ? 'text-amber-600 font-bold' : ''}>
                        {currentForm.titleEn.length} chars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Meta Description (EN)
                    </label>
                    <textarea
                      rows={4}
                      value={currentForm.descEn}
                      onChange={(e) => setCurrentForm({ ...currentForm, descEn: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 leading-relaxed focus:outline-none focus:border-primary"
                      required
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>Optimal: 140-160 characters</span>
                      <span className={currentForm.descEn.length > 160 ? 'text-amber-600 font-bold' : ''}>
                        {currentForm.descEn.length} chars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Target Keywords (EN)
                    </label>
                    <input
                      type="text"
                      value={currentForm.keywordsEn}
                      onChange={(e) => setCurrentForm({ ...currentForm, keywordsEn: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Arabic SEO */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4" dir="rtl">
                  <h4 className="text-xs font-bold text-neutral-900 font-arabic flex items-center gap-2">
                    <span>🇸🇦</span> إعدادات السيو بالعربية
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 font-arabic mb-1">
                      عنوان الصفحة في محركات البحث (Title AR)
                    </label>
                    <input
                      type="text"
                      value={currentForm.titleAr}
                      onChange={(e) => setCurrentForm({ ...currentForm, titleAr: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 font-arabic font-medium focus:outline-none focus:border-primary"
                      required
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>الأفضل: 50-60 حرفاً</span>
                      <span>{currentForm.titleAr.length} حرفاً</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 font-arabic mb-1">
                      وصف الميتا في نتائج البحث (Description AR)
                    </label>
                    <textarea
                      rows={4}
                      value={currentForm.descAr}
                      onChange={(e) => setCurrentForm({ ...currentForm, descAr: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-arabic leading-relaxed focus:outline-none focus:border-primary"
                      required
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>الأفضل: 140-160 حرفاً</span>
                      <span>{currentForm.descAr.length} حرفاً</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 font-arabic mb-1">
                      الكلمات المفتاحية المستهدفة (AR)
                    </label>
                    <input
                      type="text"
                      value={currentForm.keywordsAr}
                      onChange={(e) => setCurrentForm({ ...currentForm, keywordsAr: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-arabic text-neutral-800 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Social OpenGraph & Canonical */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Social Sharing Card (OpenGraph) & Canonical Link
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      OpenGraph Share Image URL
                    </label>
                    <input
                      type="text"
                      value={currentForm.ogImage}
                      onChange={(e) => setCurrentForm({ ...currentForm, ogImage: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">Image displayed when link is shared on WhatsApp, LinkedIn, X</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      value={currentForm.canonicalUrl}
                      onChange={(e) => setCurrentForm({ ...currentForm, canonicalUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">Primary canonical URL for indexing</p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving SEO...</span>
                    </>
                  ) : (
                    <span>Save {PAGE_LABELS[currentForm.pageKey]?.label || currentForm.pageKey} SEO</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
