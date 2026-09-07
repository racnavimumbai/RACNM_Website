'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, UserCheck, Search, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import GlobalSearchModal from '@/components/GlobalSearchModal';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Initiatives', href: '/initiatives' },
  { name: 'Events', href: '/events' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Editorial', href: '/editorials' },
  { name: 'Team', href: '/team' }
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Ctrl+K / Cmd+K search shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change without cascading effect render
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileMenuOpen(false);
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  return (
    <>
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? (theme === 'light' 
                ? 'header-scrolled bg-white/92 backdrop-blur-2xl border-b border-[var(--border-gold)] py-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
                : 'header-scrolled bg-[#08080b]/95 backdrop-blur-2xl border-b border-[#d4af37]/20 py-2.5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]')
            : (theme === 'light'
                ? 'header-transparent bg-gradient-to-b from-[#f8f7f4]/95 via-[#f8f7f4]/60 to-transparent py-4'
                : 'header-transparent bg-gradient-to-b from-[#08080b]/95 via-[#08080b]/60 to-transparent py-4')
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Dual Brand Logos (RCNM | MO) */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group shrink-0">
            {/* RCNM Logo */}
            <div className="h-9 sm:h-11 w-auto flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/RCNM.png"
                alt="Rotaract Club of Navi Mumbai"
                className={cn(
                  "h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300",
                  theme === 'light' 
                    ? 'filter brightness-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
                    : 'filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]'
                )}
              />
            </div>

            {/* Vertical Divider */}
            <div className={cn(
              "h-6 sm:h-7 w-[1px] bg-gradient-to-b from-transparent to-transparent",
              theme === 'light' ? 'via-black/15' : 'via-white/20'
            )} />

            {/* MO Logo */}
            <div className="h-9 sm:h-11 w-auto flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/MO.png"
                alt="Magnum Opus"
                className={cn(
                  "h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300",
                  theme === 'light'
                    ? 'filter drop-shadow-[0_2px_10px_rgba(184,148,30,0.2)]'
                    : 'filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]'
                )}
              />
            </div>
          </Link>

          {/* Navigation Dock */}
          <nav className={cn(
            "nav-dock hidden lg:flex items-center gap-1 backdrop-blur-2xl px-3 py-1.5 rounded-2xl border shadow-2xl relative",
            theme === 'light'
              ? 'bg-white/95 border-black/10 shadow-black/5'
              : 'bg-[#0f0f15]/90 border-white/10 shadow-black/50'
          )}>
            {navItems.map(item => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-300 tracking-wide relative z-10 whitespace-nowrap shrink-0',
                    isActive
                      ? 'text-black font-extrabold'
                      : theme === 'light'
                        ? 'text-gray-800 hover:text-black hover:bg-black/5'
                        : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  )}
                >
                  {/* Animated active indicator background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#fde047] to-[#d4af37] rounded-xl shadow-md shadow-[#d4af37]/30"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}

            {/* Search Box / Button beside Team */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ml-0.5 group border whitespace-nowrap shrink-0",
                theme === 'light'
                  ? 'text-gray-800 hover:text-black bg-black/4 hover:bg-black/8 border-black/10'
                  : 'text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
              )}
              title="Search website"
            >
              <Search className="w-3.5 h-3.5 text-[var(--gold-primary)] group-hover:scale-110 transition-transform" />
              <span>Search</span>
            </button>
          </nav>

          {/* Right Action CTA */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Join the Team Button */}
            <Link
              href="/join"
              className="flex items-center gap-2 text-xs font-extrabold px-5 py-2.5 btn-gold-action uppercase tracking-wider whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4" />
              <span>Join the Team</span>
            </Link>

            {/* Light / Dark Theme Toggle Button (On the right of Join button) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Sun className="w-4.5 h-4.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Moon className="w-4.5 h-4.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile: Theme Toggle + Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2.5 rounded-xl border transition-colors",
                theme === 'light'
                  ? 'bg-white border-black/8 text-gray-600 hover:text-gray-900'
                  : 'bg-[#0f0f15] border-white/10 text-zinc-300 hover:text-white'
              )}
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>

        {/* Mobile Drawer with staggered items */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "mobile-drawer lg:hidden fixed inset-x-0 top-[68px] backdrop-blur-2xl border-b p-6 shadow-2xl overflow-hidden",
                theme === 'light'
                  ? 'bg-white/98 border-[var(--border-gold)]'
                  : 'bg-[#08080b]/98 border-[#d4af37]/30'
              )}
            >
              <motion.div
                className="flex flex-col gap-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
                }}
              >
                {navItems.map(item => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <motion.div
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-200 flex items-center justify-between',
                          isActive
                            ? 'bg-[var(--gold-primary)]/20 text-[var(--gold-primary)] border border-[var(--gold-primary)]/50 font-bold'
                            : theme === 'light'
                              ? 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <span>{item.name}</span>
                        {isActive && <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  className={cn(
                    "pt-4 mt-2 border-t flex flex-col gap-2.5",
                    theme === 'light' ? 'border-black/8' : 'border-white/10'
                  )}
                >
                  <Link
                    href="/join"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 btn-gold-action font-extrabold text-sm uppercase tracking-wider shadow-xl justify-center"
                  >
                    Become a Member
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
