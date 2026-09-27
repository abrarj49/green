import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import ContactForm from '@/components/ContactForm';
import FAQAccordion from '@/components/FAQAccordion';
import { getSiteSeo } from '@/lib/sqlite';
import {
  FileTextIcon,
  CheckIcon,
  MapPinIcon,
} from '@/components/icons/SiteIcons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const seo = getSiteSeo('contact');

  if (seo) {
    return {
      title: isAr ? seo.titleAr : seo.titleEn,
      description: isAr ? seo.descAr : seo.descEn,
      keywords: isAr ? seo.keywordsAr : seo.keywordsEn,
      alternates: {
        canonical: seo.canonicalUrl || `https://greensolutionksa.com/${locale}/contact`,
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
      ? 'اتصل بنا | شركة جرين سلوشن السعودية — استشارات هندسية ومعاينات ميدانية'
      : 'Contact Us | Green Solution Co. Saudi Arabia — Direct Engineering Consultations',
    description: isAr
      ? 'تواصل مباشرة مع الإدارة الهندسية لشركة جرين سلوشن لطلب زيارات الموقع، مراجعة المخططات التنفيذية، وتسعير مناقصات اللاندسكيب والري بالمملكة.'
      : 'Connect with Green Solution Co. engineering directorate for tender BoQ reviews, site inspections, and smart irrigation audits across Jeddah, Riyadh, and KSA.',
  };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string; type?: string; ref?: string }>;
}) {
  const { locale } = await params;
  const { service, ref } = await searchParams;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  const faqItems = [
    {
      q: isAr
        ? 'ما هي سرعة استجابة فريقكم لإجراء المعاينة الميدانية؟'
        : 'How quickly can your team conduct an on-site inspection?',
      a: isAr
        ? 'يقوم مهندسونا بجدولة وزيارة الموقع خلال 24 إلى 48 ساعة في جدة ومكة المكرمة والرياض، مع تقديم تقرير فني أولي.'
        : 'Our licensed engineers schedule site visits within 24 to 48 hours across Jeddah, Makkah, and Riyadh.',
    },
    {
      q: isAr
        ? 'هل المخططات وجداول الكميات (BoQs) مطابقة لكود البناء السعودي؟'
        : 'Are your drawings and BoQs compliant with the Saudi Building Code?',
      a: isAr
        ? 'نعم، كافة التصاميم الهندسية وشبكات الري والأعمال الصلبة مطابقة تماماً لاشتراطات SBC 02-L وSBC 301.'
        : 'Yes, 100% of our architectural drawings and hydraulic schematics strictly adhere to SBC 02-L guidelines.',
    },
    {
      q: isAr
        ? 'ما هي تقنيات توفير المياه التي تعتمدونها؟'
        : 'What water conservation technologies do you deploy?',
      a: isAr
        ? 'نعتمد أنظمة تحكم ذكية بمحطات الأرصاد والري بالتنقيط تحت السطحي، مما يوفر أكثر من 35% من مياه الري.'
        : 'We integrate weather-synced SCADA controllers and subsurface drip lines, verified to save 35%+ freshwater.',
    },
    {
      q: isAr
        ? 'هل النباتات وأشجار النخيل موردة من مشاتلكم الخاصة؟'
        : 'Do you supply native plants and specimen palms from your own nursery?',
      a: isAr
        ? 'نعم، تمتلك جرين سلوشن مشاتل متخصصة بجدة تضم أكثر من 200,000 شتلة ونخلة مؤقلمة للحرارة العالية والملوحة.'
        : 'Yes, our Jeddah propagation nursery holds 200k+ specimens acclimatized to extreme desert heat and salinity.',
    },
    {
      q: isAr
        ? 'كيف يمكن طلب ملف التأهيل الفني المعتمد (PQD) للمناقصات؟'
        : 'How can contractors request your Pre-Qualification Dossier (PQD)?',
      a: isAr
        ? 'يمكنكم اختيار "مناقصة وتأهيل فني" بالنموذج، وسنزودكم فوراً بالسجل التجاري وشهادات الزكاة ورخص المهندسين.'
        : 'Select "Tender / PQD" in the form or email us; our commercial desk dispatches the full dossier immediately.',
    },
  ];

  return (
    <PageShell defaultService={service}>
      {/* 1. ULTRA SLEEK HERO HEADER */}
      <PageHero
        badge={{
          en: 'Get In Touch',
          ar: 'تواصل سريع ومباشر',
        }}
        title={{
          en: "Let's Build Your Vision",
          ar: 'لنبنِ رؤيتك معاً',
        }}
        subtitle={{
          en: 'Ready for a site survey or engineering consultation? Our expert team is at your service.',
          ar: 'هل تخطط لمشروع جديد أو ترغب بمعاينة الموقع؟ فريقنا الهندسي جاهز لخدمتك فوراً.',
        }}
        breadcrumbs={[
          {
            labelEn: 'Contact Us',
            labelAr: 'اتصل بنا',
          },
        ]}
        stats={[
          {
            value: '24-48h',
            labelEn: 'Site Inspection',
            labelAr: 'معاينة الموقع',
          },
          {
            value: '100%',
            labelEn: 'SCE-Licensed',
            labelAr: 'مهندسون معتمدون',
          },
          {
            value: 'HQ',
            labelEn: 'Jeddah & Riyadh',
            labelAr: 'جدة والرياض',
          },
        ]}
        backgroundImage="/img/hero-royal-palace.jpg"
      />

      {/* 2. CONTACT CHANNELS STRIP */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Direct Phone */}
            <a
              href="tel:+966595998808"
              className="p-5 rounded-none bg-[#F3F7FB] border-t-2 border-[#1D8F2C] hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-none bg-[#1D8F2C]/10 text-[#1D8F2C] flex items-center justify-center mb-3 group-hover:bg-[#1D8F2C] group-hover:text-white transition-colors">
                  📞
                </div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block font-[var(--font-display)]">
                  {isAr ? 'الخط المباشر' : 'Direct Line'}
                </span>
                <div className="text-sm font-bold text-[#232434] mt-1 font-mono">
                  +966 59 599 8808
                </div>
                <p className="text-[11px] text-[#585858] mt-1">
                  {isAr ? 'اتصال مباشر مع المهندس المسؤول' : 'Instant connection to project lead'}
                </p>
              </div>
              <span className="text-xs font-bold text-[#1D8F2C] mt-3 inline-flex items-center gap-1">
                {isAr ? 'اتصل الآن ←' : 'Call Now →'}
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/966595998808"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-none bg-[#F3F7FB] border-t-2 border-[#25D366] hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-none bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-3 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  💬
                </div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block font-[var(--font-display)]">
                  {isAr ? 'واتساب للأعمال' : 'WhatsApp Desk'}
                </span>
                <div className="text-sm font-bold text-[#232434] mt-1">
                  WhatsApp Business
                </div>
                <p className="text-[11px] text-[#585858] mt-1">
                  {isAr ? 'مشاركة المخططات والملفات' : 'Share drawings & site photos'}
                </p>
              </div>
              <span className="text-xs font-bold text-[#25D366] mt-3 inline-flex items-center gap-1">
                {isAr ? 'محادثة فورية ←' : 'Chat on WhatsApp →'}
              </span>
            </a>

            {/* RFP Email */}
            <a
              href="mailto:chhameed@greensolutionksa.com"
              className="p-5 rounded-none bg-[#F3F7FB] border-t-2 border-[#1D8F2C] hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-none bg-[#1D8F2C]/10 text-[#1D8F2C] flex items-center justify-center mb-3 group-hover:bg-[#1D8F2C] group-hover:text-white transition-colors">
                  ✉️
                </div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block font-[var(--font-display)]">
                  {isAr ? 'بريد المناقصات' : 'Tendering RFP'}
                </span>
                <div className="text-xs font-bold text-[#232434] mt-1 font-mono truncate">
                  chhameed@greensolutionksa.com
                </div>
                <p className="text-[11px] text-[#585858] mt-1">
                  {isAr ? 'استقبال ملفات CAD وجداول الكميات' : 'Receive CAD files & BoQ tenders'}
                </p>
              </div>
              <span className="text-xs font-bold text-[#1D8F2C] mt-3 inline-flex items-center gap-1">
                {isAr ? 'إرسال بريد ←' : 'Send RFP Email →'}
              </span>
            </a>

            {/* Working Hours */}
            <div className="p-5 rounded-none bg-[#F3F7FB] border-t-2 border-[#1D8F2C] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-none bg-neutral-200/60 text-neutral-700 flex items-center justify-center mb-3">
                  🕒
                </div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block font-[var(--font-display)]">
                  {isAr ? 'أوقات العمل' : 'Working Hours'}
                </span>
                <div className="text-sm font-bold text-[#232434] mt-1">
                  {isAr ? 'السبت – الخميس' : 'Saturday – Thursday'}
                </div>
                <p className="text-[11px] text-[#585858] mt-1 font-mono">
                  8:00 AM – 6:00 PM (KSA)
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-200 text-[10px] font-semibold text-[#1D8F2C] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#1D8F2C] animate-pulse" />
                <span>{isAr ? 'المعاينة الميدانية متاحة' : 'Site surveys active'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN SECTION: FORM + HQ OFFICE & MAP */}
      <section className="py-16 bg-[#F3F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-7">
                <ContactForm initialService={service} />
              </div>

              {/* Right Column: Headquarters Info & Map */}
              <div className="lg:col-span-5 space-y-6">
                {/* Headquarters Office Card */}
                <div className="p-6 rounded-none bg-white border-t-4 border-[#1D8F2C] shadow-sm space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-none bg-[#1D8F2C]/10 text-[#1D8F2C] flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-5 h-5 text-[#1D8F2C]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#1D8F2C] uppercase tracking-wider block mb-0.5">
                        {isAr ? 'المقر الرئيسي والمشاتل' : 'Western Province HQ'}
                      </span>
                      <h3 className="font-bold text-[#232434] text-base font-[var(--font-display)] mb-1">
                        {isAr ? 'مكتب الإدارة الرئيسي — جدة' : 'Green Solution Co. — Jeddah HQ'}
                      </h3>
                      <p className="text-xs text-[#585858] leading-relaxed">
                        {isAr
                          ? 'مكتب رقم 10، عمارة الكعكية، شارع الإمام الشافعي، حي الفيصلية، جدة، المملكة العربية السعودية.'
                          : 'Office #10, Al Kakiyah Building, Al Imam Al Shafei Street, Al Faisaliyyah District, Jeddah, Saudi Arabia.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span>{isAr ? 'السجل التجاري:' : 'CR:'} 4030495810</span>
                    <span className="inline-flex items-center gap-1 text-[#1D8F2C] font-bold text-[11px]">
                      <CheckIcon className="w-3.5 h-3.5 text-[#1D8F2C]" />
                      <span>{isAr ? 'نشط ومعتمد' : 'Active & Verified'}</span>
                    </span>
                  </div>
                </div>

                {/* Regional Operations Strip */}
                <div className="p-5 rounded-none bg-white border-t-2 border-[#1D8F2C] shadow-sm space-y-2.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-[var(--font-display)]">
                    {isAr ? 'المراكز الإقليمية والمشاتل' : 'Regional Facilities'}
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-none bg-[#F3F7FB] border-s-2 border-[#1D8F2C] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#232434] block">
                          {isAr ? 'مشاتل أبحر الشمالية' : 'North Obhur Propagation Nursery'}
                        </span>
                        <span className="text-neutral-500 text-[11px]">
                          {isAr ? '200,000+ شتلة ونخلة مؤقلمة' : '200k+ specimen plants reserve'}
                        </span>
                      </div>
                      <span className="text-[#1D8F2C] font-bold text-[11px]">Jeddah</span>
                    </div>

                    <div className="p-3 rounded-none bg-[#F3F7FB] border-s-2 border-[#1D8F2C] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#232434] block">
                          {isAr ? 'مكتب المشاريع بالرياض' : 'Riyadh Project Liaison Desk'}
                        </span>
                        <span className="text-neutral-500 text-[11px]">
                          {isAr ? 'مشاريع العاصمة والمقرات الحكومية' : 'Central Region operations'}
                        </span>
                      </div>
                      <span className="text-[#1D8F2C] font-bold text-[11px]">Riyadh</span>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-none overflow-hidden shadow-sm aspect-[16/9] border-t-2 border-[#1D8F2C]">
                  <iframe
                    title="Green Solution KSA Office Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118814.23816439365!2d39.1238977!3d21.543333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d01fb1137e59%3A0xe059579737b118db!2sJeddah%20Saudi%20Arabia!5e0!3m2!1sen!2ssa!4v1700000000000!5m2!1sen!2ssa"
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 4. COMPACT TECHNICAL FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D8F2C]/10 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider mb-2 border-l-2 border-[#1D8F2C]">
                <span>{isAr ? 'الأسئلة الشائعة' : 'Frequently Asked'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232434] tracking-tight font-[var(--font-display)]">
                {isAr ? 'استفسارات شائعة حول خدماتنا' : 'Technical & Execution FAQs'}
              </h2>
            </div>

            <FAQAccordion items={faqItems} />
          </SectionReveal>
        </div>
      </section>
    </PageShell>
  );
}
