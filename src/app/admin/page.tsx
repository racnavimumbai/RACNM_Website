'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getEvents,
  getInitiatives,
  getGalleryPhotos,
  getEditorials,
  getApplications,
  EventItem,
  Initiative,
  GalleryPhoto,
  Editorial,
  JoinApplication
} from '@/lib/data/api';
import {
  Calendar,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Inbox,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [applications, setApplications] = useState<JoinApplication[]>([]);

  useEffect(() => {
    async function loadStats() {
      const [eList, iList, gList, edList, aList] = await Promise.all([
        getEvents(),
        getInitiatives(),
        getGalleryPhotos(),
        getEditorials(),
        getApplications()
      ]);
      setEvents(eList);
      setInitiatives(iList);
      setPhotos(gList);
      setEditorials(edList);
      setApplications(aList);
    }
    loadStats();
  }, []);

  const pendingApps = applications.filter(a => a.status === 'pending');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[#121215] border border-[#d4af37]/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>45th Year MAGNUM OPUS • Non-Technical Admin Portal</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white">
            Welcome, RACNM Administrator
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Manage your club events, upload event photography, publish newsletters, and respond to incoming member applications.
          </p>
        </div>

        <Link
          href="/admin/events"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-black font-bold text-xs hover:scale-105 transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-[#121215] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Events</span>
            <Calendar className="w-4 h-4 text-[#d4af37]" />
          </div>
          <span className="font-serif-heading text-3xl font-bold text-white block">
            {events.length}
          </span>
          <span className="text-[10px] text-zinc-500 block">Total Events Archived</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Initiatives</span>
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
          </div>
          <span className="font-serif-heading text-3xl font-bold text-white block">
            {initiatives.length}
          </span>
          <span className="text-[10px] text-zinc-500 block">Active Thrust Areas</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Photos</span>
            <ImageIcon className="w-4 h-4 text-[#d4af37]" />
          </div>
          <span className="font-serif-heading text-3xl font-bold text-white block">
            {photos.length}
          </span>
          <span className="text-[10px] text-zinc-500 block">In Photo Gallery</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Editorials</span>
            <FileText className="w-4 h-4 text-[#d4af37]" />
          </div>
          <span className="font-serif-heading text-3xl font-bold text-white block">
            {editorials.length}
          </span>
          <span className="text-[10px] text-zinc-500 block">Bulletins & Articles</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-[#d4af37]/40 space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold text-[#d4af37]">Pending Join</span>
            <Inbox className="w-4 h-4 text-[#d4af37]" />
          </div>
          <span className="font-serif-heading text-3xl font-bold text-[#d4af37] block">
            {pendingApps.length}
          </span>
          <span className="text-[10px] text-zinc-400 block">New Member Applications</span>
        </div>
      </div>

      {/* QUICK ACTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Actions Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif-heading text-2xl font-bold text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/events"
              className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-2 group"
            >
              <Calendar className="w-6 h-6 text-[#d4af37]" />
              <h3 className="font-serif-heading font-bold text-white text-lg group-hover:text-[#d4af37] transition-colors">
                Manage Events
              </h3>
              <p className="text-zinc-400 text-xs">
                Add event photos, update impact metrics, and change publication status.
              </p>
            </Link>

            <Link
              href="/admin/editorials"
              className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-2 group"
            >
              <FileText className="w-6 h-6 text-[#d4af37]" />
              <h3 className="font-serif-heading font-bold text-white text-lg group-hover:text-[#d4af37] transition-colors">
                Publish Newsletter PDF
              </h3>
              <p className="text-zinc-400 text-xs">
                Upload monthly bulletin PDFs and editorial pieces to the digital magazine.
              </p>
            </Link>

            <Link
              href="/admin/gallery"
              className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-2 group"
            >
              <ImageIcon className="w-6 h-6 text-[#d4af37]" />
              <h3 className="font-serif-heading font-bold text-white text-lg group-hover:text-[#d4af37] transition-colors">
                Upload Gallery Photos
              </h3>
              <p className="text-zinc-400 text-xs">
                Add new high-resolution event photographs and organize album collections.
              </p>
            </Link>

            <Link
              href="/admin/applications"
              className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-2 group"
            >
              <Inbox className="w-6 h-6 text-[#d4af37]" />
              <h3 className="font-serif-heading font-bold text-white text-lg group-hover:text-[#d4af37] transition-colors">
                Review Applications
              </h3>
              <p className="text-zinc-400 text-xs">
                View contact details of prospective Rotaract members who applied online.
              </p>
            </Link>
          </div>
        </div>

        {/* Right: Recent Applications Inbox */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-heading text-2xl font-bold text-white">
              Recent Inquiries
            </h2>
            <Link href="/admin/applications" className="text-xs text-[#d4af37] font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-[#121215] border border-white/10 rounded-2xl p-4 space-y-3">
            {applications.length > 0 ? (
              applications.slice(0, 3).map(app => (
                <div key={app.id} className="p-3 rounded-xl bg-[#18181c] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{app.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#d4af37]/20 text-[#d4af37]">
                      {app.status}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs line-clamp-1">{app.reason}</p>
                  <span className="text-[10px] text-zinc-500 block">{formatDate(app.created_at)}</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-xs text-center py-4">No membership inquiries yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
