'use client';

import { useState, useEffect } from 'react';
import { getBoardMembers, BoardMember } from '@/lib/data/api';
import { InstagramIcon, LinkedinIcon } from '@/components/SocialIcons';
import { Mail, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function TeamPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getBoardMembers();
      setMembers(data);
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
            MASTHEAD NO. 07
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            BOARD OF DIRECTORS (2024-25)
          </span>
        </div>

        <h1 className="font-serif-heading text-5xl sm:text-7xl font-normal text-white">
          Leadership & Board
        </h1>

        <p className="text-zinc-300 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          The 45th Board of Directors bringing together dedicated students, creative minds, and young professionals steering Rotaract Club of Navi Mumbai under MAGNUM OPUS.
        </p>
      </motion.div>

      {/* Leadership Directory Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {members.map((member) => (
          <motion.div
            key={member.id}
            variants={itemFade}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="elevated-card flex flex-col justify-between group"
          >
            {/* Profile Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[20px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.image_url}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              {/* Gold overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Role badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-bold text-[#d4af37] uppercase tracking-widest border border-[#d4af37]/30">
                {member.role}
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h2 className="font-serif-heading text-2xl font-normal text-white group-hover:text-[#d4af37] transition-colors duration-300">
                  {member.name}
                </h2>
                {member.bio && (
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 pt-1 font-sans">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/10 text-zinc-400">
                {member.social_links?.instagram && (
                  <a href={member.social_links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors duration-200" aria-label="Instagram">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {member.social_links?.linkedin && (
                  <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors duration-200" aria-label="LinkedIn">
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {member.social_links?.email && (
                  <a href={`mailto:${member.social_links.email}`} className="hover:text-[#d4af37] transition-colors duration-200" aria-label="Email">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
