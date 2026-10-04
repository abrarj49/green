import { DatabaseSync } from 'node:sqlite';
import { neon } from '@neondatabase/serverless';
import path from 'path';

const url = 'postgresql://neondb_owner:npg_pJuh3KLDw7To@ep-still-haze-b3rixn13-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(url);

const dbPath = path.join(process.cwd(), 'data', 'green.db');
console.log('Reading local SQLite database from:', dbPath);
const sqlite = new DatabaseSync(dbPath);

async function migrate() {
  try {
    // 1. Recreate services_cms table cleanly
    await sql`DROP TABLE IF EXISTS services_cms CASCADE;`;
    await sql`
      CREATE TABLE services_cms (
        slug VARCHAR(255) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        division_code VARCHAR(50) NOT NULL DEFAULT 'DIV 01',
        image TEXT NOT NULL DEFAULT '',
        title_en VARCHAR(500) NOT NULL,
        title_ar VARCHAR(500) NOT NULL,
        short_desc_en TEXT NOT NULL DEFAULT '',
        short_desc_ar TEXT NOT NULL DEFAULT '',
        full_desc_en TEXT NOT NULL DEFAULT '',
        full_desc_ar TEXT NOT NULL DEFAULT '',
        features_en JSONB NOT NULL DEFAULT '[]'::jsonb,
        features_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
        deliverables_en JSONB NOT NULL DEFAULT '[]'::jsonb,
        deliverables_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
        meta_title_en VARCHAR(500) NOT NULL DEFAULT '',
        meta_title_ar VARCHAR(500) NOT NULL DEFAULT '',
        meta_desc_en TEXT NOT NULL DEFAULT '',
        meta_desc_ar TEXT NOT NULL DEFAULT '',
        keywords TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const services = sqlite.prepare('SELECT * FROM services_cms').all();
    console.log(`Found ${services.length} services in SQLite.`);

    for (const s of services) {
      console.log(`Migrating service: ${s.slug} (${s.titleEn || s.title_en})`);
      await sql`
        INSERT INTO services_cms (
          slug, category, division_code, image, title_en, title_ar,
          short_desc_en, short_desc_ar, full_desc_en, full_desc_ar,
          features_en, features_ar, deliverables_en, deliverables_ar,
          meta_title_en, meta_title_ar, meta_desc_en, meta_desc_ar, keywords,
          created_at, updated_at
        ) VALUES (
          ${s.slug}, ${s.category}, ${s.division_code || s.divisionCode || 'DIV 01'}, ${s.image || ''},
          ${s.title_en || s.titleEn || ''}, ${s.title_ar || s.titleAr || ''},
          ${s.short_desc_en || s.shortDescEn || ''}, ${s.short_desc_ar || s.shortDescAr || ''},
          ${s.full_desc_en || s.fullDescEn || ''}, ${s.full_desc_ar || s.fullDescAr || ''},
          ${s.features_en || s.featuresEn || '[]'}::jsonb, ${s.features_ar || s.featuresAr || '[]'}::jsonb,
          ${s.deliverables_en || s.deliverablesEn || '[]'}::jsonb, ${s.deliverables_ar || s.deliverablesAr || '[]'}::jsonb,
          ${s.meta_title_en || s.metaTitleEn || ''}, ${s.meta_title_ar || s.metaTitleAr || ''},
          ${s.meta_desc_en || s.metaDescEn || ''}, ${s.meta_desc_ar || s.metaDescAr || ''},
          ${s.keywords || ''},
          ${s.created_at || s.createdAt || new Date().toISOString()}, ${s.updated_at || s.updatedAt || new Date().toISOString()}
        );
      `;
    }

    // 2. Recreate blogs table cleanly
    await sql`DROP TABLE IF EXISTS blogs CASCADE;`;
    await sql`
      CREATE TABLE blogs (
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

    const blogs = sqlite.prepare('SELECT * FROM blogs').all();
    console.log(`Found ${blogs.length} blogs in SQLite.`);

    for (const b of blogs) {
      console.log(`Migrating blog: ${b.slug} (${b.titleEn || b.title_en})`);
      await sql`
        INSERT INTO blogs (
          id, slug, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar,
          category, image, author_en, author_ar, read_time, tags, is_published,
          meta_title_en, meta_title_ar, meta_desc_en, meta_desc_ar, keywords,
          created_at, updated_at
        ) VALUES (
          ${b.id}, ${b.slug}, ${b.titleEn || b.title_en}, ${b.titleAr || b.title_ar},
          ${b.excerptEn || b.excerpt_en || ''}, ${b.excerptAr || b.excerpt_ar || ''},
          ${b.contentEn || b.content_en || ''}, ${b.contentAr || b.content_ar || ''},
          ${b.category || 'landscape'}, ${b.image || ''},
          ${b.authorEn || b.author_en || 'Green Solution'}, ${b.authorAr || b.author_ar || 'جرين سلوشن'},
          ${b.readTime || b.read_time || '5 min read'}, ${b.tags || '[]'}::jsonb,
          ${b.isPublished !== 0 && b.is_published !== false},
          ${b.metaTitleEn || b.meta_title_en || ''}, ${b.metaTitleAr || b.meta_title_ar || ''},
          ${b.metaDescEn || b.meta_desc_en || ''}, ${b.metaDescAr || b.meta_desc_ar || ''},
          ${b.keywords || ''},
          ${b.createdAt || b.created_at || new Date().toISOString()},
          ${b.updatedAt || b.updated_at || new Date().toISOString()}
        );
      `;
    }

    // 3. Migrate SEO
    await sql`DROP TABLE IF EXISTS site_seo CASCADE;`;
    await sql`
      CREATE TABLE site_seo (
        page_key VARCHAR(100) PRIMARY KEY,
        title_en VARCHAR(500) NOT NULL,
        title_ar VARCHAR(500) NOT NULL,
        desc_en TEXT NOT NULL,
        desc_ar TEXT NOT NULL,
        keywords_en TEXT NOT NULL,
        keywords_ar TEXT NOT NULL,
        og_image TEXT NOT NULL,
        canonical_url TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const seos = sqlite.prepare('SELECT * FROM site_seo').all();
    console.log(`Found ${seos.length} SEO records in SQLite.`);

    for (const seo of seos) {
      await sql`
        INSERT INTO site_seo (
          page_key, title_en, title_ar, desc_en, desc_ar, keywords_en, keywords_ar, og_image, canonical_url, updated_at
        ) VALUES (
          ${seo.pageKey || seo.page_key}, ${seo.titleEn || seo.title_en}, ${seo.titleAr || seo.title_ar},
          ${seo.descEn || seo.desc_en}, ${seo.descAr || seo.desc_ar},
          ${seo.keywordsEn || seo.keywords_en}, ${seo.keywordsAr || seo.keywords_ar},
          ${seo.ogImage || seo.og_image || ''}, ${seo.canonicalUrl || seo.canonical_url || ''},
          ${seo.updatedAt || seo.updated_at || new Date().toISOString()}
        );
      `;
    }

    const finalServices = await sql`SELECT count(*) FROM services_cms;`;
    const finalBlogs = await sql`SELECT count(*) FROM blogs;`;
    console.log(`\n🎉 MIGRATION SUCCESSFUL! Neon Database is fully populated:`);
    console.log(`- Services in Neon: ${finalServices[0].count}`);
    console.log(`- Blogs in Neon: ${finalBlogs[0].count}`);

  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
