import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getBlogById, updateBlog, deleteBlog } from '@/lib/sqlite';
import { isPostgresConfigured, pgGetBlogById, pgUpdateBlog, pgDeleteBlog } from '@/lib/postgres';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    let blog = null;
    if (isPostgresConfigured()) {
      blog = await pgGetBlogById(id);
    } else {
      blog = getBlogById(id);
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error('Error fetching blog in admin API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    let updatedBlog = null;
    if (isPostgresConfigured()) {
      updatedBlog = await pgUpdateBlog(id, body);
    } else {
      updatedBlog = updateBlog(id, body);
    }

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error: any) {
    console.error('Error updating blog in admin API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    let deleted = false;
    if (isPostgresConfigured()) {
      deleted = await pgDeleteBlog(id);
    } else {
      deleted = deleteBlog(id);
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found or deletion failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog in admin API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
