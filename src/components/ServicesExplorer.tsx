'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceItem } from '@/data/services';
import { CloseIcon } from './icons/SiteIcons';


export const serviceVisualMap: Record<
  string,
  { image: string; divisionCode: string; tagsEn: string[]; tagsAr: string[] }
> = {
  'landscape-design-planning': {
    image: '/img/services/landscape-design.jpg',
    divisionCode: 'DIV 01',
    tagsEn: ['Master Planning', 'BIM / CAD', '3D Renders', 'BoQ Preparation'],
    tagsAr: ['مخطط رئيسي', 'نمذجة BIM/CAD', 'تصورات 3D', 'جداول الكميات'],
  },
  'outdoor-paving-hardscape': {
    image: '/img/services/outdoor-paving.jpg',
    divisionCode: 'DIV 02',
    tagsEn: ['Natural Travertine', 'Granite Pavers', 'Linear Drainage', 'Thermal Joints'],
    tagsAr: ['ترافرتين طبيعي', 'جرانيت صلب', 'تصريف سطحي', 'فواصل تمدد'],
  },
  'urban-green-space-management': {
    image: '/img/services/urban-green.jpg',
    divisionCode: 'DIV 03',
    tagsEn: ['Municipal Parks', 'Royal Grounds', 'Canopy Trees', 'Civil Compliance'],
    tagsAr: ['حدائق بلدية', 'قصور ملكية', 'أشجار ظلية', 'مطابقة بلدية'],
  },
  'garden-pergolas-shade': {
    image: '/img/services/pergolas-shade.jpg',
    divisionCode: 'DIV 04',
    tagsEn: ['Motorized Louvers', 'Bronze Aluminum', 'LED Strips', 'Teak Decking'],
    tagsAr: ['لوفرات متحركة', 'ألومنيوم برونزي', 'إضاءة مخفية', 'أرضيات تيك'],
  },
  'swimming-pools-water-features': {
    image: '/img/services/water-features.jpg',
    divisionCode: 'DIV 05',
    tagsEn: ['Infinity Edges', 'Sheet Cascades', 'LED Illumination', 'Salt Filtration'],
    tagsAr: ['حواف لا متناهية', 'شلالات صخرية', 'إنارة غاطسة', 'فلترة ملحية'],
  },
  'indoor-plantscapes-maintenance': {
    image: '/img/services/indoor-plantscapes-maintenance.jpg',
    divisionCode: 'DIV 06',
    tagsEn: ['Atrium Greening', 'Acoustic Moss', 'Sub-Irrigation', 'Bio-Sanitation'],
    tagsAr: ['بهو وأفنية', 'طحالب صوتية', 'ري تحت سطحي', 'تعقيم بيولوجي'],
  },
  'irrigation-drainage-networks': {
    image: '/img/services/irrigation-networks.jpg',
    divisionCode: 'DIV 07',
    tagsEn: ['SCADA Central Control', 'Rotary Sprinklers', 'Subsurface Drip', '30%+ Water Save'],
    tagsAr: ['تحكم مركزي SCADA', 'رشاشات دوارة', 'ري بالتنقيط', 'توفير 30%+ مياه'],
  },
  'turf-grass-lawn-solutions': {
    image: '/img/services/turf-grass.jpg',
    divisionCode: 'DIV 08',
    tagsEn: ['FIFA Laser Graded', 'Hybrid Bermuda', 'Saline Resistant', 'Rootzone Aeration'],
    tagsAr: ['تسوية ليزرية فيفا', 'برمودا هجين', 'مقاوم للملوحة', 'تهوية الجذور'],
  },
  'botanical-care-plant-health': {
    image: '/img/services/botanical-care.jpg',
    divisionCode: 'DIV 09',
    tagsEn: ['Soil Microbiology', 'Nutrient Dosing', 'Specimen Palms', 'Arid Hardening'],
    tagsAr: ['ميكروبيولوجيا التربة', 'حقن المغذيات', 'نخيل معمر', 'أقلمة مناخية'],
  },
  'architectural-outdoor-lighting': {
    image: '/img/services/architectural-outdoor-lighting.jpg',
    divisionCode: 'DIV 10',
    tagsEn: ['Low-Voltage LED', 'DALI / Smart DMX', 'Optic Lenses', 'Brass Fixtures'],
    tagsAr: ['إضاءة LED آمنة', 'أنظمة تحكم DALI', 'عدسات بصرية', 'نحاس بحري'],
  },
  'structural-earthworks-grading': {
    image: '/img/services/structural-earthworks-grading.jpg',
    divisionCode: 'DIV 11',
    tagsEn: ['Laser Levelling', 'Geotechnical Soil', 'Stormwater Inlets', '95% Proctor Compaction'],
    tagsAr: ['تسوية بالليزر', 'اختبار تربة', 'مصائد سيول', 'دمك بروكتر 95%'],
  },
  'integrated-pest-management': {
    image: '/img/services/integrated-pest-management.jpg',
    divisionCode: 'DIV 12',
    tagsEn: ['Red Palm Weevil', 'Organic Bio-Controls', 'Stem Micro-Injection', 'MEWA Certified'],
    tagsAr: ['سوسة النخيل الحمراء', 'مكافحة حيوية', 'حقن الجذع الميكروي', 'معتمد من الوزارة'],
  },
  'commercial-landscape-maintenance': {
    image: '/img/services/commercial-landscape-maintenance.jpg',
    divisionCode: 'DIV 13',
    tagsEn: ['Corporate Campuses', 'SLA Handover', 'Quarterly Audits', 'Agronomist Inspection'],
    tagsAr: ['مقرات شركات كبرى', 'عقود SLA ملزمة', 'تقارير دورية', 'إشراف زراعي'],
  },
};

