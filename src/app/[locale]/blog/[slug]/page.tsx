import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { getBlogBySlug, getBlogs } from '@/lib/sqlite';

export async function generateStaticParams() {
  const { blogs } = getBlogs({ limit: 100 });
  return blogs.map((b: any) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isAr = locale === 'ar';
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: isAr ? 'المقال غير موجود | جرين سلوشن' : 'Article Not Found | Green Solution KSA',
    };
  }

  const title = isAr ? (blog.metaTitleAr || blog.titleAr) : (blog.metaTitleEn || blog.titleEn);
  const desc = isAr ? (blog.metaDescAr || blog.excerptAr) : (blog.metaDescEn || blog.excerptEn);

  return {
    title: `${title} | Green Solution KSA`,
    description: desc,
    keywords: blog.keywords,
    alternates: {
      canonical: `https://greensolutionksa.com/${locale}/blog/${blog.slug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://greensolutionksa.com/${locale}/blog/${blog.slug}`,
      siteName: 'Green Solution KSA',
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      images: [
        {
          url: blog.image || '/images/hero-1.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [blog.image || '/images/hero-1.webp'],
    },
  };
}

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  const blog = getBlogBySlug(slug);
  if (!blog) {
    notFound();
  }

  const title = isAr ? blog.titleAr : blog.titleEn;
  const excerpt = isAr ? blog.excerptAr : blog.excerptEn;
  const content = isAr ? blog.contentAr : blog.contentEn;
  const author = isAr ? blog.authorAr : blog.authorEn;

  // Get other articles for "Related Technical Briefings" and sidebar
  const { blogs: allBlogs } = getBlogs({ isPublished: true, limit: 10 });
  const recentBlogs = allBlogs.filter((b: any) => b.id !== blog.id).slice(0, 3);
  const allCategories = Array.from(new Set(allBlogs.map((b: any) => b.category)));

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: excerpt,
    image: blog.image,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://greensolutionksa.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Green Solution Co.',
      logo: {
        '@type': 'ImageObject',
        url: 'https://greensolutionksa.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://greensolutionksa.com/${locale}/blog/${blog.slug}`,
    },
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. ULTRA SLEEK HERO HEADER */}
      <PageHero
        badge={{
          en: `${blog.category} • ${blog.readTime}`,
          ar: `${blog.category} • ${blog.readTime}`,
        }}
        title={{
          en: title,
          ar: title,
        }}
        subtitle={{
          en: excerpt,
          ar: excerpt,
        }}
        breadcrumbs={[
          {
            labelEn: 'Blog',
            labelAr: 'المدونة',
            href: `/${locale}/blog`,
          },
          {
            labelEn: title,
            labelAr: title,
          },
        ]}
        stats={[
          {
            value: blog.readTime,
            labelEn: 'Read Time',
            labelAr: 'وقت القراءة',
          },
          {
            value: 'SBC',
            labelEn: 'Verified Spec',
            labelAr: 'معايير معتمدة',
          },
          {
            value: 'KSA',
            labelEn: 'Field Insights',
            labelAr: 'رؤى ميدانية',
          },
        ]}
        backgroundImage={blog.image}
      />

      {/* 2. MAIN 2-COLUMN ARTICLE + SIDEBAR SECTION (SUNGO news-details.html) */}
      <section className="py-20 sm:py-24 bg-[#F3F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Main Post (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Featured Image */}
              <div className="relative h-72 sm:h-96 lg:h-[460px] overflow-hidden bg-[#1E202B] border border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.image || '/images/hero-1.webp'}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Content Box */}
              <div className="bg-white p-6 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
                
                {/* Meta header */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#585858] pb-4 border-b border-neutral-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="text-[#1D8F2C]">👤</span>
                    <span>{author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="text-[#1D8F2C]">📅</span>
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="text-[#1D8F2C]">🏷️</span>
                    <span>{blog.category}</span>
                  </span>
                </div>

                {/* Excerpt Highlight Box (Sungo Hilight-Text) */}
                <div className="p-6 bg-[#F3F7FB] border-s-4 border-[#1D8F2C]">
                  <span className="block text-xs font-bold text-[#1D8F2C] uppercase tracking-wider mb-2 font-[var(--font-display)]">
                    {isAr ? 'الملخص التنفيذي للدراسة' : 'Executive Briefing'}
                  </span>
                  <p className="text-base text-[#232434] leading-relaxed italic font-serif">
                    {excerpt}
                  </p>
                </div>

                {/* Article Body */}
                <article className="text-[#585858] text-sm sm:text-base leading-relaxed space-y-6">
                  {content.split('\n\n').map((block, idx) => {
                    const trimmed = block.trim();
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h2
                          key={idx}
                          className="text-xl sm:text-2xl font-bold text-[#232434] pt-6 pb-2 border-b border-neutral-200 tracking-tight font-[var(--font-display)]"
                        >
                          {trimmed.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-lg sm:text-xl font-bold text-[#232434] pt-4 pb-1 font-[var(--font-display)]">
                          {trimmed.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      const items = trimmed.split('\n').map((line) => line.replace(/^[-*]\s+/, ''));
                      return (
                        <ul key={idx} className="space-y-2 text-[#585858] ps-4">
                          {items.map((it, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#1D8F2C] font-bold">✓</span>
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} className="leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
                </article>

                {/* Tags & Share */}
                <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-bold text-[#232434] font-[var(--font-display)]">
                        {isAr ? 'الوسوم:' : 'Tags:'}
                      </span>
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[#F3F7FB] text-[#232434] text-xs font-medium border border-neutral-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#232434] font-[var(--font-display)]">
                      {isAr ? 'مشاركة:' : 'Share:'}
                    </span>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `${title} - https://greensolutionksa.com/${locale}/blog/${blog.slug}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-[#25D366] text-white font-bold"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        `https://greensolutionksa.com/${locale}/blog/${blog.slug}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-[#0077B5] text-white font-bold"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Sungo Sidebar Widgets (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Widget 1: Categories */}
              <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm">
                <h3 className="text-xl font-bold text-[#232434] pb-4 mb-6 border-b border-neutral-200 font-[var(--font-display)] relative after:content-[''] after:absolute after:bottom-[-1px] after:start-0 after:w-12 after:h-0.5 after:bg-[#1D8F2C]">
                  {isAr ? 'التصنيفات' : 'Categories'}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm font-semibold text-[#232434]">
                  {allCategories.map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/${locale}/blog`}
                        className="flex items-center justify-between p-3 bg-[#F3F7FB] hover:bg-[#1D8F2C] hover:text-white transition-all border border-neutral-200/80"
                      >
                        <span>{cat}</span>
                        <span className="font-mono text-[11px] text-neutral-400">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Widget 2: Recent Posts */}
              <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm">
                <h3 className="text-xl font-bold text-[#232434] pb-4 mb-6 border-b border-neutral-200 font-[var(--font-display)] relative after:content-[''] after:absolute after:bottom-[-1px] after:start-0 after:w-12 after:h-0.5 after:bg-[#1D8F2C]">
                  {isAr ? 'أحدث المقالات' : 'Recent Articles'}
                </h3>
                <div className="space-y-4">
                  {recentBlogs.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/${locale}/blog/${item.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-16 h-16 shrink-0 bg-[#1E202B] overflow-hidden border border-neutral-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image || '/images/hero-1.webp'}
                          alt={isAr ? item.titleAr : item.titleEn}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {new Date(item.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <h4 className="text-xs font-bold text-[#232434] group-hover:text-[#1D8F2C] transition-colors line-clamp-2 leading-snug font-[var(--font-display)]">
                          {isAr ? item.titleAr : item.titleEn}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Widget 3: Need Help? Call Here Box */}
              <div
                className="relative p-8 text-white overflow-hidden bg-cover bg-center border border-neutral-800"
                style={{ backgroundImage: "url('/img/sungo/service/details-1.jpg')" }}
              >
                <div className="absolute inset-0 bg-[#1E202B]/90" />
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#1D8F2C] flex items-center justify-center text-white text-2xl shadow-lg">
                    📞
                  </div>
                  <h4 className="text-xl font-bold font-[var(--font-display)] text-white">
                    {isAr ? 'هل تحتاج إلى استشارة هندسية؟' : 'Need Help? Call Here'}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {isAr
                      ? 'تواصل مباشرة مع المهندس المشرف لمناقشة مخططاتكم ومعاينة الموقع.'
                      : 'Speak directly with our senior agronomy & irrigation engineering team.'}
                  </p>
                  <a
                    href="tel:+966595998808"
                    className="block text-xl sm:text-2xl font-black text-[#1D8F2C] hover:text-white transition-colors font-mono"
                  >
                    +966 59 599 8808
                  </a>
                  <div className="pt-2">
                    <Link
                      href={`/${locale}/contact`}
                      className="theme-btn w-full block text-center"
                    >
                      <span>{isAr ? 'طلب استشارة فورية' : 'Consult Our Team'}</span>
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </PageShell>
  );
}
