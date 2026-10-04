import { setRequestLocale } from 'next-intl/server';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { getBlogs, getSiteSeo } from '@/lib/sqlite';
import { isPostgresConfigured, pgGetBlogs } from '@/lib/postgres';
import BlogListClient from '@/components/blog/BlogListClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const seo = getSiteSeo('blog');

  if (seo) {
    return {
      title: isAr ? seo.titleAr : seo.titleEn,
      description: isAr ? seo.descAr : seo.descEn,
      keywords: isAr ? seo.keywordsAr : seo.keywordsEn,
      alternates: {
        canonical: seo.canonicalUrl || `https://greensolutionksa.com/${locale}/blog`,
      },
      openGraph: {
        title: isAr ? seo.titleAr : seo.titleEn,
        description: isAr ? seo.descAr : seo.descEn,
        url: `https://greensolutionksa.com/${locale}/blog`,
        siteName: 'Green Solution KSA',
        images: [{ url: seo.ogImage || '/images/hero-1.webp' }],
      },
    };
  }

  return {
    title: isAr
      ? 'المدونة الهندسية والتقنية | شركة جرين سلوشن للمقاولات'
      : 'Engineering Journal & Technical Insights | Green Solution KSA',
    description: isAr
      ? 'أبحاث ودراسات متخصصة في شبكات الري الذكي، كود البناء السعودي للمناظر الطبيعية، وصيانة النخيل والمساحات الخضراء.'
      : 'Authoritative engineering articles, technical specifications, Saudi Building Code (SBC 02-L) guides, and smart irrigation case studies.',
  };
}

export default async function BlogCatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  let blogs: any[] = [];
  try {
    if (isPostgresConfigured()) {
      blogs = await pgGetBlogs({ publishedOnly: true });
    } else {
      const res = getBlogs({ isPublished: true, limit: 100 });
      blogs = res.blogs;
    }
  } catch {
    const res = getBlogs({ isPublished: true, limit: 100 });
    blogs = res.blogs;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: isAr ? 'مدونة جرين سلوشن الهندسية' : 'Green Solution Engineering Journal',
    description: isAr
      ? 'دراسات وأبحاث هندسية متقدمة في تنسيق المواقع وشبكات الري الذكي'
      : 'Advanced engineering case studies, smart irrigation protocols, and Saudi Building Code analysis.',
    publisher: {
      '@type': 'Organization',
      name: 'Green Solution Co.',
      url: 'https://greensolutionksa.com',
    },
    blogPost: blogs.map((b: any) => ({
      '@type': 'BlogPosting',
      headline: isAr ? b.titleAr : b.titleEn,
      description: isAr ? b.excerptAr : b.excerptEn,
      datePublished: b.createdAt,
      dateModified: b.updatedAt,
      image: b.image,
      url: `https://greensolutionksa.com/${locale}/blog/${b.slug}`,
    })),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. ULTRA SLEEK HERO HEADER */}
      <PageHero
        badge={{
          en: 'Engineering Journal',
          ar: 'المدونة الهندسية',
        }}
        title={{
          en: 'Insights & Innovation',
          ar: 'رؤى وابتكارات هندسية',
        }}
        subtitle={{
          en: 'Expert perspectives on smart irrigation, landscape architecture, and sustainable environments in Saudi Arabia.',
          ar: 'أحدث الرؤى الهندسية حول تقنيات الري الذكي وتنسيق المواقع المستدامة بالمملكة.',
        }}
        breadcrumbs={[
          {
            labelEn: 'Blog',
            labelAr: 'المدونة',
          },
        ]}
        stats={[
          {
            value: `${blogs.length}+`,
            labelEn: 'Articles',
            labelAr: 'دراسة ومقال',
          },
          {
            value: 'SBC',
            labelEn: 'Code Guides',
            labelAr: 'أدلة معتمدة',
          },
          {
            value: 'SCADA',
            labelEn: 'Water Studies',
            labelAr: 'أبحاث الري',
          },
        ]}
        backgroundImage="/img/service-6.jpg"
      />

      {/* 2. ARTICLES CONTAINER */}
      <section className="py-16 bg-neutral-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogListClient blogs={blogs} locale={locale} />

          {/* Consultation CTA Card */}
          <div className="mt-16 bg-[#14161F] text-white p-8 sm:p-12 rounded-none border-t-4 border-[#1D8F2C] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 text-center md:text-start relative z-10">
              <span className="inline-block px-3 py-1 rounded-none bg-[#1D8F2C]/20 text-[#1D8F2C] text-xs font-bold uppercase tracking-wider font-[var(--font-display)] border-l-2 border-[#1D8F2C]">
                {isAr ? 'استشارة هندسية' : 'Engineering Advisory'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-[var(--font-display)]">
                {isAr
                  ? 'هل تحتاج إلى تدقيق هندسي لمخططات مشروعك؟'
                  : 'Require Technical Review for Irrigation or Hardscape?'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                {isAr
                  ? 'فريقنا الهندسي جاهز لمراجعة المخططات التنفيذية وتقديم التوصيات المطابقة لمعايير المملكة.'
                  : 'Our licensed engineers review tender drawings, calculate hydraulic loads, and certify SBC code compliance.'}
              </p>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="px-7 py-3 rounded-none bg-[#1D8F2C] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#167423] transition-colors shrink-0 relative z-10 uppercase tracking-wider"
            >
              <span>{isAr ? 'طلب استشارة هندسية' : 'Consult Our Engineers'}</span>
              <span className="rtl:rotate-180 ms-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
