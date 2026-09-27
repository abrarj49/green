const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'green.db');
const db = new DatabaseSync(dbPath);

console.log('Connecting to SQLite at:', dbPath);

const extraBlogs = [
  {
    id: 'blog_4',
    slug: 'fifa-sports-turf-hybrid-bermuda-saudi-arabia',
    titleEn: 'FIFA-Standard Sports Turf & Hybrid Bermuda in Arid Saudi Climates',
    titleAr: 'ملاعب العشب الطبيعي بمعايير فيفا وبرمودا الهجين في المناخات الجافة بالمملكة',
    excerptEn: 'Technical criteria for rootzone sand specifications, sub-surface drainage, laser grading, and salinity management for World Cup-grade stadium turf.',
    excerptAr: 'المعايير الهندسية لطبقات الجذور الرملية، وشبكات الصرف تحت السطحي، والتسوية بالليزر ومراقبة الملوحة لملاعب كرة القدم الدولية.',
    contentEn: `## Achieving Championship-Grade Turf in 50°C Climates

Maintaining high-performance sports turf in Saudi Arabia requires scientific precision. Under FIFA Quality Pro benchmarks, pitch shear strength, ball bounce, and traction must remain constant through extreme summer heat.

### 1. USGA Rootzone Sand Specifications
The foundation of tournament turf is a carefully graded 300mm sand rootzone meeting USGA porosity standards. Proper hydraulic conductivity prevents waterlogging while ensuring essential oxygen reaches deep roots.

### 2. Hybrid Bermuda Cultivars (Tifway 419 & Latitude 36)
We engineer turf systems using warm-season hybrid Bermuda grass varieties bred for rapid recovery from mechanical cleat damage, high heat tolerance, and exceptional saline water resilience.

### 3. Subsurface Aeration & Vacuum Drainage
Integrating sub-air aeration systems enables continuous oxygen pumping directly to the root matrix, preventing anaerobic soil conditions and optimizing water utilization.`,
    contentAr: `## هندسة ملاعب البطولات في درجات حرارة تتجاوز 50 مئوية

يتطلب الحفاظ على المسطحات الخضراء الرياضية عالية الأداء في المملكة دقة علمية صارمة تلبي متطلبات معايير فيفا (FIFA Quality Pro).

### 1. مواصفات رمل منطقة الجذور وفق الجمعية الأمريكية للغولف (USGA)
أساس المسطح الرياضي الناجح هو طبقة رملية بسماكة 300 ملم محددة التدرج الحبيبي، تتيح نفاذية هيدروليكية مثالية تمنع تجمع المياه وتضمن وصول الأكسجين للجذور.

### 2. أصناف برمودا الهجين (Tifway 419 وLatitude 36)
نعتمد على أصناف النجيل الدافئ المهجن التي تتميز بسرعة التعافي الفائقة من الضغط الميكانيكي، والقدرة العالية على مقاومة الملوحة ودرجات الحرارة الشديدة.

### 3. أنظمة الصرف الهوائي والتهوية تحت السطحية
دمج أنظمة ضخ الأكسجين وسحب المياه الزائدة تحت السطح يحافظ على حيوية الجذور ويمنع تعفنها في الفترات الحارة.`,
    category: 'Turf & Sports Facilities',
    image: '/img/services/turf-grass.jpg',
    authorEn: 'Sports Turf Engineering Directorate',
    authorAr: 'إدارة هندسة الملاعب الرياضية',
    readTime: '5 min read',
    tags: JSON.stringify(['FIFA Quality Pro', 'Sports Turf', 'Hybrid Bermuda', 'Stadiums KSA']),
    isPublished: 1,
    metaTitleEn: 'FIFA Sports Turf & Hybrid Bermuda in Saudi Arabia | Green Solution KSA',
    metaTitleAr: 'ملاعب العشب الطبيعي بمعايير فيفا وبرمودا الهجين | جرين سلوشن',
    metaDescEn: 'Engineering specifications for FIFA-standard sports turf, USGA rootzone sand, and hybrid Bermuda cultivars in Saudi Arabia.',
    metaDescAr: 'المواصفات الهندسية لملاعب كرة القدم الاحترافية بمعايير فيفا وزراعة عشب برمودا الهجين في المملكة العربية السعودية.',
    keywords: 'fifa sports turf saudi, stadium grass jeddah, hybrid bermuda grass riyadh, green solution sports turf',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
  },
  {
    id: 'blog_5',
    slug: 'architectural-pergolas-urban-cooling-saudi-arabia',
    titleEn: 'Architectural Pergolas & Shading: Thermal Microclimate Control for Urban Plazas',
    titleAr: 'المظلات والبرجولات المعمارية: التحكم الحراري وتبريد المناخ المصغر في الساحات الحضرية',
    excerptEn: 'How bioclimatic motorized louvers, aerodynamic shade canopies, and integrated mist cooling lower perceived ambient temperature by up to 12°C in public spaces.',
    excerptAr: 'كيف تسهم البرجولات البيومناخية ذات اللوفرات المتحركة ورذاذ التبريد في خفض درجات الحرارة المحسوسة بمقدار 12 درجة مئوية في الساحات الخارجية.',
    contentEn: `## Extending Outdoor Livability in Saudi Arabia

Urban public spaces, commercial outdoor promenades, and hotel terraces in the Kingdom require active thermal management to ensure year-round visitor comfort and pedestrian footfall.

### 1. Bioclimatic Motorized Louvers
Marine-grade powder-coated aluminum louvers rotate automatically with sun angles to block direct solar radiation while allowing rising thermal air currents to escape naturally.

### 2. High-Pressure Micro-Mist Integration
High-pressure (70 bar) stainless steel misting lines emit 5-micron water droplets that evaporate instantly, cooling the surrounding air through thermodynamic sensible heat absorption without wetting surfaces or diners.

### 3. SBC Structural Wind Load Certification
All architectural pergola frameworks engineered by Green Solution comply with Saudi Building Code wind load criteria (SBC 301), engineered to withstand desert sandstorms exceeding 120 km/h.`,
    contentAr: `## تعزيز جودة الحياة والأنشطة الخارجية في مدن المملكة

تتطلب المماشي التجارية وساحات المطاعم المفتوحة وحدائق القصور بالمملكة حلولاً مدروسة للتحكم الحراري لضمان راحة الرواد على مدار العام.

### 1. البرجولات البيومناخية ذات اللوفرات الذكية
شفرات ألومنيوم متحركة ومطلية حرارياً تدور آلياً وفق زاوية سقوط الشمس لصد الإشعاع المباشر مع السماح للهواء الساخن بالتصاعد والخروج بشكل طبيعي.

### 2. شبكات الضباب والرذاذ عالي الضغط
دمج فوهات الرذاذ الدقيق بقوة 70 بار تنتج ذرات ماء بحجم 5 ميكرون تتبخر لحظياً وتمتص الحرارة من الجو المحيط لتخفض الحرارة المحسوسة حتى 12 درجة دون تبليل الأرضيات.

### 3. مطابقة كود البناء السعودي SBC 301 لأحمال الرياح
تُصمم كافة هياكل البرجولات والمظلات لدينا لتحمل العواصف الرملية وشدات الرياح التي تتجاوز 120 كم/ساعة بأعلى معاملات الأمان الإنشائي.`,
    category: 'Hardscape & Structures',
    image: '/img/services/pergolas-shade.jpg',
    authorEn: 'Civil & Structural Division',
    authorAr: 'إدارة الإنشاءات المعمارية',
    readTime: '4 min read',
    tags: JSON.stringify(['Pergolas', 'Microclimate Cooling', 'SBC 301', 'Outdoor Shading']),
    isPublished: 1,
    metaTitleEn: 'Architectural Pergolas & Urban Shading in Saudi Arabia | Green Solution KSA',
    metaTitleAr: 'البرجولات والمظلات المعمارية والتبريد في السعودية | جرين سلوشن',
    metaDescEn: 'Bioclimatic motorized pergolas, high-pressure misting, and SBC wind compliance for commercial outdoor spaces.',
    metaDescAr: 'أنظمة البرجولات الذكية والرذاذ التبريدي ومطابقة كود البناء السعودي للساحات والمشاريع التجارية.',
    keywords: 'architectural pergolas riyadh, motorized louvers jeddah, commercial shading ksa, mist cooling systems',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: 'blog_6',
    slug: 'hydraulic-water-features-desert-filtration-saudi',
    titleEn: 'Hydraulic Water Features: Mitigating Mineral Scaling in Desert Microclimates',
    titleAr: 'النوافير والمسطحات المائية الهندسية: منع ترسبات الأملاح والتكلس في المناخ الصحراوي',
    excerptEn: 'Engineering recirculating water cascades, infinity edge reflecting pools, and automatic chemical dosing to prevent calcification in high-TDS water regions.',
    excerptAr: 'هندسة الشلالات والمسطحات المائية العاكسة، وأنظمة الفلترة المتقدمة والحقن الكيميائي لمنع التكلس وتغير لون الأحجار الطبيعية.',
    contentEn: `## Water Features as Environmental Acoustic and Visual Focus

Reflecting pools, dancing jets, and natural stone sheet cascades elevate commercial headquarters and luxury residential estates. However, Saudi Arabia's high Total Dissolved Solids (TDS) groundwater and intense evaporation rates pose unique engineering challenges.

### 1. Scaling & Calcification Prevention
Without continuous mineralization control, dissolved calcium and magnesium carbonates deposit rapidly on nozzles and dark granite copings. We install automated reverse-osmosis (RO) top-up systems and acid-dosing stations to maintain neutral pH balance.

### 2. High-Efficiency Multi-Media & Glass Filtration
Recirculation manifolds utilize activated AFM glass media filtration, eliminating suspended particles down to 5 microns and reducing backwash water volume by up to 50% compared to traditional silica sand filters.

### 3. Underwater Architectural Illuminance
Submersible 316L stainless steel LED luminaires with DMX512 dynamic controllers produce programmable chromatic choreographies without heat dissipation risks.`,
    contentAr: `## المسطحات المائية كعنصر تبريد بصري وصوتي فائق الفخامة

تضفي أحواض الانعكاس والشلالات الجدارية والنوافير الراقصة سحراً استثنائياً على مقرات الشركات والقصور الملكية بالمملكة، لكنها تتطلب حلولاً هيدروليكية خاصة لمواجهة ارتفاع ملوحة المياه (TDS) وسرعة التبخر.

### 1. منع التكلس والترسبات الجيرية
في غياب المعالجة المستمرة، تتراكم أملاح الكالسيوم والمغنيسيوم على الفوهات والجرانيت الأسود. نقوم بتركيب أنظمة تحلية وتناضح عكسي (RO) مع حقن تلقائي لموازنة درجة الحموضة (pH).

### 2. أنظمة الفلترة بالزجاج النشط (AFM)
نستخدم وسائط الفلترة الزجاجية النشطة التي تنقي المياه من الشوائب الدقيقة حتى 5 ميكرون، وتخفض مياه الغسيل العكسي بنسبة 50% مقارنة بالفلاتر الرملية التقليدية.

### 3. الإنارة الغاطسة المعمارية
نعتمد على وحدات إضاءة LED غاطسة مصنعة من الستانلس ستيل البحري 316L وأنظمة تحكم رقمية DMX تقدم عروضاً ضوئية مبرمجة دون أي انبعاث حراري.`,
    category: 'Water Features & Pools',
    image: '/img/services/water-features.jpg',
    authorEn: 'Hydraulic Engineering Team',
    authorAr: 'فريق الهندسة الهيدروليكية',
    readTime: '6 min read',
    tags: JSON.stringify(['Water Features', 'Hydraulics', 'Fountains', 'Filtration', 'Desalination']),
    isPublished: 1,
    metaTitleEn: 'Hydraulic Water Features & Desert Filtration | Green Solution KSA',
    metaTitleAr: 'النوافير والمسطحات المائية ومنع التكلس في السعودية | جرين سلوشن',
    metaDescEn: 'Engineering specifications for commercial fountains, water features, scale prevention, and filtration systems in Saudi Arabia.',
    metaDescAr: 'المواصفات الهندسية للشلالات والنوافير الفاخرة وحلول منع التكلس وترشيد المياه في المملكة العربية السعودية.',
    keywords: 'water features saudi arabia, fountains jeddah, infinity pool riyadh, landscape hydraulic contractor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  }
];

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO blogs (
    id, slug, titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr,
    category, image, authorEn, authorAr, readTime, tags, isPublished,
    metaTitleEn, metaTitleAr, metaDescEn, metaDescAr, keywords, createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const b of extraBlogs) {
  insertStmt.run(
    b.id, b.slug, b.titleEn, b.titleAr, b.excerptEn, b.excerptAr, b.contentEn, b.contentAr,
    b.category, b.image, b.authorEn, b.authorAr, b.readTime, b.tags, b.isPublished,
    b.metaTitleEn, b.metaTitleAr, b.metaDescEn, b.metaDescAr, b.keywords, b.createdAt, b.updatedAt
  );
  console.log(`Seeded blog: ${b.slug}`);
}

// Check total count
const count = db.prepare('SELECT COUNT(*) as c FROM blogs').get();
console.log('Total blogs in SQLite database now:', count.c);

// Check services count
const srvCount = db.prepare('SELECT COUNT(*) as c FROM services_cms').get();
console.log('Total services in SQLite database now:', srvCount.c);
