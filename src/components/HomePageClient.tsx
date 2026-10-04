'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import QuotePopup from '@/components/QuotePopup';
import HeroSection from '@/components/HeroSection';
import SectionReveal from '@/components/SectionReveal';
import ScrollReveal from '@/components/ScrollReveal';
import CountUp from '@/components/CountUp';
import AnimatedText from '@/components/AnimatedText';
import ClientMarquee from '@/components/ClientMarquee';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ColumnsIcon,
  SportsIcon,
  DropletIcon,
  RulerIcon,
  LeafIcon,
  PalmIcon,
  TelemetryIcon,
  NurseryIcon,
  AwardIcon,
  BuildingIcon,
} from '@/components/icons/SiteIcons';

interface FeaturedService {
  slug: string;
  image: string;
  icon: React.FC<{ className?: string }>;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

const featuredServices: FeaturedService[] = [
  {
    slug: 'landscape-design-planning',
    image: '/img/services/landscape-design.jpg',
    icon: ColumnsIcon,
    titleEn: 'Landscape Design & Master Planning',
    titleAr: 'تصميم وتخطيط المناظر الطبيعية',
    descEn: 'Architectural blueprints, 3D renderings, and BoQs compliant with Saudi environmental regulations.',
    descAr: 'مخططات معمارية وتصورات ثلاثية الأبعاد وجداول كميات معتمدة تناسب بيئة المملكة.',
  },
  {
    slug: 'lawn-development-maintenance',
    image: '/img/services/turf-grass.jpg',
    icon: SportsIcon,
    titleEn: 'Lawn Development & Maintenance',
    titleAr: 'إنشاء وصيانة المسطحات الخضراء',
    descEn: 'Laser grading, soil microbiome conditioning, hybrid turf installation, and routine mowing.',
    descAr: 'تسوية دقيقة بالليزر، تهيئة التربة، زراعة العشب الطبيعي والهجين، وبرامج صيانة وقائية.',
  },
  {
    slug: 'irrigation-water-systems',
    image: '/img/services/irrigation-networks.jpg',
    icon: DropletIcon,
    titleEn: 'Automated Irrigation & Water Systems',
    titleAr: 'شبكات الري الأوتوماتيكية الذكية',
    descEn: 'Weather-adaptive drip and rotary networks reducing water consumption by up to 30%.',
    descAr: 'شبكات ري بالتنقيط والرشاشات الدوارة متصلة بحساسات الطقس لتوفير 30% من استهلاك المياه.',
  },
  {
    slug: 'outdoor-paving-hardscape',
    image: '/img/services/outdoor-paving.jpg',
    icon: RulerIcon,
    titleEn: 'Outdoor Paving, Hardscape & Walkways',
    titleAr: 'الأعمال الصلبة والممرات والبرجولات',
    descEn: 'Natural stone paving, permeable pavers, decorative pergolas, and heavy-duty plaza works.',
    descAr: 'أرضيات حجر طبيعي وإنترلوك عالي التحمل، برجولات خشبية ومظلات وجلسات خارجية راقية.',
  },
  {
    slug: 'vertical-gardens-rooftops',
    image: '/img/services/botanical-care.jpg',
    icon: LeafIcon,
    titleEn: 'Vertical Gardens & Green Rooftops',
    titleAr: 'الحدائق الرأسية والأسطح الخضراء',
    descEn: 'Engineered modular living walls, automated fertigation, and rooftop structural greening.',
    descAr: 'جدران نباتية حية متطورة، ري وتسميد آلي، وتحويل أسطح المباني إلى واحات خضراء معزولة.',
  },
  {
    slug: 'urban-green-space-management',
    image: '/img/services/urban-green.jpg',
    icon: PalmIcon,
    titleEn: 'Urban Green Space & Public Parks',
    titleAr: 'إدارة وتطوير الحدائق الحضرية',
    descEn: 'Municipal parks, corporate campus landscaping, native tree planting, and bio-friendly care.',
    descAr: 'تنسيق الحدائق العامة ومقرات الشركات وتشجير الطرق بأنواع نباتية محلية مستدامة.',
  },
];

interface FeaturedProjectCard {
  id: number;
  slug?: string;
  image: string;
  category: 'landscape' | 'irrigation' | 'hardscape' | 'sports';
  titleEn: string;
  titleAr: string;
  clientEn: string;
  clientAr: string;
  locationEn: string;
  locationAr: string;
}

const portfolioProjects: FeaturedProjectCard[] = [
  {
    id: 1,
    image: '/img/service-1.jpg',
    category: 'landscape',
    titleEn: 'Obhur Presidential Palace Grounds',
    titleAr: 'تنسيق حدائق قصر أبحر الملكي',
    clientEn: 'Saudi Rare Company',
    clientAr: 'شركة النوادر السعودية',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 2,
    image: '/img/service-2.jpg',
    category: 'sports',
    titleEn: 'King Abdullah Sports City Stadium Pitch',
    titleAr: 'ملاعب مدينة الملك عبدالله الرياضية',
    clientEn: 'KASC / Saudi Ministry of Sports',
    clientAr: 'مدينة الملك عبدالله الرياضية',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 3,
    image: '/img/service-3.jpg',
    category: 'irrigation',
    titleEn: 'King Abdulaziz University Smart Irrigation',
    titleAr: 'شبكات الري الذكية بجامعة الملك عبدالعزيز',
    clientEn: 'King Abdulaziz University',
    clientAr: 'جامعة الملك عبدالعزيز',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 4,
    image: '/img/service-4.jpg',
    category: 'hardscape',
    titleEn: 'Jeddah Chamber Headquarters Plaza',
    titleAr: 'الساحات الخارجية لغرفة جدة للتجارة',
    clientEn: 'Jeddah Chamber (JCCI)',
    clientAr: 'غرفة جدة للتجارة والصناعة',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
  {
    id: 5,
    image: '/img/service-5.jpg',
    category: 'landscape',
    titleEn: 'Ibrahim Juffali Luxury Private Estate',
    titleAr: 'قصر د. فوزية إبراهيم الجفالي',
    clientEn: 'Dr. Fouzia Ibrahim Juffali',
    clientAr: 'د. فوزية إبراهيم الجفالي',
    locationEn: 'Makkah',
    locationAr: 'مكة المكرمة',
  },
  {
    id: 6,
    image: '/img/service-6.jpg',
    category: 'irrigation',
    titleEn: 'PME Meteorology Headquarters Greening',
    titleAr: 'مقر الأرصاد وحماية البيئة',
    clientEn: 'PME Building / Al Angari',
    clientAr: 'مبنى الأرصاد وحماية البيئة',
    locationEn: 'Jeddah',
    locationAr: 'جدة',
  },
];

const faqs = [
  {
    qEn: 'Are Green Solution KSA designs compliant with the Saudi Building Code (SBC)?',
    qAr: 'هل تصاميم شركة جرين سلوشن مطابقة لكود البناء السعودي (SBC)؟',
    aEn: 'Yes, 100% of our architectural drawings, hydraulic irrigation calculations, and structural hardscapes comply with SBC 02-L and municipal standards across all Saudi provinces.',
    aAr: 'نعم، جميع مخططاتنا المعمارية وحسابات شبكات الري الهيدروليكية والأعمال الصلبة مطابقة تماماً لاشتراطات كود البناء السعودي SBC 02-L والبلديات المعتمدة.',
  },
  {
    qEn: 'How does your automated SCADA irrigation save up to 30% water?',
    qAr: 'كيف تحقق شبكات الري الذكية SCADA وفراً مائياً يصل إلى 30%؟',
    aEn: 'Our systems integrate on-site evapotranspiration sensors, weather-synchronized controllers, and root-zone moisture meters that adjust flow in real time, preventing runoff and over-watering.',
    aAr: 'تعتمد شبكاتنا على محطات أرصاد جوية مدمجة ومجسات لرطوبة التربة تنظم الري آلياً بناءً على حاجة النبات الفعلية ودرجة الحرارة، مما يمنع الهدر المائي.',
  },
  {
    qEn: 'Do you provide turnkey execution including civil works and BoQs?',
    qAr: 'هل تقدمون تنفيذاً متكاملاً يشمل الأعمال المدنية وجداول الكميات؟',
    aEn: 'Yes. We provide full EPC delivery from initial site survey and stamped BoQ drafting to earthworks, irrigation installation, planting, and long-term maintenance contracts.',
    aAr: 'نعم، نقدم حلولاً تنفيذية شاملة EPC تبدأ من الرفع المساحي وإعداد جداول الكميات المعتمدة وحتى أعمال الحفر، شبكات الري، التوريد، والزراعة مع عقود صيانة سنوية.',
  },
  {
    qEn: 'What plant species do you recommend for Saudi Arabia’s arid climate?',
    qAr: 'ما هي أنواع النباتات الموصى بها للبيئة الصحراوية بالمملكة؟',
    aEn: 'Our Western Province acclimatization nursery stocks over 200,000 indigenous and climate-adapted species including Washingtonia palms, Acacia tortilis, Ziziphus, and drought-tolerant turf varieties.',
    aAr: 'تحتوي مشاتلنا على أكثر من 200,000 شتلة ونخلة مؤقلمة تشمل نخيل الواشنطونيا، السمر، السدر، والنجيل الصحراوي الهجين الذي يتحمل درجات حرارة تتجاوز 50 درجة مئوية.',
  },
];

const sustainabilityPillars = [
  {
    en: 'Environmental Sustainability',
    ar: 'الاستدامة البيئية الشاملة',
    tagEn: 'SGI Aligned',
    tagAr: 'مبادرة السعودية الخضراء',
  },
  {
    en: 'Smart SCADA Hydraulics',
    ar: 'شبكات ري SCADA الذكية',
    tagEn: '35%+ Water Saved',
    tagAr: 'وفر مائي موثق +35%',
  },
  {
    en: 'Saudi Vision 2030',
    ar: 'رؤية السعودية 2030',
    tagEn: 'Quality of Life',
    tagAr: 'جودة الحياة والتطوير',
  },
  {
    en: 'Acclimatized Native Flora',
    ar: 'مشاتل أقلمة نباتية متخصصة',
    tagEn: '200k+ Specimen Reserve',
    tagAr: '+200 ألف شتلة ونخلة',
  },
  {
    en: 'SBC 02-L Building Code',
    ar: 'كود البناء السعودي المعتمد',
    tagEn: 'Certified Blueprints',
    tagAr: 'مخططات وجداول كميات معتمدة',
  },
  {
    en: 'FIFA-Standard Sports Turf',
    ar: 'إنشاء وصيانة الملاعب الرياضية',
    tagEn: 'Hybrid Turf Systems',
    tagAr: 'معايير دولية معتمدة',
  },
  {
    en: 'Royal & Mega Estates',
    ar: 'قصور ملكية ومشاريع كبرى',
    tagEn: 'Turnkey Delivery',
    tagAr: 'عقود تسليم مفتاح',
  },
];

export default function HomePageClient() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [quoteFormState, setQuoteFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [quoteData, setQuoteData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'landscape-design-planning',
    message: '',
  });

  const locale = useLocale();
  const isAr = locale === 'ar';

  const filteredProjects =
    activeCategory === 'all'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeCategory);

