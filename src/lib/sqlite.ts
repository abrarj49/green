import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { servicesData } from '@/data/services';

export interface DbSubmission {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  locale: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbBlog {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  category: string;
  image: string;
  authorEn: string;
  authorAr: string;
  readTime: string;
  tags: string[];
  isPublished: boolean;
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescEn: string;
  metaDescAr: string;
  keywords: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbCmsService {
  slug: string;
  category: string;
  divisionCode: string;
  image: string;
  titleEn: string;
  titleAr: string;
  shortDescEn: string;
  shortDescAr: string;
  fullDescEn: string;
  fullDescAr: string;
  featuresEn: string[];
  featuresAr: string[];
  deliverablesEn: string[];
  deliverablesAr: string[];
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescEn: string;
  metaDescAr: string;
  keywords: string;
  updatedAt: string;
}

export interface DbSiteSeo {
  pageKey: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  keywordsEn: string;
  keywordsAr: string;
  ogImage: string;
  canonicalUrl: string;
  updatedAt: string;
}

// Global cache to maintain a single SQLite connection across hot-reloads
interface SqliteCache {
  db: DatabaseSync | null;
}

declare global {
  // eslint-disable-next-line no-var
  var sqliteCache: SqliteCache | undefined;
}

const cached: SqliteCache = global.sqliteCache || { db: null };
if (!global.sqliteCache) {
  global.sqliteCache = cached;
}

export function getSqliteDb(): DatabaseSync {
  if (cached.db) {
    return cached.db;
  }

  const dataDir = path.join(process.cwd(), 'data');
  let dbPath = path.join(dataDir, 'green.db');

  // In Vercel serverless functions, the root filesystem is read-only.
  // Use /tmp where write permissions are fully supported.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join('/tmp', 'green.db');
    try {
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, tmpDbPath);
      }
      dbPath = tmpDbPath;
    } catch {
      dbPath = tmpDbPath;
    }
  } else {
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // ignore
      }
    }
  }

  const db = new DatabaseSync(dbPath);

  // Enable WAL mode or fallback to MEMORY journal mode for serverless
  try {
    db.exec('PRAGMA journal_mode = WAL;');
  } catch {
    try {
      db.exec('PRAGMA journal_mode = MEMORY;');
    } catch {
      // ignore
    }
  }

  // 1. Initialize Submissions Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL DEFAULT 'general',
      message TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'en',
      status TEXT NOT NULL DEFAULT 'new',
      source TEXT NOT NULL DEFAULT 'contact-page',
      notes TEXT DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
    CREATE INDEX IF NOT EXISTS idx_submissions_service ON submissions(service);
    CREATE INDEX IF NOT EXISTS idx_submissions_createdAt ON submissions(createdAt DESC);
  `);

  // 2. Initialize Blogs Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      titleEn TEXT NOT NULL,
      titleAr TEXT NOT NULL,
      excerptEn TEXT NOT NULL,
      excerptAr TEXT NOT NULL,
      contentEn TEXT NOT NULL,
      contentAr TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      image TEXT NOT NULL,
      authorEn TEXT NOT NULL DEFAULT 'Green Solution Agronomy Board',
      authorAr TEXT NOT NULL DEFAULT 'هيئة الخبراء الزراعيين بجرين سلوشن',
      readTime TEXT NOT NULL DEFAULT '5 min read',
      tags TEXT NOT NULL DEFAULT '[]',
      isPublished INTEGER NOT NULL DEFAULT 1,
      metaTitleEn TEXT NOT NULL DEFAULT '',
      metaTitleAr TEXT NOT NULL DEFAULT '',
      metaDescEn TEXT NOT NULL DEFAULT '',
      metaDescAr TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
    CREATE INDEX IF NOT EXISTS idx_blogs_isPublished ON blogs(isPublished);
    CREATE INDEX IF NOT EXISTS idx_blogs_createdAt ON blogs(createdAt DESC);
  `);

  // 3. Initialize Services CMS Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS services_cms (
      slug TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      divisionCode TEXT NOT NULL DEFAULT 'DIV 01',
      image TEXT NOT NULL,
      titleEn TEXT NOT NULL,
      titleAr TEXT NOT NULL,
      shortDescEn TEXT NOT NULL,
      shortDescAr TEXT NOT NULL,
      fullDescEn TEXT NOT NULL,
      fullDescAr TEXT NOT NULL,
      featuresEn TEXT NOT NULL,
      featuresAr TEXT NOT NULL,
      deliverablesEn TEXT NOT NULL,
      deliverablesAr TEXT NOT NULL,
      metaTitleEn TEXT NOT NULL DEFAULT '',
      metaTitleAr TEXT NOT NULL DEFAULT '',
      metaDescEn TEXT NOT NULL DEFAULT '',
      metaDescAr TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL DEFAULT '',
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_services_category ON services_cms(category);
  `);

  // 4. Initialize Site SEO Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_seo (
      pageKey TEXT PRIMARY KEY,
      titleEn TEXT NOT NULL,
      titleAr TEXT NOT NULL,
      descEn TEXT NOT NULL,
      descAr TEXT NOT NULL,
      keywordsEn TEXT NOT NULL,
      keywordsAr TEXT NOT NULL,
      ogImage TEXT NOT NULL DEFAULT '/img/hero-royal-palace.jpg',
      canonicalUrl TEXT NOT NULL DEFAULT '',
      updatedAt TEXT NOT NULL
    );
  `);

  // Auto-seed Submissions if empty
  try {
    const countCheck = db.prepare('SELECT COUNT(*) as count FROM submissions').get() as { count: number };
    if (!countCheck || countCheck.count === 0) {
      const seedStmt = db.prepare(`
        INSERT INTO submissions (id, name, email, phone, service, message, locale, status, source, notes, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const now = Date.now();
      seedStmt.run(
        'sub_seed_1',
        'Sheikh Khalid Al-Ghamdi',
        'khalid.ghamdi@example.sa',
        '+966 50 123 4567',
        'landscape-design-planning',
        'Looking for a complete landscape master plan and 3D architectural renders for a 2,500 m² private estate in North Obhur, Jeddah.',
        'ar',
        'new',
        'contact-page',
        'Preliminary site appraisal requested for Obhur villa.',
        new Date(now - 1000 * 60 * 45).toISOString(),
        new Date(now - 1000 * 60 * 45).toISOString()
      );

      seedStmt.run(
        'sub_seed_2',
        'Eng. Tariq Mansour',
        'tmansour@redseadevelop.sa',
        '+966 55 987 6543',
        'irrigation-drainage-networks',
        'Requesting technical proposal for smart weather-based central irrigation network (Rain Bird IQ4) upgrade for commercial plaza.',
        'en',
        'read',
        'homepage-popup',
        'Discussed telemetry decoders and flow sensors. Awaiting BoQ.',
        new Date(now - 1000 * 60 * 60 * 5).toISOString(),
        new Date(now - 1000 * 60 * 60 * 2).toISOString()
      );

      seedStmt.run(
        'sub_seed_3',
        'Dr. Abdulaziz Al-Otaibi',
        'a.otaibi@aljazira-group.sa',
        '+966 54 321 0987',
        'turf-grass-lawn-solutions',
        'Need consultation on hybrid Bermuda sports turf installation with sub-base laser grading and salinity monitoring.',
        'ar',
        'replied',
        'services-page',
        'Quotation sent via email. Site visit scheduled for Sunday.',
        new Date(now - 1000 * 60 * 60 * 26).toISOString(),
        new Date(now - 1000 * 60 * 60 * 12).toISOString()
      );
    }
  } catch (err) {
    console.warn('Seed submissions error:', err);
  }

  // Auto-seed Services CMS if empty
  try {
    const srvCount = db.prepare('SELECT COUNT(*) as count FROM services_cms').get() as { count: number };
    if (!srvCount || srvCount.count === 0) {
      const visualLookup: Record<string, { image: string; divisionCode: string }> = {
        'landscape-design-planning': { image: '/img/services/landscape-design.jpg', divisionCode: 'DIV 01' },
        'outdoor-paving-hardscape': { image: '/img/services/outdoor-paving.jpg', divisionCode: 'DIV 02' },
        'urban-green-space-management': { image: '/img/services/urban-green.jpg', divisionCode: 'DIV 03' },
        'garden-pergolas-shade': { image: '/img/services/pergolas-shade.jpg', divisionCode: 'DIV 04' },
        'swimming-pools-water-features': { image: '/img/services/water-features.jpg', divisionCode: 'DIV 05' },
        'indoor-plantscapes-maintenance': { image: '/img/services/botanical-care.jpg', divisionCode: 'DIV 06' },
        'irrigation-drainage-networks': { image: '/img/services/irrigation-networks.jpg', divisionCode: 'DIV 07' },
        'turf-grass-lawn-solutions': { image: '/img/services/turf-grass.jpg', divisionCode: 'DIV 08' },
        'botanical-care-plant-health': { image: '/img/services/botanical-care.jpg', divisionCode: 'DIV 09' },
        'architectural-outdoor-lighting': { image: '/img/services/pergolas-shade.jpg', divisionCode: 'DIV 10' },
        'structural-earthworks-grading': { image: '/img/services/outdoor-paving.jpg', divisionCode: 'DIV 11' },
        'integrated-pest-management': { image: '/img/services/botanical-care.jpg', divisionCode: 'DIV 12' },
        'commercial-landscape-maintenance': { image: '/img/services/urban-green.jpg', divisionCode: 'DIV 13' },
      };

      const insertServiceStmt = db.prepare(`
        INSERT INTO services_cms (
          slug, category, divisionCode, image, titleEn, titleAr, shortDescEn, shortDescAr,
          fullDescEn, fullDescAr, featuresEn, featuresAr, deliverablesEn, deliverablesAr,
          metaTitleEn, metaTitleAr, metaDescEn, metaDescAr, keywords, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const now = new Date().toISOString();
      for (let i = 0; i < servicesData.length; i++) {
        const s = servicesData[i];
        const v = visualLookup[s.slug] || {
          image: '/img/services/landscape-design.jpg',
          divisionCode: `DIV ${String(i + 1).padStart(2, '0')}`,
        };

        insertServiceStmt.run(
          s.slug,
          s.category,
          v.divisionCode,
          v.image,
          s.titleEn,
          s.titleAr,
          s.shortDescEn,
          s.shortDescAr,
          s.fullDescEn,
          s.fullDescAr,
          JSON.stringify(s.featuresEn),
          JSON.stringify(s.featuresAr),
          JSON.stringify(s.deliverablesEn),
          JSON.stringify(s.deliverablesAr),
          `${s.titleEn} | Green Solution KSA`,
          `${s.titleAr} | جرين سلوشن السعودية`,
          s.shortDescEn,
          s.shortDescAr,
          'landscape, irrigation, saudi arabia, contracting, hardscape, green solution',
          now
        );
      }
    }
  } catch (err) {
    console.warn('Seed services_cms error:', err);
  }

  // Auto-seed Blogs if empty
  try {
    const blogCount = db.prepare('SELECT COUNT(*) as count FROM blogs').get() as { count: number };
    if (!blogCount || blogCount.count === 0) {
      const insertBlogStmt = db.prepare(`
        INSERT INTO blogs (
          id, slug, titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr,
          category, image, authorEn, authorAr, readTime, tags, isPublished,
          metaTitleEn, metaTitleAr, metaDescEn, metaDescAr, keywords, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const now = Date.now();

      insertBlogStmt.run(
        'blog_1',
        'smart-irrigation-water-savings-saudi-arabia',
        'Smart Irrigation in Saudi Arabia: Achieving 30%+ Verified Water Conservation',
        'الري الذكي في المملكة العربية السعودية: تحقيق وفر مائي يتجاوز 30%',
        'How SCADA-integrated central controllers, weather stations, and subsurface drip networks are transforming commercial campuses across Riyadh, Jeddah, and the Eastern Province.',
        'كيف تسهم أنظمة التحكم المركزي SCADA ومحطات الأرصاد والري بالتنقيط في إحداث ثورة في ترشيد مياه المجمعات الكبرى ومطابقة أهداف رؤية 2030.',
        `# Smart Irrigation in Saudi Arabia: Achieving 30%+ Verified Water Conservation\n\nWater is the Kingdom's most precious resource. With the accelerating momentum of the **Saudi Green Initiative (SGI)** and municipal sustainability mandates, traditional timer-based irrigation systems are rapidly being retired in favor of high-precision hydraulic automation.\n\n## 1. The Limitations of Conventional Clock Timers\nTraditional clock timers irrigate irrespective of soil moisture, ambient humidity, or wind speed. In hyper-arid regions such as Riyadh and the Western Province, evaporation rates can exceed 12 mm per day during summer months. Overwatering not only depletes aquifers but also induces root rot and increases soil salinity.\n\n## 2. Telemetry and Weather-Based Central Control\nModern commercial landscapes utilize central control systems such as **Rain Bird IQ4** and **Hunter ACC2 Decoder Satellites**. Connected to on-site micro-meteorological stations, these systems adjust daily run times according to real-time Evapotranspiration (ET) calculations.\n\n- **Flow Sensing:** Immediate burst pipe shutdown to prevent erosion and water wastage.\n- **Subsurface Drip Irrigation (SDI):** Delivering water directly to the rootzone, eliminating spray evaporation losses.\n- **Soil Moisture Telemetry:** Solar-powered capacitance sensors verifying hydration before any solenoid valve is actuated.\n\n## 3. Measurable Economic and Environmental ROI\nFor large-scale corporate headquarters and residential compounds, transitioning to smart hydraulic control yields an average of **32% to 44% in monthly water utility savings**, with complete capital expenditure payback achieved within 14 to 18 months.`,
        `# الري الذكي في المملكة العربية السعودية: تحقيق وفر مائي يتجاوز 30%\n\nتعد المياه أثمن الموارد الطبيعية في المملكة. ومع تسارع مبادرة **السعودية الخضراء** والتشريعات البيئية الحديثة، أصبح التحول من أنظمة الري التقليدية إلى الشبكات الهيدروليكية الذكية ضرورة هندسية واقتصادية ملحة.\n\n## 1. عيوب المؤقتات الزمنية القديمة\nتعتمد أنظمة الري القديمة على جداول ثابتة تهدر المياه دون مراعاة درجات الحرارة أو سرعة الرياح أو رطوبة التربة، مما يؤدي إلى زيادة ملوحة التربة وتلف الجذور.\n\n## 2. أنظمة التحكم المركزي ومحطات الأرصاد\nتعتمد شركة جرين سلوشن على تقنيات **Rain Bird IQ4** و**Hunter ACC2**، حيث ترتبط الشبكة بحساسات مناخية تحسب معدل البخر-نتح (ET) يومياً وتضبط كميات الضخ بدقة متناهية.\n\n- **حساسات التدفق:** إغلاق فوري للخطوط في حال حدوث أي كسر لتفادي هدر المياه.\n- **الري بالتنقيط تحت السطحي:** إيصال المياه مباشرة لعمق الجذور دون تعرضها للتبخر السطحي.\n- **مجسات رطوبة التربة:** قياس دقيق لحاجة النبات الفعلية قبل تشغيل المحابس.\n\n## 3. العائد الاستثماري والبيئي\nتسهم هذه الأنظمة في خفض فواتير المياه بنسب تتراوح بين **30% و45%** للمجمعات التجارية والقصور، مع استرداد تكلفة النظام خلال فترة وجيزة.`,
        'water-irrigation',
        '/img/services/irrigation-networks.jpg',
        'Eng. Hameed Ch',
        'م. حميد تشودري',
        '6 min read',
        JSON.stringify(['Smart Irrigation', 'Water Conservation', 'Rain Bird IQ4', 'Vision 2030']),
        1,
        'Smart Irrigation in Saudi Arabia: 30%+ Water Conservation | Green Solution KSA',
        'الري الذكي في السعودية: تحقيق وفر مائي 30%+ | جرين سلوشن',
        'Discover how smart weather-based central irrigation networks cut water consumption by over 30% across Saudi Arabia commercial landscapes.',
        'تعرف على كيفية تحقيق أنظمة الري الذكية وفراً مائياً يتجاوز 30% في المشاريع والمجمعات الكبرى بالمملكة.',
        'smart irrigation saudi arabia, water conservation ksa, rain bird iq4, drip irrigation jeddah, riyadh landscape',
        new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
        new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString()
      );

      insertBlogStmt.run(
        'blog_2',
        'saudi-building-code-hardscape-specifications',
        'Engineering Luxury Hardscapes: SBC 02-L Compliance for Palaces & Plazas',
        'هندسة الهاردسكيب الفاخر: معايير كود البناء السعودي SBC 02-L للقصور والساحات',
        'A comprehensive engineering review of sub-base Proctor compaction testing, thermal expansion joint design, and natural stone selection for extreme desert climates.',
        'دليل هندسي شامل حول اختبارات دمك الأساس بروكتر 95%، وفواصل التمدد الحراري، وانتقاء الترافرتين والجرانيت لتحمل الأحمال العالية.',
        `# Engineering Luxury Hardscapes: SBC 02-L Compliance for Palaces & Plazas\n\nDesigning paved outdoor plazas, grand residential entrance driveways, and palatial courtyards in Saudi Arabia demands far more than surface aesthetics. Thermal expansion extremes—ranging from 5°C on winter desert nights to over 55°C under direct summer sun—can rapidly destroy substandard stone installations.\n\n## 1. Geotechnical Compaction & Proctor Testing\nEvery enduring hardscape begins beneath the visible surface. Under the **Saudi Building Code (SBC 02-L)**, sub-base preparation requires laser-controlled grading and aggregate compaction achieving a minimum of **95% Modified Proctor Density**.\n\n## 2. Thermal Expansion Joint Engineering\nNatural stone and concrete pavers expand significantly in desert heat. Failure to integrate perimeter expansion joints and field divider joints every 4 to 6 meters inevitably results in buckling, cracked pavers, and mortar degradation.\n\n## 3. Travertine, Granite & Solar Reflectance (SRI)\nSelecting stone with an adequate Solar Reflectance Index (SRI) reduces surface heat absorption, keeping pedestrian walkways cooler and preventing thermal degradation of sub-surface utilities.`,
        `# هندسة الهاردسكيب الفاخر: معايير كود البناء السعودي SBC 02-L للقصور والساحات\n\nيتطلب تنفيذ الممرات وساحات القصور الفاخرة ومواقف السيارات بالمملكة دقة هندسية صارمة تتجاوز المظهر الجمالي، لمواجهة التمدد الحراري الذي يتراوح بين 5 درجات شتاءً وأكثر من 55 درجة مئوية صيفاً.\n\n## 1. دمك طبقات الأساس واختبارات بروكتر\nوفقاً لكود البناء السعودي **SBC 02-L**، يجب تسوية طبقات الأساس بالليزر مع تحقيق كثافة دمك لا تقل عن **95% باختبار بروكتر المعدل** لضمان عدم حدوث أي هبوط مستقبلي.\n\n## 2. فواصل التمدد الحراري الدقيقة\nيجب توزيع فواصل التمدد المرنة كل 4 إلى 6 أمتار لمنع تكسر الحجر أو انفصاله نتيجة الإجهادات الحرارية العالية.\n\n## 3. اختيار الأحجار ومؤشر الانعكاس الشمسي (SRI)\nنعتمد على الترافرتين والجرانيت المعالج ذي الانعكاس الشمسي المرتفع للحفاظ على برودة الممرات وتوفير بيئة مشاة مريحة.`,
        'hardscape-structures',
        '/img/services/outdoor-paving.jpg',
        'Architectural Division',
        'إدارة الهندسة الإنشائية',
        '5 min read',
        JSON.stringify(['Hardscape Engineering', 'Saudi Building Code', 'Travertine Paving', 'SBC 02-L']),
        1,
        'Engineering Luxury Hardscapes: SBC 02-L Compliance | Green Solution KSA',
        'معايير كود البناء السعودي للهاردسكيب الفاخر | جرين سلوشن',
        'Technical guide to Saudi Building Code compliance, compaction testing, and thermal expansion joints for commercial and royal hardscapes.',
        'الدليل الهندسي الشامل لمطابقة كود البناء السعودي في تنفيذ أعمال الرصف والهاردسكيب للقصور والمشاريع الكبرى.',
        'sbc 02-l, hardscape saudi arabia, travertine paving ksa, luxury driveway contractor',
        new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
        new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString()
      );

      insertBlogStmt.run(
        'blog_3',
        'protecting-saudi-date-palms-red-palm-weevil',
        'Protecting Saudi Date Palms: Proven IPM Protocols Against Red Palm Weevil',
        'حماية النخيل في السعودية: بروتوكولات المكافحة المتكاملة ضد سوسة النخيل الحمراء',
        'Scientific strategies, preventative trunk micro-injections, and pheromone monitoring adhering to Ministry of Environment, Water and Agriculture (MEWA) regulations.',
        'استراتيجيات علمية، وحقن جذعي ميكروي وقائي، ومصائد فرمونية معتمدة من وزارة البيئة والمياه والزراعة لحماية ثروة النخيل.',
        `# Protecting Saudi Date Palms: Proven IPM Protocols Against Red Palm Weevil\n\nThe Date Palm (*Phoenix dactylifera*) is the biological and cultural cornerstone of the Saudi landscape. However, the Red Palm Weevil (*Rhynchophorus ferrugineus*) represents a severe threat to commercial plantations and prestigious landscape installations alike.\n\n## 1. Early Detection Methodology\nBecause larvae feed inside the trunk, visual symptoms often appear only after irreversible structural damage has occurred. Green Solution utilizes acoustic detection sensors and precision pheromone-kairomone traps for early infestation monitoring.\n\n## 2. Trunk Micro-Injection Protocols\nUnlike indiscriminate canopy spraying that contaminates soil and kills beneficial pollinators, targeted trunk micro-injection delivers precise systemic bio-rational insecticides directly into the vascular xylem, eliminating boring larvae from within.\n\n## 3. Preventative Hygiene & Pruning Standards\nAdhering to **MEWA** guidelines, pruning is performed exclusively during low-activity seasons, with immediate wound sealants applied to prevent adult female weevils from ovipositing into fresh frond cuts.`,
        `# حماية النخيل في السعودية: بروتوكولات المكافحة المتكاملة ضد سوسة النخيل الحمراء\n\nيمثل النخيل رمزاً وطنياً وبيئياً لا غنى عنه في كافة المشاريع السعودية. إلا أن حشرة سوسة النخيل الحمراء تشكل خطراً بالغاً يتطلب تدخلاً علمياً استباقياً.\n\n## 1. طرق الكشف المبكر\nتتغذى اليرقات داخل قلب الجذع، مما يجعل اكتشافها متأخراً في الطرق التقليدية. نستخدم مجسات صوتية ومصائد فرمونية حديثة للرصد المبكر.\n\n## 2. تقنية الحقن الجذعي المباشر\nبدلاً من الرش السطحي العشوائي الضار بالبيئة، نقوم بحقن مبيدات حيوية جهازية داخل الأوعية الخشبية للجذع مباشرة للقضاء على اليرقات بفعالية تامة.\n\n## 3. معايير التقليم والتعقيم المعتمدة من الوزارة\nنلتزم بجدول التقليم المعتمد من وزارة البيئة والمياه والزراعة مع طلاء الجروح فوراً بمواد عازلة تمنع وضع البيوض.`,
        'protection-services',
        '/img/services/botanical-care.jpg',
        'Agronomy Science Dept',
        'قسم العلوم الزراعية والوقاية',
        '4 min read',
        JSON.stringify(['Date Palms', 'Red Palm Weevil', 'MEWA Certified', 'Plant Health']),
        1,
        'Protecting Date Palms from Red Palm Weevil in KSA | Green Solution',
        'حماية النخيل من سوسة النخيل الحمراء في السعودية | جرين سلوشن',
        'Scientific Integrated Pest Management (IPM) protocols and trunk micro-injection for date palm preservation in Saudi Arabia.',
        'بروتوكولات علمية متكاملة للحقن الجذعي وحماية أشجار النخيل المعمرة في المملكة العربية السعودية.',
        'red palm weevil ksa, date palm treatment saudi, mewa palm protection, tree doctor jeddah',
        new Date(now - 1000 * 60 * 60 * 24 * 12).toISOString(),
        new Date(now - 1000 * 60 * 60 * 24 * 12).toISOString()
      );
    }
  } catch (err) {
    console.warn('Seed blogs error:', err);
  }

  // Auto-seed Site SEO if empty
  try {
    const seoCount = db.prepare('SELECT COUNT(*) as count FROM site_seo').get() as { count: number };
    if (!seoCount || seoCount.count === 0) {
      const insertSeoStmt = db.prepare(`
        INSERT INTO site_seo (
          pageKey, titleEn, titleAr, descEn, descAr, keywordsEn, keywordsAr, ogImage, canonicalUrl, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const now = new Date().toISOString();
      const defaultSeoPages = [
        {
          key: 'home',
          titleEn: 'Green Solution KSA | Landscape Architecture & Environmental Contracting',
          titleAr: 'جرين سلوشن السعودية | تخطيط وتنسيق المناظر الطبيعية والمقاولات البيئية',
          descEn: 'Leading Saudi contractor delivering turnkey landscape architecture, smart irrigation networks, royal estate gardens, and sports turf across the Kingdom.',
          descAr: 'شركة المقاولات السعودية الرائدة في تخطيط وتنسيق المناظر الطبيعية، شبكات الري الذكية، حدائق القصور الفاخرة، وملاعب كرة القدم بالمملكة.',
          keywordsEn: 'landscape design saudi arabia, smart irrigation jeddah, royal palace gardens riyadh, sports turf ksa, green solution',
          keywordsAr: 'تنسيق حدائق السعودية, شبكات ري ذكية جدة, حدائق قصور الرياض, ملاعب فيفا, مقاولات زراعية',
          ogImage: '/img/hero-royal-palace.jpg',
        },
        {
          key: 'about',
          titleEn: 'About Us | Green Solution Co. Saudi Arabia',
          titleAr: 'من نحن | شركة جرين سلوشن السعودية',
          descEn: '25+ years of international horticultural engineering experience, serving royal palatial grounds, top universities, and government ministries.',
          descAr: 'أكثر من 25 عاماً من الخبرة الهندسية والبستانية الدولية في خدمة القصور الملكية والجامعات والوزارات الحكومية بالمملكة.',
          keywordsEn: 'about green solution, saudi landscape company, horticultural engineers ksa',
          keywordsAr: 'عن جرين سلوشن, شركة لاندسكيب سعودية, مهندسون زراعيون المملكة',
          ogImage: '/img/why-nursery.jpg',
        },
        {
          key: 'services',
          titleEn: 'Engineering Divisions & Services | Green Solution KSA',
          titleAr: 'الأقسام والخدمات الهندسية | شركة جرين سلوشن السعودية',
          descEn: 'Explore 13 specialized engineering disciplines in landscape design, hydraulic irrigation networks, outdoor paving, and living green across Saudi Arabia.',
          descAr: 'استكشف 13 تخصصاً هندسياً وتنفيذياً في تخطيط وتنسيق الحدائق، شبكات الري الهيدروليكية، الهاردسكيب، والمسطحات الخضراء.',
          keywordsEn: 'landscape services ksa, commercial irrigation saudi, pergola installation, sports turf grading',
          keywordsAr: 'خدمات لاندسكيب السعودية, شبكات ري تجارية, تركيب مظلات وبرجولات, تسوية ملاعب',
          ogImage: '/img/services/landscape-design.jpg',
        },
        {
          key: 'projects',
          titleEn: 'Signature Projects Portfolio | Green Solution KSA',
          titleAr: 'سجل المشاريع والأعمال المنجزة | جرين سلوشن السعودية',
          descEn: 'Browse our portfolio of completed royal palaces, corporate headquarters, stadium pitches, and public parks across Saudi Arabia.',
          descAr: 'تصفح معرض مشاريعنا المنفذة في القصور الملكية، مقرات كبرى الشركات، الملاعب الرياضية، والحدائق العامة.',
          keywordsEn: 'landscape portfolio ksa, completed projects jeddah, stadium turf projects riyadh',
          keywordsAr: 'مشاريع لاندسكيب السعودية, مشاريع منجزة جدة, ملاعب الرياض',
          ogImage: '/img/hero-stadium.jpg',
        },
        {
          key: 'clients',
          titleEn: 'Our Clients & Institutional Alliances | Green Solution KSA',
          titleAr: 'عملاؤنا وشركاء المسيرة | جرين سلوشن السعودية',
          descEn: 'Trusted by Saudia Airlines, King Abdulaziz University, MEWA, Jeddah Chamber, King Abdullah Sports City, Fluor, and Al Muhaidib.',
          descAr: 'موثوقون من الخطوط السعودية، جامعة الملك عبدالعزيز، وزارة البيئة والمياه والزراعة، غرفة جدة، ومدينة الملك عبدالله الرياضية.',
          keywordsEn: 'saudi clients, mewa contractor, royal palace client roster',
          keywordsAr: 'عملاء جرين سلوشن, مقاول معتمد الوزارة, شركاء النجاح',
          ogImage: '/img/hero-royal-palace.jpg',
        },
        {
          key: 'contact',
          titleEn: 'Request Project Consultation & BoQ | Green Solution KSA',
          titleAr: 'طلب استشارة فنية وعرض سعر | جرين سلوشن السعودية',
          descEn: 'Contact our landscape architects and irrigation hydrologists for technical proposals, site inspections, and customized BoQ estimates.',
          descAr: 'تواصل مع مهندسينا المعماريين وخبراء الري للحصول على دراسات فنية، معاينات ميدانية، وعروض أسعار وجداول كميات متكاملة.',
          keywordsEn: 'contact landscape architect jeddah, request boq irrigation riyadh',
          keywordsAr: 'تواصل مع مهندس لاندسكيب جدة, طلب تسعير ري الرياض',
          ogImage: '/img/hero-smart-irrigation.jpg',
        },
        {
          key: 'blog',
          titleEn: 'Engineering Insights & Knowledge Hub | Green Solution KSA',
          titleAr: 'المدونة الهندسية والمعرفية | جرين سلوشن السعودية',
          descEn: 'Technical articles, water conservation strategies, and SBC building code insights from leading Saudi landscape engineers.',
          descAr: 'مقالات فنية، استراتيجيات ترشيد مياه الري، ودراسات كود البناء السعودي من كبار المهندسين الزراعيين بالمملكة.',
          keywordsEn: 'landscape engineering blog ksa, water saving irrigation articles, saudi green initiative insights',
          keywordsAr: 'مدونة اللاندسكيب السعودية, مقالات ترشيد المياه, أبحاث مبادرة السعودية الخضراء',
          ogImage: '/img/services/irrigation-networks.jpg',
        },
      ];

      for (const p of defaultSeoPages) {
        insertSeoStmt.run(
          p.key,
          p.titleEn,
          p.titleAr,
          p.descEn,
          p.descAr,
          p.keywordsEn,
          p.keywordsAr,
          p.ogImage,
          `https://greensolutionksa.com/${p.key === 'home' ? '' : p.key}`,
          now
        );
      }
    }
  } catch (err) {
    console.warn('Seed site_seo error:', err);
  }

  cached.db = db;
  return db;
}

