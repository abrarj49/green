import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getCmsServices, createCmsService, getCmsServiceBySlug } from '@/lib/sqlite';
import { isPostgresConfigured, pgGetCmsServices } from '@/lib/postgres';

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (isPostgresConfigured()) {
      const services = await pgGetCmsServices();
      return NextResponse.json({ success: true, services });
    }

    const services = getCmsServices();
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    console.error('Error fetching services in admin API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      titleEn,
      titleAr,
      slug,
      divisionCode,
      category,
      image,
      shortDescEn,
      shortDescAr,
      fullDescEn,
      fullDescAr,
      featuresEn,
      featuresAr,
      deliverablesEn,
      deliverablesAr,
      metaTitleEn,
      metaTitleAr,
      metaDescEn,
      metaDescAr,
      keywords,
    } = body;

    if (!titleEn) {
      return NextResponse.json(
        { success: false, error: 'English Title is required' },
        { status: 400 }
      );
    }

    // Generate sanitized slug
    const generatedSlug = (slug || titleEn)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Check if slug already exists
    const existing = getCmsServiceBySlug(generatedSlug);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `A service with slug "${generatedSlug}" already exists.` },
        { status: 400 }
      );
    }

    const newService = createCmsService({
      slug: generatedSlug,
      titleEn: titleEn.trim(),
      titleAr: (titleAr || titleEn).trim(),
      divisionCode: (divisionCode || 'DIV 32-00').trim(),
      category: category || 'Landscape Architecture',
      image: image || '/images/hero-1.webp',
      shortDescEn: shortDescEn || '',
      shortDescAr: shortDescAr || '',
      fullDescEn: fullDescEn || '',
      fullDescAr: fullDescAr || '',
      featuresEn: Array.isArray(featuresEn) ? featuresEn : [],
      featuresAr: Array.isArray(featuresAr) ? featuresAr : [],
      deliverablesEn: Array.isArray(deliverablesEn) ? deliverablesEn : [],
      deliverablesAr: Array.isArray(deliverablesAr) ? deliverablesAr : [],
      metaTitleEn: metaTitleEn || titleEn,
      metaTitleAr: metaTitleAr || titleAr || titleEn,
      metaDescEn: metaDescEn || shortDescEn || '',
      metaDescAr: metaDescAr || shortDescAr || '',
      keywords: keywords || '',
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, service: newService }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating service in admin API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
