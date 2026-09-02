import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEditorialBySlug } from '@/lib/data/api';
import { ArrowLeft, Calendar, FileText, Sparkles, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const editorial = await getEditorialBySlug(slug);
  if (!editorial) return { title: 'Editorial Not Found' };

  return {
    title: `${editorial.title} | RCNM Editorials`,
    description: editorial.summary
  };
}

export default async function EditorialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const editorial = await getEditorialBySlug(slug);
  if (!editorial) notFound();

  // Structured Data (Schema.org Article)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: editorial.title,
    author: {
      '@type': 'Person',
      name: editorial.author
    },
    datePublished: editorial.published_at,
    description: editorial.summary,
    image: [editorial.cover_image],
    publisher: {
      '@type': 'Organization',
      name: 'Rotaract Club of Navi Mumbai',
      url: 'https://rotaractclubofnavimumbai.org'
    }
  };

  return (
    <div className="space-y-12 py-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <Link
        href="/editorials"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#d4af37] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Editorials</span>
      </Link>

      {/* Title & Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold">
            {editorial.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            {formatDate(editorial.published_at)}
          </span>
        </div>

        <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-white tracking-tight leading-snug">
          {editorial.title}
        </h1>

        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <span>By <strong className="text-white">{editorial.author}</strong></span>
          <span>•</span>
          <span>Rotaract Club of Navi Mumbai</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={editorial.cover_image}
          alt={editorial.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* PDF Download Callout if available */}
      {editorial.pdf_url && (
        <div className="p-6 rounded-2xl bg-[#18181c] border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif-heading font-bold text-white text-lg">
              Official PDF Edition Available
            </h3>
            <p className="text-xs text-zinc-400">
              Download or view the high-resolution publication PDF file.
            </p>
          </div>

          <a
            href={editorial.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f3e5ab] transition-colors shrink-0 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open PDF Document</span>
          </a>
        </div>
      )}

      {/* Content Text */}
      <div className="bg-[#121215] border border-white/10 rounded-3xl p-8 sm:p-12 text-zinc-200 text-base leading-relaxed space-y-6 whitespace-pre-line font-sans">
        {editorial.content}
      </div>
    </div>
  );
}
