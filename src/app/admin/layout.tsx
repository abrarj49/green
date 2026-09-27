import Link from 'next/link';

export const metadata = {
  title: 'Green Solution KSA — Admin Portal',
  description: 'Internal administration dashboard for Green Solution KSA inquiries and submissions.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-primary-dark text-white px-6 py-4 border-b border-primary/20 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg text-white">
            <span className="w-8 h-8 rounded-lg bg-accent text-primary-dark flex items-center justify-center font-extrabold text-sm">
              GS
            </span>
            <span>Admin Portal</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold text-neutral-300">
            <Link
              href="/admin/dashboard"
              className="hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Submissions
            </Link>
            <Link
              href="/admin/services"
              className="hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Services CMS
            </Link>
            <Link
              href="/admin/blogs"
              className="hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Blog CMS
            </Link>
            <Link
              href="/admin/seo"
              className="hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Site SEO
            </Link>
            <Link
              href="/en"
              target="_blank"
              className="hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Live Site ↗
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="text-xs text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
          >
            Logout / Switch
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="px-6 py-4 text-center text-xs text-neutral-500 border-t border-neutral-200 bg-white">
        Green Solution Co. — Admin Management System © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
