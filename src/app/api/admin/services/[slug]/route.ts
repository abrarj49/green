import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getCmsServiceBySlug, updateCmsService, deleteCmsService } from '@/lib/sqlite';
import { isPostgresConfigured, pgGetCmsServiceBySlug, pgUpdateCmsService, pgDeleteCmsService } from '@/lib/postgres';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    let service = null;
    if (isPostgresConfigured()) {
      service = await pgGetCmsServiceBySlug(slug);
    } else {
      service = getCmsServiceBySlug(slug);
    }

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    console.error('Error fetching service in admin API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();

    let updated = null;
    if (isPostgresConfigured()) {
      updated = await pgUpdateCmsService(slug, body);
    } else {
      updated = updateCmsService(slug, body);
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Service not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    console.error('Error updating service in admin API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    let deleted = false;
    if (isPostgresConfigured()) {
      deleted = await pgDeleteCmsService(slug);
    } else {
      deleted = deleteCmsService(slug);
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Service not found or delete failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Service successfully deleted' });
  } catch (error: any) {
    console.error('Error deleting service in admin API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
