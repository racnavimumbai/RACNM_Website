'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/8 blur-[180px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md space-y-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181c] border border-[#d4af37]/40 text-xs font-semibold text-[#d4af37]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>404 • PAGE NOT FOUND</span>
        </div>

        {/* Large animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="text-gold-gradient font-serif-heading text-[8rem] sm:text-[10rem] font-bold leading-none select-none"
        >
          404
        </motion.div>

        <h1 className="font-serif-heading text-4xl font-bold text-white -mt-4">
          Chapter Lost
        </h1>

        <p className="text-zinc-400 text-sm leading-relaxed">
          The page or event story you are looking for has moved or does not exist in our archive.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Link
            href="/"
            className="btn-gold-action inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
