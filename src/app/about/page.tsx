'use client';

import Link from 'next/link';
import { Award, MapPin, ArrowRight, Quote } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import SectionDivider from '@/components/SectionDivider';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const timelineEvents = [
  {
    year: '1982',
    title: 'Foundation of RCNM',
    description: 'Chartered in Navi Mumbai, Rotaract Club of Navi Mumbai became the first community-based Rotaract club in Zone 1, establishing a landmark movement for youth service in the satellite city.'
  },
  {
    year: '1995',
    title: 'Expansion into Youth Empowerment',
    description: 'Expanded thrust areas to include career counseling, blood donation marathons, and local environmental drives, setting benchmarks across District 3142.'
  },
  {
    year: '2010',
    title: 'Silver Jubilee & Flagship Initiatives',
    description: 'Celebrated 25 years of continuous community impact, establishing long-term literacy programs and civic partnerships with NMMC.'
  },
  {
    year: '2020',
    title: 'Pandemic Resilience & Relief Operations',
    description: 'Mobilized food supplies, medical emergency helplines, and digital learning support during the pandemic, proving the adaptive strength of RCNM youth.'
  },
  {
    year: '2024-25',
    title: 'The 45th Year — MAGNUM OPUS',
    description: 'Entering our 45th Year with the theme MAGNUM OPUS — striving to make every initiative a masterpiece of leadership, service, and artistic storytelling.'
  }
];

const fourWayTests = [
  { num: '01', title: 'Is it the TRUTH?', desc: 'Integrity, honesty, and transparency form the bedrock of all our actions and communications.' },
  { num: '02', title: 'Is it FAIR to all?', desc: 'Ensuring equity, respect, and dignity for every community member and partner we engage with.' },
  { num: '03', title: 'Will it build GOODWILL?', desc: 'Fostering deep friendships, trust, and collaborative goodwill across District 3142.' },
  { num: '04', title: 'Is it BENEFICIAL?', desc: 'Creating measurable, long-lasting positive impact for Navi Mumbai and future generations.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-28 py-12 pb-24 bg-transparent text-[#f8fafc]">
      
      {/* EDITORIAL HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 page-hero-glow">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={itemFade} className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">
              ARCHIVE NO. 45
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              EST. 1982 NAVI MUMBAI
            </span>
          </motion.div>

          <motion.div variants={itemFade} className="max-w-4xl space-y-4 pt-6">
            <h1 className="font-serif-heading text-5xl sm:text-7xl font-normal text-white leading-tight">
              The Story of <br />
              <span className="italic font-normal text-gold-gradient">Rotaract Club of Navi Mumbai</span>
            </h1>
            <p className="font-sans-body text-zinc-300 text-base sm:text-lg leading-relaxed">
              As the oldest community-based Rotaract club in Zone 1, District 3142, RCNM has spent 45 years nurturing leaders, creating social impact, and fostering lifelong bonds across Navi Mumbai and beyond.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* HERITAGE & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center elevated-card p-8 sm:p-12"
        >
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest block">
              HERITAGE & MISSION
            </span>

            <h2 className="font-serif-heading text-3xl sm:text-5xl font-normal text-white leading-snug">
              Pioneering Youth Leadership in Navi Mumbai
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Rotaract Club of Navi Mumbai was established in <strong className="text-white">1982</strong>. Over the last four decades, we have remained at the forefront of community service, professional development, and youth empowerment.
            </p>

            <p className="text-zinc-400 text-sm leading-relaxed">
              Sponsored by the <strong className="text-white">Rotary Club of Navi Mumbai</strong> (District 3142), our club serves as an incubator for young adults aged 18 to 30. Here, passion meets structured action — whether it is conducting mega health camps, reforesting coastal mangroves, or mentoring school children.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-800">
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Navi Mumbai</span>
                  <span className="text-[11px] font-mono text-zinc-400">Club Base & Operations</span>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <Award className="w-5 h-5 text-[#d4af37] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Zone 1, RID 3142</span>
                  <span className="text-[11px] font-mono text-zinc-400">Oldest Pioneer Club</span>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
              alt="Rotaract Club of Navi Mumbai Legacy"
              className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/80 backdrop-blur-sm border border-zinc-700/50 text-xs">
              <span className="font-serif-heading text-[#d4af37] text-lg block font-normal">
                45th Year MAGNUM OPUS Theme
              </span>
              Creating masterpieces of service, friendship, and personal growth.
            </div>
          </div>

        </motion.div>
      </section>

      <SectionDivider />

      {/* 45 YEAR HISTORICAL CHRONICLE — Proper Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="border-b border-zinc-800 pb-6 space-y-2"
        >
          <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            HISTORICAL CHRONICLE
          </span>
          <h2 className="font-serif-heading text-4xl sm:text-5xl font-normal text-white">
            45 Years in the Making
          </h2>
        </motion.div>

        {/* Timeline with connected dots and line */}
        <div className="relative pl-12 sm:pl-16">
          {/* Vertical connecting line */}
          <div className="timeline-line" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-10"
          >
            {timelineEvents.map((item, index) => (
              <motion.div
                key={index}
                variants={itemFade}
                className="relative group"
              >
                {/* Timeline dot */}
                <div className={`timeline-dot top-2 ${index === timelineEvents.length - 1 ? 'timeline-dot-active' : ''}`} />

                <div className="p-6 sm:p-8 elevated-card">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                    <span className="font-serif-heading text-3xl sm:text-4xl text-[#d4af37] shrink-0 font-normal">
                      {item.year}
                    </span>
                    <div className="space-y-2">
                      <h3 className="font-serif-heading text-2xl text-white group-hover:text-[#d4af37] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ROTARY FOUR-WAY TEST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="border-b border-zinc-800 pb-4"
        >
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white">
            The Four-Way Test
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {fourWayTests.map((test) => (
            <motion.div
              key={test.num}
              variants={itemFade}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="p-6 elevated-card space-y-3"
            >
              <span className="text-xs font-mono text-[#d4af37] block font-bold">TEST {test.num}</span>
              <h3 className="font-serif-heading font-normal text-white text-xl">{test.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {test.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionDivider />

      {/* CTA TO TEAM */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="p-10 sm:p-16 elevated-card space-y-4 relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#d4af37]/8 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <h3 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white">
              Meet the 45th Board of Directors
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
              Our leadership team brings together dedicated students, young professionals, and civic minds.
            </p>
            <div className="pt-2">
              <Link href="/team" className="btn-editorial-primary">
                <span>View Board of Directors</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
