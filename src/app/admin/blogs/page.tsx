'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface BlogRecord {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  category: string;
  image: string;
  authorEn: string;
  readTime: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (categoryFilter !== 'all') query.set('category', categoryFilter);
      if (statusFilter !== 'all') query.set('isPublished', statusFilter === 'published' ? 'true' : 'false');
      if (search) query.set('search', search);

      const res = await fetch(`/api/admin/blogs?${query.toString()}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error('Fetch blogs error:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting blog');
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (blog: BlogRecord) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, isPublished: !blog.isPublished } : b))
        );
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const categories = Array.from(new Set(blogs.map((b) => b.category)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Blog Content Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Write, edit, and publish technical insights and articles for Green Solution KSA in English and Arabic.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all hover:shadow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Write New Article
        </Link>
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
              placeholder="Search by title, excerpt, or category..."
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
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <div className="text-xs font-medium text-neutral-500">
          Showing <span className="text-neutral-900 font-bold">{blogs.length}</span> articles
        </div>
      </div>

      {/* Blogs Table / List */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm">Loading articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <p className="text-base font-semibold text-neutral-800">No articles found</p>
            <p className="text-sm text-neutral-500 mt-1">Get started by creating your first technical blog post.</p>
            <Link
              href="/admin/blogs/new"
              className="inline-block mt-4 text-xs font-semibold text-primary hover:underline"
            >
              + Create Article Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50/75 text-xs uppercase font-semibold text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Read Time</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={blog.image}
                            alt={blog.titleEn}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/hero-1.webp';
                            }}
                          />
                        </div>
                        <div className="min-w-0 max-w-md">
                          <Link
                            href={`/admin/blogs/${blog.id}`}
                            className="font-semibold text-neutral-900 hover:text-primary transition line-clamp-1"
                          >
                            {blog.titleEn}
                          </Link>
                          <div className="text-xs text-neutral-500 font-arabic line-clamp-1 mt-0.5" dir="rtl">
                            {blog.titleAr}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono mt-1 truncate">
                            /{blog.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(blog)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                          blog.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle publish status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            blog.isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {blog.readTime || '5 min read'}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/en/blog/${blog.slug}`}
                          target="_blank"
                          className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-primary hover:bg-neutral-100 rounded-lg transition"
                          title="View on Live Site"
                        >
                          View ↗
                        </Link>
                        <Link
                          href={`/admin/blogs/${blog.id}`}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition shadow-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id, blog.titleEn)}
                          disabled={deletingId === blog.id}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete article"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
