'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryPhoto } from '@/lib/data/mockData';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: GalleryPhoto[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({
  isOpen,
  onClose,
  photos,
  currentIndex,
  onNavigate
}: LightboxModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl"
        >
          {/* Top Controls */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent"
          >
            <div className="text-white min-w-0">
              <span className="font-serif-heading font-bold text-[#d4af37] text-lg block truncate">
                {currentPhoto.album_name}
              </span>
              <span className="text-xs text-zinc-400 block">
                Photo {currentIndex + 1} of {photos.length} • Rotaract Year {currentPhoto.rotaract_year}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href={currentPhoto.image_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 text-zinc-200 hover:text-[#d4af37] hover:bg-white/20 transition-all duration-200 border border-white/10"
                title="Download image"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 text-zinc-200 hover:text-white hover:bg-red-500/30 transition-all duration-200 border border-white/10"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {/* Main Image Display */}
          <div className="flex-1 relative flex items-center justify-center px-4 min-h-0">
            {/* Previous Button */}
            {currentIndex > 0 && (
              <button
                onClick={() => onNavigate(currentIndex - 1)}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all shadow-xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image with crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl max-h-[70vh]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPhoto.image_url}
                  alt={currentPhoto.caption}
                  className="max-h-[70vh] w-auto max-w-full object-contain select-none"
                />
              </motion.div>
            </AnimatePresence>

            {/* Next Button */}
            {currentIndex < photos.length - 1 && (
              <button
                onClick={() => onNavigate(currentIndex + 1)}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all shadow-xl"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom: Caption + Thumbnail Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="p-4 sm:p-6 z-20 bg-gradient-to-t from-black/90 to-transparent space-y-4"
          >
            {/* Caption */}
            <p className="text-zinc-200 text-sm sm:text-base font-medium max-w-2xl mx-auto text-center">
              {currentPhoto.caption}
            </p>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-3xl mx-auto">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => onNavigate(idx)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                      idx === currentIndex
                        ? 'border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-110'
                        : 'border-white/10 opacity-50 hover:opacity-80 hover:border-white/30'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.image_url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
