import { setRequestLocale } from 'next-intl/server';
import HomePageClient from '@/components/HomePageClient';
import { getSiteSeo } from '@/lib/sqlite';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const seo = getSiteSeo('home');

  if (seo) {
    return {
      title: isAr ? seo.titleAr : seo.titleEn,
      description: isAr ? seo.descAr : seo.descEn,
      keywords: isAr ? seo.keywordsAr : seo.keywordsEn,
      alternates: {
        canonical: seo.canonicalUrl || `https://greensolutionksa.com/${locale}`,
      },
      openGraph: {
        title: isAr ? seo.titleAr : seo.titleEn,
        description: isAr ? seo.descAr : seo.descEn,
        url: `https://greensolutionksa.com/${locale}`,
        siteName: 'Green Solution KSA',
        images: [{ url: seo.ogImage || '/images/hero-1.webp' }],
      },
    };
  }

  return {
    title: isAr
      ? 'جرين سلوشن السعودية | مقاولات تنسيق المواقع وشبكات الري الذكي'
      : 'Green Solution KSA | Commercial Landscaping & Smart Irrigation Systems',
    description: isAr
      ? 'شركة سعودية متخصصة في مقاولات وتصميم اللاندسكيب وشبكات الري الذكية والمسطحات الخضراء ومطابقة كود البناء السعودي.'
      : 'Leading Saudi commercial landscape contractor specializing in architectural masterplanning, smart irrigation systems, hardscape, and Vision 2030 green developments.',
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <HomePageClient />;
}
