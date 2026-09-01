'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEditorials, Editorial } from '@/lib/data/api';
import PdfViewerModal from '@/components/PdfViewerModal';
import { Sparkles, FileText, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { formatDate } from '@/lib/utils';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function EditorialsPage() {
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{ title: string; url: string | null }>({ title: '', url: null });

  useEffect(() => {
    async function loadData() {
      const data = await getEditorials();
      setEditorials(data.filter(e => e.status === 'published'));
    }
    loadData();
  }, []);

  const handleOpenPdf = (title: string, url: string | null) => {
    setSelectedPdf({ title, url });
    setPdfModalOpen(true);
  };

  const heroEditorial = editorials[0];
  const restEditorials = editorials.slice(1);

  return (
    <div className="space-y-16 py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 max-w-3xl mx-auto page-hero-glow"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181c] border border-[#d4af37]/40 text-xs font-semibold text-[#d4af37]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DIGITAL PUBLICATION & MAGAZINE ARCHIVE</span>
        </div>
        <h1 className="font-serif-heading text-4xl sm:text-6xl font-bold text-white tracking-tight">
          Editor&apos;s <span className="text-gold-gradient">Corner</span>
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          Explore our official monthly bulletins, thought pieces, annual publications, and member-written stories.
        </p>
      </motion.div>

      {/* Hero Editorial — Large Spread */}
      {heroEditorial && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="elevated-card overflow-hidden group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
            {/* Image Side */}
            <div className="relative h-72 lg:h-auto overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroEditorial.cover_image}
                alt={heroEditorial.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#121215] hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121215] to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-[#d4af37] border border-[#d4af37]/40">
                {heroEditorial.category}
              </div>
            </div>

            {/* Content Side */}
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider w-fit">
                <Sparkles className="w-3 h-3" />
                LATEST PUBLICATION
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    {formatDate(heroEditorial.published_at)}
                  </span>
                  <span>•</span>
                  <span>By <strong className="text-white">{heroEditorial.author}</strong></span>
                </div>

                <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                  {heroEditorial.title}
                </h2>

                <p className="text-zinc-300 text-sm leading-relaxed line-clamp-4">
                  {heroEditorial.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={`/editorials/${heroEditorial.slug}`}
                  className="btn-editorial-primary"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {heroEditorial.pdf_url && (
                  <button
                    onClick={() => handleOpenPdf(heroEditorial.title, heroEditorial.pdf_url)}
                    className="btn-editorial-secondary"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>View PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rest of Editorials Grid */}
      {restEditorials.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {restEditorials.map((item) => (
            <motion.div
              key={item.id}
              variants={itemFade}
              whileHover={{ y: -6 }}
              className="elevated-card overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-56 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-semibold text-[#d4af37] border border-[#d4af37]/40">
                  {item.category}
                </div>
              </div>

              <div className="p-8 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      {formatDate(item.published_at)}
                    </span>
                    <span>•</span>
                    <span>By <strong className="text-white">{item.author}</strong></span>
                  </div>

                  <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white group-hover:text-[#d4af37] transition-colors duration-300 leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/editorials/${item.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] hover:underline group/link"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>

                  {item.pdf_url && (
                    <button
                      onClick={() => handleOpenPdf(item.title, item.pdf_url)}
                      className="px-4 py-2 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-semibold text-xs transition-all duration-300 flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title={selectedPdf.title}
        pdfUrl={selectedPdf.url}
      />
    </div>
  );
}