interface ServicesExplorerProps {
  services: ServiceItem[];
  locale: string;
  isAr: boolean;
  categoryLabels: Record<string, { en: string; ar: string }>;
  onOpenQuote?: (serviceSlug?: string) => void;
}

export default function ServicesExplorer({
  services,
  locale,
  isAr,
  categoryLabels,
  onOpenQuote,
}: ServicesExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'catalog'>('grid');

  const categories = [
    { id: 'all', en: 'All Disciplines', ar: 'كافة التخصصات' },
    { id: 'design-planning', en: 'Master Planning & Design', ar: 'التصميم والتخطيط' },
    { id: 'hardscape-structures', en: 'Hardscape & Structures', ar: 'الهاردسكيب والإنشاءات' },
    { id: 'water-irrigation', en: 'Smart Hydraulics & Water', ar: 'أنظمة الري والمياه' },
    { id: 'living-green', en: 'Living Green & Turf', ar: 'المسطحات الخضراء والزراعة' },
    { id: 'protection-services', en: 'Agronomy & Maintenance', ar: 'الصيانة وإدارة المسطحات' },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        activeCategory === 'all' || service.category === activeCategory;

      const title = isAr ? service.titleAr : service.titleEn;
      const desc = isAr ? service.shortDescAr : service.shortDescEn;
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query) ||
        service.slug.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery, isAr]);

  return (
    <div className="space-y-10">
      {/* Control Bar: Category Tabs & Search */}
      <div className="bg-white rounded-none p-4 sm:p-6 border-t-2 border-[#1D8F2C] shadow-sm space-y-5">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? services.length
                : services.filter((s) => s.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 font-[var(--font-display)] cursor-pointer ${
                  isActive
                    ? 'bg-[#1D8F2C] text-white'
                    : 'bg-neutral-100 text-[#232434] hover:bg-neutral-200'
                }`}
              >
                <span>{isAr ? cat.ar : cat.en}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 ${
                    isActive ? 'bg-white text-[#1D8F2C] font-bold' : 'bg-white text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-neutral-100">
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-4 h-4 text-neutral-400 absolute start-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث بالاسم أو التخصص (مثال: ري ذكي، ترافرتين، فيفا)...'
                  : 'Search by discipline or keyword (e.g. smart irrigation, travertine, turf)...'
              }
              className="w-full ps-10 pe-4 py-2.5 rounded-none border border-neutral-300 text-sm focus:outline-none focus:border-[#1D8F2C] transition-all placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                aria-label="Clear search"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-neutral-500">
            <span className="font-medium">
              {isAr
                ? `عرض ${filteredServices.length} من أصل ${services.length} خدمة`
                : `Showing ${filteredServices.length} of ${services.length} disciplines`}
            </span>

            <div className="inline-flex rounded-none bg-neutral-100 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-none font-semibold text-xs transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#232434] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title={isAr ? 'عرض البطاقات المصورة' : 'Visual Grid'}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {isAr ? 'شبكي' : 'Grid'}
                </span>
              </button>
              <button
                onClick={() => setViewMode('catalog')}
                className={`px-3 py-1.5 rounded-none font-semibold text-xs transition-all ${
                  viewMode === 'catalog'
                    ? 'bg-white text-[#232434] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title={isAr ? 'عرض المواصفات الفنية' : 'Technical Catalog'}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {isAr ? 'كتالوج' : 'Catalog'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid or Catalog */}
      <AnimatePresence mode="wait">
        {filteredServices.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-none shadow-sm">
            <svg className="w-12 h-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-primary-dark mb-1">
              {isAr ? 'لم يتم العثور على خدمات مطابقة' : 'No Matching Disciplines Found'}
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              {isAr
                ? 'جرب البحث بكلمات أخرى أو اختر "كافة التخصصات"'
                : 'Try searching with different keywords or select "All Disciplines"'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-none bg-[#1D8F2C] text-white text-xs font-semibold hover:bg-[#167423] transition-colors"
            >
              {isAr ? 'إعادة ضبط الفلتر' : 'Reset Filters'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => {
              const visual = serviceVisualMap[service.slug] || {
                image: '/img/services/landscape-design.jpg',
                divisionCode: `DIV ${String(index + 1).padStart(2, '0')}`,
                tagsEn: ['Precision Engineering', 'SBC Compliant'],
                tagsAr: ['هندسة دقيقة', 'مطابق لكود البناء'],
              };
              const catLabel = categoryLabels[service.category];
              const tags = isAr ? visual.tagsAr : visual.tagsEn;

              return (
                <motion.div
                  key={service.slug}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-none overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl border-b-4 border-transparent hover:border-[#1D8F2C] transition-all duration-300 group"
                >
                  <div>
                    {/* Architectural Photo Banner */}
                    <div className="relative h-56 w-full overflow-hidden bg-[#1E202B]">
                      <Image
                        src={visual.image}
                        alt={isAr ? service.titleAr : service.titleEn}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 text-[11px] font-mono font-bold bg-[#1D8F2C] text-white">
                          {visual.divisionCode}
                        </span>
                        <span className="px-3 py-1 text-[11px] font-bold bg-white text-[#232434] font-[var(--font-display)]">
                          {isAr ? catLabel?.ar : catLabel?.en}
                        </span>
                      </div>

                      {/* Bottom Title on Image */}
                      <div className="absolute bottom-4 inset-x-4">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug drop-shadow-md group-hover:text-[#1D8F2C] transition-colors font-[var(--font-display)]">
                          <Link href={`/${locale}/services/${service.slug}`}>
                            {isAr ? service.titleAr : service.titleEn}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <p className="text-[#585858] text-sm leading-relaxed mb-6 line-clamp-3">
                        {isAr ? service.shortDescAr : service.shortDescEn}
                      </p>

                      {/* Engineering Scope Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] px-2.5 py-1 rounded-none bg-neutral-100 text-neutral-700 font-medium group-hover:bg-[#1D8F2C]/10 group-hover:text-[#1D8F2C] transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Key Deliverable Items */}
                      <ul className="space-y-2 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                        {(isAr ? service.featuresAr : service.featuresEn)
                          .slice(0, 2)
                          .map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2">
                              <svg
                                className="w-3.5 h-3.5 text-[#1D8F2C] shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-neutral-100 mt-2">
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#232434] group-hover:text-[#1D8F2C] transition-colors font-[var(--font-display)]"
                    >
                      <span>{isAr ? 'المواصفات والتفاصيل' : 'Technical Scope'}</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Link>

                    {onOpenQuote && (
                      <button
                        onClick={() => onOpenQuote(service.slug)}
                        className="text-xs font-bold px-3 py-1.5 rounded-none bg-neutral-100 text-[#232434] hover:bg-[#1D8F2C] hover:text-white transition-all font-[var(--font-display)] uppercase cursor-pointer"
                      >
                        {isAr ? 'طلب تسعير' : 'Request BoQ'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Catalog / Technical Specification List View */
          <div className="space-y-4">
            {filteredServices.map((service, index) => {
              const visual = serviceVisualMap[service.slug] || {
                image: '/img/services/landscape-design.jpg',
                divisionCode: `DIV ${String(index + 1).padStart(2, '0')}`,
                tagsEn: ['Precision Engineering', 'SBC Compliant'],
                tagsAr: ['هندسة دقيقة', 'مطابق لكود البناء'],
              };
              const catLabel = categoryLabels[service.category];

              return (
                <motion.div
                  key={service.slug}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-none bg-white shadow-sm hover:shadow-lg border-l-4 border-transparent hover:border-[#1D8F2C] transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative w-20 h-20 rounded-none overflow-hidden shrink-0 hidden sm:block bg-neutral-900">
                      <Image
                        src={visual.image}
                        alt={isAr ? service.titleAr : service.titleEn}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-bold text-white bg-[#1D8F2C] px-2 py-0.5 rounded-none">
                          {visual.divisionCode}
                        </span>
                        <span className="text-xs font-medium text-neutral-400">
                          {isAr ? catLabel?.ar : catLabel?.en}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#232434] hover:text-[#1D8F2C] transition-colors">
                        <Link href={`/${locale}/services/${service.slug}`}>
                          {isAr ? service.titleAr : service.titleEn}
                        </Link>
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl line-clamp-2">
                        {isAr ? service.shortDescAr : service.shortDescEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="px-4 py-2 rounded-none bg-neutral-100 hover:bg-[#1D8F2C] hover:text-white text-[#232434] text-xs font-bold transition-all"
                    >
                      {isAr ? 'عرض المواصفات' : 'View Scope'}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
