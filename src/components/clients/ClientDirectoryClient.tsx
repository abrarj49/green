'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ColumnsIcon,
  SportsIcon,
  BuildingIcon,
  CraneIcon,
  CrownIcon,
  StarIcon,
  MapPinIcon,
  CheckIcon,
  CloseIcon,
} from '@/components/icons/SiteIcons';

export interface ClientItem {
  id: string;
  en: string;
  ar: string;
  logo: string;
  sector: 'all' | 'gov' | 'education' | 'corporate' | 'contractors' | 'hospitality';
  categoryEn: string;
  categoryAr: string;
  scopeEn: string;
  scopeAr: string;
  locationEn: string;
  locationAr: string;
}

export const fullClientList: ClientItem[] = [
  {
    id: 'saudia',
    en: 'Saudi Arabian Airlines (Saudia)',
    ar: 'الخطوط الجوية العربية السعودية',
    logo: '/img/clients/saudia.svg',
    sector: 'gov',
    categoryEn: 'Aviation & National Infrastructure',
    categoryAr: 'طيران وبنية تحتية وطنية',
    scopeEn: 'Aviation Headquarter grounds, administrative landscaping & automated irrigation',
    scopeAr: 'تنسيق محيط المقر الرئيسي للطيران، المسطحات الخضراء والري الآلي',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 'mewa',
    en: 'Ministry of Environment, Water & Agriculture',
    ar: 'وزارة البيئة والمياه والزراعة',
    logo: '/img/clients/mewa.svg',
    sector: 'gov',
    categoryEn: 'Government & National Authority',
    categoryAr: 'وزارة وهيئة حكومية رسمية',
    scopeEn: 'Integrated Pest Management (IPM) studies, palm health & water audits',
    scopeAr: 'دراسات الإدارة المتكاملة للآفات، بروتوكولات حماية النخيل والتدقيق المائي',
    locationEn: 'Riyadh & Western Province',
    locationAr: 'الرياض والمنطقة الغربية',
  },
  {
    id: 'kau',
    en: 'King Abdulaziz University',
    ar: 'جامعة الملك عبدالعزيز',
    logo: '/img/clients/kau.svg',
    sector: 'education',
    categoryEn: 'Higher Education & Master Campus',
    categoryAr: 'تعليم عالي وحرم جامعي متكامل',
    scopeEn: '18,500 m² high-load interlock plazas, weather-station ET irrigation telemetry',
    scopeAr: '18,500 م² ساحات إنترلوك للأحمال العالية، وشبكات ري ذكية بمحطات الأرصاد',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 'kasc',
    en: 'King Abdullah Sports City (Al-Jawhara)',
    ar: 'مدينة الملك عبدالله الرياضية (الجوهرة)',
    logo: '/img/clients/kasc.svg',
    sector: 'education',
    categoryEn: 'Sports Stadiums & Mega Venues',
    categoryAr: 'ملاعب دولية ومنشآت رياضية كبرى',
    scopeEn: 'FIFA-standard championship hybrid turf revamping, laser grading & root aeration',
    scopeAr: 'تجديد عشب ملاعب البطولة بمعايير فيفا، تسوية ليزرية وتهوية الجذور',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 'bank-aljazira',
    en: 'Bank AlJazira HQ',
    ar: 'المقر الرئيسي لبنك الجزيرة',
    logo: '/img/clients/bank-aljazira.svg',
    sector: 'corporate',
    categoryEn: 'Banking & Financial Headquarters',
    categoryAr: 'قطاع بنكي ومقرات مالية كبرى',
    scopeEn: 'Biophilic indoor living walls, climate-shaded rooftop executive terrace',
    scopeAr: 'حدائق رأسية جدارية بالبهو الرئيسي، وحديقة سقفية مظللة للإدارة التنفيذية',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 'jcci',
    en: 'Jeddah Chamber of Commerce & Industry',
    ar: 'الغرفة التجارية الصناعية بجدة',
    logo: '/img/clients/jcci.svg',
    sector: 'gov',
    categoryEn: 'Commerce & Civic Institutions',
    categoryAr: 'غرف تجارية وهيئات أعمال مدنية',
    scopeEn: 'Civic entrance plaza landscaping, high-durability pedestrian paving',
    scopeAr: 'تنسيق بهو المدخل الرئيسي للغرفة، وبلاط ممرات مشاة عالي التحمل',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 'westin',
    en: 'Westin Hotels & Resorts',
    ar: 'منتجعات وفنادق ويستن العالمية',
    logo: '/img/clients/westin.svg',
    sector: 'hospitality',
    categoryEn: '5-Star Luxury Hospitality & Resorts',
    categoryAr: 'فنادق ومنتجعات 5 نجوم فاخرة',
    scopeEn: 'Comprehensive botanical landscape, ambient resort misting & ornamental water displays',
    scopeAr: 'تنسيق بستاني للمنتجع، أنظمة تبريد بالضباب المائي ونوافير زخرفية هادئة',
    locationEn: 'Western Province',
    locationAr: 'المنطقة الغربية',
  },
  {
    id: 'radisson',
    en: 'Radisson Blu Hotel & Resort',
    ar: 'فندق ومنتجع راديسون بلو',
    logo: '/img/clients/radisson.svg',
    sector: 'hospitality',
    categoryEn: 'Luxury Waterfront Hospitality',
    categoryAr: 'ضيافة فندقية شاطئية فاخرة',
    scopeEn: 'Seaside salt-tolerant palm groves, subsurface automated drip networks',
    scopeAr: 'غابات نخيل شاطئية مقاومة للملوحة، وشبكات ري بالتنقيط تحت السطحي',
    locationEn: 'Jeddah Waterfront',
    locationAr: 'واجهة جدة البحرية',
  },
  {
    id: 'al-raza',
    en: 'Raza Palace Enclaves',
    ar: 'مجموعة قصور رضا الملكية',
    logo: '/img/clients/al-raza.svg',
    sector: 'hospitality',
    categoryEn: 'Royal Palaces & VIP Private Estates',
    categoryAr: 'قصور ملكية ومجمعات سكنية خاصة',
    scopeEn: 'Turnkey architectural palace landscapes, heritage date palms & Italian marble fountains',
    scopeAr: 'لاندسكيب القصور الفاخرة، نخيل معمر أصيل، ونوافير رخامية إيطالية',
    locationEn: 'Obhur & Riyadh',
    locationAr: 'أبحر والرياض',
  },
  {
    id: 'al-bilad',
    en: 'Al-Bilad Hotel & Resorts',
    ar: 'فندق ومنتجع البلاد',
    logo: '/img/clients/al-bilad.svg',
    sector: 'hospitality',
    categoryEn: 'Heritage Hospitality Resorts',
    categoryAr: 'منتجعات فندقية تاريخية',
    scopeEn: 'Lush tropical foliage acclimatization, smart Hunter water telemetry',
    scopeAr: 'تنسيق نباتي استوائي مؤقلم، وشبكات ري ذكية بمحابس Hunter الكهرومغناطيسية',
    locationEn: 'Corniche Jeddah',
    locationAr: 'كورنيش جدة',
  },
  {
    id: 'shaker',
    en: 'Shaker Group Corporate Campus',
    ar: 'المقر الرئيسي لمجموعة شاكر',
    logo: '/img/clients/shaker.svg',
    sector: 'corporate',
    categoryEn: 'Industrial & HVAC Conglomerates',
    categoryAr: 'مجمعات تجارية وصناعية كبرى',
    scopeEn: 'Executive parking shade canopies, native xeriscape & smart controllers',
    scopeAr: 'أشجار تظليل المواقف، حدائق نباتات برية موفرة للمياه وتحكم ذكي',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 'binladin',
    en: 'Saudi Binladin Group (SBG)',
    ar: 'مجموعة بن لادن السعودية',
    logo: '/img/clients/binladin.svg',
    sector: 'contractors',
    categoryEn: 'Tier-1 Mega Infrastructure Contractors',
    categoryAr: 'مقاول رئيسي للمشاريع العملاقة',
    scopeEn: 'Specialized subcontracting: sports turf revamping & major university paving',
    scopeAr: 'مقاول باطن متخصص: تجديد نجيل الملاعب وأعمال تبليط الجامعات الكبرى',
    locationEn: 'Nationwide Projects',
    locationAr: 'مشاريع المملكة',
  },
  {
    id: 'al-saad',
    en: 'Al Saad General Contracting Co.',
    ar: 'شركة السعد للمقاولات العامة',
    logo: '/img/clients/al-saad.svg',
    sector: 'contractors',
    categoryEn: 'Commercial & Civic Infrastructure',
    categoryAr: 'مقاولات عامة وبنية تحتية',
    scopeEn: 'Civic hardscape execution, perimeter tree planting & water pump stations',
    scopeAr: 'تنفيذ أعمال هاردسكيب مدنية، تشجير المحيط، ومحطات ضخ المياه',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 'alqussie',
    en: 'Al Qussie International Company',
    ar: 'شركة القسي العالمية للمقاولات',
    logo: '/img/clients/alqussie.svg',
    sector: 'contractors',
    categoryEn: 'Industrial Works & Facility Operations',
    categoryAr: 'خدمات وتشغيل المنشآت الصناعية',
    scopeEn: 'Long-term corporate green space maintenance, pest management & irrigation',
    scopeAr: 'صيانة مساحات خضراء طويلة الأجل، مكافحة آفات وشبكات ري',
    locationEn: 'Western Province',
    locationAr: 'المنطقة الغربية',
  },
  {
    id: 'abv-rock',
    en: 'ABV Rock Group KSA',
    ar: 'مجموعة إيه بي في روك السعودية',
    logo: '/img/clients/abv-rock.svg',
    sector: 'contractors',
    categoryEn: 'Heavy Civil & Strategic Underground Works',
    categoryAr: 'أعمال مدنية واستراتيجية كبرى',
    scopeEn: 'Geotechnical soil stabilization, native xeriscape cover & runoff control',
    scopeAr: 'تثبيت التربة الجيوتقني، غطاء نباتي صحراوي والتحكم في تصريف السيول',
    locationEn: 'Strategic Sites KSA',
    locationAr: 'مواقع استراتيجية بالمملكة',
  },
  {
    id: 'kreidie',
    en: 'Rafic A. Kreidie Engineers & Contractors',
    ar: 'شركة رفيق كريدية للهندسة والمقاولات',
    logo: '/img/clients/kreidie.svg',
    sector: 'contractors',
    categoryEn: 'Architectural Engineering & Contracting',
    categoryAr: 'هندسة معمارية ومقاولات عامة',
    scopeEn: 'Installation of heavy hardscape and plaza paving at KAU Project 5200',
    scopeAr: 'تنفيذ أعمال الهاردسكيب الثقيل وبلاط الساحات بالمشروع 5200 بجامعة المؤسس',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
];

export default function ClientDirectoryClient({ isAr }: { isAr: boolean }) {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientModal, setSelectedClientModal] = useState<ClientItem | null>(null);

  const sectorFilters = useMemo(
    () => [
      { id: 'all', labelEn: 'All Clients', labelAr: 'كافة الشركاء', icon: <StarIcon className="w-3.5 h-3.5" /> },
      { id: 'gov', labelEn: 'Government & Ministries', labelAr: 'الوزارات والهيئات', icon: <ColumnsIcon className="w-3.5 h-3.5" /> },
      { id: 'education', labelEn: 'Sports & Campuses', labelAr: 'الرياضة والجامعات', icon: <SportsIcon className="w-3.5 h-3.5" /> },
      { id: 'corporate', labelEn: 'Banking & HQs', labelAr: 'البنوك والمقرات', icon: <BuildingIcon className="w-3.5 h-3.5" /> },
      { id: 'contractors', labelEn: 'Tier-1 EPC Contractors', labelAr: 'المقاولون الكبار', icon: <CraneIcon className="w-3.5 h-3.5" /> },
      { id: 'hospitality', labelEn: 'Palaces & Luxury Resorts', labelAr: 'القصور والضيافة', icon: <CrownIcon className="w-3.5 h-3.5" /> },
    ],
    []
  );

  const filteredClients = useMemo(() => {
    return fullClientList.filter((item) => {
      const matchesSector =
        selectedSector === 'all' || item.sector === selectedSector;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        item.en.toLowerCase().includes(query) ||
        item.ar.toLowerCase().includes(query) ||
        item.scopeEn.toLowerCase().includes(query) ||
        item.scopeAr.toLowerCase().includes(query) ||
        item.categoryEn.toLowerCase().includes(query) ||
        item.categoryAr.toLowerCase().includes(query);

      return matchesSector && matchesSearch;
    });
  }, [selectedSector, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Interactive Sector Tabs & Search Bar */}
      <div className="bg-white p-6 border-t-2 border-[#1D8F2C] shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Sector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {sectorFilters.map((s) => {
              const count =
                s.id === 'all'
                  ? fullClientList.length
                  : fullClientList.filter((c) => c.sector === s.id).length;
              const isSelected = selectedSector === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSector(s.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border font-[var(--font-display)] ${
                    isSelected
                      ? 'bg-[#1D8F2C] text-white border-[#1D8F2C]'
                      : 'bg-[#F3F7FB] border-neutral-200 text-[#232434] hover:border-[#1D8F2C]'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{isAr ? s.labelAr : s.labelEn}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث باسم المؤسسة أو القطاع...' : 'Search by client or scope...'}
              className="w-full ps-10 pe-8 py-2.5 border border-neutral-300 focus:outline-none focus:border-[#1D8F2C] text-xs bg-[#F3F7FB] font-sans"
            />
            <svg
              className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
                aria-label="Clear search"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          <span>
            {isAr
              ? `عرض ${filteredClients.length} من أصل ${fullClientList.length} مؤسسة شريكة بالمملكة`
              : `Showing ${filteredClients.length} of ${fullClientList.length} client partnerships across Saudi Arabia`}
          </span>
          {(selectedSector !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSector('all');
                setSearchQuery('');
              }}
              className="text-[#1D8F2C] font-bold hover:underline"
            >
              {isAr ? 'إعادة ضبط التصفية ↺' : 'Reset filters ↺'}
            </button>
          )}
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => setSelectedClientModal(client)}
            className="p-6 border-t-2 border-[#1D8F2C] bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative shadow-sm"
          >
            {/* Left green indicator on hover */}
            <div className="absolute top-0 bottom-0 start-0 w-1 bg-transparent group-hover:bg-[#1D8F2C] transition-colors" />

            <div>
              {/* Category Pill & Location */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D8F2C] bg-[#1D8F2C]/10 px-2.5 py-1 font-[var(--font-display)]">
                  {isAr ? client.categoryAr : client.categoryEn}
                </span>
                <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                  <MapPinIcon className="w-3 h-3 text-[#1D8F2C] shrink-0" />
                  <span>{isAr ? client.locationAr : client.locationEn}</span>
                </span>
              </div>

              {/* Logo Area */}
              <div className="h-20 w-full flex items-center justify-center my-4 p-3 bg-[#F3F7FB] group-hover:bg-white transition-all">
                <Image
                  src={client.logo}
                  alt={isAr ? client.ar : client.en}
                  width={180}
                  height={56}
                  className="max-h-14 w-auto object-contain transition-transform group-hover:scale-110 duration-300"
                  loading="lazy"
                />
              </div>

              {/* Institution Title */}
              <h3 className="text-sm sm:text-base font-bold text-[#232434] font-[var(--font-display)] group-hover:text-[#1D8F2C] transition-colors leading-snug mb-2">
                {isAr ? client.ar : client.en}
              </h3>

              {/* Delivered Scope Summary */}
              <p className="text-xs text-[#585858] line-clamp-2 leading-relaxed">
                {isAr ? client.scopeAr : client.scopeEn}
              </p>
            </div>

            {/* Bottom Card Action */}
            <div className="pt-4 border-t border-neutral-100 mt-5 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1D8F2C]">
                <CheckIcon className="w-3 h-3 text-[#1D8F2C]" />
                <span>Verified Partner</span>
              </span>
              <span className="text-[#1D8F2C] font-bold group-hover:translate-x-1 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                {isAr ? 'التفاصيل ←' : 'Details →'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Modal */}
      {selectedClientModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedClientModal(null)}
        >
          <div
            className="bg-white max-w-lg w-full p-6 sm:p-8 shadow-2xl border-t-4 border-[#1D8F2C] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedClientModal(null)}
              className="absolute top-5 end-5 w-8 h-8 bg-neutral-100 hover:bg-[#1D8F2C] hover:text-white flex items-center justify-center text-neutral-500 font-bold transition cursor-pointer"
              aria-label="Close modal"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

            {/* Logo in Modal */}
            <div className="h-16 w-36 flex items-center justify-start mb-4">
              <Image
                src={selectedClientModal.logo}
                alt={isAr ? selectedClientModal.ar : selectedClientModal.en}
                width={160}
                height={48}
                className="max-h-12 w-auto object-contain"
              />
            </div>

            <span className="inline-block px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] font-bold text-xs mb-2 font-[var(--font-display)]">
              {isAr ? selectedClientModal.categoryAr : selectedClientModal.categoryEn}
            </span>

            <h3 className="text-2xl font-bold font-[var(--font-display)] text-[#232434] mb-1">
              {isAr ? selectedClientModal.ar : selectedClientModal.en}
            </h3>

            <p className="text-xs text-neutral-400 mb-6 flex items-center gap-1.5">
              <MapPinIcon className="w-3.5 h-3.5 text-[#1D8F2C] shrink-0" />
              <span>{isAr ? selectedClientModal.locationAr : selectedClientModal.locationEn}, KSA</span>
              <span>•</span>
              <span>Official Institutional Partner</span>
            </p>

            <div className="p-4 bg-[#F3F7FB] border border-neutral-200 mb-6 space-y-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block font-[var(--font-display)]">
                {isAr ? 'نطاق الأعمال الهندسية والتنفيذية:' : 'Executed Engineering Scope:'}
              </span>
              <p className="text-xs sm:text-sm text-[#232434] leading-relaxed font-medium">
                {isAr ? selectedClientModal.scopeAr : selectedClientModal.scopeEn}
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#585858] mb-6">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C] shrink-0" />
                <span>{isAr ? 'عقود تنفيذ مطابقة لكود البناء السعودي SBC' : 'Compliant with Saudi Building Code (SBC)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C] shrink-0" />
                <span>{isAr ? 'التزام كامل ببرامج الترشيد المائي ومبادرة السعودية الخضراء' : 'SGI & Water Conservation Audited'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C] shrink-0" />
                <span>{isAr ? 'إشراف ميداني من مهندسين مرخصين من هيئة المهندسين' : 'SCE Licensed Engineering Oversight'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedClientModal(null)}
                className="px-5 py-2.5 border border-neutral-300 text-neutral-600 text-xs font-semibold hover:bg-neutral-100 transition"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
