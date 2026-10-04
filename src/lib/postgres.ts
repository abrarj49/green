import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { DbSubmission, DbBlog, DbCmsService, DbSiteSeo } from '@/lib/sqlite';
import { servicesData } from '@/data/services';

export function isPostgresConfigured(): boolean {
  return !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);
}

function getConnectionString(): string {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Vercel Postgres is not configured: POSTGRES_URL or DATABASE_URL environment variable is missing.');
  }
  return url;
}

let sqlInstance: NeonQueryFunction<false, false> | null = null;
let initialized = false;

export function getPostgresSql(): NeonQueryFunction<false, false> {
  if (!sqlInstance) {
    sqlInstance = neon(getConnectionString());
  }
  return sqlInstance;
}

export async function ensurePostgresInitialized() {
  if (initialized || !isPostgresConfigured()) return;
  const sql = getPostgresSql();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        service VARCHAR(255) NOT NULL DEFAULT 'general',
        message TEXT NOT NULL,
        locale VARCHAR(10) NOT NULL DEFAULT 'en',
        status VARCHAR(50) NOT NULL DEFAULT 'new',
        source VARCHAR(100) NOT NULL DEFAULT 'contact-page',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_en VARCHAR(500) NOT NULL,
        title_ar VARCHAR(500) NOT NULL,
        excerpt_en TEXT NOT NULL,
        excerpt_ar TEXT NOT NULL,
        content_en TEXT NOT NULL,
        content_ar TEXT NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'landscape',
        image TEXT NOT NULL,
        author_en VARCHAR(255) NOT NULL DEFAULT 'Green Solution Technical Committee',
        author_ar VARCHAR(255) NOT NULL DEFAULT 'هيئة الخبراء الزراعيين بجرين سلوشن',
        read_time VARCHAR(50) NOT NULL DEFAULT '5 min read',
        tags JSONB NOT NULL DEFAULT '[]'::jsonb,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        meta_title_en VARCHAR(500) NOT NULL DEFAULT '',
        meta_title_ar VARCHAR(500) NOT NULL DEFAULT '',
        meta_desc_en TEXT NOT NULL DEFAULT '',
        meta_desc_ar TEXT NOT NULL DEFAULT '',
        keywords TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS services_cms (
        slug VARCHAR(255) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        division_code VARCHAR(50) NOT NULL DEFAULT 'DIV 01',
        image TEXT NOT NULL,
        title_en VARCHAR(500) NOT NULL,
        title_ar VARCHAR(500) NOT NULL,
        short_desc_en TEXT NOT NULL,
        short_desc_ar TEXT NOT NULL,
        full_desc_en TEXT NOT NULL,
        full_desc_ar TEXT NOT NULL,
        features_en JSONB NOT NULL,
        features_ar JSONB NOT NULL,
        deliverables_en JSONB NOT NULL,
        deliverables_ar JSONB NOT NULL,
        meta_title_en VARCHAR(500) NOT NULL DEFAULT '',
        meta_title_ar VARCHAR(500) NOT NULL DEFAULT '',
        meta_desc_en TEXT NOT NULL DEFAULT '',
        meta_desc_ar TEXT NOT NULL DEFAULT '',
        keywords TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS site_seo (
        page_key VARCHAR(100) PRIMARY KEY,
        title_en VARCHAR(500) NOT NULL,
        title_ar VARCHAR(500) NOT NULL,
        desc_en TEXT NOT NULL,
        desc_ar TEXT NOT NULL,
        keywords_en TEXT NOT NULL,
        keywords_ar TEXT NOT NULL,
        og_image TEXT NOT NULL DEFAULT '/img/hero-royal-palace.jpg',
        canonical_url TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Seed services if empty
    const srvCountRes = await sql`SELECT count(*)::int as count FROM services_cms;`;
    if (srvCountRes[0]?.count === 0) {
      for (let i = 0; i < servicesData.length; i++) {
        const s = servicesData[i];
        const divCode = `DIV ${String(i + 1).padStart(2, '0')}`;
        await sql`
          INSERT INTO services_cms (
            slug, category, division_code, image, title_en, title_ar, short_desc_en, short_desc_ar,
            full_desc_en, full_desc_ar, features_en, features_ar, deliverables_en, deliverables_ar,
            meta_title_en, meta_title_ar, meta_desc_en, meta_desc_ar, keywords
          ) VALUES (
            ${s.slug}, ${s.category}, ${divCode}, ${'/img/services/landscape-design.jpg'},
            ${s.titleEn}, ${s.titleAr}, ${s.shortDescEn}, ${s.shortDescAr},
            ${s.fullDescEn}, ${s.fullDescAr},
            ${JSON.stringify(s.featuresEn)}::jsonb, ${JSON.stringify(s.featuresAr)}::jsonb,
            ${JSON.stringify(s.deliverablesEn)}::jsonb, ${JSON.stringify(s.deliverablesAr)}::jsonb,
            ${`${s.titleEn} | Green Solution KSA`}, ${`${s.titleAr} | جرين سلوشن السعودية`},
            ${s.shortDescEn}, ${s.shortDescAr},
            ${'landscape, irrigation, saudi arabia, contracting, hardscape, green solution'}
          ) ON CONFLICT (slug) DO NOTHING;
        `;
      }
    }

    initialized = true;
  } catch (err) {
    console.error('Postgres init error:', err);
  }
}

// -------------------------------------------------------------------
// Submissions
// -------------------------------------------------------------------

export async function pgCreateSubmission(data: {
  name: string;
  email: string;
  phone: string;
  service?: string;
  message: string;
  locale?: string;
  source?: string;
  notes?: string;
}): Promise<DbSubmission> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();

  await sql`
    INSERT INTO submissions (
      id, name, email, phone, service, message, locale, status, source, notes, created_at, updated_at
    ) VALUES (
      ${id}, ${data.name.trim()}, ${data.email.trim().toLowerCase()}, ${data.phone.trim()},
      ${data.service || 'general'}, ${data.message.trim()}, ${data.locale || 'en'}, 'new',
      ${data.source || 'contact-page'}, ${data.notes || ''}, ${now}, ${now}
    );
  `;

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

export async function pgGetSubmissions(options: {
  status?: string | null;
  service?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}): Promise<{ submissions: DbSubmission[]; total: number; page: number; totalPages: number }> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 20;
  const offset = (page - 1) * limit;

  let rows: any[] = [];
  let countRes: any[] = [];

  const status = options.status && options.status !== 'all' ? options.status : null;
  const service = options.service && options.service !== 'all' ? options.service : null;
  const search = options.search && options.search.trim() ? `%${options.search.trim()}%` : null;

  if (status && service && search) {
    countRes = await sql`SELECT count(*)::int as count FROM submissions WHERE status = ${status} AND service = ${service} AND (name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search} OR message ILIKE ${search});`;
    rows = await sql`SELECT * FROM submissions WHERE status = ${status} AND service = ${service} AND (name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search} OR message ILIKE ${search}) ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;
  } else if (status && search) {
    countRes = await sql`SELECT count(*)::int as count FROM submissions WHERE status = ${status} AND (name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search} OR message ILIKE ${search});`;
    rows = await sql`SELECT * FROM submissions WHERE status = ${status} AND (name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search} OR message ILIKE ${search}) ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;
  } else if (service && search) {
    countRes = await sql`SELECT count(*)::int as count FROM submissions WHERE service = ${service} AND (name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search} OR message ILIKE ${search});`;
    rows = await sql`SELECT * FROM submissions WHERE service = ${service} AND (name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search} OR message ILIKE ${search}) ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;
  } else if (status && service) {
    countRes = await sql`SELECT count(*)::int as count FROM submissions WHERE status = ${status} AND service = ${service};`;
    rows = await sql`SELECT * FROM submissions WHERE status = ${status} AND service = ${service} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;
  } else if (status) {
    countRes = await sql`SELECT count(*)::int as count FROM submissions WHERE status = ${status};`;
    rows = await sql`SELECT * FROM submissions WHERE status = ${status} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;
  } else if (service) {
    countRes = await sql`SELECT count(*)::int as count FROM submissions WHERE service = ${service};`;
    rows = await sql`SELECT * FROM submissions WHERE service = ${service} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;
  } else if (search) {
    countRes = await sql`SELECT count(*)::int as count FROM submissions WHERE name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search} OR message ILIKE ${search};`;
    rows = await sql`SELECT * FROM submissions WHERE name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search} OR message ILIKE ${search} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;
  } else {
    countRes = await sql`SELECT count(*)::int as count FROM submissions;`;
    rows = await sql`SELECT * FROM submissions ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;
  }

  const total = Number(countRes[0]?.count || 0);
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
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  }));

  return {
    submissions,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function pgGetSubmissionById(id: string): Promise<DbSubmission | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const rows = await sql`SELECT * FROM submissions WHERE id = ${id} LIMIT 1;`;
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
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
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export async function pgUpdateSubmission(
  id: string,
  updates: Partial<Pick<DbSubmission, 'status' | 'notes'>>
): Promise<DbSubmission | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const now = new Date().toISOString();

  if (updates.status !== undefined && updates.notes !== undefined) {
    await sql`UPDATE submissions SET status = ${updates.status}, notes = ${updates.notes}, updated_at = ${now} WHERE id = ${id};`;
  } else if (updates.status !== undefined) {
    await sql`UPDATE submissions SET status = ${updates.status}, updated_at = ${now} WHERE id = ${id};`;
  } else if (updates.notes !== undefined) {
    await sql`UPDATE submissions SET notes = ${updates.notes}, updated_at = ${now} WHERE id = ${id};`;
  }

  return await pgGetSubmissionById(id);
}