// -------------------------------------------------------------
// SUBMISSIONS HELPERS
// -------------------------------------------------------------
export function createSubmission(data: {
  name: string;
  email: string;
  phone: string;
  service?: string;
  message: string;
  locale?: string;
  source?: string;
  notes?: string;
}): DbSubmission {
  const db = getSqliteDb();
  const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO submissions (id, name, email, phone, service, message, locale, status, source, notes, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?)
  `);

  insert.run(
    id,
    data.name.trim(),
    data.email.trim().toLowerCase(),
    data.phone.trim(),
    data.service || 'general',
    data.message.trim(),
    data.locale || 'en',
    data.source || 'contact-page',
    data.notes || '',
    now,
    now
  );

  return {
    id,
    _id: id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    service: data.service || 'general',
    message: data.message.trim(),
    locale: data.locale || 'en',
    status: 'new',
    source: data.source || 'contact-page',
    notes: data.notes || '',
    createdAt: now,
    updatedAt: now,
  };
}

export function getSubmissions(options: {
  status?: string | null;
  service?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}): { submissions: DbSubmission[]; total: number; page: number; totalPages: number } {
  const db = getSqliteDb();
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 20;
  const offset = (page - 1) * limit;

  const whereClauses: string[] = [];
  const params: (string | number)[] = [];

  if (options.status && options.status !== 'all') {
    whereClauses.push('status = ?');
    params.push(options.status);
  }

  if (options.service && options.service !== 'all') {
    whereClauses.push('service = ?');
    params.push(options.service);
  }

  if (options.search && options.search.trim()) {
    const term = `%${options.search.trim()}%`;
    whereClauses.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)');
    params.push(term, term, term, term);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM submissions ${whereSql}`);
  const countRow = countStmt.get(...params) as { count: number };
  const total = countRow ? Number(countRow.count) : 0;

  const queryStmt = db.prepare(`
    SELECT * FROM submissions
    ${whereSql}
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  const rows = queryStmt.all(...params, limit, offset) as Record<string, any>[];

  const submissions: DbSubmission[] = rows.map((r) => ({
    id: String(r.id),
    _id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    phone: String(r.phone),
    service: String(r.service),
    message: String(r.message),
    locale: String(r.locale),
    status: r.status as DbSubmission['status'],
    source: String(r.source),
    notes: String(r.notes || ''),
    createdAt: String(r.createdAt),
    updatedAt: String(r.updatedAt),
  }));

  return {
    submissions,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function getSubmissionById(id: string): DbSubmission | null {
  const db = getSqliteDb();
  const stmt = db.prepare('SELECT * FROM submissions WHERE id = ?');
  const row = stmt.get(id) as Record<string, any> | undefined;

  if (!row) return null;

  return {
    id: String(row.id),
    _id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    service: String(row.service),
    message: String(row.message),
    locale: String(row.locale),
    status: row.status as DbSubmission['status'],
    source: String(row.source),
    notes: String(row.notes || ''),
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
  };
}

export function updateSubmission(
  id: string,
  updates: { status?: string; notes?: string }
): DbSubmission | null {
  const db = getSqliteDb();
  const existing = getSubmissionById(id);
  if (!existing) return null;

  const newStatus = updates.status || existing.status;
  const newNotes = typeof updates.notes === 'string' ? updates.notes : existing.notes;
  const now = new Date().toISOString();

  const updateStmt = db.prepare(`
    UPDATE submissions
    SET status = ?, notes = ?, updatedAt = ?
    WHERE id = ?
  `);

  updateStmt.run(newStatus, newNotes, now, id);

  return {
    ...existing,
    status: newStatus as DbSubmission['status'],
    notes: newNotes,
    updatedAt: now,
  };
}

export function getAllSubmissionsForExport(): DbSubmission[] {
  const db = getSqliteDb();
  const stmt = db.prepare('SELECT * FROM submissions ORDER BY createdAt DESC');
  const rows = stmt.all() as Record<string, any>[];

  return rows.map((r) => ({
    id: String(r.id),
    _id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    phone: String(r.phone),
    service: String(r.service),
    message: String(r.message),
    locale: String(r.locale),
    status: r.status as DbSubmission['status'],
    source: String(r.source),
    notes: String(r.notes || ''),
    createdAt: String(r.createdAt),
    updatedAt: String(r.updatedAt),
  }));
}

// -------------------------------------------------------------
// BLOGS CRUD HELPERS
// -------------------------------------------------------------
export function getBlogs(options?: {
  category?: string | null;
  search?: string | null;
  isPublished?: boolean;
  isPublishedOnly?: boolean;
  page?: number;
  limit?: number;
}): {
  blogs: DbBlog[];
  total: number;
  page: number;
  totalPages: number;
} {
  const db = getSqliteDb();
  const whereClauses: string[] = [];
  const params: (string | number)[] = [];

  const page = Math.max(1, options?.page || 1);
  const limit = Math.max(1, Math.min(100, options?.limit || 50));
  const offset = (page - 1) * limit;

  // Published filter logic
  if (typeof options?.isPublished === 'boolean') {
    whereClauses.push('isPublished = ?');
    params.push(options.isPublished ? 1 : 0);
  } else if (options?.isPublishedOnly === true) {
    whereClauses.push('isPublished = 1');
  }

  if (options?.category && options.category !== 'all') {
    whereClauses.push('category = ?');
    params.push(options.category);
  }

  if (options?.search && options.search.trim()) {
    const term = `%${options.search.trim()}%`;
    whereClauses.push('(titleEn LIKE ? OR titleAr LIKE ? OR excerptEn LIKE ? OR excerptAr LIKE ? OR keywords LIKE ?)');
    params.push(term, term, term, term, term);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM blogs ${whereSql}`);
  const countRow = countStmt.get(...params) as { count: number };
  const total = countRow ? Number(countRow.count) : 0;

  const stmt = db.prepare(`
    SELECT * FROM blogs
    ${whereSql}
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);
  const rows = stmt.all(...params, limit, offset) as Record<string, any>[];

  const blogs: DbBlog[] = rows.map((r) => ({
    id: String(r.id),
    slug: String(r.slug),
    titleEn: String(r.titleEn),
    titleAr: String(r.titleAr),
    excerptEn: String(r.excerptEn),
    excerptAr: String(r.excerptAr),
    contentEn: String(r.contentEn),
    contentAr: String(r.contentAr),
    category: String(r.category),
    image: String(r.image),
    authorEn: String(r.authorEn),
    authorAr: String(r.authorAr),
    readTime: String(r.readTime),
    tags: JSON.parse(String(r.tags || '[]')),
    isPublished: Boolean(r.isPublished),
    metaTitleEn: String(r.metaTitleEn || ''),
    metaTitleAr: String(r.metaTitleAr || ''),
    metaDescEn: String(r.metaDescEn || ''),
    metaDescAr: String(r.metaDescAr || ''),
    keywords: String(r.keywords || ''),
    createdAt: String(r.createdAt),
    updatedAt: String(r.updatedAt),
  }));

  return {
    blogs,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function getBlogBySlug(slug: string): DbBlog | null {
  const db = getSqliteDb();
  const stmt = db.prepare('SELECT * FROM blogs WHERE slug = ?');
  const r = stmt.get(slug) as Record<string, any> | undefined;
  if (!r) return null;

  return {
    id: String(r.id),
    slug: String(r.slug),
    titleEn: String(r.titleEn),
    titleAr: String(r.titleAr),
    excerptEn: String(r.excerptEn),
    excerptAr: String(r.excerptAr),
    contentEn: String(r.contentEn),
    contentAr: String(r.contentAr),
    category: String(r.category),
    image: String(r.image),
    authorEn: String(r.authorEn),
    authorAr: String(r.authorAr),
    readTime: String(r.readTime),
    tags: JSON.parse(String(r.tags || '[]')),
    isPublished: Boolean(r.isPublished),
    metaTitleEn: String(r.metaTitleEn || ''),
    metaTitleAr: String(r.metaTitleAr || ''),
    metaDescEn: String(r.metaDescEn || ''),
    metaDescAr: String(r.metaDescAr || ''),
    keywords: String(r.keywords || ''),
    createdAt: String(r.createdAt),
    updatedAt: String(r.updatedAt),
  };
}

export function getBlogById(id: string): DbBlog | null {
  const db = getSqliteDb();
  const stmt = db.prepare('SELECT * FROM blogs WHERE id = ?');
  const r = stmt.get(id) as Record<string, any> | undefined;
  if (!r) return null;

  return {
    id: String(r.id),
    slug: String(r.slug),
    titleEn: String(r.titleEn),
    titleAr: String(r.titleAr),
    excerptEn: String(r.excerptEn),
    excerptAr: String(r.excerptAr),
    contentEn: String(r.contentEn),
    contentAr: String(r.contentAr),
    category: String(r.category),
    image: String(r.image),
    authorEn: String(r.authorEn),
    authorAr: String(r.authorAr),
    readTime: String(r.readTime),
    tags: JSON.parse(String(r.tags || '[]')),
    isPublished: Boolean(r.isPublished),
    metaTitleEn: String(r.metaTitleEn || ''),
    metaTitleAr: String(r.metaTitleAr || ''),
    metaDescEn: String(r.metaDescEn || ''),
    metaDescAr: String(r.metaDescAr || ''),
    keywords: String(r.keywords || ''),
    createdAt: String(r.createdAt),
    updatedAt: String(r.updatedAt),
  };
}

export function createBlog(data: Omit<DbBlog, 'id' | 'createdAt' | 'updatedAt'>): DbBlog {
  const db = getSqliteDb();
  const id = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO blogs (
      id, slug, titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr,
      category, image, authorEn, authorAr, readTime, tags, isPublished,
      metaTitleEn, metaTitleAr, metaDescEn, metaDescAr, keywords, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.slug.trim(),
    data.titleEn.trim(),
    data.titleAr.trim(),
    data.excerptEn.trim(),
    data.excerptAr.trim(),
    data.contentEn.trim(),
    data.contentAr.trim(),
    data.category || 'general',
    data.image || '/img/services/landscape-design.jpg',
    data.authorEn || 'Green Solution Agronomy Board',
    data.authorAr || 'هيئة الخبراء الزراعيين بجرين سلوشن',
    data.readTime || '5 min read',
    JSON.stringify(data.tags || []),
    data.isPublished ? 1 : 0,
    data.metaTitleEn || '',
    data.metaTitleAr || '',
    data.metaDescEn || '',
    data.metaDescAr || '',
    data.keywords || '',
    now,
    now
  );

  return {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateBlog(id: string, data: Partial<Omit<DbBlog, 'id' | 'createdAt'>>): DbBlog | null {
  const db = getSqliteDb();
  const existing = getBlogById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: DbBlog = {
    ...existing,
    ...data,
    updatedAt: now,
  };

  const stmt = db.prepare(`
    UPDATE blogs SET
      slug = ?, titleEn = ?, titleAr = ?, excerptEn = ?, excerptAr = ?,
      contentEn = ?, contentAr = ?, category = ?, image = ?, authorEn = ?,
      authorAr = ?, readTime = ?, tags = ?, isPublished = ?,
      metaTitleEn = ?, metaTitleAr = ?, metaDescEn = ?, metaDescAr = ?,
      keywords = ?, updatedAt = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.slug,
    updated.titleEn,
    updated.titleAr,
    updated.excerptEn,
    updated.excerptAr,
    updated.contentEn,
    updated.contentAr,
    updated.category,
    updated.image,
    updated.authorEn,
    updated.authorAr,
    updated.readTime,
    JSON.stringify(updated.tags),
    updated.isPublished ? 1 : 0,
    updated.metaTitleEn,
    updated.metaTitleAr,
    updated.metaDescEn,
    updated.metaDescAr,
    updated.keywords,
    now,
    id
  );

  return updated;
}

