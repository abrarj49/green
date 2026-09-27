import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import StructuredData from '@/components/StructuredData';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import CustomCursor from '@/components/CustomCursor';
import '../globals.css';

// Google Fonts via next/font — Sungo & Eco-Luxury design system
import { Montserrat_Alternates, Plus_Jakarta_Sans, Cairo } from 'next/font/google';

const montserrat = Montserrat_Alternates({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    en: 'Green Solution KSA | Landscape Design & Environmental Services',
    ar: 'جرين سلوشن السعودية | تصميم المناظر الطبيعية والخدمات البيئية',
  };

  const descriptions: Record<string, string> = {
    en: 'Green Solution KSA delivers premium landscape design, irrigation, hardscape and environmental services across Saudi Arabia. 25+ years of horticultural expertise, 55+ completed projects.',
    ar: 'تقدم جرين سلوشن السعودية خدمات متميزة في تصميم المناظر الطبيعية والري والأعمال الصلبة والخدمات البيئية في جميع أنحاء المملكة العربية السعودية.',
  };

  const otherLocale = locale === 'en' ? 'ar' : 'en';

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        [locale]: `/${locale}`,
        [otherLocale]: `/${otherLocale}`,
      },
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      siteName: locale === 'ar' ? 'جرين سلوشن السعودية' : 'Green Solution KSA',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    other: {
      'theme-color': '#1D8F2C',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      lang={locale}
      dir={dir}
      className={`${montserrat.variable} ${plusJakarta.variable} ${cairo.variable} min-h-screen ${
        locale === 'ar' ? 'font-arabic' : 'font-sans'
      }`}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${dir}";`,
        }}
      />
      <StructuredData locale={locale} />
      <NextIntlClientProvider messages={messages}>
        <SmoothScroll />
        <ScrollProgressBar />
        <CustomCursor />
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
