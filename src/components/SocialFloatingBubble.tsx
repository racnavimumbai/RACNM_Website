'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Mail } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, XIcon, WhatsappIcon } from '@/components/SocialIcons';

interface SocialItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
  hoverClass: string;
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    name: 'X',
    href: 'https://x.com/rc_navimumbai',
    icon: XIcon,
    ariaLabel: 'Follow RACNM on X',
    hoverClass: 'bg-black text-white border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.25)]'
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/rc_navimumbai',
    icon: InstagramIcon,
    ariaLabel: 'Follow RACNM on Instagram',
    hoverClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white border-transparent shadow-[0_0_20px_rgba(225,48,108,0.55)]'
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@rcnavimumbai',
    icon: YoutubeIcon,
    ariaLabel: 'Subscribe to RACNM on YouTube',
    hoverClass: 'bg-[#ff0000] text-white border-transparent shadow-[0_0_20px_rgba(255,0,0,0.55)]'
  },
  {
    name: 'Email',
    href: 'mailto:rotaractclubofnavimumbai@gmail.com',
    icon: Mail,
    ariaLabel: 'Email Rotaract Club of Navi Mumbai',
    hoverClass: 'bg-[#e11d48] text-white border-transparent shadow-[0_0_20px_rgba(225,29,72,0.55)]'
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/?text=Hello%20Rotaract%20Club%20of%20Navi%20Mumbai%20!',
    icon: WhatsappIcon,
    ariaLabel: 'Connect with RACNM on WhatsApp',
    hoverClass: 'bg-[#25d366] text-white border-transparent shadow-[0_0_20px_rgba(37,211,102,0.55)]'
  }
];

export default function SocialFloatingBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hide on admin portal (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center select-none"
    >
      {/* Floating Expanded Social Stack */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 mb-3"
          >
            {SOCIAL_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredItem === item.name;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      delay: (SOCIAL_ITEMS.length - 1 - index) * 0.05,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  exit={{
                    opacity: 0,
                    y: 15,
                    scale: 0.7,
                    transition: {
                      duration: 0.15,
                      delay: index * 0.03
                    }
                  }}
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Tooltip Pill (appears to the left) */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="social-fab-panel absolute right-full mr-3.5 px-3 py-1.5 rounded-lg bg-[#18181b]/95 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-2xl pointer-events-none whitespace-nowrap z-10 flex items-center"
                      >
                        {item.name}
                        {/* Caret pointing right towards the icon */}
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#18181b] rotate-45 border-t border-r border-white/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Social Icon Button with Vibrant Brand Colors */}
                  <motion.a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.94 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border border-white/20 text-white ${item.hoverClass}`}
                  >
                    <Icon className="w-5 h-5 transition-transform drop-shadow-sm" />
                  </motion.a>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Floating Bubble */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? 'Close social links menu' : 'Open social links menu'}
        aria-expanded={isOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none ${
          isOpen
            ? 'bg-[#e11d48] text-white shadow-[0_8px_30px_rgba(225,29,72,0.5)] border border-rose-400/50'
            : 'bg-gradient-to-tr from-[#e6bc3b] via-[#d4af37] to-[#b8860b] text-black shadow-[0_8px_30px_rgba(212,175,55,0.45)] border border-[#fef08a]/60 hover:shadow-[0_10px_35px_rgba(212,175,55,0.6)]'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 stroke-[2.4]" />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