export function deleteBlog(id: string): boolean {
  const db = getSqliteDb();
  const stmt = db.prepare('DELETE FROM blogs WHERE id = ?');
  const res = stmt.run(id);
  return (res as any).changes > 0;
}

// -------------------------------------------------------------
// SERVICES CMS HELPERS
// -------------------------------------------------------------
export function getCmsServices(): DbCmsService[] {
  const db = getSqliteDb();
  const stmt = db.prepare('SELECT * FROM services_cms ORDER BY divisionCode ASC');
  const rows = stmt.all() as Record<string, any>[];

  return rows.map((r) => ({
    slug: String(r.slug),
    category: String(r.category),
    divisionCode: String(r.divisionCode),
    image: String(r.image),
    titleEn: String(r.titleEn),
    titleAr: String(r.titleAr),
    shortDescEn: String(r.shortDescEn),
    shortDescAr: String(r.shortDescAr),
    fullDescEn: String(r.fullDescEn),
    fullDescAr: String(r.fullDescAr),
    featuresEn: JSON.parse(String(r.featuresEn || '[]')),
    featuresAr: JSON.parse(String(r.featuresAr || '[]')),
    deliverablesEn: JSON.parse(String(r.deliverablesEn || '[]')),
    deliverablesAr: JSON.parse(String(r.deliverablesAr || '[]')),
    metaTitleEn: String(r.metaTitleEn || ''),
    metaTitleAr: String(r.metaTitleAr || ''),
    metaDescEn: String(r.metaDescEn || ''),
    metaDescAr: String(r.metaDescAr || ''),
    keywords: String(r.keywords || ''),
    updatedAt: String(r.updatedAt),
  }));
}

