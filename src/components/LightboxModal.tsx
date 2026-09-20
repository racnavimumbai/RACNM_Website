'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Image as ImageIcon } from 'lucide-react';
import { GalleryPhoto } from '@/lib/data/api';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: GalleryPhoto[];
  currentIndex?: number;
  onNavigate: (index: number) => void;
}

function subscribeMounted() {
  return () => {};
}

export default function LightboxModal({
  isOpen,
  onClose,
  photos = [],
  currentIndex = 0,
  onNavigate
}: LightboxModalProps) {
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const [erroredUrl, setErroredUrl] = useState<string | null>(null);

  // Safe clamping of index
  const safeIndex = photos.length > 0 
    ? Math.max(0, Math.min(currentIndex, photos.length - 1)) 
    : 0;

  const currentPhoto = photos[safeIndex];
  const imgError = Boolean(currentPhoto && erroredUrl === currentPhoto.image_url);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && safeIndex > 0) onNavigate(safeIndex - 1);
    if (e.key === 'ArrowRight' && safeIndex < photos.length - 1) onNavigate(safeIndex + 1);
  }, [isOpen, safeIndex, photos.length, onClose, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Lock body scroll cleanly and always restore on close/unmount
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen || !currentPhoto) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-2xl select-none"
          onClick={(e) => {
            // Close if user clicks the dark backdrop outside controls and image
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Top Controls Header */}
          <div className="p-4 sm:p-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/90 via-black/60 to-transparent shrink-0">
            <div className="text-white min-w-0 pr-4">
              <span className="font-serif-heading font-bold text-[#d4af37] text-lg sm:text-xl block truncate">
                {currentPhoto.album_name || 'RACNM Photo Archive'}
              </span>
              <span className="text-xs text-zinc-400 block mt-0.5">
                Photo {safeIndex + 1} of {photos.length}
                {currentPhoto.rotaract_year ? ` • Rotaract Year ${currentPhoto.rotaract_year}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {currentPhoto.image_url && (
                <a
                  href={currentPhoto.image_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 text-zinc-200 hover:text-[#d4af37] hover:bg-white/20 transition-all border border-white/10"
                  title="Open full image in new tab"
                >
                  <Download className="w-5 h-5" />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 text-zinc-200 hover:text-white hover:bg-red-500/30 transition-all border border-white/10 cursor-pointer"
                aria-label="Close Lightbox"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Photo Center Container */}
          <div
            className="flex-1 relative flex items-center justify-center px-4 sm:px-16 min-h-0 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            {/* Previous Arrow Button */}
            {safeIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(safeIndex - 1);
                }}
                className="absolute left-3 sm:left-6 z-30 p-3 rounded-full bg-black/70 border border-white/20 text-white hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all shadow-2xl cursor-pointer"
                aria-label="Previous photo"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Photo with Framer Motion Transition */}
            <div className="relative max-h-[70vh] max-w-[90vw] flex items-center justify-center">
              {imgError ? (
                <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/80 rounded-2xl border border-white/10 text-center space-y-3">
                  <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto" />
                  <p className="text-zinc-400 text-sm">Image could not be loaded</p>
                </div>
              ) : (
                <motion.div
                  key={`photo-${safeIndex}-${currentPhoto.image_url}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative overflow-hidden rounded-2xl border border-[#d4af37]/30 shadow-[0_10px_50px_rgba(0,0,0,0.8)] max-h-[70vh]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentPhoto.image_url}
                    alt={currentPhoto.caption || 'Rotaract Club of Navi Mumbai Event Photograph'}
                    onError={() => setErroredUrl(currentPhoto.image_url)}
                    className="max-h-[70vh] w-auto max-w-full object-contain select-none rounded-2xl"
                  />
                </motion.div>
              )}
            </div>

            {/* Next Arrow Button */}
            {safeIndex < photos.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(safeIndex + 1);
                }}
                className="absolute right-3 sm:right-6 z-30 p-3 rounded-full bg-black/70 border border-white/20 text-white hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all shadow-2xl cursor-pointer"
                aria-label="Next photo"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Controls: Caption + Thumbnail Strip */}
          <div className="p-4 sm:p-6 z-30 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-3 shrink-0">
            {/* Caption */}
            {currentPhoto.caption && (
              <p className="text-zinc-200 text-xs sm:text-sm font-medium max-w-2xl mx-auto text-center leading-relaxed">
                {currentPhoto.caption}
              </p>
            )}

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-3xl mx-auto scrollbar-thin">
                {photos.map((photo, idx) => {
                  const isCurrent = idx === safeIndex;
                  return (
                    <button
                      key={`thumb-${photo.id || 'photo'}-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(idx);
                      }}
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.6)] scale-110'
                          : 'border-white/15 opacity-50 hover:opacity-90 hover:border-white/40'
                      }`}
                      aria-label={`Go to photo ${idx + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.image_url}
                        alt={photo.caption || `Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
