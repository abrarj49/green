import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getAllSubmissionsForExport } from '@/lib/sqlite';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/models/Submission';

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let records: any[] = [];

    // 1. Primary: Get from SQLite
    try {
      records = getAllSubmissionsForExport();
    } catch (sqliteErr) {
      console.error('SQLite export error:', sqliteErr);
    }

    // 2. Fallback: If SQLite was empty, check MongoDB if connected
    if (records.length === 0) {
      try {
        const db = await connectToDatabase();
        if (db) {
          records = await Submission.find({}).sort({ createdAt: -1 }).lean();
        }
      } catch (mongoErr) {
        // Ignore
      }
    }

    // Generate CSV Header
    const csvHeader = [
      'Date',
      'Name',
      'Email',
      'Phone',
      'Service',
      'Status',
      'Locale',
      'Source',
      'Notes',
      'Message',
    ].join(',');

    // Generate CSV Rows (escaping quotes/newlines properly)
    const csvRows = records.map((r) => {
      const escape = (str: any) => {
        if (!str) return '""';
        return `"${String(str).replace(/"/g, '""').replace(/\r?\n|\r/g, ' ')}"`;
      };

      return [
        escape(r.createdAt ? new Date(r.createdAt).toISOString() : ''),
        escape(r.name),
        escape(r.email),
        escape(r.phone),
        escape(r.service),
        escape(r.status),
        escape(r.locale),
        escape(r.source),
        escape(r.notes),
        escape(r.message),
      ].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const filename = `submissions-export-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export CSV error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
