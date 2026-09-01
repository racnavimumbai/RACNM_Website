'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getInitiativeBySlug, getEvents, Initiative, EventItem } from '@/lib/data/api';
import { ArrowLeft, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import SectionDivider from '@/components/SectionDivider';
import { formatDate } from '@/lib/utils';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function InitiativeDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [connectedEvents, setConnectedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const [init, allEvents] = await Promise.all([
        getInitiativeBySlug(slug),
        getEvents()
      ]);
      setInitiative(init);
      if (init) {
        setConnectedEvents(
          allEvents.filter(e => e.initiative_id === init.id || e.summary.toLowerCase().includes(init.title.toLowerCase().slice(0, 5)))
        );
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div className="space-y-4">
          <h1 className="font-serif-heading text-4xl text-white">Initiative Not Found</h1>
          <Link href="/initiatives" className="btn-editorial-primary">Back to Initiatives</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-12 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/initiatives"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#d4af37] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Initiatives</span>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{initiative.category}</span>
        </div>
        <h1 className="font-serif-heading text-4xl sm:text-6xl font-bold text-white tracking-tight">
          {initiative.title}
        </h1>
        <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
          {initiative.summary}
        </p>
      </motion.div>

      {/* Banner Cover Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={initiative.cover_image}
          alt={initiative.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </motion.div>

      {/* Detailed Description */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="elevated-card p-8 sm:p-10 space-y-6"
      >
        <h2 className="font-serif-heading text-2xl font-bold text-[#d4af37]">
          About This Initiative
        </h2>
        <div className="text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
          {initiative.description}
        </div>
      </motion.div>

      <SectionDivider />

      {/* Connected Events Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="space-y-8 pt-6"
      >
        <div className="space-y-2">
          <h2 className="font-serif-heading text-3xl font-bold text-white">
            Connected Events & Projects
          </h2>
          <p className="text-zinc-400 text-sm">
            Events conducted under {initiative.title} across Navi Mumbai.
          </p>
        </div>

        {connectedEvents.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {connectedEvents.map(event => (
              <motion.div
                key={event.id}
                variants={itemFade}
                whileHover={{ y: -4 }}
                className="rounded-2xl elevated-card p-6 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#d4af37]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-zinc-400 text-xs line-clamp-2">
                    {event.summary}
                  </p>
                </div>

                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] hover:underline group/link"
                >
                  <span>Read Event Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="p-8 text-center elevated-card text-zinc-400 text-sm">
            Multiple events under this initiative are being scheduled for the 45th Year. Stay tuned!
          </div>
        )}
      </motion.div>
    </div>
  );
}
