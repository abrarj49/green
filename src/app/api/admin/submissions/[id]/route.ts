import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getSubmissionById, updateSubmission } from '@/lib/sqlite';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/models/Submission';

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

    // 1. Primary: Query SQLite
    try {
      const sqliteSub = getSubmissionById(id);
      if (sqliteSub) {
        return NextResponse.json({ success: true, submission: sqliteSub });
      }
    } catch (sqliteErr) {
      console.error('SQLite get error:', sqliteErr);
    }

    // 2. Optional: Check MongoDB if connected
    try {
      const db = await connectToDatabase();
      if (db) {
        const submission = await Submission.findById(id).lean();
        if (submission) {
          return NextResponse.json({ success: true, submission });
        }
      }
    } catch (mongoErr) {
      // Ignore if Mongo not connected
    }

    return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Get submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
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
    const { status, notes } = body;

    // 1. Primary: Update SQLite
    let updatedRecord = null;
    try {
      updatedRecord = updateSubmission(id, { status, notes });
      if (updatedRecord) {
        return NextResponse.json({ success: true, submission: updatedRecord });
      }
    } catch (sqliteErr) {
      console.error('SQLite update error:', sqliteErr);
    }

    // 2. Optional: Update MongoDB if connected
    try {
      const db = await connectToDatabase();
      if (db) {
        const updateFields: any = {};
        if (status) updateFields.status = status;
        if (typeof notes === 'string') updateFields.notes = notes;

        const updated = await Submission.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
        ).lean();

        if (updated) {
          return NextResponse.json({ success: true, submission: updated });
        }
      }
    } catch (mongoErr) {
      // Ignore
    }

    return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Update submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
