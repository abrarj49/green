'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  SportsIcon,
  ColumnsIcon,
  DropletIcon,
  RulerIcon,
  LeafIcon,
  CloseIcon,
} from './icons/SiteIcons';


export interface GalleryItem {
  id: string;
  image: string;
  category: 'all' | 'sports' | 'palace' | 'irrigation' | 'hardscape' | 'green';
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  clientEn: string;
  clientAr: string;
  specsEn?: string;
  specsAr?: string;
}

export const sampleGalleryItems: GalleryItem[] = [
  {
    id: 'kasc-pitch',
    image: '/img/hero-stadium.jpg',
    category: 'sports',
    titleEn: 'King Abdullah Sports City (Al-Jawhara) — FIFA Standard Turf',
    titleAr: 'مدينة الملك عبدالله الرياضية (الجوهرة) — ملاعب بطولة بمواصفات الفيفا',
    categoryEn: 'Sports Turf & Arenas',
    categoryAr: 'ملاعب ومسطحات رياضية',
    clientEn: 'Ministry of Sports / El-Seif / M.Six',
    clientAr: 'وزارة الرياضة / مؤسسة السيف / إم سيكس',
    specsEn: 'Sub-surface aerification, laser grading & automated irrigation telemetry',
    specsAr: 'تهوية تحت سطحية، تسوية ليزرية ومراقبة ري متصلة بالأرصاد',
  },
  {
    id: 'kau-plaza',
    image: '/img/services/outdoor-paving.jpg',
    category: 'hardscape',
    titleEn: 'King Abdulaziz University — Heavy-Traffic Boulevard & Plazas',
    titleAr: 'جامعة الملك عبدالعزيز — الساحات الصلبة وممرات المشاة المظللة',
    categoryEn: 'Hardscape & Interlock',
    categoryAr: 'أعمال صلبة وإنترلوك',
    clientEn: 'King Abdulaziz University',
    clientAr: 'جامعة الملك عبدالعزيز',
    specsEn: '18,500 m² high-load interlock with 98% Modified Proctor sub-base compaction',
    specsAr: '18,500 م² إنترلوك عالي التحمل مع دمك طبقات تأسيس بنسبة 98%',
  },
  {
    id: 'obhur-palace',
    image: '/img/hero-royal-palace.jpg',
    category: 'palace',
    titleEn: 'Obhur Waterfront Royal Estate — Seaside Palms & Coastal Grass',
    titleAr: 'قصر أبحر الملكي — حدائق النخيل الساحلية وعشب الباسبالوم المقاوم للملوحة',
    categoryEn: 'Royal Estates & Palaces',
    categoryAr: 'حدائق قصور فاخرة',
    clientEn: 'Saudi Rare Company / Private Royal Office',
    clientAr: 'شركة النوادر السعودية / ديوان خاص',
    specsEn: '120+ mature date palms with salt-aerosol root barriers and cascade water fountains',
    specsAr: '120+ نخلة معمرة مع عوازل رذاذ الملوحة ونوافير مائية هيدروليكية',
  },
  {
    id: 'irrigation-network',
    image: '/img/services/irrigation-networks.jpg',
    category: 'irrigation',
    titleEn: 'Smart Hydraulic Telemetry & Central Weather Station Network',
    titleAr: 'شبكات الري الهيدروليكية الذكية ومحطات الأرصاد المركزية',
    categoryEn: 'Smart Irrigation & Water',
    categoryAr: 'شبكات ري ذكية ومحطات أرصاد',
    clientEn: 'PME Meteorology HQ / Al Angari Projects',
    clientAr: 'مقر الأرصاد وحماية البيئة / شركة العنقري للمشاريع',
    specsEn: 'Subsurface drip lines with Rain Bird IQ4 satellite control saving 35%+ water',
    specsAr: 'خطوط ري تحت سطحي مع تحكم مركزي IQ4 يحقق وفراً يتجاوز 35% في المياه',
  },
  {
    id: 'living-wall',
    image: '/img/services/urban-green.jpg',
    category: 'green',
    titleEn: 'Bank Al Jazira Corporate Atrium — Hydroponic Living Wall',
    titleAr: 'المقر الرئيسي لبنك الجزيرة — حدائق رأسية هيدروبونيك ذكية بالبهو الرئيسي',
    categoryEn: 'Vertical Living Walls',
    categoryAr: 'حدائق رأسية وجدران خضراء',
    clientEn: 'Bank Al Jazira Facilities Directorate',
    clientAr: 'الإدارة العامة للمرافق — بنك الجزيرة',
    specsEn: '380 m² automated closed-loop fertigation with remote BMS telemetry',
    specsAr: '380 م² ري مغلق بحقن سمادي آلي ومراقبة ذكية عبر نظام إدارة المباني',
  },
  {
    id: 'pergola-shading',
    image: '/img/services/pergolas-shade.jpg',
    category: 'hardscape',
    titleEn: 'Bioclimatic Thermal Pergolas & Shaded Pedestrian Promenades',
    titleAr: 'برجولات بيومناخية ذكية وممرات مشاة مظللة لتخفيف الحرارة',
    categoryEn: 'Pergolas & Shade Structures',
    categoryAr: 'برجولات وتظليل معماري',
    clientEn: 'Municipality Public Parks & Commercial Boulevards',
    clientAr: 'حدائق بلديات ومشاريع واجهات تجارية',
    specsEn: 'SBC 301 wind-load certified aluminum and thermo-treated hardwood structures',
    specsAr: 'مطابقة لكود الأحمال SBC 301 مع أخشاب معالجة وألمنيوم عالي المتانة',
  },
  {
    id: 'botanical-nursery',
    image: '/img/services/botanical-care.jpg',
    category: 'green',
    titleEn: 'Acclimatized Botanical Propagation & Date Palm Health Facilities',
    titleAr: 'مشاتل إكثار وأقلمة النباتات ومراكز وقاية وعلاج النخيل',
    categoryEn: 'Botanical Science & Nurseries',
    categoryAr: 'علوم بستانية ومشاتل متخصصة',
    clientEn: 'Green Solution In-House Facilities (Jeddah & Makkah)',
    clientAr: 'مشاتل جرين سلوشن الخاصة (جدة ومكة المكرمة)',
    specsEn: '200,000+ specimen inventory cultivating native flora & arid succulents',
    specsAr: 'طاقة استيعابية 200,000+ شتلة ونبتة متكيفة مع بيئات المملكة',
  },
  {
    id: 'water-features',
    image: '/img/services/water-features.jpg',
    category: 'palace',
    titleEn: 'Architectural Reflective Pools & Multi-Tier Cascade Fountains',
    titleAr: 'بحيرات عاكسة وشلالات ونوافير معمارية متطورة',
    categoryEn: 'Architectural Water Features',
    categoryAr: 'نوافير وشلالات معمارية',
    clientEn: 'VIP Private Residences & Ministry Plazas',
    clientAr: 'قصور خاصة وميادين وزارية',
    specsEn: 'Automated sand filtration with UV sterilization & anti-calcification treatment',
    specsAr: 'فلترة رملية آلية مع تعقيم بالأشعة فوق البنفسجية ومعالجة مانعة للتكلس',
  },
  {
    id: 'masterplan-bim',
    image: '/img/services/landscape-design.jpg',
    category: 'green',
    titleEn: 'BIM 3D Masterplanning & Photorealistic Landscape Modeling',
    titleAr: 'مخططات تنسيق المواقع ثلاثية الأبعاد ونمذجة BIM التنفيذية',
    categoryEn: 'Landscape Architecture & BIM',
    categoryAr: 'تصميم لاندسكيب ونمذجة BIM',
    clientEn: 'Government Ministries & Master Developers',
    clientAr: 'وزارات وهيئات ومطورون عقاريون',
    specsEn: 'SBC 02-L compliant BoQs, hydraulic pressure mapping & luminaire calculations',
    specsAr: 'جداول كميات مطابقة لكود البناء ومخططات ضغوط الري وتوزيع الإضاءة',
  },
];

