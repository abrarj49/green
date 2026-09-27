import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getSubmissions } from '@/lib/sqlite';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/models/Submission';

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const service = searchParams.get('service');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // 1. Primary: Use SQLite Database
    try {
      const result = getSubmissions({
        status,
        service,
        search,
        page,
        limit,
      });

      // If SQLite already has records, return them directly
      if (result.total > 0) {
        return NextResponse.json({
          success: true,
          submissions: result.submissions,
          pagination: {
            total: result.total,
            page: result.page,
            limit,
            totalPages: result.totalPages,
          },
        });
      }
    } catch (sqliteErr) {
      console.error('SQLite query error:', sqliteErr);
    }

    // 2. Optional: If MongoDB is connected and has records, query MongoDB
    try {
      const db = await connectToDatabase();
      if (db) {
        const query: any = {};
        if (status && status !== 'all') query.status = status;
        if (service && service !== 'all') query.service = service;
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
          ];
        }

        const total = await Submission.countDocuments(query);
        const submissions = await Submission.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        if (total > 0) {
          return NextResponse.json({
            success: true,
            submissions,
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit) || 1,
            },
          });
        }
      }
    } catch (mongoErr) {
      // Ignore if MongoDB not configured
    }

    // 3. Fallback: Return empty or initial state cleanly
    const fallbackResult = getSubmissions({ status, service, search, page, limit });
    return NextResponse.json({
      success: true,
      submissions: fallbackResult.submissions,
      pagination: {
        total: fallbackResult.total,
        page: 1,
        limit,
        totalPages: 1,
      },
    });
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
