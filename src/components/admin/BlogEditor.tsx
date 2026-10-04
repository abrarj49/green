'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SaudiFlagIcon } from '@/components/icons/SiteIcons';
import ImageUploadDropzone from '@/components/admin/ImageUploadDropzone';


interface BlogFormData {
  id?: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  category: string;
  image: string;
  authorEn: string;
  authorAr: string;
  readTime: string;
  tags: string[];
  isPublished: boolean;
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescEn: string;
  metaDescAr: string;
  keywords: string;
}

const DEFAULT_IMAGE_PRESETS = [
  { label: 'Smart Irrigation & Water Systems', url: '/images/hero-1.webp' },
  { label: 'Hardscape & SBC Structural', url: '/images/hero-2.webp' },
  { label: 'Royal Palm Care & Agronomy', url: '/images/hero-3.webp' },
  { label: 'Commercial Landscape Masterplan', url: '/images/water-irrigation.jpg' },
  { label: 'Sports Turf & Athletic Turf', url: '/images/hardscape-sbc.jpg' },
  { label: 'Precision Nursery & Plant Logistics', url: '/images/palm-weevil.jpg' },
];

const CATEGORY_PRESETS = [
  'Water Conservation & Smart Irrigation',
  'Hardscape Engineering & SBC Codes',
  'Agronomy, Turf & Palm Health',
  'Landscape Architecture & Urban Greening',
  'Mega Project Operations & Maintenance',
  'Sustainability & ESG Compliance',
];