export async function pgGetAllSubmissionsForExport(): Promise<DbSubmission[]> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const rows = await sql`SELECT * FROM submissions ORDER BY created_at DESC;`;
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
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  }));
}

// -------------------------------------------------------------------
// Blogs
// -------------------------------------------------------------------

export async function pgGetBlogs(options?: {
  category?: string | null;
  publishedOnly?: boolean;
}): Promise<DbBlog[]> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const publishedOnly = options?.publishedOnly !== false;
  const category = options?.category && options.category !== 'all' ? options.category : null;

  let rows: any[] = [];
  if (publishedOnly && category) {
    rows = await sql`SELECT * FROM blogs WHERE is_published = TRUE AND category = ${category} ORDER BY created_at DESC;`;
  } else if (publishedOnly) {
    rows = await sql`SELECT * FROM blogs WHERE is_published = TRUE ORDER BY created_at DESC;`;
  } else if (category) {
    rows = await sql`SELECT * FROM blogs WHERE category = ${category} ORDER BY created_at DESC;`;
  } else {
    rows = await sql`SELECT * FROM blogs ORDER BY created_at DESC;`;
  }

  return rows.map((r) => ({
    id: String(r.id),
    slug: String(r.slug),
    titleEn: String(r.title_en),
    titleAr: String(r.title_ar),
    excerptEn: String(r.excerpt_en),
    excerptAr: String(r.excerpt_ar),
    contentEn: String(r.content_en),
    contentAr: String(r.content_ar),
    category: String(r.category),
    image: String(r.image),
    authorEn: String(r.author_en),
    authorAr: String(r.author_ar),
    readTime: String(r.read_time),
    tags: Array.isArray(r.tags) ? r.tags : [],
    isPublished: Boolean(r.is_published),
    metaTitleEn: String(r.meta_title_en || ''),
    metaTitleAr: String(r.meta_title_ar || ''),
    metaDescEn: String(r.meta_desc_en || ''),
    metaDescAr: String(r.meta_desc_ar || ''),
    keywords: String(r.keywords || ''),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  }));
}

