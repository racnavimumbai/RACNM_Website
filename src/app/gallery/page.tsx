'use client';

import { useState, useEffect } from 'react';
import { getGalleryPhotos, GalleryPhoto } from '@/lib/data/api';
import LightboxModal from '@/components/LightboxModal';
import { Sparkles, Image as ImageIcon, Filter, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};

const itemFade: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  
  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    async function fetchPhotos() {
      const data = await getGalleryPhotos();
      setPhotos(data);
    }
    fetchPhotos();
  }, []);

  const albums = ['All', ...Array.from(new Set(photos.map(p => p.album_name)))];
  const years = ['All', ...Array.from(new Set(photos.map(p => p.rotaract_year)))];

  const filteredPhotos = photos.filter(p => {
    const matchesAlbum = selectedAlbum === 'All' || p.album_name === selectedAlbum;
    const matchesYear = selectedYear === 'All' || p.rotaract_year === selectedYear;
    return matchesAlbum && matchesYear;
  });

  const handleOpenLightbox = (index: number) => {
    setCurrentIdx(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-12 py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 max-w-3xl mx-auto page-hero-glow"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181c] border border-[#d4af37]/40 text-xs font-semibold text-[#d4af37]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VISUAL ARCHIVE & MEMORIES</span>
        </div>
        <h1 className="font-serif-heading text-4xl sm:text-6xl font-bold text-white tracking-tight">
          Photo <span className="text-gold-gradient">Gallery</span>
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          A living photographic archive capturing the energy, fellowship, and ground-level impact of Rotaract Club of Navi Mumbai across the years.
        </p>
        {filteredPhotos.length > 0 && (
          <p className="text-xs text-zinc-500">{filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''} in this collection</p>
        )}
      </motion.div>

      {/* Filter Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl elevated-card"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <Filter className="w-4 h-4 text-[#d4af37]" />
          <span>Filter Albums:</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {albums.map(album => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedAlbum === album
                  ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20'
                  : 'bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {album}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Photos Grid with Masonry-like layout */}
      <AnimatePresence mode="wait">
        {filteredPhotos.length > 0 ? (
          <motion.div
            key={selectedAlbum + selectedYear}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[200px]"
          >
            {filteredPhotos.map((photo, index) => {
              // Varied sizes for visual interest
              const isTall = index % 7 === 0 || index % 7 === 3;
              const isWide = index % 7 === 1;

              return (
                <motion.div
                  key={photo.id}
                  variants={itemFade}
                  layout
                  onClick={() => handleOpenLightbox(index)}
                  className={`group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#d4af37]/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] ${
                    isTall ? 'row-span-2' : ''
                  } ${isWide ? 'col-span-2' : ''}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.image_url}
                    alt={photo.caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                    <div className="self-end">
                      <span className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md inline-block">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#d4af37] uppercase font-bold block tracking-wider">
                        {photo.album_name}
                      </span>
                      <p className="text-xs text-white line-clamp-2 font-medium">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 text-center elevated-card space-y-3"
          >
            <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-300 text-base font-medium">No photos found for this album.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={filteredPhotos}
        currentIndex={currentIdx}
        onNavigate={idx => setCurrentIdx(idx)}
      />
    </div>
  );
}
