'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents, EventItem } from '@/lib/data/api';
import { Calendar, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { formatDate } from '@/lib/utils';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const data = await getEvents();
      setEvents(data.filter(e => e.status === 'published'));
    }
    load();
  }, []);

  const years = ['all', ...Array.from(new Set(events.map(e => e.rotaract_year)))];
  const filteredEvents = filter === 'all' ? events : events.filter(e => e.rotaract_year === filter);

  return (
    <div className="space-y-16 py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent text-[var(--text-primary)]">
      
      {/* Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-[var(--border-primary)] pb-8 space-y-4 page-hero-glow"
      >

        <h1 className="font-serif-heading text-5xl sm:text-7xl font-normal text-[var(--text-primary)]">
          Events & Living Stories
        </h1>

        <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Every event is a chapter in our story. Explore with us the impact that we created and the memories that we made.
        </p>
      </motion.div>

      {/* Filter Bar */}
      {years.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-secondary)]"
        >
          <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Filter by Year:
          </span>
          {years.map(year => (
            <button
              key={year}
              onClick={() => setFilter(year)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                filter === year
                  ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20'
                  : 'bg-[var(--bg-card)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--gold-subtle)] hover:text-[var(--gold-primary)]'
              }`}
            >
              {year === 'all' ? 'All Years' : year}
            </button>
          ))}
        </motion.div>
      )}

      {/* Events Archive Grid */}
      <motion.div
        key={filter}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            variants={itemFade}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="elevated-card flex flex-col justify-between group relative"
          >
            {/* Featured Ribbon */}
            {event.is_featured && (
              <div className="featured-ribbon">★ FEATURED</div>
            )}

            <div className="relative h-60 overflow-hidden rounded-t-[20px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.cover_image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-md border border-zinc-700/50 backdrop-blur-md">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  {formatDate(event.event_date)}
                </span>
                <span className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-md border border-zinc-700/50 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  {event.location.split(',')[0]}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="font-serif-heading text-2xl font-normal text-[var(--text-primary)] group-hover:text-[#d4af37] transition-colors duration-300 leading-snug">
                  {event.title}
                </h2>
                <p className="text-[var(--text-muted)] text-xs line-clamp-3 leading-relaxed">
                  {event.summary}
                </p>
              </div>

              {/* Impact Metrics */}
              {event.impact_metrics && event.impact_metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-secondary)]">
                  {event.impact_metrics.slice(0, 2).map((m: { label: string; value: string }, idx: number) => (
                    <div key={idx} className="bg-[var(--bg-card)] p-2.5 rounded-xl text-center border border-[var(--border-primary)]">
                      <span className="font-serif-heading font-normal text-[#d4af37] text-base block">{m.value}</span>
                      <span className="text-[10px] text-[var(--text-muted)] uppercase block">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3">
                <Link
                  href={`/events/${event.slug}`}
                  className="w-full text-center py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[#d4af37] hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 block text-[var(--text-primary)] border border-[var(--border-secondary)] hover:border-[#d4af37] flex items-center justify-center gap-2"
                >
                  <span>Read Event Story</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