export function getCmsServiceBySlug(slug: string): DbCmsService | null {
  const db = getSqliteDb();
  const stmt = db.prepare('SELECT * FROM services_cms WHERE slug = ?');
  const r = stmt.get(slug) as Record<string, any> | undefined;
  if (!r) return null;

  return {
    slug: String(r.slug),
    category: String(r.category),
    divisionCode: String(r.divisionCode),
    image: String(r.image),
    titleEn: String(r.titleEn),
    titleAr: String(r.titleAr),
    shortDescEn: String(r.shortDescEn),
    shortDescAr: String(r.shortDescAr),
    fullDescEn: String(r.fullDescEn),
    fullDescAr: String(r.fullDescAr),
    featuresEn: JSON.parse(String(r.featuresEn || '[]')),
    featuresAr: JSON.parse(String(r.featuresAr || '[]')),
    deliverablesEn: JSON.parse(String(r.deliverablesEn || '[]')),
    deliverablesAr: JSON.parse(String(r.deliverablesAr || '[]')),
    metaTitleEn: String(r.metaTitleEn || ''),
    metaTitleAr: String(r.metaTitleAr || ''),
    metaDescEn: String(r.metaDescEn || ''),
    metaDescAr: String(r.metaDescAr || ''),
    keywords: String(r.keywords || ''),
    updatedAt: String(r.updatedAt),
  };
}

