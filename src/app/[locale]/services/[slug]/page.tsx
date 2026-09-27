import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import AnimatedText from '@/components/AnimatedText';
import { servicesData, getServiceBySlug } from '@/data/services';
import { serviceVisualMap } from '@/components/ServicesExplorer';
import { routing } from '@/i18n/routing';
import { getCmsServiceBySlug } from '@/lib/sqlite';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const service of servicesData) {
      params.push({ locale, slug: service.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isAr = locale === 'ar';

  const cmsService = getCmsServiceBySlug(slug);
  if (cmsService) {
    const title = isAr
      ? (cmsService.metaTitleAr || cmsService.titleAr)
      : (cmsService.metaTitleEn || cmsService.titleEn);
    const desc = isAr
      ? (cmsService.metaDescAr || cmsService.shortDescAr)
      : (cmsService.metaDescEn || cmsService.shortDescEn);
    return {
      title: `${title} | Green Solution KSA`,
      description: desc,
      keywords: cmsService.keywords,
      alternates: {
        canonical: `https://greensolutionksa.com/${locale}/services/${slug}`,
      },
      openGraph: {
        title,
        description: desc,
        images: [{ url: cmsService.image || '/images/hero-2.webp' }],
      },
    };
  }

  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: isAr
      ? `${service.titleAr} | جرين سلوشن السعودية`
      : `${service.titleEn} | Green Solution KSA`,
    description: isAr ? service.shortDescAr : service.shortDescEn,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cmsService = getCmsServiceBySlug(slug);
  const baseService = getServiceBySlug(slug);

  if (!cmsService && !baseService) {
    notFound();
  }

  const service = cmsService
    ? {
        slug: cmsService.slug,
        category: cmsService.category as any,
        titleEn: cmsService.titleEn,
        titleAr: cmsService.titleAr,
        shortDescEn: cmsService.shortDescEn,
        shortDescAr: cmsService.shortDescAr,
        fullDescEn: cmsService.fullDescEn,
        fullDescAr: cmsService.fullDescAr,
        featuresEn: cmsService.featuresEn,
        featuresAr: cmsService.featuresAr,
        deliverablesEn: cmsService.deliverablesEn,
        deliverablesAr: cmsService.deliverablesAr,
      }
    : baseService!;

  const isAr = locale === 'ar';
  const allServices = servicesData;

  const visual = {
    image: cmsService?.image || serviceVisualMap[service.slug]?.image || '/img/services/landscape-design.jpg',
    divisionCode: cmsService?.divisionCode || serviceVisualMap[service.slug]?.divisionCode || 'DIV 01',
  };

  return (
    <PageShell defaultService={service.slug}>
      {/* 1. ULTRA SLEEK HERO HEADER */}
      <PageHero
        badge={{
          en: `${visual.divisionCode} • Certified Division`,
          ar: `${visual.divisionCode} • قسم هندسي معتمد`,
        }}
        title={{
          en: service.titleEn,
          ar: service.titleAr,
        }}
        subtitle={{
          en: service.shortDescEn,
          ar: service.shortDescAr,
        }}
        breadcrumbs={[
          {
            labelEn: 'Services',
            labelAr: 'خدماتنا',
            href: `/${locale}/services`,
          },
          {
            labelEn: service.titleEn,
            labelAr: service.titleAr,
          },
        ]}
        stats={[
          {
            value: visual.divisionCode,
            labelEn: 'Specialty Code',
            labelAr: 'رمز التخصص',
          },
          {
            value: 'SBC',
            labelEn: 'Code Compliant',
            labelAr: 'مطابق للكود',
          },
          {
            value: 'Turnkey',
            labelEn: 'EPC Delivery',
            labelAr: 'تسليم مفتاح',
          },
        ]}
        backgroundImage={visual.image}
      />

      {/* 2. MAIN 2-COLUMN SERVICE DETAILS SECTION (SUNGO service-details.html layout) */}
      <section className="py-20 sm:py-24 bg-[#F3F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* SIDEBAR: All Services, Working Hours, Need Help? Card (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
              
              {/* Widget 1: All Services Navigation List */}
              <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm">
                <h3 className="text-xl font-bold text-[#232434] pb-4 mb-6 border-b border-neutral-200 font-[var(--font-display)] relative after:content-[''] after:absolute after:bottom-[-1px] after:start-0 after:w-12 after:h-0.5 after:bg-[#1D8F2C]">
                  {isAr ? 'كافة الخدمات الهندسية' : 'All Services'}
                </h3>
                <ul className="space-y-2">
                  {allServices.map((item) => {
                    const isActive = item.slug === service.slug;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/${locale}/services/${item.slug}`}
                          className={`flex items-center justify-between p-3.5 transition-all text-sm font-semibold border ${
                            isActive
                              ? 'bg-[#1D8F2C] text-white border-[#1D8F2C]'
                              : 'bg-[#F3F7FB] text-[#232434] border-neutral-200/80 hover:bg-[#1D8F2C] hover:text-white hover:border-[#1D8F2C]'
                          }`}
                        >
                          <span className="truncate">{isAr ? item.titleAr : item.titleEn}</span>
                          <span className="text-xs transition-transform transform group-hover:translate-x-1">
                            {isAr ? '←' : '→'}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Widget 2: Working Hours */}
              <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm">
                <h3 className="text-xl font-bold text-[#232434] pb-4 mb-6 border-b border-neutral-200 font-[var(--font-display)] relative after:content-[''] after:absolute after:bottom-[-1px] after:start-0 after:w-12 after:h-0.5 after:bg-[#1D8F2C]">
                  {isAr ? 'أوقات العمل والمعاينات' : 'Working Hours'}
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm text-[#585858]">
                  <li className="flex items-center justify-between py-2 border-b border-neutral-100">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-[#1D8F2C]">🕒</span>
                      {isAr ? 'السبت – الخميس' : 'Sat – Thu:'}
                    </span>
                    <span className="font-bold text-[#232434]">08:00 AM – 06:00 PM</span>
                  </li>
                  <li className="flex items-center justify-between py-2 border-b border-neutral-100">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-[#1D8F2C]">🕒</span>
                      {isAr ? 'يوم الجمعة' : 'Friday:'}
                    </span>
                    <span className="font-bold text-neutral-400">{isAr ? 'مغلق (طوارئ فقط)' : 'Closed'}</span>
                  </li>
                  <li className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-[#1D8F2C]">⚡</span>
                      {isAr ? 'فرق الطوارئ والصيانة' : 'Emergency SLAs:'}
                    </span>
                    <span className="font-bold text-[#1D8F2C]">{isAr ? '24/7 على مدار الساعة' : '24 Hours'}</span>
                  </li>
                </ul>
              </div>

              {/* Widget 3: Need Help? Call Here Card (Sungo Sidebar Image) */}
              <div
                className="relative p-8 text-white overflow-hidden bg-cover bg-center border border-neutral-800"
                style={{ backgroundImage: "url('/img/sungo/service/details-1.jpg')" }}
              >
                <div className="absolute inset-0 bg-[#1E202B]/90" />
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#1D8F2C] flex items-center justify-center text-white text-2xl shadow-lg">
                    📞
                  </div>
                  <h4 className="text-xl font-bold font-[var(--font-display)] text-white">
                    {isAr ? 'هل تحتاج إلى استشارة هندسية؟' : 'Need Help? Call Here'}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {isAr
                      ? 'تواصل مباشرة مع المهندس المشرف لمناقشة مخططاتكم ومعاينة الموقع.'
                      : 'Speak directly with our senior agronomy & irrigation engineering team.'}
                  </p>
                  <a
                    href="tel:+966595998808"
                    className="block text-xl sm:text-2xl font-black text-[#1D8F2C] hover:text-white transition-colors font-mono"
                  >
                    +966 59 599 8808
                  </a>
                  <div className="pt-2">
                    <a
                      href="https://wa.me/966595998808"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      <span>{isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* MAIN COLUMN: Visuals, Overview, Benefits, Deliverables, FAQs (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-10 order-1 lg:order-2">
              
              {/* Featured Showcase Photo */}
              <div className="relative h-72 sm:h-[420px] w-full overflow-hidden bg-[#232434] shadow-sm border border-neutral-200">
                <Image
                  src={visual.image}
                  alt={isAr ? service.titleAr : service.titleEn}
                  fill
                  sizes="(max-width: 1024px) 100vw, 850px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 start-6 end-6 flex items-center justify-between text-white text-xs">
                  <span className="font-mono bg-[#1D8F2C] px-3.5 py-1 text-white font-bold tracking-wider">
                    {visual.divisionCode}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 text-white font-semibold">
                    {isAr ? 'تنفيذ مطابق للمعايير الهندسية SBC' : 'SBC & Saudi Standards Compliant'}
                  </span>
                </div>
              </div>

              {/* Service Overview & Methodology */}
              <div className="bg-white p-6 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
                <span className="text-[#1D8F2C] text-xs font-bold tracking-widest uppercase block font-[var(--font-display)]">
                  {isAr ? 'المنهجية الفنية والمعايير' : 'Methodology & Engineering Standard'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232434] font-[var(--font-display)] leading-tight">
                  {isAr ? service.titleAr : service.titleEn}
                </h2>
                <p className="text-[#585858] leading-relaxed text-base sm:text-lg whitespace-pre-line">
                  {isAr ? service.fullDescAr : service.fullDescEn}
                </p>

                {/* Sungo Video / Benefits Highlight Box */}
                <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#F3F7FB] p-6 border border-neutral-200 items-center">
                  <div className="md:col-span-5 relative h-48 bg-[#1E202B] overflow-hidden border border-neutral-300">
                    <img
                      src="/img/sungo/service/details-2.jpg"
                      alt="Service benefit"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-[#1D8F2C] text-white flex items-center justify-center text-lg shadow-md">
                        ▶
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-7 space-y-3">
                    <h4 className="text-lg font-bold text-[#232434] font-[var(--font-display)]">
                      {isAr ? 'مزايا التعاقد المباشر معنا' : 'Key Advantages & Guarantees'}
                    </h4>
                    <p className="text-xs text-[#585858]">
                      {isAr
                        ? 'نضمن أعلى كفاءة تشغيلية وتوفير موثق للمياه مطابق لمبادرة السعودية الخضراء.'
                        : 'Certified EPC handover with verified water savings and complete municipal compliance.'}
                    </p>
                    <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-[#232434]">
                      <li className="flex items-center gap-2">
                        <span className="text-[#1D8F2C] font-bold">✓</span>
                        {isAr ? 'ضمان رسمي على شبكات الري والنباتات' : 'Certified SLA & Plant Acclimatization Warranty'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#1D8F2C] font-bold">✓</span>
                        {isAr ? 'مخططات تنفيذية 3D وCAD مطابقة لـ SBC' : '3D Renders & SBC Compliant CAD Schematics'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#1D8F2C] font-bold">✓</span>
                        {isAr ? 'توريد من مشاتلنا المتخصصة بجدة' : 'Direct Supply From Our Jeddah Commercial Nurseries'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* What We Deliver (Features Grid) */}
              <div className="bg-white p-6 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#232434] font-[var(--font-display)]">
                  {isAr ? 'نطاق الأعمال ومخرجات التنفيذ' : 'What We Deliver & Field Scope'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(isAr ? service.featuresAr : service.featuresEn).map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#F3F7FB] border border-neutral-200 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 bg-[#1D8F2C] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#232434] leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Handover Deliverables */}
              <div className="bg-white p-6 sm:p-10 border border-neutral-200 shadow-sm space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#232434] font-[var(--font-display)]">
                  {isAr ? 'الوثائق الفنية والمخططات المسلمة' : 'Technical Handover Deliverables'}
                </h3>
                <div className="space-y-3">
                  {(isAr ? service.deliverablesAr : service.deliverablesEn).map((del, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#F3F7FB] border-s-4 border-[#1D8F2C]">
                      <span className="text-xs sm:text-sm text-[#232434] font-medium leading-relaxed">
                        {del}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Fast Action Banner */}
              <div className="bg-[#232434] p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl font-bold font-[var(--font-display)] text-white mb-2">
                    {isAr ? 'جاهزون لمراجعة مخططاتكم وتسعير مشروعكم' : 'Ready to Review Your Plans & Tender BoQ?'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {isAr
                      ? 'مهندسونا الاستشاريون يقدمون دراسات الجدوى الهيدروليكية والمعاينة الميدانية خلال 24 ساعة.'
                      : 'Our estimators and chief agronomists review drawings and provide initial surveys within 24 hours.'}
                  </p>
                </div>
                <Link
                  href={`/${locale}/contact?service=${service.slug}`}
                  className="theme-btn shrink-0"
                >
                  <span>
                    {isAr ? 'طلب عرض سعر فوري' : 'Get A Quote'}
                    <i className="fa-solid fa-arrow-right-long ms-2">→</i>
                  </span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>
    </PageShell>
  );
}
