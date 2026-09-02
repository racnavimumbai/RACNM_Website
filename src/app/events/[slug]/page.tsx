'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getEventBySlug, EventItem } from '@/lib/data/api';
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectionDivider from '@/components/SectionDivider';
import LightboxModal from '@/components/LightboxModal';
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

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const data = await getEventBySlug(slug);
      setEvent(data);
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

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div className="space-y-4">
          <h1 className="font-serif-heading text-4xl text-white">Event Not Found</h1>
          <Link href="/events" className="btn-editorial-primary">Back to Events</Link>
        </div>
      </div>
    );
  }

  // Convert gallery images to lightbox format
  const galleryPhotos = (event.gallery_images || []).map((url: string, idx: number) => ({
    id: `gallery-${idx}`,
    event_id: event.id,
    image_url: url,
    caption: `${event.title} — Photo ${idx + 1}`,
    album_name: event.title,
    rotaract_year: event.rotaract_year,
    sort_order: idx,
    created_at: new Date().toISOString(),
  }));

  const handleOpenGallery = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-12 py-12 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Back Link */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#d4af37] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Events</span>
        </Link>
      </motion.div>

      {/* Header Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold">
            Rotaract Year {event.rotaract_year}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            {formatDate(event.event_date)}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            {event.location}
          </span>
        </div>

        <h1 className="font-serif-heading text-4xl sm:text-6xl font-bold text-white tracking-tight">
          {event.title}
        </h1>

        <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
          {event.summary}
        </p>
      </motion.div>

      {/* Cover Image with parallax-like effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.cover_image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>

      {/* Impact Metrics Grid */}
      {event.impact_metrics && event.impact_metrics.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {event.impact_metrics.map((m: { label: string; value: string }, idx: number) => {
            const numericValue = parseInt(m.value.replace(/[^0-9]/g, ''));
            const suffix = m.value.replace(/[0-9,]/g, '');
            return (
              <motion.div
                key={idx}
                variants={itemFade}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl elevated-card text-center space-y-1 shadow-lg"
              >
                {!isNaN(numericValue) && numericValue > 0 ? (
                  <AnimatedCounter
                    target={numericValue}
                    suffix={suffix}
                    className="font-serif-heading font-bold text-3xl stat-number block"
                  />
                ) : (
                  <span className="font-serif-heading font-bold text-3xl text-[#d4af37] block">
                    {m.value}
                  </span>
                )}
                <span className="text-xs text-zinc-300 uppercase tracking-wider font-semibold block">
                  {m.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <SectionDivider />

      {/* Event Story Description */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="elevated-card p-8 sm:p-10 space-y-6"
      >
        <h2 className="font-serif-heading text-2xl font-bold text-[#d4af37]">
          The Full Story
        </h2>
        <div className="text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
          {event.description}
        </div>
      </motion.div>

      {/* Event Photo Gallery */}
      {event.gallery_images && event.gallery_images.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-serif-heading text-2xl font-bold text-white">
              Event Photographs
            </h2>
            <span className="text-xs text-zinc-400 ml-2">({event.gallery_images.length} photos)</span>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {event.gallery_images.map((img: string, idx: number) => (
              <motion.div
                key={idx}
                variants={itemFade}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleOpenGallery(idx)}
                className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-md group cursor-pointer hover:border-[#d4af37]/40 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${event.title} photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#d4af37]" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Lightbox for gallery images */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={galleryPhotos}
        currentIndex={lightboxIdx}
        onNavigate={idx => setLightboxIdx(idx)}
      />
    </div>
  );
}
