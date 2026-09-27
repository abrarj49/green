'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface CmsServiceRecord {
  slug: string;
  divisionCode: string;
  category: string;
  image: string;
  titleEn: string;
  titleAr: string;
  shortDescEn: string;
  featuresEn: string[];
  deliverablesEn: string[];
  updatedAt: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<CmsServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Fetch services error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" (/services/${slug})?`)) return;
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/services/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s.slug !== slug));
      } else {
        alert(data.error || 'Failed to delete service');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting service');
    } finally {
      setDeletingSlug(null);
    }
  };

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const filteredServices = services.filter((s) => {
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesSearch =
      !search ||
      s.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      s.titleAr.includes(search) ||
      s.divisionCode.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Services Content Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Add new contracting lines, edit division codes, scopes, deliverables, and SEO for all specialized services.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services/new"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all hover:shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Service
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by service title, division code (e.g. DIV 32-90)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:border-primary"
          >
            <option value="all">All Disciplines ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-medium text-neutral-500">
          Showing <span className="text-neutral-900 font-bold">{filteredServices.length}</span> services
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Loading service records from database...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-20 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700">No matching services found</p>
          <p className="text-xs text-neutral-400 mt-1">Try clearing your search query or filter.</p>
          <Link
            href="/admin/services/new"
            className="inline-block mt-4 text-xs font-bold text-primary hover:underline"
          >
            + Create New Service Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <div
              key={srv.slug}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-md transition duration-200"
            >
              {/* Cover Image & Division Badge */}
              <div className="relative h-44 bg-neutral-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srv.image}
                  alt={srv.titleEn}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero-1.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="inline-block bg-white/90 backdrop-blur-md text-primary-dark font-mono font-bold text-[11px] px-2.5 py-1 rounded-md shadow-sm">
                    {srv.divisionCode}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-accent-light block">
                    {srv.category}
                  </span>
                  <h3 className="text-sm font-bold leading-snug line-clamp-1">
                    {srv.titleEn}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 font-arabic text-right mb-2 line-clamp-1" dir="rtl">
                    {srv.titleAr}
                  </p>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {srv.shortDescEn}
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{srv.featuresEn.length} Scope Features</span>
                    <span>{srv.deliverablesEn.length} Deliverables</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/en/services/${srv.slug}`}
                    target="_blank"
                    className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition"
                    title="View on Live Site"
                  >
                    View ↗
                  </Link>
                  <Link
                    href={`/admin/services/${srv.slug}`}
                    className="flex-1 text-center py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition shadow-sm"
                  >
                    Edit Service
                  </Link>
                  <button
                    onClick={() => handleDelete(srv.slug, srv.titleEn)}
                    disabled={deletingSlug === srv.slug}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50"
                    title="Delete service"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