  const handleInlineQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteFormState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quoteData,
          source: 'homepage-sungo-quote',
          locale,
        }),
      });
      if (res.ok) {
        setQuoteFormState('success');
        setQuoteData({
          name: '',
          email: '',
          phone: '',
          service: 'landscape-design-planning',
          message: '',
        });
      } else {
        setQuoteFormState('error');
      }
    } catch {
      setQuoteFormState('error');
    }
  };

  return (
    <div className="bg-white text-[#585858] font-sans antialiased selection:bg-[#1D8F2C] selection:text-white">
      <Navbar onOpenQuote={() => setIsQuoteOpen(true)} />

      {/* 1. Hero Section Slider */}
      <HeroSection onOpenQuote={() => setIsQuoteOpen(true)} />

      {/* 2. Sungo Marquee Band (Green Ticker with Star Icons) */}
      <div className="bg-[#1D8F2C] py-4 overflow-hidden select-none border-y border-white/10">
        <div className="marquee-inner flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex items-center gap-6 shrink-0 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase font-[var(--font-display)] px-3">
              <span>{isAr ? 'تصميم اللاندسكيب' : 'Landscape Architecture'}</span>
              <img src="/img/sungo/star.svg" alt="star" className="w-4 h-4 opacity-80" />
              <span>{isAr ? 'شبكات الري الذكية' : 'Smart SCADA Irrigation'}</span>
              <img src="/img/sungo/star.svg" alt="star" className="w-4 h-4 opacity-80" />
              <span>{isAr ? 'مشاتل الأقلمة' : 'Acclimatized Nurseries'}</span>
              <img src="/img/sungo/star.svg" alt="star" className="w-4 h-4 opacity-80" />
              <span>{isAr ? 'ملاعب معتمدة' : 'Championship Arenas'}</span>
              <img src="/img/sungo/star.svg" alt="star" className="w-4 h-4 opacity-80" />
              <span>{isAr ? 'الأعمال الصلبة' : 'Hardscape Engineering'}</span>
              <img src="/img/sungo/star.svg" alt="star" className="w-4 h-4 opacity-80" />
              <span>{isAr ? 'الحدائق الرأسية' : 'Vertical Living Walls'}</span>
              <img src="/img/sungo/star.svg" alt="star" className="w-4 h-4 opacity-80" />
              <span>{isAr ? 'كود البناء السعودي' : 'Saudi Building Code SBC'}</span>
              <img src="/img/sungo/star.svg" alt="star" className="w-4 h-4 opacity-80" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Sungo About Section (Asymmetric 2-Col with Counter Badge & Features) */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column (5 cols): Sungo Asymmetric Image Composition */}
            <div className="lg:col-span-6 relative">
              <ScrollReveal direction="left" duration={0.8}>
                <div className="relative">
                  {/* Main Large Image */}
                  <div className="relative overflow-hidden bg-[#232434] shadow-2xl group">
                    <img
                      src="/img/about.jpg"
                      alt={isAr ? 'عن شركة جرين سلوشن' : 'About Green Solution KSA'}
                      className="w-full h-[450px] sm:h-[540px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Overlapping Secondary Image */}
                  <div className={`hidden sm:block absolute -bottom-10 ${isAr ? '-left-8' : '-right-8'} w-64 h-64 border-8 border-white shadow-2xl overflow-hidden group`}>
                    <img
                      src="/img/why-nursery.jpg"
                      alt={isAr ? 'مشاتل الأقلمة' : 'Acclimatization Facility'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Sungo Counter Floating Badge (float-bob-y) */}
                  <div className={`absolute -top-6 ${isAr ? '-right-4' : '-left-4'} bg-[#1D8F2C] text-white p-6 shadow-2xl flex items-center gap-4 border-2 border-white/20 float-bob-y`}>
                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center p-2">
                      <img src="/img/sungo/about/icon-1.svg" alt="icon" className="w-8 h-8 invert brightness-0 invert-1" />
                    </div>
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-display)] leading-none text-white">
                        <CountUp value="25+" />
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/90 mt-1">
                        {isAr ? 'عاماً من الخبرة بالمملكة' : 'Years Experience'}
                      </p>
                    </div>
                  </div>

                  {/* Sungo Video Box with Rotating Text Ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    <button
                      onClick={() => setIsQuoteOpen(true)}
                      className="w-20 h-20 bg-white text-[#1D8F2C] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer relative group"
                      aria-label="Request consultation"
                    >
                      <svg className="w-8 h-8 text-[#1D8F2C] translate-x-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <div className="absolute -inset-3 border border-dashed border-[#1D8F2C] rounded-full animate-spin-slow pointer-events-none" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column (6 cols): Sungo Content Block */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal direction="right" duration={0.8} delay={0.15}>
                <div>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 bg-[#1D8F2C]" />
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D8F2C] font-[var(--font-display)]">
                      {isAr ? 'عن شركة جرين سلوشن' : 'About Green Solution'}
                    </span>
                  </div>
                  <AnimatedText
                    text={
                      isAr
                        ? 'رواد هندسة اللاندسكيب والري الذكي في المملكة'
                        : 'Pioneering Arid Landscape Architecture & Smart Irrigation'
                    }
                    as="h2"
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#232434] leading-[1.18] font-[var(--font-display)]"
                  />
                </div>

                <p className="text-sm sm:text-base text-[#585858] leading-relaxed mt-4">
                  {isAr
                    ? 'تعتبر شركة جرين سلوشن (Green Solution Co.) إحدى الشركات الوطنية المتقدمة في المملكة العربية السعودية في مجالات هندسة اللاندسكيب، تصميم وتنفيذ شبكات الري الذكية المركزية SCADA، وأعمال الهاردسكيب المطابقة لكود البناء السعودي (SBC)، مدعومة بمشاتل إنتاجية متخصصة ومقرات ميدانية في جدة والرياض.'
                    : 'Green Solution Co. is a premier landscape architecture and hydraulic engineering firm operating across Saudi Arabia. Backed by over 25 years of horticultural science, we build resilient ecosystems for royal estates, FIFA-grade sports stadiums, and university masterplans aligned with the Saudi Green Initiative.'}
                </p>

                {/* Sungo Icon Feature Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  <div className="group flex items-start gap-4 p-4 bg-[#F3F7FB] border-s-4 border-[#1D8F2C] hover-lift accent-line-expand transition-all">
                    <div className="w-13 h-13 rounded-lg bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs text-[#1D8F2C] group-hover:bg-[#1D8F2C] group-hover:text-white transition-all duration-300">
                      <TelemetryIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#232434] font-[var(--font-display)] mb-1">
                        {isAr ? 'شبكات ري SCADA الذكية' : 'Smart SCADA Telemetry'}
                      </h4>
                      <p className="text-xs text-[#585858] leading-relaxed">
                        {isAr ? 'وفر مائي موثق يتجاوز 35% باستخدام محطات الأرصاد.' : 'Conserving over 35% freshwater via weather-based automation.'}
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-4 bg-[#F3F7FB] border-s-4 border-[#1D8F2C] hover-lift accent-line-expand transition-all">
                    <div className="w-13 h-13 rounded-lg bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs text-[#1D8F2C] group-hover:bg-[#1D8F2C] group-hover:text-white transition-all duration-300">
                      <NurseryIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#232434] font-[var(--font-display)] mb-1">
                        {isAr ? 'مشاتل أقلمة نباتية' : 'Acclimatized Nurseries'}
                      </h4>
                      <p className="text-xs text-[#585858] leading-relaxed">
                        {isAr ? 'مخزون يتجاوز 200,000 شتلة ونخلة مؤقلمة للبيئة.' : '200,000+ drought-tolerant native flora in propagation.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Author & Sungo Button Row */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-6 border-t border-neutral-200">
                  <Link
                    href={`/${locale}/about`}
                    className="theme-btn uppercase text-sm font-bold tracking-wide font-[var(--font-display)] inline-flex items-center gap-3"
                  >
                    <span>{isAr ? 'استكشف مسيرتنا' : 'Explore More'}</span>
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#232434] rounded-full flex items-center justify-center text-white font-bold text-base font-[var(--font-display)]">
                      CH
                    </div>
                    <div>
                      <h6 className="text-sm font-bold text-[#232434] font-[var(--font-display)]">
                        {isAr ? 'م. عبدالحميد' : 'Eng. Ch. Hameed'}
                      </h6>
                      <p className="text-xs text-[#1D8F2C] font-semibold">
                        {isAr ? 'المدير العام وكبير الاستشاريين' : 'Founder & Lead Agronomist'}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Trust Bar (Sungo brand-section) */}
      <div className="py-12 bg-[#F3F7FB] border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h6 className="text-center text-xs font-bold tracking-[0.2em] uppercase text-[#585858] mb-8 font-[var(--font-display)]">
            {isAr ? 'شركاء النجاح وكبرى المنشآت الوطنية بالمملكة' : '55+ Prestigious Saudi Institutions Trust Us'}
          </h6>
          <ClientMarquee />
        </div>
      </div>

      {/* 5. Sungo Services Section (Dark Navy Geometric Background with Card Grid) */}
      <section
        className="pt-24 lg:pt-32 pb-32 sm:pb-36 lg:pb-40 bg-[#1E202B] text-white relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/img/sungo/service/service-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#1E202B]/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-[#1D8F2C]" />
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D8F2C] font-[var(--font-display)]">
                    {isAr ? 'خدماتنا المتخصصة' : 'Services We Offer'}
                  </span>
                </div>
                <AnimatedText
                  text={
                    isAr
                      ? 'حلول بستانية وهندسية متكاملة للمشاريع الكبرى'
                      : 'Comprehensive Landscape & Irrigation Engineering'
                  }
                  as="h2"
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-[var(--font-display)] leading-tight"
                />
              </div>

              <Link
                href={`/${locale}/services`}
                className="theme-btn uppercase text-xs font-bold tracking-wider font-[var(--font-display)] inline-flex items-center gap-2 shrink-0 self-start md:self-auto"
              >
                <span>{isAr ? 'عرض كافة الخدمات' : 'View All Services'}</span>
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </SectionReveal>

          {/* 6 Sungo Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <ScrollReveal key={service.slug} direction="up" delay={index * 0.1}>
                <div className="bg-white overflow-hidden group hover-lift accent-line-expand shine-hover shadow-xl border-t-4 border-transparent hover:border-[#1D8F2C] flex flex-col justify-between h-full">
                  <div>
                    {/* Visual Service Image with Subtle Zoom & Floating Badge */}
                    <div className="relative h-56 w-full overflow-hidden bg-[#232434]">
                      <img
                        src={service.image}
                        alt={isAr ? service.titleAr : service.titleEn}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                      {/* Icon Badge Floating over Image */}
                      <div className="absolute bottom-4 start-4 w-12 h-12 bg-white group-hover:bg-[#1D8F2C] text-[#1D8F2C] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg group-hover:rotate-6">
                        <service.icon className="w-6 h-6 transition-transform" />
                      </div>
                    </div>

                    <div className="p-7">
                      <h4 className="text-xl font-extrabold text-[#232434] mb-3 font-[var(--font-display)] group-hover:text-[#1D8F2C] transition-colors">
                        <Link href={`/${locale}/services/${service.slug}`}>
                          {isAr ? service.titleAr : service.titleEn}
                        </Link>
                      </h4>

                      <p className="text-xs sm:text-sm text-[#585858] leading-relaxed font-normal">
                        {isAr ? service.descAr : service.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="px-7 pb-7">
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="inline-flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#232434] group-hover:text-[#1D8F2C] transition-colors pt-4 border-t border-neutral-100 font-[var(--font-display)]"
                    >
                      <span>{isAr ? 'تفاصيل الخدمة' : 'Read More'}</span>
                      <svg className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Floating Luxury White Card (Achievement Metrics) */}
      <section className="relative z-20 -mt-16 sm:-mt-20 lg:-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] border border-neutral-100 p-8 sm:p-10 lg:p-12 hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.16)] transition-shadow duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-neutral-100 rtl:lg:divide-x-reverse">
            {/* Stat 1: 25+ Years */}
            <ScrollReveal direction="fade" delay={0.05}>
              <div className="flex flex-col items-center text-center px-4 sm:px-6 group">
                <div className="w-13 h-13 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1D8F2C] mb-4 group-hover:bg-[#1D8F2C] group-hover:text-white transition-all duration-300 shadow-xs">
                  <AwardIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[var(--font-display)] text-[#232434] tracking-tight leading-none mb-2">
                  <CountUp value="25+" />
                </div>
                <p className="text-xs sm:text-sm uppercase tracking-wider text-[#232434] font-bold font-[var(--font-display)]">
                  {isAr ? 'عاماً خبرة بالمملكة' : 'Years in Saudi Arabia'}
                </p>
                <span className="text-[11px] text-[#585858] font-medium mt-1">
                  {isAr ? 'ريادة منذ عام 1998' : 'Pioneering Since 1998'}
                </span>
              </div>
            </ScrollReveal>

            {/* Stat 2: 55+ Projects */}
            <ScrollReveal direction="fade" delay={0.15}>
              <div className="flex flex-col items-center text-center px-4 sm:px-6 group">
                <div className="w-13 h-13 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1D8F2C] mb-4 group-hover:bg-[#1D8F2C] group-hover:text-white transition-all duration-300 shadow-xs">
                  <BuildingIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[var(--font-display)] text-[#232434] tracking-tight leading-none mb-2">
                  <CountUp value="55+" />
                </div>
                <p className="text-xs sm:text-sm uppercase tracking-wider text-[#232434] font-bold font-[var(--font-display)]">
                  {isAr ? 'مشروعاً منجزاً ومعتمداً' : 'Completed Projects'}
                </p>
                <span className="text-[11px] text-[#585858] font-medium mt-1">
                  {isAr ? 'قصور ومنشآت كبرى' : 'Royal & Mega Estates'}
                </span>
              </div>
            </ScrollReveal>

            {/* Stat 3: 35% Water Save */}
            <ScrollReveal direction="fade" delay={0.25}>
              <div className="flex flex-col items-center text-center px-4 sm:px-6 group">
                <div className="w-13 h-13 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1D8F2C] mb-4 group-hover:bg-[#1D8F2C] group-hover:text-white transition-all duration-300 shadow-xs">
                  <DropletIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[var(--font-display)] text-[#232434] tracking-tight leading-none mb-2">
                  <CountUp value="35%" />
                </div>
                <p className="text-xs sm:text-sm uppercase tracking-wider text-[#232434] font-bold font-[var(--font-display)]">
                  {isAr ? 'وفر مائي موثق' : 'Freshwater Conserved'}
                </p>
                <span className="text-[11px] text-[#585858] font-medium mt-1">
                  {isAr ? 'شبكات SCADA المؤتمتة' : 'Automated SCADA Telemetry'}
                </span>
              </div>
            </ScrollReveal>

            {/* Stat 4: 200k+ Plants */}
            <ScrollReveal direction="fade" delay={0.35}>
              <div className="flex flex-col items-center text-center px-4 sm:px-6 group">
                <div className="w-13 h-13 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1D8F2C] mb-4 group-hover:bg-[#1D8F2C] group-hover:text-white transition-all duration-300 shadow-xs">
                  <LeafIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[var(--font-display)] text-[#232434] tracking-tight leading-none mb-2">
                  <CountUp value="200k+" />
                </div>
                <p className="text-xs sm:text-sm uppercase tracking-wider text-[#232434] font-bold font-[var(--font-display)]">
                  {isAr ? 'شتلة بمشاتل الأقلمة' : 'Acclimatized Plants'}
                </p>
                <span className="text-[11px] text-[#585858] font-medium mt-1">
                  {isAr ? 'مستودع نباتي حي' : 'Native Species Nursery'}
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. Sungo Projects Showcase (Card Slider with Overlay Content) */}
      <section className="py-24 lg:py-32 bg-[#F3F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-[#1D8F2C]" />
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D8F2C] font-[var(--font-display)]">
                    {isAr ? 'مشاريعنا وسجل إنجازاتنا' : 'Our Projects'}
                  </span>
                </div>
                <AnimatedText
                  text={
                    isAr
                      ? 'نماذج من أحدث مشاريعنا المنجزة بالمملكة'
                      : 'Landmark Projects Across Saudi Arabia'
                  }
                  as="h2"
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#232434] font-[var(--font-display)] leading-tight"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', labelEn: 'All', labelAr: 'الكل' },
                  { id: 'landscape', labelEn: 'Landscaping', labelAr: 'تنسيق الحدائق' },
                  { id: 'irrigation', labelEn: 'Irrigation', labelAr: 'شبكات الري' },
                  { id: 'hardscape', labelEn: 'Hardscape', labelAr: 'الأعمال الصلبة' },
                  { id: 'sports', labelEn: 'Sports', labelAr: 'الملاعب' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider font-[var(--font-display)] transition-all cursor-pointer ${
                      activeCategory === tab.id
                        ? 'bg-[#1D8F2C] text-white'
                        : 'bg-white text-[#232434] hover:bg-neutral-200'
                    }`}
                  >
                    {isAr ? tab.labelAr : tab.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Sungo Projects Grid with Framer Motion layout animation */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj) => (
                <motion.div
                  layout
                  key={proj.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative overflow-hidden bg-[#232434] group shadow-xl aspect-[4/3] hover-lift">
                    <img
                      src={proj.image}
                      alt={isAr ? proj.titleAr : proj.titleEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#232434]/95 via-[#232434]/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Sungo Project Overlay Card */}
                    <div className="absolute inset-x-6 bottom-6 bg-white p-5 shadow-2xl flex items-center justify-between gap-4 transition-transform duration-300 group-hover:-translate-y-1 border-l-4 border-[#1D8F2C]">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1D8F2C] font-[var(--font-display)] block mb-1">
                          {isAr ? proj.locationAr : proj.locationEn} • {isAr ? proj.clientAr : proj.clientEn}
                        </span>
                        <h4 className="text-base font-extrabold text-[#232434] font-[var(--font-display)] leading-snug">
                          {isAr ? proj.titleAr : proj.titleEn}
                        </h4>
                      </div>

                      <Link
                        href={`/${locale}/projects`}
                        className="w-11 h-11 bg-[#1D8F2C] hover:bg-[#232434] text-white flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer group-hover:scale-105"
                        title={isAr ? 'عرض التفاصيل' : 'View Project'}
                      >
                        <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/projects`}
              className="theme-btn uppercase text-sm font-bold tracking-wide font-[var(--font-display)] inline-flex items-center gap-3"
            >
              <span>{isAr ? 'استعرض جدول كافة المشاريع الـ 55' : 'Explore All 55 Projects'}</span>
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Kinetic Marquee Ribbon (Unique Floating Badges with Glow) */}
      <div className="bg-[#171922] py-6 sm:py-7 overflow-hidden select-none border-y border-white/10 relative">
        {/* Left/Right Fade Masks for seamless edge blend */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#171922] via-[#171922]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#171922] via-[#171922]/80 to-transparent z-10" />

        <motion.div
          className="flex gap-4 sm:gap-6 items-center whitespace-nowrap will-change-transform"
          animate={{ x: isAr ? ['0%', '50%'] : ['0%', '-50%'] }}
          transition={{
            x: {
              duration: 35,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          style={{ direction: 'ltr' }}
        >
          {[...sustainabilityPillars, ...sustainabilityPillars].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 sm:gap-6 shrink-0">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-[#1D8F2C]/15 border border-white/10 hover:border-[#1D8F2C]/40 transition-all duration-300 group shadow-sm cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#1D8F2C] shrink-0 animate-pulse-glow" />
                <span className="text-white text-sm sm:text-base font-bold font-[var(--font-display)] tracking-wide group-hover:text-[#4CAF50] transition-colors">
                  {isAr ? item.ar : item.en}
                </span>
                <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 group-hover:bg-[#1D8F2C]/30 group-hover:text-white transition-colors">
                  {isAr ? item.tagAr : item.tagEn}
                </span>
              </div>
              <span className="text-[#1D8F2C] text-sm select-none opacity-60">✦</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 9. Sungo Testimonials Section (Split Card Dark Style) */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-3 h-3 bg-[#1D8F2C]" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D8F2C] font-[var(--font-display)]">
                  {isAr ? 'آراء العملاء والشركاء' : 'Testimonials'}
                </span>
              </div>
              <AnimatedText
                text={
                  isAr
                    ? 'ماذا يقول عملاؤنا عن جودة أعمالنا'
                    : 'What Our Clients Say About Us'
                }
                as="h2"
                className="text-3xl sm:text-4xl font-extrabold text-[#232434] font-[var(--font-display)]"
              />
            </div>
          </SectionReveal>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="p-8 sm:p-10 bg-[#F3F7FB] border-l-4 border-[#1D8F2C] shadow-sm hover-lift flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#F59E0B] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-[#585858] leading-relaxed italic mb-6">
                    {isAr
                      ? '«نفذت شركة جرين سلوشن أعمال المسطحات وشبكات الري الذكية في قصر أبحر الملكي بكفاءة غير مسبوقة، وكانت مطابقة تماماً للمواصفات الصارمة مع التزام فائق بجدول التسليم.»'
                      : '"Green Solution executed the presidential palace grounds and telemetry irrigation with unprecedented precision, fully adhering to rigorous specifications and delivery deadlines."'}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <h5 className="text-base font-extrabold text-[#232434] font-[var(--font-display)]">
                    {isAr ? 'إدارة المشاريع — شركة النوادر السعودية' : 'Project Directorate — Saudi Rare Co.'}
                  </h5>
                  <span className="text-xs text-[#1D8F2C] font-semibold">
                    {isAr ? 'مشروع قصر أبحر الملكي، جدة' : 'Obhur Presidential Palace Project, Jeddah'}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="p-8 sm:p-10 bg-[#F3F7FB] border-l-4 border-[#1D8F2C] shadow-sm hover-lift flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#F59E0B] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-[#585858] leading-relaxed italic mb-6">
                    {isAr
                      ? '«أنظمة الري الأوتوماتيكية المركزية وفرت أكثر من 30% من استهلاك المياه في الحرم الجامعي، وفريق المهندسين المقيم على أهبة الاستعداد دائماً للمتابعة الدورية والصيانة.»'
                      : '"The automated central irrigation networks conserved more than 30% water across the university campus, with an exemplary on-site engineering support team."'}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <h5 className="text-base font-extrabold text-[#232434] font-[var(--font-display)]">
                    {isAr ? 'الإدارة العامة للمشاريع والصيانة' : 'Department of Projects & Maintenance'}
                  </h5>
                  <span className="text-xs text-[#1D8F2C] font-semibold">
                    {isAr ? 'جامعة الملك عبدالعزيز، جدة' : 'King Abdulaziz University, Jeddah'}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 10. Sungo FAQ Section (2-Col Image + Accordion) */}
      <section className="py-24 lg:py-32 bg-[#F3F7FB] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Col (5 cols): Sungo FAQ illustration image */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="left" duration={0.8}>
                <div className="relative">
                  <div className="overflow-hidden bg-[#232434] shadow-2xl group">
                    <img
                      src="/img/sungo/faq/faq.jpg"
                      alt={isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                      className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-[#1D8F2C] text-white p-6 shadow-2xl hidden sm:block float-bob-y">
                    <span className="text-2xl font-extrabold font-[var(--font-display)] block">
                      <CountUp value="100%" />
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold">
                      {isAr ? 'معتمد وفق الكود السعودي' : 'SBC Certified'}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Col (7 cols): FAQ Accordion */}
            <div className="lg:col-span-7 space-y-4">
              <ScrollReveal direction="right" duration={0.8} delay={0.15}>
                <div>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 bg-[#1D8F2C]" />
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1D8F2C] font-[var(--font-display)]">
                      {isAr ? 'الأسئلة الشائعة' : 'See Our FAQs'}
                    </span>
                  </div>
                  <AnimatedText
                    text={
                      isAr
                        ? 'إجابات عن استفساراتكم الهندسية والبستانية'
                        : 'Frequently Asked Questions'
                    }
                    as="h2"
                    className="text-3xl sm:text-4xl font-extrabold text-[#232434] font-[var(--font-display)] mb-6"
                  />
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={idx} className="bg-white border-s-4 border-[#1D8F2C] transition-all shadow-sm">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full p-5 text-start font-bold text-[#232434] hover:text-[#1D8F2C] flex items-center justify-between gap-4 font-[var(--font-display)] text-sm sm:text-base cursor-pointer"
                        >
                          <span>{isAr ? faq.qAr : faq.qEn}</span>
                          <span className={`w-8 h-8 rounded-full bg-[#F3F7FB] flex items-center justify-center shrink-0 text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#1D8F2C] text-white' : ''}`}>
                            ▼
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 text-xs sm:text-sm text-[#585858] leading-relaxed border-t border-neutral-100 pt-3">
                                {isAr ? faq.aAr : faq.aEn}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Sungo Floating CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="zoom" duration={0.8}>
            <div
              className="bg-[#1D8F2C] p-8 sm:p-14 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 hover-lift"
              style={{ backgroundImage: "url('/img/sungo/cta-mask.png')" }}
            >
              <div className="space-y-2 text-center md:text-start text-white relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-white/80 font-[var(--font-display)] block">
                  {isAr ? 'استشارة هندسية ودراسة فنية مجانية' : 'Consultancy & BoQ Estimation'}
                </span>
                <AnimatedText
                  text={
                    isAr
                      ? 'هل تحتاج إلى استشارة لمشروعك في المملكة؟'
                      : 'Get Free Engineering Consultancy?'
                  }
                  as="h3"
                  className="text-2xl sm:text-4xl font-extrabold font-[var(--font-display)] text-white"
                />
                <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                  {isAr
                    ? 'مهندسونا مستعدون لمعاينة الموقع ومراجعة المخططات وتقديم عرض سعر وجدول كميات مفصل.'
                    : 'Our senior agronomists and hydraulic engineers will review your drawings and provide a stamped BoQ.'}
                </p>
              </div>

              <button
                onClick={() => setIsQuoteOpen(true)}
                className="px-9 py-4 bg-white text-[#232434] hover:bg-[#232434] hover:text-white font-extrabold text-sm uppercase tracking-wide transition-all shadow-xl font-[var(--font-display)] cursor-pointer shrink-0 relative z-10 flex items-center gap-3 hover:scale-105"
              >
                <span>{isAr ? 'طلب عرض سعر الآن' : 'Get A Quote'}</span>
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
      <QuotePopup isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
