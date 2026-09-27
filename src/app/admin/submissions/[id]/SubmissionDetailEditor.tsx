'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface SubmissionData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  locale: 'en' | 'ar';
  source: string;
  message: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function SubmissionDetailEditor({ id }: { id: string }) {
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'new' | 'read' | 'replied' | 'archived'>('new');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSubmission = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success && data.submission) {
        setSubmission(data.submission);
        setStatus(data.submission.status);
        setNotes(data.submission.notes || '');
      }
    } catch (err) {
      console.error('Fetch submission error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', text: 'Changes saved successfully.' });
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to save updates.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error saving changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-500 text-sm">
        Loading submission details…
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center space-y-4">
        <p className="text-neutral-600">Submission not found.</p>
        <Link href="/admin/dashboard" className="text-primary font-bold text-xs hover:underline">
          ← Back to Submissions Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-primary transition-colors"
      >
        <span>← Back to Submissions Dashboard</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <span className="text-xs font-mono text-neutral-400 block mb-1">
              ID: {submission._id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark">
              {submission.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Submitted on {new Date(submission.createdAt).toLocaleString()} via{' '}
              <span className="font-semibold">{submission.source}</span> (
              {submission.locale.toUpperCase()})
            </p>
          </div>

          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-center ${
              status === 'new'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'read'
                ? 'bg-amber-100 text-amber-800'
                : status === 'replied'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-400 block mb-1 font-semibold uppercase tracking-wider">
              Email Address
            </span>
            <a
              href={`mailto:${submission.email}`}
              className="text-primary font-bold text-sm hover:underline"
            >
              {submission.email}
            </a>
          </div>
          <div>
            <span className="text-neutral-400 block mb-1 font-semibold uppercase tracking-wider">
              Phone / WhatsApp
            </span>
            <a
              href={`tel:${submission.phone}`}
              className="text-primary font-bold text-sm hover:underline font-mono"
            >
              {submission.phone}
            </a>
          </div>
          <div>
            <span className="text-neutral-400 block mb-1 font-semibold uppercase tracking-wider">
              Requested Service
            </span>
            <span className="font-bold text-neutral-800 text-sm capitalize">
              {submission.service.replace(/-/g, ' ')}
            </span>
          </div>
        </div>

        {/* Client message text */}
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Inquiry Message
          </h3>
          <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap font-sans">
            {submission.message}
          </div>
        </div>

        {/* Status & Internal Notes Form */}
        <form onSubmit={handleSave} className="pt-6 border-t border-neutral-100 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
              >
                <option value="new">New (Unreviewed)</option>
                <option value="read">Read (In Review)</option>
                <option value="replied">Replied (Contacted Client)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Internal Team Notes & Next Steps
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record follow-up logs, quotation numbers, meeting dates, or inspection notes…"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm bg-neutral-50/50"
            />
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-xl text-xs font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all disabled:opacity-50 shadow-xs"
            >
              {saving ? 'Saving Updates…' : 'Save Status & Notes'}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-6 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