export default function LightboxGallery({ isAr }: { isAr: boolean }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const categories = useMemo(() => [
    { id: 'all', labelEn: 'All Highlights', labelAr: 'كافة اللقطات', icon: StarIcon },
    { id: 'sports', labelEn: 'Sports Stadiums', labelAr: 'ملاعب رياضية', icon: SportsIcon },
    { id: 'palace', labelEn: 'Royal Estates', labelAr: 'قصور ومقرات', icon: ColumnsIcon },
    { id: 'irrigation', labelEn: 'Smart Irrigation', labelAr: 'شبكات ري', icon: DropletIcon },
    { id: 'hardscape', labelEn: 'Hardscape Plazas', labelAr: 'أعمال صلبة', icon: RulerIcon },
    { id: 'green', labelEn: 'Botanical & Living Walls', labelAr: 'نباتات وجدران حية', icon: LeafIcon },
  ], []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return sampleGalleryItems;
    return sampleGalleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleNext = useCallback(() => {
    setActiveIdx((curr) =>
      curr === null ? null : (curr + 1) % filteredItems.length
    );
  }, [filteredItems.length]);

  const handlePrev = useCallback(() => {
    setActiveIdx((curr) =>
      curr === null
        ? null
        : (curr - 1 + filteredItems.length) % filteredItems.length
    );
  }, [filteredItems.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIdx, handleNext, handlePrev]);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {categories.map((cat) => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveIdx(null);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1D8F2C] text-white shadow-sm'
                  : 'bg-white text-[#232434] hover:bg-neutral-100 shadow-sm'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{isAr ? cat.labelAr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid with Interactive Luxury Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveIdx(idx)}
            className="group relative rounded-none overflow-hidden aspect-[4/3] bg-neutral-900 border-t-2 border-[#1D8F2C] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={isAr ? item.titleAr : item.titleEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent group-hover:from-black/95 transition-all" />

            {/* Top Category Badge */}
            <div className="absolute top-3 start-3">
              <span className="inline-block px-3 py-1 rounded-none bg-black/70 backdrop-blur-md text-[#1D8F2C] text-[10px] font-bold uppercase tracking-wider border-l-2 border-[#1D8F2C]">
                {isAr ? item.categoryAr : item.categoryEn}
              </span>
            </div>

            {/* Floating Zoom Button */}
            <div className="absolute top-3 end-3 w-8 h-8 rounded-none bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>

            {/* Bottom Content Bar */}
            <div className="absolute bottom-4 start-4 end-4 text-white space-y-1">
              <h4 className="text-sm sm:text-base font-bold font-serif leading-snug group-hover:text-emerald-400 transition-colors">
                {isAr ? item.titleAr : item.titleEn}
              </h4>
              <p className="text-[11px] text-neutral-300 line-clamp-1">
                {isAr ? item.clientAr : item.clientEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeIdx !== null && filteredItems[activeIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveIdx(null)}
          >
            <div
              className="relative max-w-5xl w-full bg-neutral-900 rounded-none overflow-hidden border-t-4 border-[#1D8F2C] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveIdx(null)}
                className="absolute top-4 end-4 z-20 w-9 h-9 rounded-none bg-black/80 text-white hover:bg-[#1D8F2C] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close lightbox"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              {/* Photo viewer */}
              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={filteredItems[activeIdx].image}
                  alt={isAr ? filteredItems[activeIdx].titleAr : filteredItems[activeIdx].titleEn}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info Bar */}
              <div className="p-6 bg-[#071912] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#1D8F2C] uppercase tracking-wider block">
                      {isAr ? filteredItems[activeIdx].categoryAr : filteredItems[activeIdx].categoryEn}
                    </span>
                    <span className="text-white/30 text-xs">•</span>
                    <span className="text-xs text-neutral-300">
                      {isAr ? filteredItems[activeIdx].clientAr : filteredItems[activeIdx].clientEn}
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-bold font-serif">
                    {isAr ? filteredItems[activeIdx].titleAr : filteredItems[activeIdx].titleEn}
                  </h3>
                  <p className="text-xs text-neutral-300">
                    {isAr ? filteredItems[activeIdx].specsAr : filteredItems[activeIdx].specsEn}
                  </p>
                </div>

                {/* Navigation arrows */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-none bg-white/10 hover:bg-[#1D8F2C] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous"
                  >
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <span className="text-xs text-neutral-300 font-mono px-2">
                    {activeIdx + 1} / {filteredItems.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-none bg-white/10 hover:bg-[#1D8F2C] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next"
                  >
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