export function updateCmsService(slug: string, data: Partial<Omit<DbCmsService, 'slug'>>): DbCmsService | null {
  const db = getSqliteDb();
  const existing = getCmsServiceBySlug(slug);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: DbCmsService = {
    ...existing,
    ...data,
    updatedAt: now,
  };

  const stmt = db.prepare(`
    UPDATE services_cms SET
      category = ?, divisionCode = ?, image = ?, titleEn = ?, titleAr = ?,
      shortDescEn = ?, shortDescAr = ?, fullDescEn = ?, fullDescAr = ?,
      featuresEn = ?, featuresAr = ?, deliverablesEn = ?, deliverablesAr = ?,
      metaTitleEn = ?, metaTitleAr = ?, metaDescEn = ?, metaDescAr = ?,
      keywords = ?, updatedAt = ?
    WHERE slug = ?
  `);

  stmt.run(
    updated.category,
    updated.divisionCode,
    updated.image,
    updated.titleEn,
    updated.titleAr,
    updated.shortDescEn,
    updated.shortDescAr,
    updated.fullDescEn,
    updated.fullDescAr,
    JSON.stringify(updated.featuresEn),
    JSON.stringify(updated.featuresAr),
    JSON.stringify(updated.deliverablesEn),
    JSON.stringify(updated.deliverablesAr),
    updated.metaTitleEn,
    updated.metaTitleAr,
    updated.metaDescEn,
    updated.metaDescAr,
    updated.keywords,
    now,
    slug
  );

  return updated;
}

