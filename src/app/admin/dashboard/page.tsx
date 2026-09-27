'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { servicesData } from '@/data/services';

interface SubmissionRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  locale: 'en' | 'ar';
  source: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.set('status', statusFilter);
      if (serviceFilter !== 'all') query.set('service', serviceFilter);
      if (search) query.set('search', search);

      const res = await fetch(`/api/admin/submissions?${query.toString()}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, serviceFilter, search]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleExportCSV = () => {
    window.open('/api/admin/submissions/export', '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'read':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'replied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Inquiries & Leads</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time pipeline of incoming contact form & quote requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search by name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary text-xs bg-neutral-50/50"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary text-xs bg-neutral-50/50 text-neutral-800"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary text-xs bg-neutral-50/50 text-neutral-800"
          >
            <option value="all">All Services</option>
            <option value="general">General Inquiry</option>
            {servicesData.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.titleEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            Loading submissions…
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No submissions found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-start">Date</th>
                  <th className="px-6 py-3.5 text-start">Contact</th>
                  <th className="px-6 py-3.5 text-start">Service</th>
                  <th className="px-6 py-3.5 text-start">Status</th>
                  <th className="px-6 py-3.5 text-start">Source</th>
                  <th className="px-6 py-3.5 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {submissions.map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary-dark text-sm">{item.name}</div>
                      <div className="text-neutral-500 text-[11px]">{item.email}</div>
                      <div className="text-neutral-500 text-[11px] font-mono">{item.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-800 capitalize">
                        {item.service.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 text-[11px]">
                      {item.source} ({item.locale.toUpperCase()})
                    </td>
                    <td className="px-6 py-4 text-end whitespace-nowrap">
                      <Link
                        href={`/admin/submissions/${item._id}`}
                        className="inline-block px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-primary hover:text-white text-neutral-700 font-semibold transition-colors"
                      >
                        View & Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