export async function pgGetBlogBySlug(slug: string): Promise<DbBlog | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const rows = await sql`SELECT * FROM blogs WHERE slug = ${slug} LIMIT 1;`;
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: String(r.id),
    slug: String(r.slug),
    titleEn: String(r.title_en),
    titleAr: String(r.title_ar),
    excerptEn: String(r.excerpt_en),
    excerptAr: String(r.excerpt_ar),
    contentEn: String(r.content_en),
    contentAr: String(r.content_ar),
    category: String(r.category),
    image: String(r.image),
    authorEn: String(r.author_en),
    authorAr: String(r.author_ar),
    readTime: String(r.read_time),
    tags: Array.isArray(r.tags) ? r.tags : [],
    isPublished: Boolean(r.is_published),
    metaTitleEn: String(r.meta_title_en || ''),
    metaTitleAr: String(r.meta_title_ar || ''),
    metaDescEn: String(r.meta_desc_en || ''),
    metaDescAr: String(r.meta_desc_ar || ''),
    keywords: String(r.keywords || ''),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export async function pgGetBlogById(id: string): Promise<DbBlog | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const rows = await sql`SELECT * FROM blogs WHERE id = ${id} LIMIT 1;`;
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: String(r.id),
    slug: String(r.slug),
    titleEn: String(r.title_en),
    titleAr: String(r.title_ar),
    excerptEn: String(r.excerpt_en),
    excerptAr: String(r.excerpt_ar),
    contentEn: String(r.content_en),
    contentAr: String(r.content_ar),
    category: String(r.category),
    image: String(r.image),
    authorEn: String(r.author_en),
    authorAr: String(r.author_ar),
    readTime: String(r.read_time),
    tags: Array.isArray(r.tags) ? r.tags : [],
    isPublished: Boolean(r.is_published),
    metaTitleEn: String(r.meta_title_en || ''),
    metaTitleAr: String(r.meta_title_ar || ''),
    metaDescEn: String(r.meta_desc_en || ''),
    metaDescAr: String(r.meta_desc_ar || ''),
    keywords: String(r.keywords || ''),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export async function pgCreateBlog(data: Partial<DbBlog>): Promise<DbBlog> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const id = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  await sql`
    INSERT INTO blogs (
      id, slug, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar,
      category, image, author_en, author_ar, read_time, tags, is_published,
      meta_title_en, meta_title_ar, meta_desc_en, meta_desc_ar, keywords, created_at, updated_at
    ) VALUES (
      ${id}, ${data.slug || id}, ${data.titleEn || ''}, ${data.titleAr || ''},
      ${data.excerptEn || ''}, ${data.excerptAr || ''}, ${data.contentEn || ''}, ${data.contentAr || ''},
      ${data.category || 'landscape'}, ${data.image || '/img/services/landscape-design.jpg'},
      ${data.authorEn || 'Green Solution'}, ${data.authorAr || 'جرين سلوشن'},
      ${data.readTime || '5 min read'}, ${JSON.stringify(data.tags || [])}::jsonb,
      ${data.isPublished !== false}, ${data.metaTitleEn || ''}, ${data.metaTitleAr || ''},
      ${data.metaDescEn || ''}, ${data.metaDescAr || ''}, ${data.keywords || ''}, ${now}, ${now}
    );
  `;

  return (await pgGetBlogById(id))!;
}

