'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DbBlog } from '@/lib/sqlite';
import {
  DropletIcon,
  ColumnsIcon,
  PalmIcon,
  LeafIcon,
  SportsIcon,
  GlobeIcon,
  CloseIcon,
  SearchIcon,
  RulerIcon,
} from '../icons/SiteIcons';

interface BlogListClientProps {
  blogs: DbBlog[];
  locale: string;
}

function renderCategoryIcon(cat: string, className = 'w-3.5 h-3.5') {
  const c = cat.toLowerCase();
  if (c.includes('water') || c.includes('irrigation') || c.includes('ري')) {
    return <DropletIcon className={className} />;
  }
  if (c.includes('hardscape') || c.includes('code') || c.includes('صلبة') || c.includes('sbc')) {
    return <ColumnsIcon className={className} />;
  }
  if (c.includes('palm') || c.includes('protection') || c.includes('نخيل')) {
    return <PalmIcon className={className} />;
  }
  if (c.includes('turf') || c.includes('sport') || c.includes('ملاعب')) {
    return <SportsIcon className={className} />;
  }
  if (c.includes('green') || c.includes('living') || c.includes('نباتات')) {
    return <LeafIcon className={className} />;
  }
  return <RulerIcon className={className} />;
}

export default function BlogListClient({ blogs, locale }: BlogListClientProps) {
  const isAr = locale === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const categories = useMemo(() => {
    return Array.from(new Set(blogs.map((b) => b.category)));
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
      const title = isAr ? b.titleAr : b.titleEn;
      const excerpt = isAr ? b.excerptAr : b.excerptEn;
      const matchesSearch =
        !search.trim() ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        excerpt.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase()) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, search, isAr]);

  return (
    <div className="space-y-10">
      {/* Interactive Control Deck: Category Filter Tabs & Search */}
      <div className="bg-white p-6 border-t-2 border-[#1D8F2C] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border font-[var(--font-display)] ${
              selectedCategory === 'all'
                ? 'bg-[#1D8F2C] text-white border-[#1D8F2C]'
                : 'bg-[#F3F7FB] border-neutral-200 text-[#232434] hover:border-[#1D8F2C]'
            }`}
          >
            <GlobeIcon className="w-3.5 h-3.5" />
            <span>{isAr ? 'كافة الدراسات' : 'All Topics'}</span>
            <span className={`text-[10px] px-1.5 py-0.5 font-mono ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
              {blogs.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = blogs.filter((b) => b.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border font-[var(--font-display)] ${
                  isSelected
                    ? 'bg-[#1D8F2C] text-white border-[#1D8F2C]'
                    : 'bg-[#F3F7FB] border-neutral-200 text-[#232434] hover:border-[#1D8F2C]'
                }`}
              >
                {renderCategoryIcon(cat, 'w-3.5 h-3.5')}
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-80 shrink-0">
          <svg
            className={`w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 ${
              isAr ? 'right-3.5' : 'left-3.5'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث بالمواصفات، الكود، التقنيات...' : 'Search specs, codes, technology...'}
            className={`w-full py-2.5 bg-[#F3F7FB] border border-neutral-300 text-xs focus:outline-none focus:border-[#1D8F2C] transition font-sans ${
              isAr ? 'pr-10 pl-8 text-right' : 'pl-10 pr-8 text-left'
            }`}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 ${
                isAr ? 'left-2' : 'right-2'
              }`}
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* When no posts match */}
      {filteredBlogs.length === 0 && (
        <div className="py-24 text-center bg-white border-t-2 border-[#1D8F2C] p-8 shadow-sm max-w-lg mx-auto">
          <div className="w-14 h-14 bg-[#F3F7FB] flex items-center justify-center mx-auto mb-4 text-[#1D8F2C]">
            <SearchIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#232434] font-[var(--font-display)]">
            {isAr ? 'لم يتم العثور على أبحاث مطابقة' : 'No matching technical articles found'}
          </h3>
          <p className="text-xs text-[#585858] mt-2 max-w-sm mx-auto">
            {isAr
              ? 'جرّب إعادة تعيين الفئة أو البحث بمصطلحات أخرى مثل: SBC, الري، النخيل، الملاعب.'
              : 'Try selecting "All Topics" or searching for keywords like "SBC", "Irrigation", "Turf", or "Palms".'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearch('');
            }}
            className="mt-5 px-5 py-2.5 text-xs font-bold text-white bg-[#1D8F2C] hover:bg-[#156e21] transition cursor-pointer"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* Grid of SUNGO News Cards (news-card-items style-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map((post) => {
          const title = isAr ? post.titleAr : post.titleEn;
          const excerpt = isAr ? post.excerptAr : post.excerptEn;
          const author = isAr ? post.authorAr : post.authorEn;
          const dateObj = new Date(post.createdAt);
          const day = dateObj.getDate();
          const month = dateObj.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short' });

          return (
            <article
              key={post.id}
              className="bg-white border-t-2 border-[#1D8F2C] shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image Container with Sungo Green Date Badge */}
              <div className="relative h-64 bg-[#1E202B] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image || '/images/hero-1.webp'}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {/* Sungo Post-Date Badge */}
                <div className="absolute top-0 end-0 bg-[#1D8F2C] text-white px-4 py-2.5 text-center font-[var(--font-display)] shadow-md">
                  <span className="block text-2xl font-black leading-none">{day}</span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider mt-0.5">{month}</span>
                </div>

                <div className="absolute bottom-3 start-3">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5">
                    {renderCategoryIcon(post.category, 'w-3.5 h-3.5 text-[#1D8F2C]')}
                    <span>{post.category}</span>
                  </span>
                </div>
              </div>

              {/* News Content Area */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Meta: Author & Category */}
                  <div className="flex items-center gap-3 text-xs text-[#585858]">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="text-[#1D8F2C]">👤</span>
                      <span>{author}</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <Link href={`/${locale}/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold text-[#232434] leading-snug group-hover:text-[#1D8F2C] transition font-[var(--font-display)] line-clamp-2">
                      {title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-xs text-[#585858] leading-relaxed line-clamp-3">
                    {excerpt}
                  </p>
                </div>

                {/* Read More Link (theme-btn-2) */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="theme-btn-2 inline-flex items-center gap-2 text-xs font-bold text-[#1D8F2C]"
                  >
                    <span>{isAr ? 'اقرأ المزيد' : 'Read More'}</span>
                    <i className="fa-solid fa-arrow-right-long">{isAr ? '←' : '→'}</i>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
