'use client';

import { useState, useEffect } from 'react';
import { getEvents, saveEvent, deleteEvent, getInitiatives, EventItem, Initiative } from '@/lib/data/api';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate, deleteUploadedImage } from '@/lib/utils';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvents();
    loadInitiatives();
  }, []);

  async function loadEvents() {
    const list = await getEvents();
    setEvents(list);
  }

  async function loadInitiatives() {
    const list = await getInitiatives();
    setInitiatives(list);
  }

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingEvent({
      title: '',
      slug: '',
      rotaract_year: '2024-25',
      event_date: new Date().toISOString().split('T')[0],
      location: 'Navi Mumbai',
      summary: '',
      description: '',
      impact_metrics: [
        { label: 'Beneficiaries', value: '100+' },
        { label: 'Volunteers', value: '25' }
      ],
      cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
      gallery_images: [],
      status: 'published',
      is_featured: false,
      is_upcoming: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: EventItem) => {
    setEditingEvent({ ...event });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title) return;

    setSaving(true);
    try {
      if (editingEvent.id) {
        const original = events.find(item => item.id === editingEvent.id);
        if (original && original.cover_image && original.cover_image !== editingEvent.cover_image) {
          deleteUploadedImage(original.cover_image);
        }
      }
      await saveEvent(editingEvent);
      await loadEvents();
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event from the website archive?')) {
      const target = events.find(item => item.id === id);
      if (target?.cover_image) {
        deleteUploadedImage(target.cover_image);
      }
      await deleteEvent(id);
      await loadEvents();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest block font-bold">
            GUI CONTENT MANAGER
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white">
            Event Stories Manager
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-gold-action"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event Story</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-800 rounded-xl bg-[#0f0f15]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#08080b] border border-zinc-800 rounded pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors ${statusFilter === 'all' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded transition-colors ${statusFilter === 'published' ? 'bg-zinc-800 text-[#d4af37] font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Published ({events.filter(e => e.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded transition-colors ${statusFilter === 'draft' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Drafts ({events.filter(e => e.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Event List Table */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#0f0f15]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 font-mono text-[11px] text-zinc-400 uppercase tracking-wider bg-[#08080b]">
                <th className="p-4">Event Cover & Title</th>
                <th className="p-4">Date & Venue</th>
                <th className="p-4">Impact Data</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {filteredEvents.map(event => (
                <tr key={event.id} className="hover:bg-zinc-800/30 transition-colors">
                  
                  {/* Title & Cover */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded overflow-hidden border border-zinc-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif-heading text-base font-normal text-white block">
                            {event.title}
                          </span>
                          {event.is_upcoming && (
                            <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">
                              UPCOMING
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 block">
                          /{event.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date & Venue */}
                  <td className="p-4 font-mono text-zinc-300">
                    <div className="space-y-0.5">
                      <span className="block flex items-center gap-1.5 text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                        {formatDate(event.event_date)}
                      </span>
                      <span className="block flex items-center gap-1.5 text-zinc-500 text-[11px]">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </td>

                  {/* Impact */}
                  <td className="p-4 font-mono">
                    {event.impact_metrics && event.impact_metrics.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {event.impact_metrics.slice(0, 2).map((m: { label: string; value: string }, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                            {m.label}: <strong className="text-[#d4af37]">{m.value}</strong>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-4 font-mono">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      event.status === 'published'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(event)}
                        className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-red-950/30"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog with AnimatePresence Motion */}
      <AnimatePresence>
        {isModalOpen && editingEvent && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0f0f15] border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="font-serif-heading text-2xl text-white">
                  {editingEvent.id ? 'Edit Event Story' : 'Add New Event Story'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder="e.g. Mega Blood Donation Drive 2024"
                    className="w-full bg-[#08080b] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-400 block">Event Date *</label>
                    <input
                      type="date"
                      required
                      value={editingEvent.event_date || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                      className="w-full bg-[#08080b] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 block">Location / Venue *</label>
                    <input
                      type="text"
                      required
                      value={editingEvent.location || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      className="w-full bg-[#08080b] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <ImageUploader
                  label="Cover Image (Uploads to GitHub Repo)"
                  required
                  value={editingEvent.cover_image || ''}
                  onChange={url => setEditingEvent({ ...editingEvent, cover_image: url })}
                />

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Thrust Category / Initiative</label>
                  <select
                    value={editingEvent.initiative_id || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, initiative_id: e.target.value })}
                    className="w-full bg-[#08080b] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="">None / General Event</option>
                    {initiatives.map(init => (
                      <option key={init.id} value={init.id}>{init.title} ({init.category})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Event Short Summary</label>
                  <textarea
                    rows={2}
                    value={editingEvent.summary || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, summary: e.target.value })}
                    className="w-full bg-[#08080b] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Full Story Description</label>
                  <textarea
                    rows={4}
                    value={editingEvent.description || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full bg-[#08080b] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                  <span className="text-[10px] text-zinc-500 block">
                    Supports Markdown formatting (<strong className="text-zinc-400">**bold**</strong>, <em className="text-zinc-400">*italics*</em>, # Headings, - lists, [links](url))
                  </span>
                </div>

                {/* Impact Metrics Editor */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[#d4af37] font-semibold block uppercase tracking-wider text-[11px]">
                      Event Impact Metrics (Number Boxes)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingEvent.impact_metrics || [];
                        setEditingEvent({
                          ...editingEvent,
                          impact_metrics: [...current, { label: 'New Metric', value: '100+' }]
                        });
                      }}
                      className="px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold hover:bg-[#d4af37]/30"
                    >
                      + Add Metric Box
                    </button>
                  </div>

                  {(editingEvent.impact_metrics || []).map((metric, mIdx) => (
                    <div key={mIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Blood Units)"
                        value={metric.label}
                        onChange={e => {
                          const list = [...(editingEvent.impact_metrics || [])];
                          list[mIdx] = { ...list[mIdx], label: e.target.value };
                          setEditingEvent({ ...editingEvent, impact_metrics: list });
                        }}
                        className="flex-1 bg-[#08080b] border border-zinc-800 rounded p-2 text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 210+)"
                        value={metric.value}
                        onChange={e => {
                          const list = [...(editingEvent.impact_metrics || [])];
                          list[mIdx] = { ...list[mIdx], value: e.target.value };
                          setEditingEvent({ ...editingEvent, impact_metrics: list });
                        }}
                        className="w-28 bg-[#08080b] border border-zinc-800 rounded p-2 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const list = (editingEvent.impact_metrics || []).filter((_, idx) => idx !== mIdx);
                          setEditingEvent({ ...editingEvent, impact_metrics: list });
                        }}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-zinc-400 block">Status</label>
                    <select
                      value={editingEvent.status || 'published'}
                      onChange={e => setEditingEvent({ ...editingEvent, status: e.target.value as 'draft' | 'published' })}
                      className="w-full bg-[#08080b] border border-zinc-800 rounded p-2.5 text-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-zinc-400 block">Homepage Displays</label>
                    <div className="space-y-2 pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-white text-xs block">
                        <input
                          type="checkbox"
                          checked={editingEvent.is_upcoming || false}
                          onChange={e => setEditingEvent({ ...editingEvent, is_upcoming: e.target.checked })}
                          className="rounded border-zinc-800 bg-[#08080b]"
                        />
                        <span>Mark as <strong>Upcoming Event</strong> (Homepage Hero)</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-white text-xs block">
                        <input
                          type="checkbox"
                          checked={editingEvent.is_featured || false}
                          onChange={e => setEditingEvent({ ...editingEvent, is_featured: e.target.checked })}
                          className="rounded border-zinc-800 bg-[#08080b]"
                        />
                        <span>Feature on Story Reel</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3 font-sans">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-outline-action"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-gold-action"
                  >
                    {saving ? 'Saving Changes...' : 'Save Event Story'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