export default function BlogEditor({ initialData }: { initialData?: BlogFormData }) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState<BlogFormData>({
    slug: initialData?.slug || '',
    titleEn: initialData?.titleEn || '',
    titleAr: initialData?.titleAr || '',
    excerptEn: initialData?.excerptEn || '',
    excerptAr: initialData?.excerptAr || '',
    contentEn: initialData?.contentEn || '',
    contentAr: initialData?.contentAr || '',
    category: initialData?.category || CATEGORY_PRESETS[0],
    image: initialData?.image || '/images/hero-1.webp',
    authorEn: initialData?.authorEn || 'Green Solution Engineering Directorate',
    authorAr: initialData?.authorAr || 'الإدارة الهندسية - جرين سليوشن',
    readTime: initialData?.readTime || '6 min read',
    tags: initialData?.tags || ['Saudi Green Initiative', 'Smart Irrigation'],
    isPublished: initialData?.isPublished ?? true,
    metaTitleEn: initialData?.metaTitleEn || '',
    metaTitleAr: initialData?.metaTitleAr || '',
    metaDescEn: initialData?.metaDescEn || '',
    metaDescAr: initialData?.metaDescAr || '',
    keywords: initialData?.keywords || 'saudi landscape, smart irrigation riyadh, SBC 02-L hardscape',
  });

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content');
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  // Sync auto slug from English title if autoSlug is enabled
  useEffect(() => {
    if (autoSlug && formData.titleEn) {
      const generated = formData.titleEn
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData((prev) => ({ ...prev, slug: generated }));
    }
  }, [formData.titleEn, autoSlug]);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const newTags = Array.from(new Set([...formData.tags, tagInput.trim()]));
    setFormData((prev) => ({ ...prev, tags: newTags }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const url = isEditing ? `/api/admin/blogs/${initialData?.id}` : '/api/admin/blogs';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save blog post');
      }

      setToast({ message: `Article successfully ${isEditing ? 'updated' : 'created'}!`, type: 'success' });

      if (!isEditing) {
        setTimeout(() => {
          router.push('/admin/blogs');
        }, 1200);
      }
    } catch (err: any) {
      setToast({ message: err.message || 'An error occurred while saving', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition"
            title="Back to all articles"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              {isEditing ? 'Edit Article' : 'Compose New Technical Article'}
            </h1>
            <p className="text-xs text-neutral-500">
              {isEditing ? `Editing: ${formData.slug}` : 'Author high-authority bilingual insights for KSA engineers'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200">
            <span className="text-xs font-semibold text-neutral-700">Status:</span>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, isPublished: !p.isPublished }))}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                formData.isPublished
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {formData.isPublished ? '● Published' : '○ Draft'}
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditing ? 'Save Changes' : 'Publish Article'}</span>
            )}
          </button>
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

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 gap-6 text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'content'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Article Content & Body
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'seo'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          SEO Meta & SERP Preview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'media'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Featured Image & Category
        </button>
      </div>

      {/* TAB 1: ARTICLE CONTENT */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Metadata Bar (Slug, Category, Read Time, Author) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-700">URL Slug</label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] text-primary hover:underline font-mono"
                >
                  {autoSlug ? 'Auto-sync ON' : 'Auto-sync OFF'}
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-mono text-neutral-600">
                <span className="text-neutral-400">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setFormData({ ...formData, slug: e.target.value });
                  }}
                  className="w-full bg-transparent outline-none pl-1 text-neutral-800 font-semibold"
                  placeholder="smart-irrigation-water-conservation"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-primary"
              >
                {CATEGORY_PRESETS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Estimated Read Time</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-primary"
                placeholder="6 min read"
              />
            </div>
          </div>

          {/* Bilingual Language Selector */}
          <div className="flex items-center justify-between bg-neutral-100 p-1.5 rounded-xl">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLangTab('en')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                  langTab === 'en'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                🇬🇧 English Content
              </button>
              <button
                type="button"
                onClick={() => setLangTab('ar')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 ${
                  langTab === 'ar'
                    ? 'bg-white text-primary shadow-sm font-arabic'
                    : 'text-neutral-600 hover:text-neutral-900 font-arabic'
                }`}
              >
                <SaudiFlagIcon className="w-3.5 h-2.5 inline" />
                <span>المحتوى بالعربية</span>
              </button>
            </div>
            <span className="text-[11px] text-neutral-500 pr-2">
              All articles are bilingual and rendered per visitor locale.
            </span>
          </div>

          {/* English Editor */}
          {langTab === 'en' && (
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Article Title (English) *
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="e.g. Smart Irrigation Architecture: Achieving 40% Water Reductions in Arid Climates"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-primary focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Executive Excerpt / Summary (English) *
                </label>
                <textarea
                  rows={2}
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  placeholder="A concise 2-sentence executive briefing that appears on card previews and search engines..."
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Full Article Body (English Markdown / HTML) *
                  </label>
                  <span className="text-[11px] text-neutral-400">Supports headers (#, ##), bullets, bold, and paragraphs</span>
                </div>
                <textarea
                  rows={14}
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Write the full in-depth article here with technical rigor, specifications, standards..."
                  className="w-full font-mono text-xs px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-primary focus:bg-white transition leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Author Byline (English)
                </label>
                <input
                  type="text"
                  value={formData.authorEn}
                  onChange={(e) => setFormData({ ...formData, authorEn: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Arabic Editor */}
          {langTab === 'ar' && (
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5" dir="rtl">
              <div>
                <label className="block text-xs font-bold text-neutral-700 font-arabic mb-1">
                  عنوان المقال (باللغة العربية) *
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="مثال: هندسة الري الذكي: تحقيق وفورات مائية بنسبة 40% في المناخات الجافة"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 font-arabic focus:outline-none focus:border-primary focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 font-arabic mb-1">
                  الملخص التنفيذي (باللغة العربية) *
                </label>
                <textarea
                  rows={2}
                  value={formData.excerptAr}
                  onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
                  placeholder="ملخص تنفيذي موجز يظهر في بطاقات المعاينة ومحركات البحث..."
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-arabic focus:outline-none focus:border-primary focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-700 font-arabic">
                    نص المقال الكامل (ماركداون أو فقرات) *
                  </label>
                  <span className="text-[11px] text-neutral-400 font-arabic">يدعم العناوين والقوائم والنصوص التفصيلية</span>
                </div>
                <textarea
                  rows={14}
                  value={formData.contentAr}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  placeholder="اكتب المقال الكامل باللغة العربية بدقة هندسية عالية..."
                  className="w-full font-arabic text-xs px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-primary focus:bg-white transition leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 font-arabic mb-1">
                  اسم الكاتب / الجهة الهندسية
                </label>
                <input
                  type="text"
                  value={formData.authorAr}
                  onChange={(e) => setFormData({ ...formData, authorAr: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-arabic focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Tags Manager */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Topic Tags
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag and press Enter"
                  className="px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold rounded-lg transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEO META & SERP PREVIEW */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Live Google SERP Simulation */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
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
                <span className="text-neutral-500">blog</span>
                <span className="text-neutral-400">›</span>
                <span className="text-neutral-500 truncate max-w-xs">{formData.slug || 'article-slug'}</span>
              </div>

              <div className="text-blue-800 hover:underline cursor-pointer text-base font-semibold leading-snug line-clamp-1">
                {formData.metaTitleEn || formData.titleEn || 'Article Title | Green Solution KSA'}
              </div>

              <div className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                {formData.metaDescEn || formData.excerptEn || 'Learn about industrial-scale landscape and irrigation engineering with Green Solution KSA.'}
              </div>
            </div>
          </div>

          {/* Detailed SEO Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English SEO */}
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
                  value={formData.metaTitleEn}
                  onChange={(e) => setFormData({ ...formData, metaTitleEn: e.target.value })}
                  placeholder={formData.titleEn || 'Title tag for Google'}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
                />
                <p className="text-[11px] text-neutral-400 mt-1">Recommended length: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Meta Description (EN)
                </label>
                <textarea
                  rows={3}
                  value={formData.metaDescEn}
                  onChange={(e) => setFormData({ ...formData, metaDescEn: e.target.value })}
                  placeholder={formData.excerptEn || 'Description snippet for Google search'}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
                />
                <p className="text-[11px] text-neutral-400 mt-1">Recommended length: 140-160 characters</p>
              </div>
            </div>

            {/* Arabic SEO */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4" dir="rtl">
              <h4 className="text-xs font-bold text-neutral-900 font-arabic flex items-center gap-1.5">
                <SaudiFlagIcon className="w-3.5 h-2.5 inline" />
                <span>تحسين محركات البحث بالعربية</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 font-arabic mb-1">
                  عنوان السيو (Meta Title AR)
                </label>
                <input
                  type="text"
                  value={formData.metaTitleAr}
                  onChange={(e) => setFormData({ ...formData, metaTitleAr: e.target.value })}
                  placeholder={formData.titleAr || 'عنوان السيو باللغة العربية'}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-arabic focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 font-arabic mb-1">
                  وصف السيو (Meta Description AR)
                </label>
                <textarea
                  rows={3}
                  value={formData.metaDescAr}
                  onChange={(e) => setFormData({ ...formData, metaDescAr: e.target.value })}
                  placeholder={formData.excerptAr || 'وصف السيو الذي يظهر في نتائج بحث جوجل'}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-arabic focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Target SEO Keywords (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="e.g. smart irrigation riyadh, landscape contractor saudi arabia, SBC 02-L code"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {/* TAB 3: FEATURED IMAGE & MEDIA */}
      {activeTab === 'media' && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <ImageUploadDropzone
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Featured Article Hero Image"
            presets={DEFAULT_IMAGE_PRESETS}
          />
        </div>
      )}
    </form>
  );
}
