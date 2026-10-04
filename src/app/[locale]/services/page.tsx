import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import ServicesExplorer from '@/components/ServicesExplorer';
import { servicesData, ServiceItem } from '@/data/services';
import { getCmsServices, getSiteSeo, DbCmsService } from '@/lib/sqlite';
import { isPostgresConfigured, pgGetCmsServices } from '@/lib/postgres';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const seo = getSiteSeo('services');

  if (seo) {
    return {
      title: isAr ? seo.titleAr : seo.titleEn,
      description: isAr ? seo.descAr : seo.descEn,
      keywords: isAr ? seo.keywordsAr : seo.keywordsEn,
      alternates: {
        canonical: seo.canonicalUrl || `https://greensolutionksa.com/${locale}/services`,
      },
      openGraph: {
        title: isAr ? seo.titleAr : seo.titleEn,
        description: isAr ? seo.descAr : seo.descEn,
        images: [{ url: seo.ogImage || '/img/service-1.jpg' }],
      },
    };
  }

  return {
    title: isAr
      ? 'الأقسام والخدمات الهندسية | شركة جرين سلوشن السعودية'
      : 'Engineering Divisions & Services | Green Solution KSA',
    description: isAr
      ? 'استكشف 13 تخصصاً هندسياً وتنفيذياً في تخطيط وتنسيق المناظر الطبيعية، شبكات الري الذكية، الهاردسكيب المعماري، والمسطحات الخضراء في المملكة العربية السعودية.'
      : 'Explore 13 specialized engineering disciplines in landscape architecture, smart hydraulic networks, architectural hardscape, and sustainable living green across Saudi Arabia.',
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  let dbServices: DbCmsService[] = [];
  try {
    if (isPostgresConfigured()) {
      dbServices = await pgGetCmsServices();
    } else {
      dbServices = getCmsServices();
    }
  } catch (err) {
    console.error('Error fetching dynamic services on services page:', err);
    try {
      dbServices = getCmsServices();
    } catch {
      dbServices = [];
    }
  }

  const services: ServiceItem[] =
    dbServices.length > 0
      ? dbServices.map((s) => ({
          slug: s.slug,
          category: s.category as any,
          divisionCode: s.divisionCode,
          image: s.image,
          titleEn: s.titleEn,
          titleAr: s.titleAr,
          shortDescEn: s.shortDescEn,
          shortDescAr: s.shortDescAr,
          fullDescEn: s.fullDescEn,
          fullDescAr: s.fullDescAr,
          featuresEn: s.featuresEn,
          featuresAr: s.featuresAr,
          deliverablesEn: s.deliverablesEn,
          deliverablesAr: s.deliverablesAr,
        }))
      : servicesData;

  const categoryLabels: Record<string, { en: string; ar: string }> = {
    'design-planning': { en: 'Master Planning & Design', ar: 'التصميم والتخطيط' },
    'hardscape-structures': { en: 'Hardscape & Structures', ar: 'الهاردسكيب والإنشاءات' },
    'living-green': { en: 'Living Green & Cultivation', ar: 'المسطحات والزراعة' },
    'water-irrigation': { en: 'Smart Hydraulics & Water', ar: 'أنظمة الري والمياه' },
    'protection-services': { en: 'Agronomy & Maintenance', ar: 'الصيانة وإدارة المسطحات' },
  };

  const standards = [
    {
      num: '01',
      titleEn: 'Smart SCADA Hydraulics',
      titleAr: 'هيدروليكا ذكية وتحكم SCADA',
      descEn: 'Rain Bird central satellites and weather telemetry conserving 35%+ water.',
      descAr: 'تحكم مركزي بمحطات الأرصاد يحقق وفراً مائياً موثقاً يتجاوز 35%.',
    },
    {
      num: '02',
      titleEn: 'SBC 02-L Compliance',
      titleAr: 'مطابقة كود البناء السعودي',
      descEn: 'Rigorous 95%+ Proctor compaction and certified thermal joints.',
      descAr: 'دمك بروكتر 95%+ مع فواصل تمدد حراري لأعلى قدرات تحمل الأحمال.',
    },
    {
      num: '03',
      titleEn: 'Acclimatized Nursery Stock',
      titleAr: 'مشاتل مؤقلمة ومضمونة',
      descEn: '200,000+ native plants and date palms conditioned for 50°C+ heat.',
      descAr: 'نخيل معمر ونباتات صحراوية مؤقلمة لتحمل حرارة تتجاوز 50 درجة.',
    },
    {
      num: '04',
      titleEn: 'MEWA-Certified IPM',
      titleAr: 'إدارة آفات معتمدة من الوزارة',
      descEn: 'Stem micro-injections protecting palms from Red Palm Weevil.',
      descAr: 'بروتوكولات حقن جذعي بيئية لحماية النخيل من سوسة النخيل الحمراء.',
    },
  ];

  return (
    <PageShell>
      {/* 1. ULTRA SLEEK HERO HEADER */}
      <PageHero
        badge={{
          en: '13 Specialized Divisions',
          ar: '13 تخصصاً هندسياً وتنفيذياً',
        }}
        title={{
          en: 'Landscaping & Smart Irrigation',
          ar: 'خدمات اللاندسكيب والري الذكي',
        }}
        subtitle={{
          en: 'Precision engineering, sustainable green spaces, and smart water systems across Saudi Arabia.',
          ar: 'هندسة معمارية متطورة، مسطحات خضراء مستدامة، وأنظمة ري ذكية بمختلف مناطق المملكة.',
        }}
        breadcrumbs={[
          {
            labelEn: 'Services',
            labelAr: 'خدماتنا',
          },
        ]}
        stats={[
          {
            value: '13',
            labelEn: 'Divisions',
            labelAr: 'تخصصاً هندسياً',
          },
          {
            value: 'SBC',
            labelEn: 'Code Compliant',
            labelAr: 'مطابق للكود',
          },
          {
            value: '35%+',
            labelEn: 'Water Conserved',
            labelAr: 'وفر مائي موثق',
          },
        ]}
        backgroundImage="/img/service-1.jpg"
      />

      {/* 2. INTERACTIVE SERVICES EXPLORER */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <ServicesExplorer
              services={services}
              locale={locale}
              isAr={isAr}
              categoryLabels={categoryLabels}
            />
          </SectionReveal>
        </div>
      </section>

      {/* 3. TECHNICAL STANDARDS — CLEAN MINIMAL CARDS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3 border-l-2 border-[#1D8F2C]">
                <span>{isAr ? 'الجودة والمعايير' : 'Technical Rigor'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'معايير تنفيذية ترتقي بالمشاريع' : 'Engineering Foundations That Set Us Apart'}
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-none bg-[#F3F7FB] border-t-2 border-[#1D8F2C] hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[#1D8F2C] mb-3 block font-mono">
                    {s.num}
                  </span>
                  <h3 className="text-base font-bold text-[#232434] mb-2 font-[var(--font-display)]">
                    {isAr ? s.titleAr : s.titleEn}
                  </h3>
                  <p className="text-xs text-[#585858] leading-relaxed">
                    {isAr ? s.descAr : s.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STREAMLINED CTA BANNER */}
      <section className="py-16 bg-[#F3F7FB]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232434] mb-3 font-[var(--font-display)]">
            {isAr ? 'هل تحتاج إلى دراسة فنية أو تسعير لمشروعك؟' : 'Need a Technical Proposal or BoQ Pricing?'}
          </h2>
          <p className="text-sm text-[#585858] mb-8 max-w-xl mx-auto">
            {isAr
              ? 'فريقنا الهندسي جاهز لمعاينة الموقع ومراجعة المخططات وتقديم حلول مخصصة.'
              : 'Our licensed engineers are ready to review your architectural plans and schedule a site survey.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="px-7 py-3 rounded-none bg-[#1D8F2C] text-white text-sm font-bold shadow-sm hover:bg-[#167423] transition-colors uppercase tracking-wider"
            >
              {isAr ? 'طلب معاينة الموقع' : 'Request Site Survey'}
            </Link>
            <Link
              href={`/${locale}/projects`}
              className="px-7 py-3 rounded-none bg-white text-[#232434] text-sm font-bold shadow-sm hover:bg-neutral-100 transition-colors uppercase tracking-wider"
            >
              {isAr ? 'استعراض المشاريع المنجزة' : 'View Completed Projects'}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
