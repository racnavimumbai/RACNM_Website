'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, ShieldCheck, Sparkles, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from '@/components/SocialIcons';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Footer() {
  const pathname = usePathname();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  const socialLinks = [
    { href: 'https://instagram.com', label: 'Instagram', icon: InstagramIcon },
    { href: 'https://linkedin.com', label: 'LinkedIn', icon: LinkedinIcon },
    { href: 'https://youtube.com', label: 'YouTube', icon: YoutubeIcon },
    { href: 'mailto:rotaractclubofnavimumbai@gmail.com', label: 'Email Us', icon: Mail },
  ];

  return (
    <>
      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <footer className="bg-[#050508] border-t border-[#d4af37]/20 text-zinc-400 relative overflow-hidden pt-20 pb-12">
        {/* Ambient Gold Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#d4af37]/8 blur-[160px] rounded-full pointer-events-none" />

        {/* Decorative Watermark */}
        <div className="watermark-text bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
          MAGNUM OPUS
        </div>

        {/* Animated gold top border */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-white/10">
            
            {/* Brand & Dual Logos */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                {/* Transparent RCNM Logo */}
                <div className="h-12 w-auto flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/RCNM.png"
                    alt="Rotaract Club of Navi Mumbai Logo"
                    className="h-full w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
                  />
                </div>

                {/* Divider */}
                <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                {/* Transparent MO Logo */}
                <div className="h-12 w-auto flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/MO.png"
                    alt="Magnum Opus 45th Year Logo"
                    className="h-full w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
                  />
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                <strong className="text-white">Rotaract Club of Navi Mumbai</strong> (RID 3142, Zone 1) is a premier youth leadership organization established in 1982. Celebrating 45 years of service, fellowship, and social impact under our annual theme — <strong className="text-white">MAGNUM OPUS</strong>.
              </p>

              {/* Social Links with hover effects */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#d4af37] hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Navigation</span>
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: 'About RCNM' },
                  { href: '/initiatives', label: 'Our Initiatives' },
                  { href: '/events', label: 'Events & Stories' },
                  { href: '/gallery', label: 'Photo Archive' },
                  { href: '/editorials', label: 'Newsletters & Press' },
                  { href: '/team', label: 'Leadership & Board' },
                  { href: '/join', label: 'Join Rotaract', highlight: true },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`hover:text-[#d4af37] transition-colors duration-200 inline-flex items-center gap-1.5 ${item.highlight ? 'text-[#d4af37] font-bold' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Thrust Areas */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Thrust Areas
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/initiatives" className="hover:text-white transition-colors duration-200">Education & Skill Building</Link></li>
                <li><Link href="/initiatives" className="hover:text-white transition-colors duration-200">Environmental Action</Link></li>
                <li><Link href="/initiatives" className="hover:text-white transition-colors duration-200">Leadership Growth</Link></li>
                <li><Link href="/initiatives" className="hover:text-white transition-colors duration-200">Community Healthcare</Link></li>
                <li><Link href="/initiatives" className="hover:text-white transition-colors duration-200">International Service</Link></li>
              </ul>
            </motion.div>

            {/* Location Details */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Contact & Base
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>Centre in Navi Mumbai, Zone 1, Rotary District 3142, Maharashtra, India.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <a href="mailto:rotaractclubofnavimumbai@gmail.com" className="hover:underline text-zinc-300 hover:text-[#d4af37] transition-colors">
                    rotaractclubofnavimumbai@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} Rotaract Club of Navi Mumbai. 45 Years of Excellence (1982–2027). All rights reserved.</p>
            
            <div className="flex items-center gap-4">
              <Link href="/admin/login" className="flex items-center gap-1 hover:text-[#d4af37] transition-colors text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Admin CMS Portal</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </footer>
    </>
  );
}