export function createCmsService(data: DbCmsService): DbCmsService {
  const db = getSqliteDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO services_cms (
      slug, category, divisionCode, image, titleEn, titleAr,
      shortDescEn, shortDescAr, fullDescEn, fullDescAr,
      featuresEn, featuresAr, deliverablesEn, deliverablesAr,
      metaTitleEn, metaTitleAr, metaDescEn, metaDescAr,
      keywords, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.slug.trim(),
    data.category || 'General Engineering',
    data.divisionCode || 'DIV 32',
    data.image || '/images/hero-1.webp',
    data.titleEn.trim(),
    data.titleAr.trim(),
    data.shortDescEn.trim(),
    data.shortDescAr.trim(),
    data.fullDescEn.trim(),
    data.fullDescAr.trim(),
    JSON.stringify(data.featuresEn || []),
    JSON.stringify(data.featuresAr || []),
    JSON.stringify(data.deliverablesEn || []),
    JSON.stringify(data.deliverablesAr || []),
    data.metaTitleEn || data.titleEn,
    data.metaTitleAr || data.titleAr,
    data.metaDescEn || data.shortDescEn,
    data.metaDescAr || data.shortDescAr,
    data.keywords || '',
    now
  );

  return {
    ...data,
    updatedAt: now,
  };
}

