export interface ServiceItem {
  slug: string;
  category:
    | 'design-planning'
    | 'hardscape-structures'
    | 'living-green'
    | 'water-irrigation'
    | 'protection-services';
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
  image?: string;
  divisionCode?: string;
  tagsEn?: string[];
  tagsAr?: string[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: 'landscape-design-planning',
    category: 'design-planning',
    titleEn: 'Landscape Design & Planning',
    titleAr: 'تصميم وتخطيط المناظر الطبيعية',
    shortDescEn: 'Conceptual layouts, working drawings, and master plans for residential, commercial, and public park projects.',
    shortDescAr: 'مخططات مفاهيمية ورسومات تنفيذية ومخططات رئيسية للمشاريع السكنية والتجارية والحدائق العامة.',
    fullDescEn:
      'Our landscape design and planning practice encompasses the entire creative and technical pipeline. From preliminary environmental site appraisals and climate-specific spatial zoning through to full architectural master plans, working drawings, MEP integration, and detailed Bills of Quantities (BoQs). We harmonize human experience with botanical science, crafting inspiring, resilient outdoor environments tailored to Saudi Arabia’s unique topography and microclimates.',
    fullDescAr:
      'تشمل ممارستنا في تصميم وتخطيط المناظر الطبيعية المسار الإبداعي والهندسي بأكمله. بدءاً من التقييمات البيئية للموقع ودراسات المناخ المصغر وتوزيع المساحات، وصولاً إلى المخططات الرئيسية الشاملة والرسومات التنفيذية وتكامل الأعمال الكهروميكانيكية وجداول الكميات التفصيلية. نحن ندمج التجربة الإنسانية مع العلوم النباتية لخلق بيئات خارجية ملهمة ومستدامة تلائم طبيعة المملكة.',
    featuresEn: [
      'Comprehensive Master Planning & 3D Visualizations',
      'Environmental Site & Microclimate Feasibility Assessments',
      'Architectural Working Drawings & Detailed Planting Schedules',
      'MEP, Drainage & Subsurface Irrigation Schematics',
      'Bill of Quantities (BoQ) & Material Specifications',
      'Regulatory Municipality & HOA Approval Documentation',
    ],
    featuresAr: [
      'مخططات رئيسية متكاملة وتصورات ثلاثية الأبعاد واقعية',
      'دراسات الجدوى البيئية وتقييم المناخ المحلي للموقع',
      'رسومات معمارية تنفيذية وجداول توزيع وتصنيف النباتات',
      'مخططات الأعمال الكهروميكانيكية وشبكات الصرف والري تحت السطحي',
      'جداول كميات دقيقة (BoQ) ومواصفات معيارية للمواد',
      'إعداد وثائق الاعتمادات البلدية وإدارات المجمعات السكنية',
    ],
    deliverablesEn: [
      'Master plan layout with CAD & BIM coordination',
      'Comprehensive plant palette optimized for KSA hardiness zones',
      'Grading, contouring and storm runoff management plans',
      'Phased implementation schedule & budgetary estimates',
    ],
    deliverablesAr: [
      'مخطط عام متناسق بصيغ CAD وBIM',
      'لوحة نباتية معتمدة ملائمة لمناخ ومناطق المملكة',
      'مخططات مناسيب الأرض وإدارة تصريف مياه الأمطار',
      'جدول زمني مرحلي للتنفيذ وتقديرات التكلفة الإجمالية',
    ],
  },
  {
    slug: 'outdoor-paving-hardscape',
    category: 'hardscape-structures',
    titleEn: 'Outdoor Paving & Hardscape Solutions',
    titleAr: 'أعمال الرصف والهاردسكيب الخارجي',
    shortDescEn: 'Driveways, walkways, patios, and courtyards using natural stone, concrete pavers, and decorative edging.',
    shortDescAr: 'مداخل سيارات وممرات وساحات وأفنية باستخدام الحجر الطبيعي وبلاط الإنترلوك الخرساني والحواف التجميلية.',
    fullDescEn:
      'We deliver enduring structural beauty through precision-crafted hardscape engineering. Specializing in high-performance driveways, pedestrian walkways, grand entry plazas, and shaded courtyard pavements, our team utilizes local and imported natural stone, thermally stabilized concrete interlocking pavers, and tailored edging systems engineered to withstand intense thermal expansion and heavy vehicle loads.',
    fullDescAr:
      'نقدم جمالاً بيانياً ومعمارياً دائماً من خلال حلول الهاردسكيب الدقيقة. نحن متخصصون في تنفيذ مواقف السيارات الفاخرة، وممرات المشاة، وساحات الاستقبال الكبرى، وأفنية المباني باستخدام الحجر الطبيعي والإنترلوك الخرساني المعالج حرارياً والمقاوم للأحمال العالية وعوامل التمدد الحراري الشديدة في المملكة.',
    featuresEn: [
      'Natural Granite, Basalt, Travertine & Sandstone Paving',
      'Heavy-duty Interlocking Concrete Pavers with High Solar Reflectance',
      'Reinforced Sub-base & Drainage Aggregate Compaction',
      'Decorative Curbs, Steps & Integrated Grade Transitions',
      'Thermal Expansion Joints & Anti-slip Surface Treatments',
      'Architectural Retaining Walls & Planter Beds',
    ],
    featuresAr: [
      'أرضيات من الجرانيت والبازلت والترافرتين والحجر الرملي الطبيعي',
      'بلاط إنترلوك خرساني عالي التحمل بمؤشر انعكاس شمسي مرتفع',
      'دك وتسوية طبقات الأساس المقواة وتصريف المياه تحت السطحي',
      'بردورات زخرفية ودرجات وممرات متدرجة بانسيابية هندسية',
      'فواصل تمدد حراري ومعالجات مانعة للانزلاق لسلامة المشاة',
      'جدران استنادية معمارية وأحواض زراعة مبنية متكاملة',
    ],
    deliverablesEn: [
      'Laser-levelled sub-base preparation with geotechnical compaction testing',
      'Precision jointing with polymer sand or mortar beds',
      'Integrated surface drainage inlets and slotted channels',
      'Long-term stain protection sealants and wash treatments',
    ],
    deliverablesAr: [
      'تجهيز وتسوية طبقات التأسيس بالليزر مع اختبارات الكثافة الميدانية',
      'تعبئة الفواصل بدقة برمال البوليمر أو المونة الإسمنتية المخصصة',
      'قنوات تصريف ومصائد مياه سطحية مدمجة وغير مرئية',
      'معالجات عزل وحماية من البقع ومقاومة للزيوت وعوامل الجو',
    ],
  },
  {
    slug: 'urban-green-space-management',
    category: 'protection-services',
    titleEn: 'Urban Green Space Management',
    titleAr: 'إدارة وتطوير المساحات الخضراء الحضرية',
    shortDescEn: 'Public parks, green belts, community gardens, and roadside plantations with smart, eco-friendly maintenance.',
    shortDescAr: 'حدائق عامة وأحزمة خضراء ومزارع مجتمعية وتشجير الطرق بصيانة ذكية وصديقة للبيئة.',
    fullDescEn:
      'In direct alignment with the Saudi Green Initiative and Vision 2030, our urban green space division oversees the long-term stewardship of municipal parks, highway green belts, civic centers, and commercial business districts. We deploy IoT-enabled remote water metering, eco-friendly pruning cycles, mechanized soil aeration, and organic fertilization regimes to maintain lush green canopies with minimal ecological footprint.',
    fullDescAr:
      'توافقاً مع مبادرة السعودية الخضراء ورؤية 2030، يتولى قسم إدارة المساحات الخضراء الحضرية لدينا الإشراف طويل المدى على الحدائق البلدية، والأحزمة الخضراء للطرق السريعة، والمراكز المدنية، ومجمعات الأعمال. نوظف تقنيات إنترنت الأشياء لمراقبة المياه، وبرامج التقليم المدروسة، وتهوية التربة الآلية، والتسميد العضوي للحفاظ على الغطاء النباتي.',
    featuresEn: [
      'Municipal Park Stewardship & Public Greening Programs',
      'Highway Median & Roadside Forestation Maintenance',
      'IoT Smart Centralized Water Consumption Auditing',
      'Tree Canopy Health Audits & Certified Arborist Care',
      'Zero-waste Composting & Biomass Recycling Programs',
      'Civic Amenity, Playground & Furnishing Safety Upkeep',
    ],
    featuresAr: [
      'إدارة الحدائق العامة ومشاريع التشجير الحضرية البلدية',
      'صيانة الجزيرة الوسطية وتشجير جنبات الطرق السريعة',
      'تدقيق مركزي ذكي لاستهلاك المياه عبر أجهزة الاستشعار',
      'فحص سلامة الأشجار والغطاء النباتي بواسطة خبراء تشجير معتمدين',
      'برامج إعادة تدوير المخلفات العضوية وتحويلها لأسمدة طبيعية',
      'صيانة ألعاب الحدائق والمقاعد والمرافق الترفيهية بانتظام',
    ],
    deliverablesEn: [
      'Full monthly asset condition reports with drone photographic surveys',
      'Scheduled seasonal pruning and canopy thinning rotations',
      'Rapid response maintenance crews for emergency irrigation leaks',
      'Biodiversity and soil carbon enrichment tracking metrics',
    ],
    deliverablesAr: [
      'تقارير شهرية لحالة الأصول مدعمة بمسوحات تصوير جوي',
      'جداول تقليم موسمية وتشذيب للمحافظة على نمو متناسق',
      'فرق طوارئ سريعة الاستجابة لمعالجة أي تسريبات أو أعطال',
      'مؤشرات قياس التنوع البيولوجي وإثراء المحتوى العضوي للتربة',
    ],
  },
  {
    slug: 'vertical-gardens-rooftops',
    category: 'living-green',
    titleEn: 'Vertical Gardens & Rooftops',
    titleAr: 'الحدائق العمودية وتخضير الأسطح',
    shortDescEn: 'Wall and facade greening, rooftop retreats with structural safety and climate-appropriate plants.',
    shortDescAr: 'تخضير الواجهات والجدران وحدائق الأسطح الآمنة إنشائياً بنباتات تلائم البيئة والمناخ.',
    fullDescEn:
      'Maximize scarce ground footprint by transforming lifeless vertical facades and concrete roofs into thriving bio-architectural ecosystems. Our living wall and rooftop systems integrate lightweight engineered growing media, root-barrier waterproofing, and multi-tier recirculating drip irrigation designed specifically for arid desert thermal radiation and high wind resistance.',
    fullDescAr:
      'نحول الجدران الصامتة والأسطح الخرسانية غير المستغلة إلى واحات حيوية تعزز العزل الحراري وتنقي الهواء. تدمج أنظمة الجدران الحية وحدائق الأسطح لدينا وسائط زراعية خفيفة الوزن ومخصصة هندسياً، مع عزل مائي متطور ضد تغلغل الجذور، وشبكات ري بالتنقيط ذات دورات ذكية مصممة لتحمل حرارة الصيف ورياح المرتفعات.',
    featuresEn: [
      'Modular Hydroponic & Substrate Living Wall Systems',
      'Structural Load & Wind Shearing Engineering Calculations',
      'Multi-layer Root Barrier Waterproofing Membranes',
      'Automated Closed-loop Recirculating Nutrient Irrigation',
      'Acclimatized Native Succulents, Creepers & Air-cleaning Species',
      'Architectural Backlit Planter Frames & Facade Cladding',
    ],
    featuresAr: [
      'أنظمة جدران حية موديولار هيدروبونيك وتربة زراعية خفيفة',
      'حسابات هندسية دقيقة للأحمال الإنشائية ومقاومة قوى الرياح',
      'أغشية عزل مائي وحماية متعددة الطبقات مانعة لتغلغل الجذور',
      'شبكة ري وتغذية آلية مغلقة تعيد تدوير المياه والمغذيات',
      'نباتات عصارية ومتسلقات محلية متأقلمة ومنقية للهواء',
      'هياكل تثبيت معمارية مدمجة مع إضاءات خلفية لإبراز التصميم',
    ],
    deliverablesEn: [
      'Structural peer-reviewed sign-off for rooftop load ratings',
      'Integrated water catchment and recycling reservoirs',
      'Automatic sensor alert for moisture drops or pump interruption',
      'Quarterly botanical trimming and nutrient injection service',
    ],
    deliverablesAr: [
      'اعتماد إنشائي معتمد لقدرات تحمل الأسطح للأوزان الرطبة',
      'خزانات مدمجة لجمع وإعادة تدوير مياه الري الفائضة',
      'أنظمة إنذار ذكية تنبه عند انخفاض الرطوبة أو توقف المضخات',
      'خدمة رعاية دورية ربع سنوية لتشذيب النباتات وتزويد المغذيات',
    ],
  },
  {
    slug: 'plantation-supplies',
    category: 'living-green',
    titleEn: 'Plantation & Supplies',
    titleAr: 'التوريدات النباتية والمشاتل الزراعية',
    shortDescEn: 'Seasonal flowers, ornamentals, shrubs, trees, and turf sourced from our in-house nursery.',
    shortDescAr: 'زهور موسمية، نباتات زينة، شجيرات، أشجار ظل ونخيل، وعشب طبيعي من مشاتلنا الخاصة.',
    fullDescEn:
      'Green Solution operates proprietary dedicated nursery facilities within Saudi Arabia, cultivating plant specimens acclimatized from germination to desert heat, saline groundwater, and intense ultraviolet exposure. We supply royal palm trees, shade-giving canopies, drought-resilient shrubs, and vibrant seasonal annuals directly to major institutional and private contractors.',
    fullDescAr:
      'تمتلك وتدير جرين سلوشن مشاتل زراعية متخصصة داخل المملكة، حيث نقوم بإكثار وتربية عينات نباتية متأقلمة منذ البذرة مع حرارة الصيف الشديدة وملوحة المياه والإشعاع الشمسي. نورّد نخيل واشنطونيا وبداوة، وأشجار الظل الكبرى، والشجيرات المزهرة، والحوليات الموسمية لكبرى الهيئات والمقاولين والقصور.',
    featuresEn: [
      'In-house Acclimatized Nursery Stock for Maximum Survival Rate',
      'Date Palms, Washingtonia Palms & Specimen Desert Trees',
      'Native & Drought-Tolerant Halophytic Flora (Neem, Conocarpus, Sidr)',
      'Vibrant Seasonal Flowers & Groundcover Carpeting',
      'Premium Certified Turfgrass Rolls (Paspalum, Bermuda)',
      'Organic Composts, Soil Conditioners & Beneficial Microbes',
    ],
    featuresAr: [
      'مخزون مشاتل مؤقلم يضمن أعلى معدلات نجاح واستقرار بعد الزراعة',
      'نخيل التمر ونخيل واشنطونيا وأشجار ظل صحراوية نادرة الحجم',
      'نباتات بيئية محلية ومتحملة للملوحة (السدر، النيم، الغاف، البزروميا)',
      'زهور موسمية نابضة بالحياة ومغطيات تربة خضراء متماسكة',
      'لفائف عشب طبيعي معتمدة ومقاومة للحرارة (باسبالم، برمودا)',
      'أسمدة عضوية معالجة حرارياً، وبتموس، ومحسنات تربة بيولوجية',
    ],
    deliverablesEn: [
      'Guaranteed root-ball integrity and certified phytosanitary clearance',
      'Crane-assisted crane offloading and precision planting alignment',
      'Initial 90-day plant replacement establishment guarantee',
      'Soil amendment and initial slow-release rooting fertilizers',
    ],
    deliverablesAr: [
      'سلامة كاملة للكتلة الجذرية مع شهادات خلو من الآفات الزراعية',
      'تنزيل ونقل بالرافعات المتخصصة وغرس دقيق حسب المناسيب',
      'ضمان استبدال النباتات خلال فترة التأسيس الأولى (90 يوماً)',
      'خلطات تربة مخصصة وتزويد بأسمدة بطيئة الذوبان لتثبيت الجذور',
    ],
  },
  {
    slug: 'pest-control',
    category: 'protection-services',
    titleEn: 'Pest Control Services',
    titleAr: 'خدمات مكافحة الآفات والحشرات',
    shortDescEn: 'Eco-friendly treatments for ants, cockroaches, rodents, mosquitoes, and termites — one-time and maintenance plans.',
    shortDescAr: 'مكافحة آمنة بيئياً للنمل والصراصير والقوارض والبعوض وحشرات الحدائق — زيارات فردية وعقود سنوية.',
    fullDescEn:
      'We practice Integrated Pest Management (IPM), a scientific, EPA-compliant approach prioritizing physical barriers, biological controls, and low-toxicity botanical solutions over aggressive blanket chemical spraying. We target agricultural pests, mosquitoes, rodents, and crawling insects in landscapes, resorts, university campuses, and residential villas while safeguarding pets, children, and beneficial pollinator populations.',
    fullDescAr:
      'نطبق منهجية الإدارة المتكاملة للآفات (IPM) المعتمدة علمياً والملتزمة بمعايير الهيئات البيئية، والتي تقدم الحواجز الوقائية والمكافحة الحيوية والحلول الطبيعية منخفضة السمية على الرش الكيميائي العشوائي. نقضي على آفات المزروعات، والبعوض، والقوارض، والحشرات الزاحفة في المنشآت والحدائق مع الحفاظ التام على سلامة الأطفال والحيوانات الأليفة ونحل التلقيح.',
    featuresEn: [
      'Scientific Integrated Pest Management (IPM) Protocols',
      'Targeted Insect Infestation Treatment for Palm Weevils & Borers',
      'Eco-friendly ULV Thermal Fogging for Mosquitoes & Flies',
      'Tamper-resistant Bait Stations for Rodent Exclusion',
      'Commercial Facility Health & Food-Safety Auditing',
      'Custom Seasonal Preventative Maintenance Contracts',
    ],
    featuresAr: [
      'بروتوكولات علمية معتمدة للإدارة المتكاملة للآفات (IPM)',
      'علاج مستهدف لحشرات النخيل بما فيها سوسة النخيل الحمراء والحفارات',
      'رش ضبابي حراري (ULV) فائق الصغر للسيطرة على البعوض والذباب',
      'محطات طعوم آمنة ومقفلة للسيطرة الوقائية على القوارض',
      'تدقيق السلامة البيئية والمطابقة للمعايير الصحية للمنشآت التجارية',
      'عقود وقائية دورية مجدولة تضمن حماية مستمرة على مدار العام',
    ],
    deliverablesEn: [
      'Full facility baseline inspection with pest vulnerability map',
      'Ministry-approved, odorless, non-staining formulations',
      'Detailed chemical safety data sheets (MSDS) provided on-site',
      'Free between-cycle re-treatment if pests resurface',
    ],
    deliverablesAr: [
      'مسح مبدئي شامل للموقع مع خريطة بنقاط الضعف والتسلل المحتملة',
      'مركبات معتمدة رسمياً، عديمة الرائحة، ولا تترك أي بقع أو آثار',
      'توفير صحائف بيانات سلامة المواد (MSDS) مع كل إجراء',
      'إعادة معالجة مجانية خلال فترة الضمان في حال ظهور أي بؤرة',
    ],
  },
  {
    slug: 'lawn-development-maintenance',
    category: 'living-green',
    titleEn: 'Lawn Development & Maintenance',
    titleAr: 'تأسيس وصيانة المسطحات الخضراء',
    shortDescEn: 'Soil analysis, turf installation, irrigation setup, mowing, weed and pest control.',
    shortDescAr: 'تحليل التربة، تركيب وتمديد العشب الطبيعي، ضبط الري، والقص الدوري ومكافحة الحشائش الضارة.',
    fullDescEn:
      'Achieving emerald, golf-course-quality turf under the Saudi sun requires deep horticultural science. Our comprehensive lawn programs cover root-zone soil chemistry balancing, precision sub-grade laser leveling, top-grade seed and sod laying, specialized rotary mowing schedules, vertical dethatching, core aeration, and integrated weed suppression.',
    fullDescAr:
      'إن الوصول إلى مسطحات خضراء يانعة بجودة ملاعب الجولف العالمية في مناخ المملكة الحار يتطلب خبرة علمية متقدمة. تشمل برامجنا المتكاملة ضبط كيميائية ودرجة حموضة التربة، والتسوية الليزرية، وتوريد وتركيب رولات العشب الطبيعي، وجداول القص الاحترافي، والتهوية الميكانيكية للتربة، ومكافحة الأعشاب الضارة بانتظام.',
    featuresEn: [
      'Precision Subsoil Conditioning & pH Salinity Neutralization',
      'Laser-guided Turf Bed Grading for Zero Puddling',
      'High-durability Warm-season Sod Installation (Paspalum / Bermuda)',
      'Cylinder & Rotary Striping Mower Fleet Operations',
      'Hollow-tine Core Aeration & Organic Topdressing',
      'Selective Pre- and Post-emergent Weed Control Programs',
    ],
    featuresAr: [
      'تجهيز وتعديل خصائص التربة ومعالجة القلوية والملوحة',
      'تسوية طبقات التأسيس بتوجيه الليزر لضمان عدم ركود وتجمع المياه',
      'تركيب رولات عشب دافئ عالية المقاومة للأقدام (باسبالم / برمودا)',
      'أسطول معدات قص أسطوانية ودوارة تمنح خطوطاً جمالية مميزة',
      'تهوية التربة بتفريغ الاسطوانات وإضافة طبقات الرمل المعقم',
      'برامج متخصصة لمكافحة الحشائش العريضة والرفيعة دون الإضرار بالعشب',
    ],
    deliverablesEn: [
      'Bi-weekly or weekly scheduled maintenance visits by trained greenskeepers',
      'Seasonal overseeding with cool-season ryegrass for winter vibrancy',
      'Foliar micro-nutrient sprays to ensure rich chlorophyll pigmentation',
      'Real-time moisture probe readings to calibrate irrigation run-times',
    ],
    deliverablesAr: [
      'زيارات صيانة أسبوعية أو نصف شهرية من قبل فنيي صيانة ملاعب معتمدين',
      'زراعة شتوية تعويضية ببذور الراي جراس للحفاظ على الخضرة الزاهية',
      'رش دوري للمغذيات الصغرى لتعزيز إنتاج الكلوروفيل واللون الأخضر الغامق',
      'قراءات مجسات الرطوبة الميدانية لضبط فترات تشغيل محابس الري بدقة',
    ],
  },
  {
    slug: 'irrigation-water-systems',
    category: 'water-irrigation',
    titleEn: 'Irrigation & Water Systems',
    titleAr: 'شبكات الري وأنظمة المياه الذكية',
    shortDescEn: 'Automated drip and sprinkler systems, smart moisture sensors, and rainwater harvesting.',
    shortDescAr: 'أنظمة ري أوتوماتيكية بالتنقيط والرشاشات، مجسات رطوبة ذكية، وحلول حصاد واستغلال المياه.',
    fullDescEn:
      'In a desert climate, water is both the most precious resource and the cornerstone of landscape health. Green Solution designs, engineers, and installs smart pressurized irrigation networks achieving up to 30% documented water reductions. From satellite weather-predictive controllers and sub-surface dripline grids to heavy-duty rotor sprinklers and pressure-regulating valves, we ensure every droplet directly benefits plant root zones.',
    fullDescAr:
      'في المناخ الصحراوي، الماء هو أثمن مورد والركيزة الأساسية لازدهار الحدائق. تصمم وتنفذ جرين سلوشن شبكات ري ذكية ومضغوطة تحقق وفراً موثقاً يصل إلى 30% في استهلاك المياه. بدءاً من وحدات التحكم المتصلة بالأقمار الصناعية والأرصاد، وشبكات الري بالتنقيط تحت السطحية، وصولاً إلى الرشاشات الدوارة ومحابس تنظيم الضغط، نضمن وصول كل قطرة إلى جذور النبات مباشرة.',
    featuresEn: [
      'Hydraulic Engineering Calculations & Pipe Sizing Simulations',
      'Weather-adaptive Smart Controllers (Wi-Fi & GSM Remote Control)',
      'Subsurface Drip Irrigation (SDI) with Anti-siphon & Root-inhibitors',
      'Pop-up Rotary Gear Sprinklers with Precision Nozzle Arcs',
      'Integrated Filtration, Sand Separators & Fertilizer Injection (Fertigation)',
      'Deep-well Booster Pumps & Flow-sensor Emergency Shut-offs',
    ],
    featuresAr: [
      'حسابات هيدروليكية دقيقة ومحاكاة لضغوط وتدفقات الأنابيب',
      'وحدات تحكم ذكية مرتبطة بالطقس والإنترنت للتحكم عن بعد',
      'أنظمة ري بالتنقيط تحت السطح مزودة بمانع سحب التربة ومقاومة الجذور',
      'رشاشات دوارة منبثقة ذات زوايا توزيع متساوية لتغطية الملاعب',
      'محطات فلاتر رملية وشبكات حقن الأسمدة السائلة مع مياه الري',
      'مضخات رفع الضغط وحساسات تدفق تغلق الخطوط آلياً عند أي كسر',
    ],
    deliverablesEn: [
      'Full CAD as-built drawings detailing valve boxes and wire runs',
      'Water audit report detailing baseline vs. smart consumption',
      'Mobile app access for property manager to adjust watering cycles',
      'Pressure testing and certification for all main and lateral pipelines',
    ],
    deliverablesAr: [
      'مخططات تنفيذية (As-Built) توضح أماكن غرف المحابس ومسارات الأسلاك',
      'تقرير تدقيق مائي يوضح نسب التوفير بالمقارنة مع الأنظمة التقليدية',
      'تطبيق هاتف ذكي يتيح لمدير المنشأة مراقبة والتحكم في دورات الري',
      'اختبارات ضغط معتمدة لكافة الخطوط الرئيسية والفرعية قبل التسليم',
    ],
  },
  {
    slug: 'vegetable-fruit-gardens',
    category: 'living-green',
    titleEn: 'Vegetables & Fruit Gardens',
    titleAr: 'حدائق الخضروات والفواكه العضوية',
    shortDescEn: 'Raised beds, organic fertilization for homes, schools, and farms.',
    shortDescAr: 'أحواض زراعية مرتفعة وتسميد عضوي للمنازل والمدارس والمزارع الإنتاجية.',
    fullDescEn:
      'We bring sustainable home food production to Saudi villas, private estates, and educational centers. Our edible landscape specialists design raised timber and stone planter beds, thermal shade houses, companion planting layouts, and automated drip networks optimized for seasonal herbs, desert-tolerant citrus trees, figs, pomegranates, and organic table vegetables.',
    fullDescAr:
      'نعيد متعة الاكتفاء الذاتي والزراعة المنزلية الصديقة للبيئة إلى الفلل والقصور والمزارع والمؤسسات التعليمية. يصمم مهندسونا أحواض زراعية مرتفعة من الخشب المعالج والحجر، مع بيوت محمية بشباك تظليل حرارية، وشبكات تنقيط ذكية مخصصة لإنتاج الحمضيات والتين والرمان والورقيات والخضروات العضوية الطازجة.',
    featuresEn: [
      'Ergonomic Raised Planter Beds & Trellising Systems',
      'Organic Living Soil Mixes Rich in Worm Castings & Compost',
      'Selection of Proven Desert Fruit Varieties (Figs, Citrus, Pomegranates, Dates)',
      'Herbal Spirals & Culinary Kitchen Garden Zones',
      'Protective UV Shade Structures & Windbreak Screen Plantings',
      '100% Organic Pest Management & Soil Microbe Inoculations',
    ],
    featuresAr: [
      'أحواض زراعية مرتفعة مريحة وهياكل تعريش للمتسلقات المثمرة',
      'خلطات تربة عضوية غنية بالكمبوست والخمائر الطبيعية الحية',
      'أصناف فواكه مثبتة التجربة في بيئة المملكة (تين، ليمون، رمان، نخيل)',
      'حدائق حلزونية للأعشاب العطرية ومحيط المطبخ المنزلي',
      'مظلات تظليل شبكية لحماية المحاصيل من شمس الصيف الحارقة',
      'إدارة آفات عضوية بنسبة 100% وتلقيح للتربة بالميكروبات النافعة',
    ],
    deliverablesEn: [
      'Seasonal planting and harvesting calendar customized for KSA months',
      'Full setup of raised beds with internal drip manifolds',
      'Ongoing advisory visits on organic pest control and pruning',
      'Starter kit of organic certified non-GMO heirloom seeds',
    ],
    deliverablesAr: [
      'روزنامة زراعية موسمية توضح مواعيد البذر والحصاد في شهور السنة',
      'تجهيز كامل للأحواض المرتفعة مع تمديدات الري بالتنقيط المدمجة',
      'زيارات استشارية دورية لمتابعة الإثمار والتقليم ومكافحة الآفات عضوياً',
      'حقيبة بذور عضوية تأسيسية معتمدة وغير معدلة وراثياً',
    ],
  },
  {
    slug: 'patio-pergola-gazebo',
    category: 'hardscape-structures',
    titleEn: 'Patio, Pergola and Gazebo',
    titleAr: 'المظلات، البرجولات والجلسات الخارجية',
    shortDescEn: 'Durable, weather-resistant outdoor structures designed for Saudi Arabia’s climate.',
    shortDescAr: 'هياكل مظللة وجلسات خارجية متينة ومقاومة لتقلبات المناخ والشمس الحارقة في المملكة.',
    fullDescEn:
      'Extend your indoor living space into the open air with custom architectural outdoor structures. We design and fabricate custom pergolas, bioclimatic louvered roofs, freestanding gazebos, and luxury patio enclosures using thermal-treated WPC, powder-coated aerospace-grade aluminum, and seasoned teak designed to resist warping, UV bleaching, and desert winds.',
    fullDescAr:
      'ننقل فخامة المعيشة الداخلية إلى الهواء الطلق عبر هياكل معمارية استثنائية. نصمم وننفذ البرجولات الخشبية، والأسقف الذكية ذات الشرائح المتحركة (Bioclimatic)، والجلسات المظللة المنفصلة (الغازيبو) باستخدام خشب WPC المعالج وألومنيوم عالي الكثافة وخشب التيك المقاوم للالتواء والحرارة والرياح.',
    featuresEn: [
      'Motorized Bioclimatic Louvered Aluminum Pergolas',
      'Weather-resistant Wood-Plastic Composite (WPC) & Natural Hardwood',
      'Integrated Concealed LED Strip Lighting & Ambient Downlights',
      'Engineered Concrete Anchor Footings & Wind-load Resistance',
      'Retractable Weather Screens & Outdoor Ceiling Fan Mounting',
      'Custom BBQ Pavilions & Outdoor Kitchen Counter Enclosures',
    ],
    featuresAr: [
      'برجولات ألومنيوم ذكية بشرائح متحركة وموتور للتحكم في الظل والمطر',
      'هياكل خشب بلاستيكي معالج (WPC) وأخشاب طبيعية صلبة ومحمية',
      'إضاءات LED شريطية مخفية ووحدات سبوت لايت مدمجة في العوارض',
      'قواعد تثبيت خرسانية مدروسة هندسياً لمقاومة أعتى هبات الرياح',
      'ستائر جانبية متحركة مدمجة وتجهيزات لتركيب مراوح ورذاذ التبريد',
      'أجنحة مخصصة لمناطق الشواء وأسطح المطابخ الخارجية الفاخرة',
    ],
    deliverablesEn: [
      '3D photo-realistic architectural renderings showing shadow movement',
      'Structural calculation report ensuring wind speed compliance',
      'Factory precision fabrication with on-site rapid assembly',
      '10-year manufacturer structural warranty on aluminum and composite frames',
    ],
    deliverablesAr: [
      'تصاميم ثلاثية الأبعاد واقعية توضح حركة الظلال خلال ساعات النهار',
      'تقرير حسابات إنشائية معتمد لضمان مقاومة سرعات الرياح القياسية',
      'تصنيع معملي دقيق يضمن سرعة ونظافة التركيب بالموقع خلال أيام',
      'ضمان إنشائي يصل إلى 10 سنوات على هياكل الألومنيوم والمواد المركبة',
    ],
  },
  {
    slug: 'park-garden-landscaping',
    category: 'design-planning',
    titleEn: 'Park & Garden Landscaping',
    titleAr: 'تنسيق الحدائق والمتنزهات الكبرى',
    shortDescEn: 'Layout design, plant selection, pathways, lighting, water features, and seating.',
    shortDescAr: 'تخطيط وتوزيع متناسق، اختيار النباتات، ممرات، إضاءات ليلية، شلالات ونوافير، ومناطق جلوس.',
    fullDescEn:
      'From intimate private villa sanctuaries to multi-hectare corporate recreation parks, we orchestrate every element into a unified aesthetic symphony. We blend majestic specimen date palms with sculptured earth berms, meandering natural flagstone paths, soothing ambient water features, atmospheric nocturnal illumination, and tailored ergonomic seating zones.',
    fullDescAr:
      'من حدائق الفلل والقصور الخاصة إلى متنزهات المجمعات السكنية ومقرات الشركات الكبرى، ننسق كافة العناصر في سيمفونية بصرية متناغمة. نمزج بين نخيل التمر الشامخ، والتلال الخضراء الانسيابية، والممرات الحجرية المتعرجة، والمسطحات المائية الهادئة، والإضاءات الليلية الساحرة، ومناطق الجلوس المريحة.',
    featuresEn: [
      'Turnkey Park Master Planning & Horticultural Execution',
      'Custom Fountains, Cascading Waterfalls & Reflection Pools',
      'Meandering Pedestrian Pathways & Jogging Track Surfaces',
      'Earth Berming & Sculptural Topographic Landscaping',
      'Integrated Pergolas, Benches & Sculptural Art Installations',
      'Children Playground Integration with Certified Safety Surfacing',
    ],
    featuresAr: [
      'تخطيط وتنفيذ شامل ومتكامل للمتنزهات والحدائق من الألف إلى الياء',
      'نوافير راقصة وشلالات مائية وبحيرات عاكسة تضفي برودة وسكينة',
      'ممرات مشاة متعرجة ومضامير جري بأرضيات مطاطية ممتصة للصدمات',
      'تشكيل تضاريس الأرض وتلال خضراء تمنح عمقاً بصرياً ممتعاً',
      'برجولات وجلسات ومقاعد حجرية وقطع فنية معمارية مدمجة',
      'تجهيز مناطق ألعاب أطفال بأرضيات أمان مطاطية مطابقة للمواصفات',
    ],
    deliverablesEn: [
      'Full turnkey handover including all softscape and hardscape elements',
      'Complete hydraulic and electrical operational manual for water features',
      'Comprehensive plant maintenance schedule and seasonal fertilization plan',
      'Dedicated warranty inspection at 30, 60, and 90 days post-completion',
    ],
    deliverablesAr: [
      'تسليم كامل للمشروع جاهزاً بكافة عناصره النباتية والمعمارية',
      'كتيب تشغيل وصيانة شامل لأنظمة النوافير والضخ والإضاءات',
      'جدول دوري لصيانة النباتات وبرامج التسميد الموسمي المعتمدة',
      'زيارات فحص دورية مجدولة بعد 30 و60 و90 يوماً من تاريخ التسليم',
    ],
  },
  {
    slug: 'outdoor-lighting',
    category: 'water-irrigation',
    titleEn: 'Outdoor Lighting',
    titleAr: 'أنظمة الإنارة والإضاءة الخارجية',
    shortDescEn: 'LED, solar-powered, motion sensors, and smart automation for landscapes and pathways.',
    shortDescAr: 'إضاءات LED ذكية، طاقة شمسية، حساسات حركة، وتحكم آلي متطور للممرات والحدائق.',
    fullDescEn:
      'Landscape lighting transforms outdoor environments after twilight, unveiling dramatic shadows, highlighting architectural tree trunks, and establishing safe, luminous pathways. Green Solution engineers low-voltage LED and high-efficiency solar lighting systems complete with astronomical timers, DALI / smart-home automation, and marine-grade brass and aluminum fixtures built to resist desert dust and moisture.',
    fullDescAr:
      'تغير الإنارة الاحترافية ملامح الحديقة تماماً بعد الغروب؛ فتخلق ظلالاً فنية مذهلة، وتبرز تفاصيل جذوع الأشجار المعمرة، وتؤمن ممرات المشاة بإنارة مريحة للعين. تصمم جرين سلوشن أنظمة إضاءة منخفضة الجهد (Low Voltage LED) ووحدات طاقة شمسية مزودة بمؤقتات فلكية، وتحكم ذكي يدمج مع أنظمة المنازل الذكية، بهياكل نحاسية وألومنيوم مقاومة للرطوبة والغبار.',
    featuresEn: [
      'Architectural Tree Uplighting & Trunk Grazing Fixtures',
      'Low-glare Path Lights, Bollards & Recessed In-ground Markers',
      'Submersible Underwater LED Lights for Fountains & Pools (IP68)',
      'Solar-powered Hybrid Luminaires with Lithium Storage',
      'Smart Automation Integration (Lutron, KNX, Mobile App, DMX)',
      'Low-voltage 12V/24V Safety Transformers & Marine-grade Brass Casings',
    ],
    featuresAr: [
      'كشافات إضاءة مسلطة للأشجار لإبراز تفاصيل التاج والجذوع (Uplighting)',
      'أعمدة ومسارات إنارة أرضية مانعة للتوهج لتحديد الممرات بأمان',
      'إضاءات غاطسة بنقاء عالي للنوافير والمسابح بمعيار حماية IP68',
      'وحدات إنارة هجينة بالطاقة الشمسية مع بطاريات ليثيوم طويلة العمر',
      'ربط ذكي مع أنظمة المنازل الذكية (KNX, Lutron) والتحكم بالهاتف',
      'محولات أمان منخفضة الجهد 12V/24V مع هياكل نحاسية عالية التحمل',
    ],
    deliverablesEn: [
      'Lux illumination mapping & photometric distribution diagrams',
      'Complete voltage drop calculations and concealed conduit layout',
      'Pre-programmed daytime/nighttime scene transitions',
      '5-year warranty on LED fixtures and waterproof driver modules',
    ],
    deliverablesAr: [
      'مخطط فوتومتري يوضح شدة توزيع الإضاءة (Lux) وتوازنها البصري',
      'حسابات هبوط الجهد وتمديد خراطيم العزل الكهربائي تحت الأرض',
      'برمجة سيناريوهات إضاءة تلقائية تتغير مع أوقات الغروب والعشاء',
      'ضمان شامل لمدة 5 سنوات على وحدات الإضاءة والمحولات المعزولة',
    ],
  },
  {
    slug: 'termite-control',
    category: 'protection-services',
    titleEn: 'Termite Control Services',
    titleAr: 'خدمات مكافحة النمل الأبيض (الدَفان)',
    shortDescEn: 'Pre and post-construction treatment, soil and structural foundation protection.',
    shortDescAr: 'معالجة قبل وبعد البناء، وحماية التربة والأساسات الإنشائية من أضرار الأرضة.',
    fullDescEn:
      'Subterranean termites represent a devastating silent threat to Saudi properties, compromising structural wood, expansion joints, door frames, and foundation integrity. Green Solution provides certified pre-construction soil barrier treatments and non-repellent post-construction sub-slab injection, establishing an impenetrable chemical and physical defensive perimeter backed by formal long-term warranties.',
    fullDescAr:
      'يمثل النمل الأبيض الجوفي (الأرضة / الدفان) تهديداً صامتاً وخطيراً على المنشآت في المملكة، حيث يهاجم الأبواب الخشبية، والديكورات، وفواصل التمدد، بل والأساسات الإنشائية. تقدم جرين سلوشن معالجات كيميائية معتمدة للتربة قبل صبة النظافة (مرحلة الدفان)، وحقناً تحت البلاط للمباني القائمة، مما ينشئ حاجزاً دفاعياً لا يمكن اختراقه مع شهادات ضمان رسمية طويلة الأجل.',
    featuresEn: [
      'Pre-construction Sub-slab Soil Trenching & Barrier Spraying',
      'Post-construction Sub-slab Pressure Injection & Perimeter Trenching',
      'Non-repellent Transfer Chemical Technology (Termidor / Fipronil)',
      'Subsurface Electronic Termite Detection & Acoustic Monitoring',
      'Protection of Expansion Joints, Pipe Penetrations & Foundation Walls',
      'Official Municipality & Civil Defense Approved Compliance Certificates',
    ],
    featuresAr: [
      'رش ومعالجة التربة والدفان قبل صب الخرسانة للأرضيات والأساسات',
      'حقن ضغط ميكانيكي تحت بلاط المباني القائمة وحفر خنادق الحماية المحيطة',
      'استخدام مواد غير طاردة بخاصية الانتقال التبادلي بين المستعمرة (Fipronil)',
      'أجهزة رصد إلكتروني وصوتي للكشف المبكر عن أي نشاط تحت الأرض',
      'معالجة وحقن فواصل التمدد الإنشائية ومداخل تمديدات السباكة والكهرباء',
      'إصدار شهادات ضمان رسمية معتمدة للبلديات والجهات المشرفة',
    ],
    deliverablesEn: [
      'Comprehensive pre-treatment inspection and structural risk assessment',
      'Official Certificate of Warranty (up to 10 years) for municipality records',
      'Annual non-invasive re-inspection audit during warranty period',
      'Environmentally responsible application strictly respecting water tables',
    ],
    deliverablesAr: [
      'فحص مبدئي دقيق وتقييم المخاطر الإنشائية لطبقات التربة بالموقع',
      'شهادة ضمان رسمية معتمدة (تصل إلى 10 سنوات) لتقديمها للجهات المعنية',
      'زيارات فحص سنوية مجانية طوال فترة الضمان للتأكد من فاعلية الحاجز',
      'تطبيق احترافي مسؤول بيئياً يراعي عدم تلويث المياه الجوفية إطلاقاً',
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return servicesData.find((s) => s.slug === slug);
}
