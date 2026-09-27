import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getAllSiteSeo, updateSiteSeo } from '@/lib/sqlite';

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const seoRecords = getAllSiteSeo();
    return NextResponse.json({ success: true, seoRecords });
  } catch (error: any) {
    console.error('Error fetching SEO in admin API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pageKey, ...data } = body;

    if (!pageKey) {
      return NextResponse.json(
        { success: false, error: 'pageKey is required' },
        { status: 400 }
      );
    }

    const updated = updateSiteSeo(pageKey, data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'SEO record not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, seo: updated });
  } catch (error: any) {
    console.error('Error updating SEO in admin API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