export function deleteCmsService(slug: string): boolean {
  const db = getSqliteDb();
  const stmt = db.prepare('DELETE FROM services_cms WHERE slug = ?');
  const res = stmt.run(slug);
  return (res as any).changes > 0;
}

// -------------------------------------------------------------
// SITE SEO HELPERS
// -------------------------------------------------------------
export function getAllSiteSeo(): DbSiteSeo[] {
  const db = getSqliteDb();
  const stmt = db.prepare('SELECT * FROM site_seo ORDER BY pageKey ASC');
  const rows = stmt.all() as Record<string, any>[];

  return rows.map((r) => ({
    pageKey: String(r.pageKey),
    titleEn: String(r.titleEn),
    titleAr: String(r.titleAr),
    descEn: String(r.descEn),
    descAr: String(r.descAr),
    keywordsEn: String(r.keywordsEn),
    keywordsAr: String(r.keywordsAr),
    ogImage: String(r.ogImage),
    canonicalUrl: String(r.canonicalUrl),
    updatedAt: String(r.updatedAt),
  }));
}

export function getSiteSeo(pageKey: string): DbSiteSeo | null {
  const db = getSqliteDb();
  const stmt = db.prepare('SELECT * FROM site_seo WHERE pageKey = ?');
  const r = stmt.get(pageKey) as Record<string, any> | undefined;
  if (!r) return null;

  return {
    pageKey: String(r.pageKey),
    titleEn: String(r.titleEn),
    titleAr: String(r.titleAr),
    descEn: String(r.descEn),
    descAr: String(r.descAr),
    keywordsEn: String(r.keywordsEn),
    keywordsAr: String(r.keywordsAr),
    ogImage: String(r.ogImage),
    canonicalUrl: String(r.canonicalUrl),
    updatedAt: String(r.updatedAt),
  };
}

export function updateSiteSeo(pageKey: string, data: Partial<Omit<DbSiteSeo, 'pageKey'>>): DbSiteSeo | null {
  const db = getSqliteDb();
  const existing = getSiteSeo(pageKey);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: DbSiteSeo = {
    ...existing,
    ...data,
    updatedAt: now,
  };

  const stmt = db.prepare(`
    UPDATE site_seo SET
      titleEn = ?, titleAr = ?, descEn = ?, descAr = ?,
      keywordsEn = ?, keywordsAr = ?, ogImage = ?, canonicalUrl = ?,
      updatedAt = ?
    WHERE pageKey = ?
  `);

  stmt.run(
    updated.titleEn,
    updated.titleAr,
    updated.descEn,
    updated.descAr,
    updated.keywordsEn,
    updated.keywordsAr,
    updated.ogImage,
    updated.canonicalUrl,
    now,
    pageKey
  );

  return updated;
}
