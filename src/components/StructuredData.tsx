export default function StructuredData({ locale }: { locale: string }) {
  const isAr = locale === 'ar';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: isAr ? 'شركة جرين سلوشن' : 'Green Solution Co.',
    alternateName: isAr ? 'Green Solution KSA' : 'شركة جرين سلوشن',
    url: 'https://www.greensolutionksa.com',
    logo: 'https://www.greensolutionksa.com/logo.png',
    telephone: '+966-595998808',
    email: 'chhameed@greensolutionksa.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office #10, Al Kakiyah Building, Al Imam Al Shafei Street, Al Faisaliyyah Dist.',
      addressLocality: 'Jeddah',
      addressRegion: 'Makkah Province',
      postalCode: '21514',
      addressCountry: 'SA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '21.543333',
      longitude: '39.172778',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
        ],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Jeddah' },
      { '@type': 'AdministrativeArea', name: 'Riyadh' },
      { '@type': 'AdministrativeArea', name: 'Makkah' },
      { '@type': 'AdministrativeArea', name: 'Madinah' },
      { '@type': 'AdministrativeArea', name: 'Yanbu' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
    sameAs: [
      'https://www.facebook.com/greensolutionksa',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