export async function pgUpdateBlog(id: string, updates: Partial<DbBlog>): Promise<DbBlog | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const now = new Date().toISOString();

  await sql`
    UPDATE blogs SET
      title_en = COALESCE(${updates.titleEn ?? null}, title_en),
      title_ar = COALESCE(${updates.titleAr ?? null}, title_ar),
      excerpt_en = COALESCE(${updates.excerptEn ?? null}, excerpt_en),
      excerpt_ar = COALESCE(${updates.excerptAr ?? null}, excerpt_ar),
      content_en = COALESCE(${updates.contentEn ?? null}, content_en),
      content_ar = COALESCE(${updates.contentAr ?? null}, content_ar),
      category = COALESCE(${updates.category ?? null}, category),
      image = COALESCE(${updates.image ?? null}, image),
      read_time = COALESCE(${updates.readTime ?? null}, read_time),
      is_published = COALESCE(${updates.isPublished ?? null}, is_published),
      updated_at = ${now}
    WHERE id = ${id};
  `;

  return await pgGetBlogById(id);
}

export async function pgDeleteBlog(id: string): Promise<boolean> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  await sql`DELETE FROM blogs WHERE id = ${id};`;
  return true;
}

// -------------------------------------------------------------------
// Services CMS
// -------------------------------------------------------------------

export async function pgGetCmsServices(category?: string | null): Promise<DbCmsService[]> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  let rows: any[] = [];
  if (category && category !== 'all') {
    rows = await sql`SELECT * FROM services_cms WHERE category = ${category} ORDER BY division_code ASC;`;
  } else {
    rows = await sql`SELECT * FROM services_cms ORDER BY division_code ASC;`;
  }

  return rows.map((r) => ({
    slug: String(r.slug),
    category: String(r.category),
    divisionCode: String(r.division_code),
    image: String(r.image),
    titleEn: String(r.title_en),
    titleAr: String(r.title_ar),
    shortDescEn: String(r.short_desc_en),
    shortDescAr: String(r.short_desc_ar),
    fullDescEn: String(r.full_desc_en),
    fullDescAr: String(r.full_desc_ar),
    featuresEn: Array.isArray(r.features_en) ? r.features_en : [],
    featuresAr: Array.isArray(r.features_ar) ? r.features_ar : [],
    deliverablesEn: Array.isArray(r.deliverables_en) ? r.deliverables_en : [],
    deliverablesAr: Array.isArray(r.deliverables_ar) ? r.deliverables_ar : [],
    metaTitleEn: String(r.meta_title_en || ''),
    metaTitleAr: String(r.meta_title_ar || ''),
    metaDescEn: String(r.meta_desc_en || ''),
    metaDescAr: String(r.meta_desc_ar || ''),
    keywords: String(r.keywords || ''),
    updatedAt: new Date(r.updated_at).toISOString(),
  }));
}

