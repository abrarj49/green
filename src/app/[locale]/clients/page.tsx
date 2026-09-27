import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import ClientMarquee from '@/components/ClientMarquee';
import ClientDirectoryClient from '@/components/clients/ClientDirectoryClient';
import { getSiteSeo } from '@/lib/sqlite';
import { CheckIcon } from '@/components/icons/SiteIcons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const seo = getSiteSeo('clients');

  if (seo) {
    return {
      title: isAr ? seo.titleAr : seo.titleEn,
      description: isAr ? seo.descAr : seo.descEn,
      keywords: isAr ? seo.keywordsAr : seo.keywordsEn,
      alternates: {
        canonical: seo.canonicalUrl || `https://greensolutionksa.com/${locale}/clients`,
      },
      openGraph: {
        title: isAr ? seo.titleAr : seo.titleEn,
        description: isAr ? seo.descAr : seo.descEn,
        images: [{ url: seo.ogImage || '/img/hero-royal-palace.jpg' }],
      },
    };
  }

  return {
    title: isAr
      ? 'عملاؤنا وشركاؤنا | جرين سلوشن السعودية — ثقة كبرى المؤسسات والوزارات'
      : 'Our Clients & Institutional Partners | Green Solution Co. Saudi Arabia',
    description: isAr
      ? 'نفخر بثقة كبرى المؤسسات الحكومية، الوزارات، الجامعات، والشركات الرائدة في المملكة العربية السعودية.'
      : 'Trusted by leading Saudi government ministries, top universities, commercial enterprises, and luxury hospitality destinations.',
  };
}

const testimonialsList = [
  {
    quoteEn:
      'Green Solution delivered exceptional quality on our luxury resort landscape with strict adherence to municipal milestones.',
    quoteAr:
      'قدمت شركة جرين سلوشن تصميماً وتنفيذاً استثنائيين للمنتجع مع التزام تام بالجداول الزمنية والمواصفات المعتمدة.',
    author: 'Abdula Ahad F',
    roleEn: 'Senior Projects Directorate',
    roleAr: 'إدارة المشاريع الكبرى',
    company: 'Westin Hotels & Resorts — KSA',
  },
  {
    quoteEn:
      'Their automated water telemetry and integrated pest management yielded healthier green cover and 30%+ verified water savings.',
    quoteAr:
      'أدى نهجهم في الري الذكي وإدارة الآفات إلى مسطحات خضراء أكثر نضارة وتوفير موثق تجاوز 30% من المياه.',
    author: 'Dr. Imran Saeed',
    roleEn: 'Operations & Facilities Director',
    roleAr: 'مدير العمليات والمرافق',
    company: 'GreenHarvest Agro & Real Estate',
  },
  {
    quoteEn:
      'Horticultural precision and engineering rigor on our royal palace waterfront estates set a benchmark in the Kingdom.',
    quoteAr:
      'التزامهم الهندسي ودقتهم البستانية في مشاريع قصور المنطقة الغربية شكّل معياراً راقياً في هندسة اللاندسكيب.',
    author: 'Shk. Abdul Rehman Ali Raza',
    roleEn: 'Principal & Managing Partner',
    roleAr: 'الرئيس والمدير الشريك',
    company: 'Raza Est — Western Province KSA',
  },
];

