'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Sparkles,
  Calendar,
  FileText,
  Users,
  Image as ImageIcon,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getInitiatives,
  getEvents,
  getGalleryPhotos,
  getEditorials,
  getAllBoardMembers,
  Initiative,
  EventItem,
  GalleryPhoto,
  Editorial,
  BoardMember
} from '@/lib/data/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Cached site data
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [members, setMembers] = useState<BoardMember[]>([]);

  useEffect(() => {
    if (isOpen) {
      async function loadAll() {
        setLoading(true);
        try {
          const [inits, evts, edts, phts, mbrs] = await Promise.all([
            getInitiatives(),
            getEvents(),
            getEditorials(),
            getGalleryPhotos(),
            getAllBoardMembers()
          ]);
          setInitiatives(inits);
          setEvents(evts);
          setEditorials(edts);
          setPhotos(phts);
          setMembers(mbrs);
        } catch (err) {
          console.error('Search data fetch error:', err);
        } finally {
          setLoading(false);
        }
      }
      loadAll();
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  // Lock scroll & handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, handleClose]);

  // Filtered results
  const q = query.trim().toLowerCase();
  
  const matchedInitiatives = q ? initiatives.filter(i => 
    i.title.toLowerCase().includes(q) || 
    i.category.toLowerCase().includes(q) || 
    i.summary.toLowerCase().includes(q)
  ) : [];

  const matchedEvents = q ? events.filter(e => 
    e.title.toLowerCase().includes(q) || 
    e.location.toLowerCase().includes(q) || 
    e.summary.toLowerCase().includes(q)
  ) : [];

  const matchedEditorials = q ? editorials.filter(e => 
    e.title.toLowerCase().includes(q) || 
    e.author.toLowerCase().includes(q) || 
    e.summary.toLowerCase().includes(q)
  ) : [];

  const matchedMembers = q ? members.filter(m => 
    m.name.toLowerCase().includes(q) || 
    m.role.toLowerCase().includes(q) || 
    (m.bio && m.bio.toLowerCase().includes(q))
  ) : [];

  const matchedPhotos = q ? photos.filter(p => 
    p.caption.toLowerCase().includes(q) || 
    p.album_name.toLowerCase().includes(q)
  ) : [];

  const totalResults = matchedInitiatives.length + matchedEvents.length + matchedEditorials.length + matchedMembers.length + matchedPhotos.length;

  const navigateTo = (href: string) => {
    handleClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="search-modal-backdrop fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="search-modal-card w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-gold)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-4 sm:px-6 py-4 border-b border-[var(--border-secondary)] bg-[var(--bg-card)]">
              <Search className="w-5 h-5 text-[#d4af37] shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search RACNM website (Initiatives, Events, Team, Bulletins, Photos...)"
                className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm sm:text-base focus:outline-none"
              />
              {loading && <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin shrink-0 ml-2" />}
              {query && (
                <button onClick={() => setQuery('')} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0 ml-2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {!q ? (
                <div className="text-center py-8 space-y-3">
                  <Sparkles className="w-8 h-8 text-[var(--gold-primary)] mx-auto opacity-60" />
                  <p className="text-[var(--text-muted)] text-sm">Type any keyword to search across the entire RACNM website.</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                    <span className="text-[var(--text-muted)]">Quick Searches:</span>
                    {['Literacy', 'Blood Donation', 'Mangroves', 'Yash Sarawgi', 'Magnum Opus'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:text-[var(--gold-primary)] hover:border-[var(--border-gold)] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : totalResults === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <p className="text-[var(--text-primary)] font-serif-heading text-lg">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-[var(--text-muted)] text-xs">Try searching for keywords like &ldquo;Events&rdquo;, &ldquo;Team&rdquo;, or project titles.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* INITIATIVES */}
                  {matchedInitiatives.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[var(--gold-primary)] uppercase tracking-widest block font-mono">
                        Thrust Initiatives ({matchedInitiatives.length})
                      </span>
                      <div className="space-y-1.5">
                        {matchedInitiatives.map(item => (
                          <div
                            key={item.id}
                            onClick={() => navigateTo(`/initiatives/${item.slug}`)}
                            className="p-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-subtle)] border border-[var(--border-primary)] hover:border-[var(--border-gold)] transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Sparkles className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-[var(--text-primary)] text-sm font-semibold group-hover:text-[var(--gold-primary)] transition-colors truncate">
                                  {item.title}
                                </h4>
                                <span className="text-[11px] text-[var(--text-muted)] block truncate">{item.category} • {item.summary}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--gold-primary)] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EVENTS */}
                  {matchedEvents.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[var(--gold-primary)] uppercase tracking-widest block font-mono">
                        Events ({matchedEvents.length})
                      </span>
                      <div className="space-y-1.5">
                        {matchedEvents.map(item => (
                          <div
                            key={item.id}
                            onClick={() => navigateTo(`/events/${item.slug}`)}
                            className="p-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-subtle)] border border-[var(--border-primary)] hover:border-[var(--border-gold)] transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Calendar className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-[var(--text-primary)] text-sm font-semibold group-hover:text-[var(--gold-primary)] transition-colors truncate">
                                  {item.title}
                                </h4>
                                <span className="text-[11px] text-[var(--text-muted)] block truncate">{item.event_date} • {item.location}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--gold-primary)] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TEAM MEMBERS */}
                  {matchedMembers.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[var(--gold-primary)] uppercase tracking-widest block font-mono">
                        Team & Leadership ({matchedMembers.length})
                      </span>
                      <div className="space-y-1.5">
                        {matchedMembers.map(item => (
                          <div
                            key={item.id}
                            onClick={() => navigateTo('/team')}
                            className="p-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-subtle)] border border-[var(--border-primary)] hover:border-[var(--border-gold)] transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Users className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-[var(--text-primary)] text-sm font-semibold group-hover:text-[var(--gold-primary)] transition-colors truncate">
                                  {item.name}
                                </h4>
                                <span className="text-[11px] text-[var(--text-muted)] block truncate">{item.role}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--gold-primary)] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EDITORIALS */}
                  {matchedEditorials.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[var(--gold-primary)] uppercase tracking-widest block font-mono">
                        Editorial Publications ({matchedEditorials.length})
                      </span>
                      <div className="space-y-1.5">
                        {matchedEditorials.map(item => (
                          <div
                            key={item.id}
                            onClick={() => navigateTo(`/editorials/${item.slug}`)}
                            className="p-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-subtle)] border border-[var(--border-primary)] hover:border-[var(--border-gold)] transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-[var(--text-primary)] text-sm font-semibold group-hover:text-[var(--gold-primary)] transition-colors truncate">
                                  {item.title}
                                </h4>
                                <span className="text-[11px] text-[var(--text-muted)] block truncate">By {item.author} • {item.category}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--gold-primary)] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PHOTOS */}
                  {matchedPhotos.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[var(--gold-primary)] uppercase tracking-widest block font-mono">
                        Photo Gallery ({matchedPhotos.length})
                      </span>
                      <div className="space-y-1.5">
                        {matchedPhotos.map(item => (
                          <div
                            key={item.id}
                            onClick={() => navigateTo('/gallery')}
                            className="p-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-subtle)] border border-[var(--border-primary)] hover:border-[var(--border-gold)] transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <ImageIcon className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-[var(--text-primary)] text-sm font-semibold group-hover:text-[var(--gold-primary)] transition-colors truncate">
                                  {item.caption || item.album_name}
                                </h4>
                                <span className="text-[11px] text-[var(--text-muted)] block truncate">{item.album_name}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--gold-primary)] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="px-6 py-2.5 bg-[var(--bg-card)] border-t border-[var(--border-secondary)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-dark)] text-[var(--text-secondary)]">ESC</kbd> to close</span>
              <span>RACNM Search Engine</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
