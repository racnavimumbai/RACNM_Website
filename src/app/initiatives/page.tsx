'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInitiatives, Initiative } from '@/lib/data/api';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function InitiativesPage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getInitiatives();
      setInitiatives(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-16 py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#08080b] text-[#f8fafc]">
      
      {/* Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-zinc-800 pb-8 space-y-4 page-hero-glow"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            DOSSIER NO. 03
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            THRUST AREAS
          </span>
        </div>

        <h1 className="font-serif-heading text-5xl sm:text-7xl font-normal text-white">
          Our Initiatives & Thrust Areas
        </h1>

        <p className="text-zinc-300 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Thrust Areas are the compass guiding us toward progress and innovation, propelling our club forward on the path of excellence across Navi Mumbai.
        </p>
      </motion.div>

      {/* Initiatives Directory List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-12"
      >
        {initiatives.map((item, idx) => (
          <motion.div
            key={item.id}
            variants={itemFade}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-zinc-800/80 group"
          >
            {/* Index */}
            <div className="lg:col-span-1">
              <span className="font-serif-heading text-4xl sm:text-5xl text-zinc-700 group-hover:text-[#d4af37] transition-colors duration-500">
                0{idx + 1}
              </span>
            </div>

            {/* Photo Crop */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-[#d4af37]/30 transition-all shadow-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.cover_image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#0a0a0c]/80 backdrop-blur-md rounded-full text-[10px] font-bold text-[#d4af37] uppercase tracking-widest border border-[#d4af37]/30">
                {item.category}
              </div>
            </motion.div>

            {/* Title & Description */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="font-serif-heading text-3xl sm:text-4xl text-white group-hover:text-[#d4af37] transition-colors duration-300">
                {item.title}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2">
                <Link
                  href={`/initiatives/${item.slug}`}
                  className="btn-editorial-secondary group/btn"
                >
                  <span>Explore Initiative Details</span>
                  <ArrowUpRight className="w-4 h-4 text-[#d4af37] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