const accreditationBadges = [
  {
    titleEn: 'Commercial Registration (CR)',
    titleAr: 'السجل التجاري (CR) — نشط',
    entityEn: 'Ministry of Commerce',
    entityAr: 'وزارة التجارة',
  },
  {
    titleEn: 'ZATCA VAT Certificate',
    titleAr: 'شهادة الزكاة والضريبة (ZATCA)',
    entityEn: 'Zakat, Tax & Customs Authority',
    entityAr: 'هيئة الزكاة والضريبة والجمارك',
  },
  {
    titleEn: 'GOSI Compliance',
    titleAr: 'التأمينات الاجتماعية (GOSI)',
    entityEn: 'General Org. for Social Insurance',
    entityAr: 'المؤسسة العامة للتأمينات',
  },
  {
    titleEn: 'High Green Nitaqat',
    titleAr: 'شهادة التوطين — النطاق الأخضر',
    entityEn: 'Ministry of Human Resources',
    entityAr: 'وزارة الموارد البشرية',
  },
  {
    titleEn: 'Chamber of Commerce',
    titleAr: 'الغرفة التجارية بجدة',
    entityEn: 'Active Registered Member',
    entityAr: 'عضوية معتمدة وسارية',
  },
];

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  return (
    <PageShell>
      {/* 1. ULTRA SLEEK HERO HEADER */}
      <PageHero
        badge={{
          en: 'Trusted Across KSA',
          ar: 'شراكات موثوقة بالمملكة',
        }}
        title={{
          en: 'Our Valued Clients',
          ar: 'عملاؤنا وشركاء النجاح',
        }}
        subtitle={{
          en: 'Proudly trusted by Saudi ministries, premier universities, royal estates, and visionary developers.',
          ar: 'نفخر بثقة كبرى الوزارات، والجامعات، والقصور الملكية، والمطورين الرواد بالمملكة.',
        }}
        breadcrumbs={[
          {
            labelEn: 'Clients',
            labelAr: 'عملاؤنا',
          },
        ]}
        stats={[
          {
            value: '19+',
            labelEn: 'Major Partners',
            labelAr: 'جهة وهيئة شريكة',
          },
          {
            value: '25+',
            labelEn: 'Years Reputation',
            labelAr: 'عاماً من الثقة',
          },
          {
            value: 'Grade A+',
            labelEn: 'Vendor Rating',
            labelAr: 'تصنيف تأهيل معتمد',
          },
        ]}
        backgroundImage="/img/hero-royal-palace.jpg"
      />

      {/* 2. INTERACTIVE CLIENT DIRECTORY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="max-w-2xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3 border-l-2 border-[#1D8F2C]">
                <span>{isAr ? 'سجل الشركاء' : 'Client Directory'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'شركاء النجاح عبر مختلف القطاعات' : 'Distinguished Partnerships Across Key Sectors'}
              </h2>
            </div>

            <ClientDirectoryClient isAr={isAr} />
          </SectionReveal>
        </div>
      </section>

      {/* 3. TESTIMONIALS — CLEAN PUNCHY QUOTES */}
      <section className="py-20 bg-[#F3F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3 border-l-2 border-[#1D8F2C]">
                <span>{isAr ? 'شهادات العملاء' : 'Testimonials'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'ماذا يقول شركاؤنا عن كفاءتنا' : 'Endorsements from Senior Directors'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialsList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-none border-t-4 border-[#1D8F2C] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    <div className="text-[#1D8F2C] text-sm tracking-widest">
                      ★★★★★
                    </div>
                    <p className="text-xs sm:text-sm text-[#585858] leading-relaxed italic">
                      &ldquo;{isAr ? item.quoteAr : item.quoteEn}&rdquo;
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-[#1D8F2C]/10 text-[#1D8F2C] font-bold text-sm flex items-center justify-center shrink-0">
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#232434] text-xs sm:text-sm font-[var(--font-display)]">
                        {item.author}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        {isAr ? item.roleAr : item.roleEn}
                      </p>
                      <span className="text-[11px] font-semibold text-[#1D8F2C] block">
                        {item.company}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 4. ACCREDITATION BADGES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3 border-l-2 border-[#1D8F2C]">
                <span>{isAr ? 'الامتثال والاعتماد' : 'Verified Compliance'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'التراخيص والشهادات النظامية المعتمدة' : 'Official Accreditations & Registrations'}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {accreditationBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-none bg-[#F3F7FB] border-t-2 border-[#1D8F2C] hover:bg-white hover:shadow-md transition-all text-center flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-none bg-white text-[#1D8F2C] shadow-sm flex items-center justify-center mx-auto mb-3">
                      <CheckIcon className="w-4 h-4 text-[#1D8F2C]" />
                    </div>
                    <h3 className="text-xs font-bold text-[#232434] font-[var(--font-display)] mb-1">
                      {isAr ? badge.titleAr : badge.titleEn}
                    </h3>
                    <p className="text-[10px] text-neutral-500">
                      {isAr ? badge.entityAr : badge.entityEn}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-200/80">
                    <span className="text-[10px] font-bold text-[#1D8F2C]">
                      {isAr ? 'نشط ومعتمد' : 'Verified Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 5. LOGO MARQUEE */}
      <section className="py-12 bg-[#F3F7FB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block font-[var(--font-display)]">
            {isAr ? 'شركاء النجاح الدائمون بالمملكة' : 'Enduring Strategic Alliances'}
          </span>
        </div>
        <ClientMarquee />
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-16 bg-[#14161F] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-[var(--font-display)]">
            {isAr
              ? 'هل ترغب في إضافة جرين سلوشن لقائمة المقاولين المعتمدين؟'
              : 'Add Green Solution to Your Approved Vendor List (AVL)'}
          </h2>
          <p className="text-sm text-neutral-400 mb-8 max-w-xl mx-auto">
            {isAr
              ? 'فريقنا التجاري جاهز لتوفير ملف التأهيل الفني وسابقة الأعمال المعتمدة لمشروعكم.'
              : 'Our tendering division is ready to supply audited PQD packs, CR documentation, and project references.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact?type=vendor-pqd`}
              className="px-7 py-3 rounded-none bg-[#1D8F2C] text-white text-sm font-bold shadow-sm hover:bg-[#167423] transition-colors uppercase tracking-wider"
            >
              {isAr ? 'طلب ملف التأهيل الفني' : 'Request PQD Pack'}
            </Link>
            <Link
              href={`/${locale}/projects`}
              className="px-7 py-3 rounded-none border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-colors uppercase tracking-wider"
            >
              {isAr ? 'استعراض المشاريع' : 'View Projects'}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
