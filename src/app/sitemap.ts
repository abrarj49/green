import { MetadataRoute } from 'next';
import { servicesData } from '@/data/services';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.greensolutionksa.com';
const locales = ['en', 'ar'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  const basePaths = [
    '',
    '/about',
    '/services',
    '/projects',
    '/clients',
    '/contact',
  ];

  // Base pages for both locales
  for (const locale of locales) {
    for (const path of basePaths) {
      routes.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${path}`,
            ar: `${SITE_URL}/ar${path}`,
          },
        },
      });
    }

    // All 13 individual service pages
    for (const service of servicesData) {
      routes.push({
        url: `${SITE_URL}/${locale}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${SITE_URL}/en/services/${service.slug}`,
            ar: `${SITE_URL}/ar/services/${service.slug}`,
          },
        },
      });
    }
  }

  return routes;
}