export async function pgGetCmsServiceBySlug(slug: string): Promise<DbCmsService | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const rows = await sql`SELECT * FROM services_cms WHERE slug = ${slug} LIMIT 1;`;
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    slug: String(r.slug),
    category: String(r.category),
    divisionCode: String(r.division_code),
    image: String(r.image),
    titleEn: String(r.title_en),
    titleAr: String(r.title_ar),
    shortDescEn: String(r.short_desc_en),
    shortDescAr: String(r.short_desc_ar),
    fullDescEn: String(r.full_desc_en),
    fullDescAr: String(r.full_desc_ar),
    featuresEn: Array.isArray(r.features_en) ? r.features_en : [],
    featuresAr: Array.isArray(r.features_ar) ? r.features_ar : [],
    deliverablesEn: Array.isArray(r.deliverables_en) ? r.deliverables_en : [],
    deliverablesAr: Array.isArray(r.deliverables_ar) ? r.deliverables_ar : [],
    metaTitleEn: String(r.meta_title_en || ''),
    metaTitleAr: String(r.meta_title_ar || ''),
    metaDescEn: String(r.meta_desc_en || ''),
    metaDescAr: String(r.meta_desc_ar || ''),
    keywords: String(r.keywords || ''),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export async function pgCreateCmsService(data: Partial<DbCmsService>): Promise<DbCmsService> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const now = new Date().toISOString();

  await sql`
    INSERT INTO services_cms (
      slug, category, division_code, image, title_en, title_ar, short_desc_en, short_desc_ar,
      full_desc_en, full_desc_ar, features_en, features_ar, deliverables_en, deliverables_ar,
      meta_title_en, meta_title_ar, meta_desc_en, meta_desc_ar, keywords, updated_at
    ) VALUES (
      ${data.slug}, ${data.category || 'General'}, ${data.divisionCode || 'DIV 32-00'},
      ${data.image || ''}, ${data.titleEn || ''}, ${data.titleAr || ''},
      ${data.shortDescEn || ''}, ${data.shortDescAr || ''},
      ${data.fullDescEn || ''}, ${data.fullDescAr || ''},
      ${JSON.stringify(data.featuresEn || [])}::jsonb, ${JSON.stringify(data.featuresAr || [])}::jsonb,
      ${JSON.stringify(data.deliverablesEn || [])}::jsonb, ${JSON.stringify(data.deliverablesAr || [])}::jsonb,
      ${data.metaTitleEn || ''}, ${data.metaTitleAr || ''},
      ${data.metaDescEn || ''}, ${data.metaDescAr || ''},
      ${data.keywords || ''}, ${now}
    );
  `;

  return (await pgGetCmsServiceBySlug(data.slug!))!;
}

