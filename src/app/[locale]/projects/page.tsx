import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import ProjectTable from '@/components/ProjectTable';
import LightboxGallery from '@/components/LightboxGallery';
import { featuredCaseStudies } from '@/data/projects';
import { getSiteSeo } from '@/lib/sqlite';
import { MapPinIcon } from '@/components/icons/SiteIcons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const seo = getSiteSeo('projects');

  if (seo) {
    return {
      title: isAr ? seo.titleAr : seo.titleEn,
      description: isAr ? seo.descAr : seo.descEn,
      keywords: isAr ? seo.keywordsAr : seo.keywordsEn,
      alternates: {
        canonical: seo.canonicalUrl || `https://greensolutionksa.com/${locale}/projects`,
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
      ? 'مشاريعنا الهندسية | سجل إنجازات شركة جرين سلوشن في المملكة العربية السعودية'
      : 'Engineering Portfolio | 55+ Landmark Projects Across Saudi Arabia — Green Solution Co.',
    description: isAr
      ? 'استعرض أكثر من 55 مشروعاً منفذاً للقصور الملكية، الجامعات، الملاعب الدولية، والمقرات الكبرى بالرياض وجدة ومكة وينبع.'
      : 'Explore 55+ landmark landscape, smart irrigation, and hardscape EPC projects across Riyadh, Jeddah, Makkah, and Yanbu.',
  };
}

export default async function ProjectsPage({
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
          en: '55+ Delivered Projects',
          ar: 'أكثر من 55 مشروعاً منجزاً',
        }}
        title={{
          en: 'Our Featured Projects',
          ar: 'مشاريعنا المميزة',
        }}
        subtitle={{
          en: 'A showcase of royal palaces, premier sports arenas, and luxury landscapes delivered across KSA.',
          ar: 'نخبة من أبرز مشاريع القصور الملكية والملاعب والمجمعات الراقية بالمملكة.',
        }}
        breadcrumbs={[
          {
            labelEn: 'Projects',
            labelAr: 'المشاريع',
          },
        ]}
        stats={[
          {
            value: '55+',
            labelEn: 'Handed Over',
            labelAr: 'مشروعاً منجزاً',
          },
          {
            value: '4',
            labelEn: 'Major Regions',
            labelAr: 'مناطق رئيسية',
          },
          {
            value: '100%',
            labelEn: 'SBC Code Compliant',
            labelAr: 'مطابق لكود البناء',
          },
        ]}
        backgroundImage="/img/hero-royal-palace.jpg"
      />

      {/* 2. FEATURED CASE STUDIES — CLEAN & SCANNABLE */}
      <section id="case-studies" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3 border-l-2 border-[#1D8F2C]">
                <span>{isAr ? 'دراسات حالة مختارة' : 'Featured Case Studies'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'أعمال استراتيجية تبرز دقة التنفيذ' : 'Landmark Works Defining Arid Excellence'}
              </h2>
            </div>

            {/* Case Studies List */}
            <div className="space-y-12">
              {featuredCaseStudies.map((study, idx) => (
                <div
                  key={study.id}
                  className="rounded-none bg-[#F3F7FB] border-t-4 border-[#1D8F2C] overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* Visual Column */}
                    <div className="lg:col-span-5 relative h-64 sm:h-72 lg:h-[400px] overflow-hidden bg-neutral-900">
                      <img
                        src={study.image}
                        alt={isAr ? study.titleAr : study.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 start-4 end-4 flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-none bg-[#1D8F2C] text-white text-[11px] font-bold uppercase tracking-wider">
                          {isAr ? study.categoryAr : study.categoryEn}
                        </span>
                        <span className="px-3 py-1 rounded-none bg-black/70 backdrop-blur-md text-[#1D8F2C] text-[11px] font-bold inline-flex items-center gap-1 border-l border-[#1D8F2C]">
                          <MapPinIcon className="w-3 h-3 text-[#1D8F2C]" />
                          <span>{isAr ? study.locationAr : study.locationEn}</span>
                        </span>
                      </div>

                      {/* Client Overlay */}
                      <div className="absolute bottom-4 start-4 end-4 text-white">
                        <span className="text-[10px] text-neutral-300 uppercase block">
                          {isAr ? 'العميل:' : 'Client:'}
                        </span>
                        <span className="text-xs font-bold text-white block">
                          {isAr ? study.clientAr : study.clientEn}
                        </span>
                      </div>
                    </div>

                    {/* Details Column — Concise copy */}
                    <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
                      <div>
                        <span className="text-xs font-bold text-[#1D8F2C] uppercase tracking-wider block mb-1">
                          CASE STUDY #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#232434] font-[var(--font-display)] leading-snug">
                          {isAr ? study.titleAr : study.titleEn}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          {isAr ? study.subtitleAr : study.subtitleEn}
                        </p>
                      </div>

                      <p className="text-neutral-600 leading-relaxed text-xs sm:text-sm">
                        {isAr ? study.descriptionAr : study.descriptionEn}
                      </p>

                      {/* 4 Impact Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {study.metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3 bg-white rounded-none border-b-2 border-[#1D8F2C] shadow-sm text-center"
                          >
                            <span className="block text-lg font-extrabold text-[#1D8F2C] font-[var(--font-display)]">
                              {m.value}
                            </span>
                            <span className="text-[10px] text-[#585858] font-medium mt-0.5 block leading-tight">
                              {isAr ? m.labelAr : m.labelEn}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div className="pt-2 border-t border-neutral-200/80">
                        <ul className="space-y-1 text-xs text-[#585858]">
                          {(isAr ? study.highlightsAr : study.highlightsEn).slice(0, 2).map((h, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2">
                              <span className="text-[#1D8F2C] font-bold">✓</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Link */}
                      <div className="pt-2">
                        <Link
                          href={`/${locale}/contact?ref=${encodeURIComponent(
                            isAr ? study.titleAr : study.titleEn
                          )}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D8F2C] hover:underline"
                        >
                          <span>{isAr ? 'طلب تنفيذ مشروع مماثل' : 'Inquire for Similar Scope'}</span>
                          <span className="rtl:rotate-180">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 3. VISUAL LIGHTBOX GALLERY */}
      <section id="photo-gallery" className="py-20 bg-[#F3F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3 border-l-2 border-[#1D8F2C]">
                <span>{isAr ? 'معرض الصور' : 'Field Visuals'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'لقطات ميدانية من مواقع العمل' : 'On-Site Photography from Completed Sites'}
              </h2>
            </div>

            <LightboxGallery isAr={isAr} />
          </SectionReveal>
        </div>
      </section>

      {/* 4. MASTER 55-PROJECT DIRECTORY */}
      <section id="full-directory" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="max-w-2xl mx-auto text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-3 border-l-2 border-[#1D8F2C]">
                <span>{isAr ? 'سجل المشاريع' : 'Project Directory'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'كافة المشاريع المنجزة (55 مشروعاً)' : 'Complete 55-Project Master Registry'}
              </h2>
            </div>

            <ProjectTable />
          </SectionReveal>
        </div>
      </section>

      {/* 5. TENDER & PRE-QUALIFICATION CTA */}
      <section className="py-16 bg-[#14161F] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-[var(--font-display)]">
            {isAr
              ? 'هل ترغب في اعتمادنا ضمن قائمة المقاولين لمشروعك؟'
              : 'Need Our Contractor Pre-Qualification Dossier (PQD)?'}
          </h2>
          <p className="text-sm text-neutral-400 mb-8 max-w-xl mx-auto">
            {isAr
              ? 'نقدم ملف التأهيل المعتمد، السجل التجاري، شهادات الزكاة، وجداول الكميات المسعرة.'
              : 'Our engineering directorate provides audited CR, ZATCA certificates, and tailored BoQs for tender submissions.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact?type=tendering`}
              className="px-7 py-3 rounded-none bg-[#1D8F2C] text-white text-sm font-bold shadow-sm hover:bg-[#167423] transition-colors uppercase tracking-wider"
            >
              {isAr ? 'طلب ملف التأهيل الفني' : 'Request PQD Pack'}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="px-7 py-3 rounded-none border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-colors uppercase tracking-wider"
            >
              {isAr ? 'استعراض الخدمات' : 'View Scope of Work'}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
