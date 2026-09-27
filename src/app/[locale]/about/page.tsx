import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedText from '@/components/AnimatedText';
import CountUp from '@/components/CountUp';
import ClientMarquee from '@/components/ClientMarquee';
import { getSiteSeo } from '@/lib/sqlite';
import {
  LeafIcon,
  DropletIcon,
  ColumnsIcon,
  HandshakeIcon,
  CheckIcon,
} from '@/components/icons/SiteIcons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const seo = getSiteSeo('about');

  if (seo) {
    return {
      title: isAr ? seo.titleAr : seo.titleEn,
      description: isAr ? seo.descAr : seo.descEn,
      keywords: isAr ? seo.keywordsAr : seo.keywordsEn,
      alternates: {
        canonical: seo.canonicalUrl || `https://greensolutionksa.com/${locale}/about`,
      },
      openGraph: {
        title: isAr ? seo.titleAr : seo.titleEn,
        description: isAr ? seo.descAr : seo.descEn,
        images: [{ url: seo.ogImage || '/img/why-nursery.jpg' }],
      },
    };
  }

  return {
    title: isAr
      ? 'من نحن — شركة جرين سلوشن السعودية | مقاولات اللاندسكيب وشبكات الري'
      : 'About Us | Green Solution Co. Saudi Arabia — Landscape & Irrigation Engineering',
    description: isAr
      ? 'تعرف على شركة جرين سلوشن — أكثر من 25 عاماً من الخبرة البستانية والهندسية بالمملكة، شركاء القصور الملكية والوزارات والجامعات السعودية.'
      : 'Learn about Green Solution Co. — 25+ years of international horticultural engineering experience, delivering sustainable landscape solutions across Saudi Arabia.',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  const milestones = [
    {
      year: '1999',
      titleEn: 'Botanical Inception',
      titleAr: 'انطلاقة المشاتل والأبحاث',
      descEn: 'Established specialized acclimatization nursery in Jeddah for arid flora.',
      descAr: 'تأسيس مشاتل متخصصة بجدة لإكثار وأقلمة النباتات المتحملة للجفاف والملوحة.',
    },
    {
      year: '2008',
      titleEn: 'Royal & Diplomatic Estates',
      titleAr: 'مشاريع القصور والمقرات الدبلوماسية',
      descEn: 'Turnkey landscape architecture for Obhur waterfront estates and Riyadh residences.',
      descAr: 'تنفيذ مشاريع لاندسكيب متكاملة لقصور أبحر البحرية والمقرات الخاصة بالرياض.',
    },
    {
      year: '2016',
      titleEn: 'FIFA Stadium Turf Management',
      titleAr: 'ملاعب الجوهرة ومعايير فيفا',
      descEn: 'Turf engineering at King Abdullah Sports City meeting international standards.',
      descAr: 'إدارة وتطوير مسطحات مدينة الملك عبدالله الرياضية وفق معايير الفيفا.',
    },
    {
      year: '2024+',
      titleEn: 'Vision 2030 Transformation',
      titleAr: 'مبادرة السعودية الخضراء ورؤية 2030',
      descEn: 'SCADA water conservation and biophilic living systems for mega developments.',
      descAr: 'تطبيق أنظمة التحكم الهيدروليكي الذكية والحدائق الرأسية للمشاريع الكبرى.',
    },
  ];

  const teamMembers = [
    {
      nameEn: 'Eng. Ch. Hameed',
      nameAr: 'م. عبدالحميد تشودري',
      roleEn: 'Managing Director & Lead Agronomist',
      roleAr: 'المدير العام وكبير الاستشاريين',
      image: '/img/team-1.jpg',
      exp: isAr ? '25+ عاماً بالمملكة' : '25+ Years in KSA',
      badge: isAr ? 'الهيئة السعودية للمهندسين' : 'SCE Senior Member',
    },
    {
      nameEn: 'Arch. Tariq Mansour',
      nameAr: 'م. طارق منصور',
      roleEn: 'Senior Landscape Architect',
      roleAr: 'رئيس قسم التصميم المعماري',
      image: '/img/team-2.jpg',
      exp: isAr ? '16+ عاماً في التخطيط' : '16+ Years in Masterplanning',
      badge: isAr ? 'معماري معتمد — SBC' : 'Certified BIM Architect',
    },
    {
      nameEn: 'Eng. Fahad Al-Ghamdi',
      nameAr: 'م. فهد الغامدي',
      roleEn: 'Smart Irrigation Specialist',
      roleAr: 'مهندس أول شبكات الري والتحكم',
      image: '/img/team-3.jpg',
      exp: isAr ? '14+ عاماً في الهيدروليكا' : '14+ Years in Hydraulics',
      badge: isAr ? 'خبير SCADA معتمد' : 'SCADA Certified Specialist',
    },
  ];

  const pillars = [
    {
      icon: <LeafIcon className="w-5 h-5 text-[#1D8F2C]" />,
      titleEn: 'Botanical Science',
      titleAr: 'علوم بستانية مؤقلمة',
      descEn: 'Proprietary nursery with 200,000+ drought-tolerant native plants and palms.',
      descAr: 'مشاتل متخصصة تضم أكثر من 200,000 شتلة ونخلة مؤقلمة للبيئة الصحراوية.',
    },
    {
      icon: <DropletIcon className="w-5 h-5 text-[#1D8F2C]" />,
      titleEn: 'Smart SCADA Telemetry',
      titleAr: 'ري ذكي موفر للمياه',
      descEn: 'Weather-adaptive automated systems conserving over 35% of fresh water.',
      descAr: 'شبكات تحكم مرتبطة بالأرصاد الجوية توفر أكثر من 35% من استهلاك المياه.',
    },
    {
      icon: <ColumnsIcon className="w-5 h-5 text-[#1D8F2C]" />,
      titleEn: 'SBC Code Compliance',
      titleAr: 'مطابقة كود البناء السعودي',
      descEn: 'Hardscape and load engineering certified to SBC 02-L standards.',
      descAr: 'تنفيذ هندسي مطابق لاشتراطات SBC 02-L للأحمال الإنشائية وفواصل التمدد.',
    },
    {
      icon: <HandshakeIcon className="w-5 h-5 text-[#1D8F2C]" />,
      titleEn: 'Turnkey EPC & SLAs',
      titleAr: 'تسليم تسليم مفتاح وعقود صيانة',
      descEn: 'Full responsibility from 3D concept to municipality permits and ongoing maintenance.',
      descAr: 'مسؤولية متكاملة تبدأ من المخططات والتراخيص وحتى التنفيذ والصيانة الوقائية.',
    },
  ];

  const sgiGoals = [
    {
      number: '01',
      titleEn: 'Water Conservation',
      titleAr: 'ترشيد استهلاك المياه',
      descEn: 'Subsurface drip networks saving 35%+ water across all projects.',
      descAr: 'شبكات ري تحت سطحية متطورة توفر 35%+ من المياه.',
      kpi: isAr ? 'وفر 35%+' : '35%+ Saved',
    },
    {
      number: '02',
      titleEn: 'Urban Microclimate Cooling',
      titleAr: 'خفض درجات الحرارة المحسوسة',
      descEn: 'Bioclimatic shade and canopy designs lowering perceived heat by up to 12°C.',
      descAr: 'أشجار ومظلات بيومناخية تخفض درجات الحرارة المحسوسة حتى 12° مئوية.',
      kpi: isAr ? 'تبريد 8-12°C' : '8-12°C Cooler',
    },
    {
      number: '03',
      titleEn: 'Flora & Palm Protection',
      titleAr: 'حماية النخيل والنباتات المحلية',
      descEn: 'Integrated pest management protecting heritage date palms.',
      descAr: 'بروتوكولات وقائية لحماية النخيل المعمر من سوسة النخيل الحمراء.',
      kpi: isAr ? 'حماية 100%' : '100% Protected',
    },
  ];

  const trustBadgesList = [
    isAr ? 'السجل التجاري (CR) — نشط ومعتمد' : 'Commercial Registration (CR) — Active',
    isAr ? 'شهادة هيئة الزكاة والضريبة والجمارك (ZATCA)' : 'ZATCA VAT Certificate',
    isAr ? 'التأمينات الاجتماعية (GOSI) — سارية' : 'GOSI Social Insurance Compliance',
    isAr ? 'شهادة التوطين — النطاق الأخضر' : 'Nationalization — Green Nitaqat',
    isAr ? 'عضوية الغرفة التجارية' : 'Chamber of Commerce Membership',
  ];

  return (
    <PageShell>
      {/* 1. SOLID ARCHITECTURAL HERO HEADER */}
      <PageHero
        badge={{
          en: '25+ Years of Excellence',
          ar: 'أكثر من 25 عاماً من التميز',
        }}
        title={{
          en: 'Pioneering Green Living in Saudi Arabia',
          ar: 'رواد الطبيعة المستدامة في المملكة',
        }}
        subtitle={{
          en: 'Engineering sustainable landscapes and smart irrigation systems, trusted by royal estates and premier institutions.',
          ar: 'أكثر من 25 عاماً من الابتكار في تصميم وتنفيذ أرقى المساحات الخضراء وشبكات الري بالمملكة.',
        }}
        breadcrumbs={[
          {
            labelEn: 'About Us',
            labelAr: 'من نحن',
          },
        ]}
        stats={[
          {
            value: '25+',
            labelEn: 'Years in KSA',
            labelAr: 'عاماً بالمملكة',
          },
          {
            value: '55+',
            labelEn: 'Major Projects',
            labelAr: 'مشروعاً منجزاً',
          },
          {
            value: '35%+',
            labelEn: 'Water Conserved',
            labelAr: 'وفر مائي موثق',
          },
        ]}
        backgroundImage="/img/about.jpg"
      />

      {/* 2. OUR STORY — SOLID ARCHITECTURAL COMPOSITION */}
      <section className="py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column (6 cols) */}
            <div className="lg:col-span-6 relative">
              <ScrollReveal direction="left" duration={0.8}>
                <div className="relative">
                  <div className="relative overflow-hidden rounded-none shadow-xl group bg-neutral-900">
                    <img
                      src="/img/about.jpg"
                      alt={isAr ? 'عن شركة جرين سلوشن' : 'About Green Solution KSA'}
                      className="w-full h-[420px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Overlapping Nursery Inset */}
                  <div
                    className={`hidden sm:block absolute -bottom-8 ${
                      isAr ? '-left-6' : '-right-6'
                    } w-56 h-56 rounded-none border-8 border-white shadow-2xl overflow-hidden group`}
                  >
                    <img
                      src="/img/why-nursery.jpg"
                      alt={isAr ? 'مشاتل الأقلمة' : 'Acclimatization Facility'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Solid Stat Badge */}
                  <div
                    className={`absolute -top-5 ${
                      isAr ? '-right-4' : '-left-4'
                    } bg-[#1D8F2C] text-white p-5 rounded-none shadow-xl flex items-center gap-4`}
                  >
                    <div className="w-10 h-10 rounded-none bg-white/15 flex items-center justify-center">
                      <LeafIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-[var(--font-display)] leading-none text-white">
                        <CountUp value="25+" />
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/90 mt-1">
                        {isAr ? 'عاماً من الخبرة بالمملكة' : 'Years Experience'}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Content Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal direction="right" duration={0.8} delay={0.15}>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#1D8F2C]/10 border-s-2 border-[#1D8F2C] text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="w-1.5 h-1.5 bg-[#1D8F2C]" />
                    <span>{isAr ? 'قصة نجاحنا' : 'Our Story'}</span>
                  </div>
                  <AnimatedText
                    text={
                      isAr
                        ? 'ريادة هندسية تصنع مساحات خضراء مستدامة'
                        : 'Engineering Resilient Green Spaces in Arid Climates'
                    }
                    as="h2"
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] leading-tight font-[var(--font-display)]"
                  />
                </div>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                  {isAr
                    ? 'منذ عام 1999، انطلقت جرين سلوشن كشركة متخصصة في هندسة وتنسيق المواقع بالمملكة، مجهزة بمشاتل إنتاجية متقدمة في جدة ومكة المكرمة وفرق عمل مؤهلة تدير مشاريع القصور الملكية والمنشآت الرياضية والمجمعات التجارية الكبرى.'
                    : 'Since 1999, Green Solution Co. has delivered premier landscape engineering across Saudi Arabia. With specialized nursery facilities in Jeddah and Makkah, we engineer enduring outdoor environments for royal residences, corporate campuses, and public parks.'}
                </p>

                {/* 2 Feature Highlights — Solid Sharp Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-none bg-[#F3F7FB] border-s-4 border-[#1D8F2C] shadow-xs">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-none bg-white flex items-center justify-center text-[#1D8F2C] shadow-xs">
                        <DropletIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-[#232434] font-[var(--font-display)]">
                        {isAr ? 'وفر مائي 35%+' : '35%+ Water Savings'}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {isAr
                        ? 'أنظمة ري مركزية ذكية SCADA مرتبطة بمحطات الأرصاد.'
                        : 'Weather-responsive SCADA irrigation systems minimizing freshwater use.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-none bg-[#F3F7FB] border-s-4 border-[#1D8F2C] shadow-xs">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-none bg-white flex items-center justify-center text-[#1D8F2C] shadow-xs">
                        <LeafIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-[#232434] font-[var(--font-display)]">
                        {isAr ? '200,000+ شتلة مؤقلمة' : '200k+ Acclimatized Plants'}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {isAr
                        ? 'نباتات محلية ونخيل معمر مهيأ لمناخ المملكة الصحراوي.'
                        : 'Indigenous species and specimen palms cultivated for extreme heat.'}
                    </p>
                  </div>
                </div>

                {/* Key CTA Link */}
                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href={`/${locale}/projects`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-[#1D8F2C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#167423] transition-colors shadow-sm"
                  >
                    <span>{isAr ? 'استعرض مشاريعنا' : 'View Our Projects'}</span>
                    <span className="rtl:rotate-180">&rarr;</span>
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-neutral-100 hover:bg-neutral-200 text-[#232434] text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>{isAr ? 'طلب استشارة' : 'Get in Touch'}</span>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS — SOLID CARDS WITH TOP ACCENT */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#1D8F2C]/10 border-s-2 border-[#1D8F2C] text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3">
                <span>{isAr ? 'ركائز تميزنا' : 'Our Pillars'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'معايير هندسية متكاملة' : 'Engineered for Reliability & Scale'}
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="h-full bg-white p-6 rounded-none shadow-sm hover:shadow-xl border-t-4 border-[#1D8F2C] transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-none bg-[#F3F7FB] flex items-center justify-center mb-5">
                      {pillar.icon}
                    </div>
                    <h3 className="text-base font-bold text-[#232434] mb-2 font-[var(--font-display)]">
                      {isAr ? pillar.titleAr : pillar.titleEn}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {isAr ? pillar.descAr : pillar.descEn}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MILESTONES TIMELINE — SOLID CARDS */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#1D8F2C]/10 border-s-2 border-[#1D8F2C] text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3">
                <span>{isAr ? 'مسيرة الإنجاز' : 'Key Milestones'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'محطات فارقة في مسيرتنا' : '25+ Years of Evolution in the Kingdom'}
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-6 rounded-none bg-[#F3F7FB] shadow-xs border-b-2 border-transparent hover:border-[#1D8F2C] transition-all h-full flex flex-col justify-between">
                  <div>
                    <div className="text-2xl font-black text-[#1D8F2C] mb-2 font-[var(--font-display)]">
                      {m.year}
                    </div>
                    <h3 className="text-sm font-bold text-[#232434] mb-2 font-[var(--font-display)]">
                      {isAr ? m.titleAr : m.titleEn}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {isAr ? m.descAr : m.descEn}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP TEAM — SOLID CARDS WITH BOTTOM ACCENT */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#1D8F2C]/10 border-s-2 border-[#1D8F2C] text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3">
                <span>{isAr ? 'القيادة الهندسية' : 'Leadership'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'فريق يقود التميز والتنفيذ' : 'Expert Direction Behind Every Project'}
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="bg-white rounded-none overflow-hidden shadow-sm hover:shadow-xl border-b-4 border-[#1D8F2C] transition-all group">
                  <div className="h-60 overflow-hidden bg-neutral-900 relative">
                    <img
                      src={member.image}
                      alt={isAr ? member.nameAr : member.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-none bg-[#1D8F2C] text-white text-[10px] font-bold">
                      {member.badge}
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-base font-bold text-[#232434] font-[var(--font-display)]">
                      {isAr ? member.nameAr : member.nameEn}
                    </h3>
                    <p className="text-xs text-[#1D8F2C] font-semibold mt-1">
                      {isAr ? member.roleAr : member.roleEn}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-2">
                      {member.exp}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VISION 2030 & SGI COMMITMENT — SOLID DARK CARDS */}
      <section className="py-20 bg-[#12141D] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D8F2C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white/5 border-s-2 border-[#1D8F2C] text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <span>{isAr ? 'مبادرة السعودية الخضراء' : 'Saudi Green Initiative'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-[var(--font-display)]">
                {isAr ? 'التزامنا بمستقبل المملكة البيئي' : 'Aligned with Vision 2030 Environmental Goals'}
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sgiGoals.map((goal, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="bg-[#1A1D27] p-6 rounded-none shadow-md border-t-2 border-[#1D8F2C] hover:border-[#1D8F2C]/80 transition-all">
                  <div className="text-xs font-bold text-[#1D8F2C] mb-2 font-mono">{goal.number}</div>
                  <h3 className="text-base font-bold text-white mb-2 font-[var(--font-display)]">
                    {isAr ? goal.titleAr : goal.titleEn}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {isAr ? goal.descAr : goal.descEn}
                  </p>
                  <div className="inline-block px-3 py-1 rounded-none bg-[#1D8F2C]/20 text-emerald-400 text-xs font-bold">
                    {goal.kpi}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CLIENT MARQUEE & TRUST BADGES */}
      <section className="py-14 bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-xs font-bold tracking-wider uppercase text-neutral-500 mb-8 font-[var(--font-display)]">
            {isAr ? 'شركاؤنا وكبرى المنشآت الوطنية' : 'Trusted by Leading Saudi Institutions'}
          </h3>
          <ClientMarquee />

          {/* Solid Badges Row */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-10 pt-8 border-t border-neutral-200/80">
            {trustBadgesList.map((badge, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 bg-[#F3F7FB] px-3 py-1.5 rounded-none"
              >
                <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C]" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CALL TO ACTION */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232434] mb-3 font-[var(--font-display)]">
            {isAr ? 'هل لديك مشروع ترغب في تنفيذه؟' : 'Planning a New Landscape or Irrigation Project?'}
          </h2>
          <p className="text-sm text-neutral-600 mb-8 max-w-xl mx-auto">
            {isAr
              ? 'تواصل مع فريقنا الهندسي لطلب معاينة ميدانية أو مناقشة المخططات التنفيذية وجداول الكميات.'
              : 'Our engineering directors are ready to review your BoQs and schedule a site survey.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="px-6 py-3 rounded-none bg-[#1D8F2C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm hover:bg-[#167423] transition-colors"
            >
              {isAr ? 'طلب معاينة ميدانية' : 'Request Site Inspection'}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="px-6 py-3 rounded-none bg-neutral-200 hover:bg-neutral-300 text-[#232434] text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors"
            >
              {isAr ? 'استعراض كافة الخدمات' : 'Explore All Services'}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