export async function pgUpdateCmsService(slug: string, data: Partial<Omit<DbCmsService, 'slug'>>): Promise<DbCmsService | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const now = new Date().toISOString();

  await sql`
    UPDATE services_cms SET
      category = COALESCE(${data.category ?? null}, category),
      division_code = COALESCE(${data.divisionCode ?? null}, division_code),
      image = COALESCE(${data.image ?? null}, image),
      title_en = COALESCE(${data.titleEn ?? null}, title_en),
      title_ar = COALESCE(${data.titleAr ?? null}, title_ar),
      short_desc_en = COALESCE(${data.shortDescEn ?? null}, short_desc_en),
      short_desc_ar = COALESCE(${data.shortDescAr ?? null}, short_desc_ar),
      full_desc_en = COALESCE(${data.fullDescEn ?? null}, full_desc_en),
      full_desc_ar = COALESCE(${data.fullDescAr ?? null}, full_desc_ar),
      features_en = CASE WHEN ${data.featuresEn ? true : false} THEN ${JSON.stringify(data.featuresEn || [])}::jsonb ELSE features_en END,
      features_ar = CASE WHEN ${data.featuresAr ? true : false} THEN ${JSON.stringify(data.featuresAr || [])}::jsonb ELSE features_ar END,
      deliverables_en = CASE WHEN ${data.deliverablesEn ? true : false} THEN ${JSON.stringify(data.deliverablesEn || [])}::jsonb ELSE deliverables_en END,
      deliverables_ar = CASE WHEN ${data.deliverablesAr ? true : false} THEN ${JSON.stringify(data.deliverablesAr || [])}::jsonb ELSE deliverables_ar END,
      meta_title_en = COALESCE(${data.metaTitleEn ?? null}, meta_title_en),
      meta_title_ar = COALESCE(${data.metaTitleAr ?? null}, meta_title_ar),
      meta_desc_en = COALESCE(${data.metaDescEn ?? null}, meta_desc_en),
      meta_desc_ar = COALESCE(${data.metaDescAr ?? null}, meta_desc_ar),
      keywords = COALESCE(${data.keywords ?? null}, keywords),
      updated_at = ${now}
    WHERE slug = ${slug};
  `;

  return await pgGetCmsServiceBySlug(slug);
}

export async function pgDeleteCmsService(slug: string): Promise<boolean> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  await sql`DELETE FROM services_cms WHERE slug = ${slug};`;
  return true;
}

// -------------------------------------------------------------------
// Site SEO
// -------------------------------------------------------------------

export async function pgGetAllSiteSeo(): Promise<DbSiteSeo[]> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const rows = await sql`SELECT * FROM site_seo ORDER BY page_key ASC;`;
  return rows.map((r) => ({
    pageKey: String(r.page_key),
    titleEn: String(r.title_en),
    titleAr: String(r.title_ar),
    descEn: String(r.desc_en),
    descAr: String(r.desc_ar),
    keywordsEn: String(r.keywords_en),
    keywordsAr: String(r.keywords_ar),
    ogImage: String(r.og_image),
    canonicalUrl: String(r.canonical_url),
    updatedAt: new Date(r.updated_at).toISOString(),
  }));
}

export async function pgGetSiteSeo(pageKey: string): Promise<DbSiteSeo | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const rows = await sql`SELECT * FROM site_seo WHERE page_key = ${pageKey} LIMIT 1;`;
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    pageKey: String(r.page_key),
    titleEn: String(r.title_en),
    titleAr: String(r.title_ar),
    descEn: String(r.desc_en),
    descAr: String(r.desc_ar),
    keywordsEn: String(r.keywords_en),
    keywordsAr: String(r.keywords_ar),
    ogImage: String(r.og_image),
    canonicalUrl: String(r.canonical_url),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export async function pgUpdateSiteSeo(pageKey: string, data: Partial<DbSiteSeo>): Promise<DbSiteSeo | null> {
  await ensurePostgresInitialized();
  const sql = getPostgresSql();
  const now = new Date().toISOString();

  await sql`
    INSERT INTO site_seo (
      page_key, title_en, title_ar, desc_en, desc_ar, keywords_en, keywords_ar, og_image, canonical_url, updated_at
    ) VALUES (
      ${pageKey}, ${data.titleEn || ''}, ${data.titleAr || ''}, ${data.descEn || ''}, ${data.descAr || ''},
      ${data.keywordsEn || ''}, ${data.keywordsAr || ''}, ${data.ogImage || '/img/hero-royal-palace.jpg'},
      ${data.canonicalUrl || ''}, ${now}
    ) ON CONFLICT (page_key) DO UPDATE SET
      title_en = COALESCE(EXCLUDED.title_en, site_seo.title_en),
      title_ar = COALESCE(EXCLUDED.title_ar, site_seo.title_ar),
      desc_en = COALESCE(EXCLUDED.desc_en, site_seo.desc_en),
      desc_ar = COALESCE(EXCLUDED.desc_ar, site_seo.desc_ar),
      keywords_en = COALESCE(EXCLUDED.keywords_en, site_seo.keywords_en),
      keywords_ar = COALESCE(EXCLUDED.keywords_ar, site_seo.keywords_ar),
      og_image = COALESCE(EXCLUDED.og_image, site_seo.og_image),
      canonical_url = COALESCE(EXCLUDED.canonical_url, site_seo.canonical_url),
      updated_at = ${now};
  `;

  return await pgGetSiteSeo(pageKey);
}
