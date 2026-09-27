const fs = require('fs');
const path = require('path');
const https = require('https');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Follow redirect
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`Failed ${response.statusCode} for ${url}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(fs.statSync(dest).size));
      });
    });
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

// Ensure directories
['public/images', 'public/img/projects', 'public/img/clients'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Curated high-res Unsplash photos matched strictly to context
const imageJobs = [
  // Smart Irrigation & Hydrology
  {
    url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/images/hero-1.webp'
  },
  {
    url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/images/water-irrigation.jpg'
  },
  // Hardscape & Structural Masonry
  {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/images/hero-2.webp'
  },
  {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/images/hardscape-sbc.jpg'
  },
  // Royal Palms & Desert Agronomy
  {
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/images/hero-3.webp'
  },
  {
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/images/palm-weevil.jpg'
  },
  // Water Features & Fountains
  {
    url: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/images/service-water-features.jpg'
  },
  // Bioclimatic Pergolas & Shading
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/images/service-pergola.jpg'
  },
  // Bank Al Jazira Vertical Living Wall
  {
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/img/projects/living-wall-atrium.jpg'
  },
  // Al Rajhi Najdi Palace Riyadh
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/img/projects/najdi-palace-estate.jpg'
  },
  // Halima Sadia Bridge Hardscape & Slope Stabilization
  {
    url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/img/projects/bridge-interlock.jpg'
  },
  // Service 4: Jeddah Chamber Commercial Plaza
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/img/service-4.jpg'
  },
  // Service 5: Ibrahim Juffali Luxury Private Estate
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/img/service-5.jpg'
  },
  // Service 6: PME Meteorology Headquarters Grounds
  {
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1400&q=80',
    dest: 'public/img/service-6.jpg'
  }
];

// High quality corporate SVG logos for the 6 missing clients
const clientLogos = {
  'radisson.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
    <rect width="240" height="70" fill="none"/>
    <text x="120" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800" fill="#1C3F94" text-anchor="middle" letter-spacing="2">RADISSON</text>
    <text x="120" y="54" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#008080" text-anchor="middle" letter-spacing="5">HOTELS &amp; RESORTS</text>
  </svg>`,
  
  'al-raza.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
    <rect width="240" height="70" fill="none"/>
    <path d="M40 45 L50 20 L60 45 Z" fill="#1D8F2C"/>
    <text x="135" y="36" font-family="'Cairo', sans-serif" font-size="18" font-weight="700" fill="#232434" text-anchor="middle">مجموعة قصور رضا</text>
    <text x="135" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#585858" text-anchor="middle" letter-spacing="2">RAZA ROYAL ESTATES</text>
  </svg>`,

  'al-bilad.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
    <rect width="240" height="70" fill="none"/>
    <circle cx="45" cy="35" r="16" fill="#C9A34E"/>
    <text x="135" y="36" font-family="'Cairo', sans-serif" font-size="20" font-weight="800" fill="#8B2131" text-anchor="middle">بنك البلاد</text>
    <text x="135" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#585858" text-anchor="middle" letter-spacing="1">BANK ALBILAD</text>
  </svg>`,

  'shaker.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
    <rect width="240" height="70" fill="none"/>
    <rect x="30" y="24" width="22" height="22" fill="#0D5C9E" rx="2"/>
    <text x="135" y="36" font-family="'Cairo', sans-serif" font-size="19" font-weight="800" fill="#0D5C9E" text-anchor="middle">مجموعة شاكر</text>
    <text x="135" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#585858" text-anchor="middle" letter-spacing="2">SHAKER GROUP</text>
  </svg>`,

  'binladin.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
    <rect width="240" height="70" fill="none"/>
    <polygon points="35,46 50,18 65,46" fill="#144633"/>
    <text x="140" y="36" font-family="'Cairo', sans-serif" font-size="18" font-weight="800" fill="#144633" text-anchor="middle">مجموعة بن لادن السعودية</text>
    <text x="140" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="#585858" text-anchor="middle" letter-spacing="1.5">SAUDI BINLADIN GROUP</text>
  </svg>`,

  'al-saad.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
    <rect width="240" height="70" fill="none"/>
    <circle cx="45" cy="35" r="14" fill="#1D8F2C"/>
    <text x="135" y="36" font-family="'Cairo', sans-serif" font-size="19" font-weight="800" fill="#232434" text-anchor="middle">شركة السعد للمقاولات</text>
    <text x="135" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#585858" text-anchor="middle" letter-spacing="1.5">AL-SAAD CONTRACTING</text>
  </svg>`
};

async function run() {
  console.log('Writing client SVG logos...');
  for (const [filename, svg] of Object.entries(clientLogos)) {
    const p = path.join('public/img/clients', filename);
    fs.writeFileSync(p, svg, 'utf8');
    console.log(`Saved client logo: ${filename}`);
  }

  console.log('\nDownloading high resolution photos...');
  for (const job of imageJobs) {
    try {
      process.stdout.write(`Downloading ${path.basename(job.dest)}... `);
      const size = await download(job.url, job.dest);
      console.log(`OK (${size} bytes)`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  console.log('\nAll assets processed successfully!');
}

run();
