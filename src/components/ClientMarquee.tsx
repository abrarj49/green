'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export const trustedClients = [
  {
    name: 'Saudia Airlines',
    nameAr: 'الخطوط السعودية',
    logo: '/img/clients/saudia.svg',
    width: 170,
    height: 44,
  },
  {
    name: 'Ministry of Environment, Water & Agriculture',
    nameAr: 'وزارة البيئة والمياه والزراعة',
    logo: '/img/clients/mewa.svg',
    width: 185,
    height: 44,
  },
  {
    name: 'King Abdulaziz University',
    nameAr: 'جامعة الملك عبدالعزيز',
    logo: '/img/clients/kau.svg',
    width: 175,
    height: 44,
  },
  {
    name: 'Jeddah Chamber of Commerce',
    nameAr: 'غرفة جدة',
    logo: '/img/clients/jcci.svg',
    width: 165,
    height: 44,
  },
  {
    name: 'King Abdullah Sports City',
    nameAr: 'مدينة الملك عبدالله الرياضية',
    logo: '/img/clients/kasc.svg',
    width: 180,
    height: 44,
  },
  {
    name: 'Bank AlJazira',
    nameAr: 'بنك الجزيرة',
    logo: '/img/clients/bank-aljazira.svg',
    width: 170,
    height: 44,
  },
  {
    name: 'Ibrahim Juffali & Brothers',
    nameAr: 'إبراهيم الجفالي وإخوانه',
    logo: '/img/clients/juffali.svg',
    width: 170,
    height: 44,
  },
  {
    name: 'Al Muhaidib Group',
    nameAr: 'مجموعة المهيدب',
    logo: '/img/clients/almuhaidib.svg',
    width: 175,
    height: 44,
  },
  {
    name: 'Fluor Arabia',
    nameAr: 'فلور العربية',
    logo: '/img/clients/fluor.svg',
    width: 160,
    height: 44,
  },
  {
    name: 'Westin Hotels & Resorts',
    nameAr: 'فنادق ومنتجعات ويستن',
    logo: '/img/clients/westin.svg',
    width: 165,
    height: 44,
  },
  {
    name: 'China Harbour Engineering',
    nameAr: 'الشركة الصينية لهندسة الموانئ',
    logo: '/img/clients/chec.svg',
    width: 165,
    height: 44,
  },
  {
    name: 'Abdulrahman Alshareef Group',
    nameAr: 'مجموعة عبدالرحمن الشريف',
    logo: '/img/clients/alshareef.svg',
    width: 175,
    height: 44,
  },
  {
    name: 'RIO Contracting',
    nameAr: 'شركة ريو للتجارة والمقاولات',
    logo: '/img/clients/rio.svg',
    width: 160,
    height: 44,
  },
];

export default function ClientMarquee() {
  // Seamless loop with two identical arrays
  const doubled = [...trustedClients, ...trustedClients];

  return (
    <div className="relative overflow-hidden py-4 select-none">
      {/* Left/Right Fade Gradients for a high-end editorial look */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

      <motion.div
        className="flex gap-6 sm:gap-8 items-center whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            duration: 38,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
        style={{ direction: 'ltr' }}
      >
        {doubled.map((client, i) => (
          <div
            key={i}
            className="flex-shrink-0 px-6 py-3.5 bg-neutral-50/80 hover:bg-white border border-neutral-200/70 hover:border-primary/30 rounded-xl transition-all duration-300 hover:shadow-sm flex items-center justify-center group"
            title={`${client.name} | ${client.nameAr}`}
          >
            <div className="relative h-9 flex items-center justify-center filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
              <Image
                src={client.logo}
                alt={client.name}
                width={client.width}
                height={client.height}
                className="h-8 sm:h-9 w-auto object-contain max-w-[180px]"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

