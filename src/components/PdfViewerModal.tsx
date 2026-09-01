'use client';

import { useEffect } from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string | null;
}

export default function PdfViewerModal({ isOpen, onClose, title, pdfUrl }: PdfViewerModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#121215] border border-[#d4af37]/30 rounded-t-2xl sm:rounded-2xl w-full max-w-5xl h-[90vh] sm:h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header with gold accent bar */}
            <div className="relative">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <div className="px-6 py-4 bg-[#18181c] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif-heading font-bold text-white text-base sm:text-lg line-clamp-1">
                      {title}
                    </h3>
                    <span className="text-[11px] text-zinc-400">RCNM Editorial Archive</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {pdfUrl && (
                    <>
                      <a
                        href={pdfUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37] text-black font-semibold text-xs hover:bg-[#f3e5ab] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download PDF</span>
                      </a>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-red-500/20 transition-colors"
                    aria-label="Close PDF Viewer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Viewer */}
            <div className="flex-1 bg-[#09090b] relative">
              {pdfUrl ? (
                <iframe
                  src={`${pdfUrl}#toolbar=0`}
                  className="w-full h-full border-0"
                  title={title}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <FileText className="w-12 h-12 text-zinc-600 mb-3" />
                  <p className="text-zinc-300 font-medium">PDF File standard preview unavailable.</p>
                  <p className="text-zinc-500 text-xs mt-1">You can read the article text directly on the editorial page.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
