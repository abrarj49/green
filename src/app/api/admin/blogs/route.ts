import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getBlogs, createBlog } from '@/lib/sqlite';

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const isPublishedParam = searchParams.get('isPublished');
    const isPublished = isPublishedParam !== null ? isPublishedParam === 'true' : undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const result = getBlogs({
      category,
      isPublished,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      blogs: result.blogs,
      pagination: {
        total: result.total,
        page: result.page,
        limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching blogs in admin API:', error);
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
      excerptEn,
      excerptAr,
      contentEn,
      contentAr,
      category,
      image,
      authorEn,
      authorAr,
      readTime,
      tags,
      isPublished,
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

    // Auto-generate slug if not provided
    const generatedSlug = (slug || titleEn)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newBlog = createBlog({
      slug: generatedSlug,
      titleEn: titleEn.trim(),
      titleAr: (titleAr || titleEn).trim(),
      excerptEn: excerptEn || '',
      excerptAr: excerptAr || '',
      contentEn: contentEn || '',
      contentAr: contentAr || '',
      category: category || 'General',
      image: image || '/images/hero-1.webp',
      authorEn: authorEn || 'Green Solution Engineering Team',
      authorAr: authorAr || 'فريق الهندسة - جرين سليوشن',
      readTime: readTime || '5 min read',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      isPublished: Boolean(isPublished),
      metaTitleEn: metaTitleEn || titleEn,
      metaTitleAr: metaTitleAr || titleAr || titleEn,
      metaDescEn: metaDescEn || excerptEn || '',
      metaDescAr: metaDescAr || excerptAr || '',
      keywords: keywords || '',
    });

    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog in admin API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
