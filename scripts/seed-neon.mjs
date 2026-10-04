import { neon } from '@neondatabase/serverless';

const url = 'postgresql://neondb_owner:npg_pJuh3KLDw7To@ep-still-haze-b3rixn13-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
console.log('Connecting to Neon database...');

const sql = neon(url);

async function init() {
  try {
    const version = await sql`SELECT version();`;
    console.log('Connected successfully! PostgreSQL Version:', version[0].version);

    console.log('Creating tables...');
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
        deliverablesAr JSONB NOT NULL DEFAULT '[]'::jsonb,
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
      CREATE TABLE IF NOT EXISTS site_seo (
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

    console.log('Tables created successfully!');

    // Check count of services_cms
    const count = await sql`SELECT count(*) FROM services_cms;`;
    console.log('Existing services_cms count:', count[0].count);

    const blogCount = await sql`SELECT count(*) FROM blogs;`;
    console.log('Existing blogs count:', blogCount[0].count);

  } catch (err) {
    console.error('Neon initialization error:', err);
  }
}

init();
