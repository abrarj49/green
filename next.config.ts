import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  serverExternalPackages: ['node:sqlite'],
  outputFileTracingIncludes: {
    '/**': ['./data/green.db'],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://green-solution-site-website.vercel.app',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@greensolutionksa.com',
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL || 'chhameed@greensolutionksa.com',
    JWT_SECRET: process.env.JWT_SECRET || 'green-solution-jwt-secret-key-prod-2026',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'greensolutionksa.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
