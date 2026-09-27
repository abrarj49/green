'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';
import Link from 'next/link';

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlog() {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        const data = await res.json();
        if (data.success && data.blog) {
          setBlog(data.blog);
        } else {
          setError(data.error || 'Article not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Loading article details...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center max-w-md mx-auto my-12">
        <p className="text-sm font-bold text-red-600 mb-2">Error</p>
        <p className="text-sm text-neutral-600 mb-4">{error || 'Article not found'}</p>
        <Link
          href="/admin/blogs"
          className="text-xs font-semibold text-primary hover:underline"
        >
          ← Return to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="py-2">
      <BlogEditor initialData={blog} />
    </div>
  );
}
