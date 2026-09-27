'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { completedProjects, Project } from '@/data/projects';
import {
  LeafIcon,
  DropletIcon,
  ColumnsIcon,
  SportsIcon,
  StarIcon,
  MapPinIcon,
  SearchIcon,
  CheckIcon,
  CloseIcon,
} from '@/components/icons/SiteIcons';

export default function ProjectTable() {
  const locale = useLocale();
  const t = useTranslations('projects');
  const isAr = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Distinct locations
  const locations = useMemo(() => {
    const locSet = new Set(completedProjects.map((p) => (isAr ? p.locationAr : p.locationEn)));
    return ['all', ...Array.from(locSet)];
  }, [isAr]);

  const categories = useMemo(() => {
    return [
      { id: 'all', label: isAr ? 'جميع الفئات' : 'All Works', icon: <StarIcon className="w-3.5 h-3.5" /> },
      { id: 'landscape', label: isAr ? 'تنسيق حدائق' : 'Landscape', icon: <LeafIcon className="w-3.5 h-3.5" /> },
      { id: 'irrigation', label: isAr ? 'شبكات ري' : 'Irrigation', icon: <DropletIcon className="w-3.5 h-3.5" /> },
      { id: 'hardscape', label: isAr ? 'أعمال صلبة' : 'Hardscape', icon: <ColumnsIcon className="w-3.5 h-3.5" /> },
      { id: 'sports', label: isAr ? 'ملاعب ورياضة' : 'Sports & Turf', icon: <SportsIcon className="w-3.5 h-3.5" /> },
    ];
  }, [isAr]);

  const filteredProjects = useMemo(() => {
    return completedProjects.filter((project) => {
      const name = isAr ? project.nameAr : project.nameEn;
      const client = isAr ? project.clientAr : project.clientEn;
      const location = isAr ? project.locationAr : project.locationEn;

      const matchesSearch =
        searchQuery.trim() === '' ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        selectedLocation === 'all' ||
        (isAr ? project.locationAr : project.locationEn) === selectedLocation;

      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;

      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [searchQuery, selectedLocation, selectedCategory, isAr]);

  // Category badge helper
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'sports':
        return {
          bg: 'bg-emerald-900/10 text-emerald-800 border-emerald-200',
          label: isAr ? 'ملاعب ورياضة' : 'Sports & Turf',
          icon: <SportsIcon className="w-3.5 h-3.5 text-emerald-700" />,
        };
      case 'irrigation':
        return {
          bg: 'bg-blue-900/10 text-blue-800 border-blue-200',
          label: isAr ? 'شبكات ري' : 'Smart Irrigation',
          icon: <DropletIcon className="w-3.5 h-3.5 text-blue-700" />,
        };
      case 'hardscape':
        return {
          bg: 'bg-stone-900/10 text-stone-800 border-stone-200',
          label: isAr ? 'أعمال صلبة' : 'Hardscape',
          icon: <ColumnsIcon className="w-3.5 h-3.5 text-stone-700" />,
        };
      default:
        return {
          bg: 'bg-[#1D8F2C]/10 text-[#1D8F2C] border-[#1D8F2C]/30',
          label: isAr ? 'تنسيق حدائق' : 'Landscape',
          icon: <LeafIcon className="w-3.5 h-3.5 text-[#1D8F2C]" />,
        };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Controls Bar: Search + Category Chips + Location Filter + View Mode Switcher */}
      <div className="bg-white p-6 border-t-2 border-[#1D8F2C] shadow-sm space-y-5">
        {/* Top row: Search input & View switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث باسم المشروع، العميل، أو المدينة...'
                  : 'Search by project name, client organization, or city...'
              }
              className="w-full ps-11 pe-9 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] transition font-sans rounded-none"
            />
            <SearchIcon className="w-5 h-5 absolute start-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 w-5 h-5 flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 transition"
                aria-label="Clear search"
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* View Mode Switcher & Location Selector */}
          <div className="flex items-center gap-3">
            <div className="relative w-44 sm:w-48">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full ps-8 pe-3.5 py-3 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-sm bg-[#F3F7FB] text-[#232434] font-medium rounded-none"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'all'
                      ? isAr
                        ? 'جميع المدن والمواقع'
                        : 'All Cities & Sites'
                      : loc}
                  </option>
                ))}
              </select>
              <MapPinIcon className="w-4 h-4 absolute start-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

            {/* Grid / Table Toggle */}
            <div className="flex items-center bg-[#F3F7FB] p-1 border border-neutral-200 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#1D8F2C] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title={isAr ? 'عرض البطاقات' : 'Grid View'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden sm:inline">{isAr ? 'بطاقات' : 'Grid'}</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#1D8F2C] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title={isAr ? 'عرض الجدول' : 'Table View'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <span className="hidden sm:inline">{isAr ? 'جدول' : 'Table'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? completedProjects.length
                : completedProjects.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border font-[var(--font-display)] ${
                  isSelected
                    ? 'bg-[#1D8F2C] text-white border-[#1D8F2C]'
                    : 'bg-[#F3F7FB] border-neutral-200 text-[#232434] hover:border-[#1D8F2C]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Result Counter & Reset */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
          <span>
            {isAr
              ? `عرض ${filteredProjects.length} من أصل ${completedProjects.length} مشروع منجز بالمملكة`
              : `Showing ${filteredProjects.length} of ${completedProjects.length} completed projects across KSA`}
          </span>
          {(searchQuery || selectedLocation !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLocation('all');
                setSelectedCategory('all');
              }}
              className="text-[#1D8F2C] hover:underline font-bold transition"
            >
              {isAr ? 'إعادة ضبط كافة الفلاتر ↺' : 'Reset all filters ↺'}
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: SUNGO GRID CARDS */}
      {viewMode === 'grid' && (
        <div>
          {filteredProjects.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-16 text-center text-neutral-500">
              <SearchIcon className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="font-[var(--font-display)] text-lg font-bold text-[#232434]">
                {isAr ? 'لم يتم العثور على مشاريع مطابقة' : 'No projects matched your criteria'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {isAr ? 'يرجى تجربة كلمات بحث أخرى أو إعادة ضبط التصفية.' : 'Try adjusting your search terms or clearing filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const badge = getCategoryBadge(project.category);
                return (
                  <div
                    key={project.id}
                    onClick={() => setActiveModalProject(project)}
                    className="group bg-white border-t-2 border-[#1D8F2C] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                  >
                    {/* Left green accent bar */}
                    <div className="absolute top-0 bottom-0 start-0 w-1 bg-transparent group-hover:bg-[#1D8F2C] transition-colors" />

                    {/* Top status & ID tag */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold border ${badge.bg}`}>
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400 font-semibold">
                          #KSA-{String(project.id).padStart(3, '0')}
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-lg font-bold text-[#232434] group-hover:text-[#1D8F2C] transition-colors font-[var(--font-display)] leading-snug mb-2">
                        {isAr ? project.nameAr : project.nameEn}
                      </h3>

                      {/* Client row */}
                      <div className="flex items-center gap-2 text-xs text-[#585858] mb-3">
                        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium truncate">{isAr ? project.clientAr : project.clientEn}</span>
                      </div>
                    </div>

                    {/* Bottom row: Location + Specs launcher */}
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 text-neutral-500 font-medium">
                        <MapPinIcon className="w-3.5 h-3.5 text-[#1D8F2C] shrink-0" />
                        {isAr ? project.locationAr : project.locationEn}
                      </span>

                      <span className="text-[#1D8F2C] font-bold group-hover:translate-x-1 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center gap-1">
                        <span>{isAr ? 'التفاصيل' : 'Specs'}</span>
                        <span>→</span>
                      </span>
                    </div>

                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute -top-1.5 -end-1.5 bg-[#1D8F2C] text-white font-bold text-[9px] px-3 py-1 uppercase tracking-wider shadow-xs inline-flex items-center gap-1 font-[var(--font-display)]">
                        <StarIcon className="w-2.5 h-2.5" />
                        <span>{isAr ? 'استراتيجي' : 'Landmark'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DENSITY DATA TABLE */}
      {viewMode === 'table' && (
        <div className="overflow-hidden border-t-2 border-[#1D8F2C] bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="bg-[#1E202B] text-white text-xs font-semibold uppercase tracking-wider border-b border-[#1D8F2C] font-[var(--font-display)]">
                  <th className="px-6 py-4 text-start w-20 font-mono">Code</th>
                  <th className="px-6 py-4 text-start">{isAr ? 'المشروع' : 'Project Title'}</th>
                  <th className="px-6 py-4 text-start">{isAr ? 'العميل / الجهة' : 'Client / Owner'}</th>
                  <th className="px-6 py-4 text-start w-36">{isAr ? 'الموقع' : 'Location'}</th>
                  <th className="px-6 py-4 text-start w-36">{isAr ? 'التصنيف الهندسـي' : 'Category'}</th>
                  <th className="px-6 py-4 text-end w-28">{isAr ? 'الإجراء' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-neutral-400">
                      {isAr
                        ? 'لم يتم العثور على مشاريع مطابقة لمعايير البحث'
                        : 'No projects matched your search criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => {
                    const badge = getCategoryBadge(project.category);
                    return (
                      <tr
                        key={project.id}
                        onClick={() => setActiveModalProject(project)}
                        className="hover:bg-[#1D8F2C]/5 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 text-neutral-400 font-mono text-xs font-semibold">
                          #{String(project.id).padStart(3, '0')}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#232434] group-hover:text-[#1D8F2C] transition-colors font-[var(--font-display)]">
                          {isAr ? project.nameAr : project.nameEn}
                          {project.featured && (
                            <span className="ms-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-[#1D8F2C]/10 text-[#1D8F2C]">
                              <StarIcon className="w-2.5 h-2.5" />
                              <span>{isAr ? 'رئيسي' : 'Featured'}</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#585858] font-medium">
                          {isAr ? project.clientAr : project.clientEn}
                        </td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <MapPinIcon className="w-3.5 h-3.5 text-[#1D8F2C] shrink-0" />
                            {isAr ? project.locationAr : project.locationEn}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ${badge.bg}`}>
                            <span>{badge.icon}</span>
                            <span>{badge.label}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-end whitespace-nowrap">
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-[#F3F7FB] group-hover:bg-[#1D8F2C] group-hover:text-white text-xs font-bold transition"
                          >
                            {isAr ? 'المواصفات' : 'View Specs'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INTERACTIVE PROJECT SPECIFICATIONS MODAL */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveModalProject(null)}
        >
          <div
            className="bg-white max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-t-4 border-[#1D8F2C] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 end-5 w-8 h-8 bg-neutral-100 hover:bg-[#1D8F2C] hover:text-white flex items-center justify-center text-neutral-500 font-bold transition cursor-pointer"
              aria-label="Close project modal"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

            {/* Header / Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#1D8F2C] text-white font-bold text-xs">
                #KSA-{String(activeModalProject.id).padStart(3, '0')}
              </span>
              <span className="px-3 py-1 bg-[#1D8F2C]/20 text-[#1D8F2C] font-bold text-xs uppercase tracking-wider font-[var(--font-display)]">
                {isAr ? 'مشروع منجز ومعتمد' : 'Verified Handed Over'}
              </span>
            </div>

            <h3 className="text-2xl font-bold font-[var(--font-display)] text-[#232434] leading-tight mb-2">
              {isAr ? activeModalProject.nameAr : activeModalProject.nameEn}
            </h3>

            <p className="text-xs text-[#585858] mb-6">
              {isAr
                ? 'سجل التوثيق الهندسي الميداني — شركة جرين سلوشن للمقاولات العامة واللاندسكيب'
                : 'Official Field EPC Record — Green Solution Co. General & Landscape Contracting'}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 p-5 bg-[#F3F7FB] mb-6">
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase block font-[var(--font-display)]">
                  {isAr ? 'العميل / الجهة المالكة' : 'Client Organization'}
                </span>
                <span className="text-sm font-bold text-[#232434] mt-0.5 block">
                  {isAr ? activeModalProject.clientAr : activeModalProject.clientEn}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase block font-[var(--font-display)]">
                  {isAr ? 'الموقع الجغرافي' : 'City / Location'}
                </span>
                <span className="text-sm font-bold text-[#232434] mt-0.5 flex items-center gap-1.5">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#1D8F2C] shrink-0" />
                  <span>{isAr ? activeModalProject.locationAr : activeModalProject.locationEn}, KSA</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase block font-[var(--font-display)]">
                  {isAr ? 'نطاق الأعمال الهندسية' : 'Engineering Scope'}
                </span>
                <span className="text-sm font-bold text-[#1D8F2C] mt-0.5 block">
                  {getCategoryBadge(activeModalProject.category).label}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase block font-[var(--font-display)]">
                  {isAr ? 'كود الامتثال' : 'Technical Standard'}
                </span>
                <span className="text-sm font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C]" />
                  <span>SBC & Municipal Verified</span>
                </span>
              </div>
            </div>

            {/* Engineering Highlights checklist */}
            <div className="space-y-2 mb-6 text-xs text-[#585858]">
              <h4 className="font-bold text-[#232434] uppercase tracking-wider text-[11px] font-[var(--font-display)]">
                {isAr ? 'معايير التنفيذ المطبقة:' : 'Executed Technical Highlights:'}
              </h4>
              <ul className="space-y-1.5 ps-1">
                <li className="flex items-center gap-2">
                  <span className="text-[#1D8F2C] font-bold">✓</span>
                  <span>
                    {isAr
                      ? 'توريد وتركيب مواد مطابقة لكود البناء السعودي (SBC 02-L) واختبارات الجودة المعتمدة.'
                      : 'Supply and installation compliant with Saudi Building Code (SBC 02-L) guidelines.'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1D8F2C] font-bold">✓</span>
                  <span>
                    {isAr
                      ? 'إشراف ميداني من مهندسين زراعيين وكهروميكانيكيين مرخصين من الهيئة السعودية للمهندسين.'
                      : 'On-site technical supervision by SCE-licensed agronomy and MEP specialists.'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1D8F2C] font-bold">✓</span>
                  <span>
                    {isAr
                      ? 'تسليم نهائي وفق جداول الكميات المعتمدة ومطابقة خطط الترشيد المائي للبلديات.'
                      : 'Full final punch-list handover with documented water conservation compliance.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setActiveModalProject(null)}
                className="w-full sm:w-auto px-5 py-2.5 border border-neutral-300 text-neutral-600 hover:bg-neutral-100 text-xs font-semibold transition"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
              <Link
                href={`/${locale}/contact?ref=${encodeURIComponent(isAr ? activeModalProject.nameAr : activeModalProject.nameEn)}`}
                className="theme-btn w-full sm:w-auto text-center"
              >
                <span>
                  {isAr ? 'طلب تنفيذ مشروع مماثل' : 'Inquire for Similar Project'}
                  <i className="fa-solid fa-arrow-right-long ms-2">→</i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
