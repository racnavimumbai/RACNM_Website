'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  MapPin,
  FileText,
  Users,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  getInitiatives,
  getEvents,
  getGalleryPhotos,
  getEditorials,
  Initiative,
  EventItem,
  GalleryPhoto,
  Editorial
} from '@/lib/data/api';
import LightboxModal from '@/components/LightboxModal';
import PdfViewerModal from '@/components/PdfViewerModal';
import FilmReelBackground from '@/components/FilmReelBackground';
import ParticleField from '@/components/ParticleField';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectionDivider from '@/components/SectionDivider';
import { formatDate } from '@/lib/utils';

// Variants for staggered entrance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function HomePage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [activeInitiativeIdx, setActiveInitiativeIdx] = useState<number>(0);
  
  // Modal states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{ title: string; url: string | null }>({ title: '', url: null });

  useEffect(() => {
    async function loadData() {
      const [inits, evts, phts, edts] = await Promise.all([
        getInitiatives(),
        getEvents(),
        getGalleryPhotos(),
        getEditorials()
      ]);
      setInitiatives(inits);
      setEvents(evts.filter(e => e.status === 'published'));
      setPhotos(phts);
      setEditorials(edts.filter(e => e.status === 'published'));
    }
    loadData();
  }, []);

  const featuredEvents = events.filter(e => e.is_featured).slice(0, 3);
  const latestEditorial = editorials[0];
  const activeInitiative = initiatives[activeInitiativeIdx] || initiatives[0];

  const DEFAULT_FALLBACK_PHOTOS: GalleryPhoto[] = [
    { id: 'rel-1', event_id: 'e1', album_name: 'RACNM Archive', image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', caption: 'RACNM Youth Leadership Conclave', rotaract_year: '2024-25', sort_order: 1, created_at: '' },
    { id: 'rel-2', event_id: 'e2', album_name: 'RACNM Archive', image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop', caption: 'Community Fellowship Drive', rotaract_year: '2024-25', sort_order: 2, created_at: '' },
    { id: 'rel-3', event_id: 'e3', album_name: 'RACNM Archive', image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop', caption: 'Youth Empowerment Summit', rotaract_year: '2024-25', sort_order: 3, created_at: '' },
    { id: 'rel-4', event_id: 'e4', album_name: 'RACNM Archive', image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop', caption: 'Environmental Action Drive', rotaract_year: '2024-25', sort_order: 4, created_at: '' },
  ];

  const activeReelPhotos = photos.length > 0 ? photos : DEFAULT_FALLBACK_PHOTOS;

  const handleOpenPhoto = (_photo: GalleryPhoto, idx: number) => {
    setCurrentPhotoIdx(idx);
    setLightboxOpen(true);
  };

  const handleOpenPdf = (title: string, url: string | null) => {
    setSelectedPdf({ title, url });
    setPdfModalOpen(true);
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-12 bg-transparent text-[#f8fafc]">
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-8 sm:py-12 flex flex-col justify-center items-center overflow-hidden pt-12 hero-backlight">
        
        {/* Moving Film Reel Photo Background */}
        <FilmReelBackground photos={photos} onPhotoClick={handleOpenPhoto} />

        {/* Floating Gold Particles */}
        <ParticleField count={40} />

        {/* Soft Ambient Radial Light Beam */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#d4af37]/20 via-[#ca8a04]/8 to-transparent blur-[180px] rounded-full pointer-events-none z-1" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-6 pointer-events-none"
        >
          
          {/* Legacy Chip Tag */}
          <motion.div variants={itemVariants} className="relative z-20 mb-3 inline-flex items-center gap-2.5 px-5 py-2 rounded-xl bg-[#0f0f15]/95 border border-[#d4af37]/50 shadow-2xl text-xs font-extrabold text-[#d4af37] backdrop-blur-xl pointer-events-auto">
            <Sparkles className="w-4 h-4 text-[#d4af37] glow-pulse" />
            <span className="tracking-widest uppercase font-sans">45 YEARS OF LEGACY • EST. 1982</span>
          </motion.div>

          {/* Transparent MO.png Emblem Centerpiece with Translucent Black Backdrop Glow */}
          <motion.div variants={itemVariants} className="relative w-full max-w-lg mx-auto py-2 flex items-center justify-center pointer-events-auto">
            {/* Opaque Dark Backdrop for MO Emblem (Offset downward to avoid overlap with legacy pill) */}
            <div className="absolute w-[240px] h-[240px] sm:w-[310px] sm:h-[310px] rounded-full bg-[#08080b] shadow-[0_20px_50px_35px_#08080b] pointer-events-none z-0" />

            <motion.img
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, rotate: 2 }}
              src="/images/MO.png"
              alt="Rotaract Club of Navi Mumbai Magnum Opus Official Logo"
              className="relative z-10 w-auto h-56 sm:h-72 lg:h-80 object-contain filter drop-shadow-[0_20px_45px_rgba(212,175,55,0.45)] cursor-pointer"
            />
          </motion.div>

          {/* Headline & Narrative */}
          <motion.div variants={itemVariants} className="space-y-4 max-w-4xl mx-auto pointer-events-auto">
            <h1 className="font-serif-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Creating Our <span className="text-gold-gradient">MAGNUM OPUS</span>
            </h1>
            <p className="font-sans-body text-zinc-300 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
              Official digital platform of the <strong className="text-white font-semibold">Rotaract Club of Navi Mumbai</strong> (District 3142, Zone 1). Celebrating 45 years of empowering youth leadership, driving community action, and building lifelong fellowship.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 pt-2 pointer-events-auto">
            <Link
              href="/events"
              className="px-8 py-4 btn-gold-action uppercase tracking-wider text-xs font-extrabold flex items-center gap-2 shadow-2xl"
            >
              <span>Explore Living Stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/join"
              className="px-8 py-4 btn-outline-action uppercase tracking-wider text-xs font-bold shadow-xl"
            >
              <Users className="w-4 h-4 text-[#d4af37]" />
              <span>Become a Member</span>
            </Link>
          </motion.div>

          {/* Upcoming Events Spotlight Card */}
          <motion.div variants={itemVariants} className="pt-3 max-w-3xl mx-auto pointer-events-auto">
            {events.find(e => e.is_upcoming) ? (
              (() => {
                const upcoming = events.find(e => e.is_upcoming)!;
                return (
                  <div className="p-5 sm:p-6 rounded-2xl modern-card-gold text-left relative overflow-hidden border border-[#d4af37]/40 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4af37]"></span>
                          </span>
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#d4af37] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>UPCOMING EVENT SPOTLIGHT</span>
                          </span>
                        </div>

                        <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white leading-snug">
                          {upcoming.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 pt-0.5">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                            {formatDate(upcoming.event_date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                            {upcoming.location}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/events/${upcoming.slug}`}
                        className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#fef08a] transition-all shrink-0 shadow-lg flex items-center gap-1.5"
                      >
                        <span>View Event Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-5 rounded-2xl modern-card text-center relative">
                <p className="text-xs font-bold text-[#d4af37] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>UPCOMING PROJECTS & COMMUNITY ACTION</span>
                </p>
                <p className="text-xs text-zinc-300 mt-1 font-sans">
                  Stay tuned for our upcoming fellowship drives, health camps, and eco-initiatives across Navi Mumbai.
                </p>
              </div>
            )}
          </motion.div>

        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ANIMATED LEGACY STATS                                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 sm:p-12 modern-card-gold"
        >
          
          {[
            { number: 45, suffix: '', label: 'Years of Service', sublabel: 'Est. 1982', gold: true },
            { number: 1000, suffix: '+', label: 'Projects Executed', sublabel: 'Social & Community Action', gold: false },
            { number: 50000, suffix: '+', label: 'Lives Impacted', sublabel: 'Across Navi Mumbai', gold: true },
            { number: 1, suffix: '', label: 'Oldest Pioneer Club', sublabel: 'Zone 1, District 3142', gold: false, prefix: 'Zone ' },
          ].map((stat, idx) => (
            <div key={idx} className={`space-y-1 text-center p-4 ${idx < 3 ? 'border-r border-white/10' : ''} hover:-translate-y-1 transition-transform duration-300`}>
              <AnimatedCounter
                target={stat.number}
                suffix={stat.suffix}
                prefix={stat.prefix}
                className={`font-serif-heading font-bold text-4xl sm:text-6xl block ${stat.gold ? 'stat-number' : 'text-white'}`}
              />
              <span className="text-xs font-bold uppercase tracking-widest text-white block">{stat.label}</span>
              <span className="text-[11px] text-zinc-400 block">{stat.sublabel}</span>
            </div>
          ))}

        </motion.div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* THRUST AREAS VISUAL EXPLORER                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="space-y-3 text-center sm:text-left"
        >
          <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4" />
            <span>OUR CORE PILLARS</span>
          </span>
          <h2 className="font-serif-heading text-4xl sm:text-6xl font-bold text-white tracking-tight">
            Thrust Areas of RCNM
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
            Thrust areas are the compass guiding us toward progress and innovation across Navi Mumbai.
          </p>
        </motion.div>

        {initiatives.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl modern-card-gold p-8 sm:p-12"
          >
            
            {/* Left Nav List */}
            <div className="lg:col-span-5 space-y-3">
              {initiatives.map((item, idx) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveInitiativeIdx(idx)}
                  onMouseEnter={() => setActiveInitiativeIdx(idx)}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full p-5 rounded-2xl text-left transition-all duration-300 flex items-center justify-between border ${
                    activeInitiativeIdx === idx
                      ? 'bg-gradient-to-r from-[#d4af37]/25 via-[#181824] to-[#0e0e13] border-[#d4af37] text-white shadow-xl shadow-[#d4af37]/5'
                      : 'bg-[#0a0a0d] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#d4af37] font-extrabold uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="font-serif-heading text-xl font-bold">
                      {item.title}
                    </h3>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeInitiativeIdx === idx ? 'text-[#d4af37] translate-x-1' : 'text-zinc-600'}`} />
                </motion.button>
              ))}
            </div>

            {/* Right Active Showcase */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeInitiative?.id}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    src={activeInitiative?.cover_image}
                    alt={activeInitiative?.title}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#040405] via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-[#d4af37] border border-[#d4af37]/40">
                  {activeInitiative?.category}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeInitiative?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <h3 className="font-serif-heading text-3xl font-bold text-white">
                    {activeInitiative?.title}
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                    {activeInitiative?.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/initiatives/${activeInitiative?.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] hover:underline uppercase tracking-wider group/link"
                    >
                      <span>Explore Initiative Details & Linked Events</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

          </motion.div>
        )}
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FEATURED EVENT STORIES                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 bg-[#060609] border-y border-white/5 relative overflow-hidden gradient-mesh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>LIVING STORIES & EVENTS</span>
              </span>
              <h2 className="font-serif-heading text-4xl sm:text-6xl font-bold text-white tracking-tight">
                Featured Event Stories
              </h2>
              <p className="text-zinc-400 text-sm max-w-xl">
                Every event is a chapter in our Magnum Opus. Explore photographs, metrics, and narratives from our recent activities.
              </p>
            </div>

            <Link
              href="/events"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#d4af37] text-xs font-bold text-white flex items-center gap-2 hover:bg-white/10 transition-all self-start md:self-auto uppercase tracking-wider group"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {featuredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="elevated-card flex flex-col justify-between overflow-hidden group shadow-2xl"
              >
                {/* Featured Ribbon */}
                {event.is_featured && idx === 0 && (
                  <div className="featured-ribbon">★ FEATURED</div>
                )}

                <div className="relative h-64 overflow-hidden rounded-t-[20px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.cover_image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e13] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300">
                    <span className="flex items-center gap-1.5 bg-black/80 px-3 py-1 rounded-md backdrop-blur-md text-[11px] font-semibold border border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      {formatDate(event.event_date)}
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/80 px-3 py-1 rounded-md backdrop-blur-md text-[11px] font-semibold border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      {event.location.split(',')[0]}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif-heading text-2xl font-bold text-white group-hover:text-[#d4af37] transition-colors duration-300 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">
                      {event.summary}
                    </p>
                  </div>

                  {/* Impact metrics */}
                  {event.impact_metrics && event.impact_metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                      {event.impact_metrics.slice(0, 2).map((m: { label: string; value: string }, metricIdx: number) => (
                        <div key={metricIdx} className="bg-white/5 p-2.5 rounded-xl text-center border border-white/5">
                          <span className="font-serif-heading font-bold text-[#d4af37] text-base block">{m.value}</span>
                          <span className="text-[10px] text-zinc-400 uppercase block font-sans">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-3">
                    <Link
                      href={`/events/${event.slug}`}
                      className="w-full text-center py-3 rounded-xl bg-white/5 hover:bg-[#d4af37] hover:text-black font-bold text-xs transition-all duration-300 border border-white/10 hover:border-[#d4af37] block uppercase tracking-wider"
                    >
                      Read Event Story & View Photos
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PHOTO ARCHIVE REEL — Masonry-style                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>VISUAL ARCHIVE</span>
            </span>
            <h2 className="font-serif-heading text-4xl sm:text-6xl font-bold text-white tracking-tight">
              Moments Captured in Time
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Photographs are the living evidence of our fellowship, energy, and work. Explore recent moments from the 45th Year.
            </p>
          </div>

          <Link
            href="/gallery"
            className="px-6 py-3 rounded-xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black text-xs font-bold flex items-center gap-2 transition-all uppercase tracking-wider group"
          >
            <span>Open Full Gallery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Gallery Grid with varied sizes */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[180px]"
        >
          {photos.slice(0, 6).map((photo, idx) => {
            // Create varied sizes: first and fourth items span 2 rows
            const isTall = idx === 0 || idx === 3;
            const isWide = idx === 1;
            return (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleOpenPhoto(photo, idx)}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#d4af37]/60 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] ${
                  isTall ? 'row-span-2' : ''
                } ${isWide ? 'col-span-2' : ''}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image_url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                  <span className="self-end p-1.5 rounded-md bg-black/60 text-white backdrop-blur-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-[11px] text-zinc-200 line-clamp-2 font-medium">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EDITORIAL & NEWSLETTER SPOTLIGHT                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {latestEditorial && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="modern-card p-6 sm:p-10 relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>EDITORIAL & NEWSLETTER ARCHIVE</span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
                    {latestEditorial.title}
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                    {latestEditorial.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <span>Author: <strong className="text-white">{latestEditorial.author}</strong></span>
                  <span>•</span>
                  <span>Published: <strong className="text-white">{formatDate(latestEditorial.published_at)}</strong></span>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {latestEditorial.pdf_url && (
                    <button
                      onClick={() => handleOpenPdf(latestEditorial.title, latestEditorial.pdf_url)}
                      className="px-8 py-4 btn-gold-action text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Newsletter PDF</span>
                    </button>
                  )}
                  <Link
                    href={`/editorials/${latestEditorial.slug}`}
                    className="px-6 py-4 btn-outline-action text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    View All Publications
                  </Link>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl hover:border-[#d4af37]/40 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={latestEditorial.cover_image}
                  alt={latestEditorial.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-xs text-zinc-300 space-y-1">
                  <span className="font-serif-heading text-2xl font-bold text-[#d4af37] block">
                    MAGNUM OPUS Official Bulletin
                  </span>
                  Official Monthly Publication of Rotaract Club of Navi Mumbai
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PROSPECTIVE MEMBER CONVERSION BANNER                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="modern-card-gold p-8 sm:p-12 text-center space-y-6 relative overflow-hidden"
        >
          {/* Background particles */}
          <ParticleField count={25} />

          <div className="max-w-3xl mx-auto space-y-5 relative z-10">
            <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase">
              BECOME PART OF SOMETHING GREATER
            </span>
            <h2 className="font-serif-heading text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
              Ready to write your chapter in our <span className="text-gold-gradient">MAGNUM OPUS</span>?
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed">
              Rotaract is more than an organization — it is a sanctuary of lifelong friendships, leadership opportunities, community service, and memories that stay with you forever.
            </p>
            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                href="/join"
                className="px-10 py-4.5 btn-gold-action text-black font-extrabold text-base uppercase tracking-wider flex items-center gap-2 shadow-2xl"
              >
                <span>Apply to Join RACNM</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MODALS */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={activeReelPhotos}
        currentIndex={currentPhotoIdx}
        onNavigate={idx => setCurrentPhotoIdx(idx)}
      />

      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title={selectedPdf.title}
        pdfUrl={selectedPdf.url}
      />
    </div>
  );
}
