'use client';

import { useMemo } from 'react';
import { GalleryPhoto } from '@/lib/data/mockData';

interface FilmReelBackgroundProps {
  photos?: GalleryPhoto[];
  onPhotoClick?: (photo: GalleryPhoto, index: number) => void;
}

const DEFAULT_FILM_IMAGES = [
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
];

export default function FilmReelBackground({ photos = [], onPhotoClick }: FilmReelBackgroundProps) {
  // Combine user uploaded photos with fallback images into valid GalleryPhoto array
  const fullPhotoList = useMemo<GalleryPhoto[]>(() => {
    // Filter out any broken/zerodha demo placeholder URLs from DB
    const validUserPhotos = (photos || []).filter(
      p => p && p.image_url && p.image_url.trim() !== '' && !p.image_url.toLowerCase().includes('zerodha')
    );

    const defaultItems = DEFAULT_FILM_IMAGES.map((url, idx) => ({
      id: `reel-default-${idx}`,
      event_id: null,
      album_name: 'RACNM Archive',
      image_url: url,
      caption: 'Rotaract Club of Navi Mumbai Heritage Moment',
      rotaract_year: '2024-25',
      sort_order: idx + 1,
      created_at: new Date().toISOString()
    }));

    // Always guarantee at least 10-12 photos so BOTH tracks have multiple moving photos across screen
    const combined = [...validUserPhotos, ...defaultItems];
    return combined.slice(0, 12);
  }, [photos]);

  // Split into two tracks (6 photos each track)
  const track1 = useMemo(() => fullPhotoList.slice(0, 6), [fullPhotoList]);
  const track2 = useMemo(() => fullPhotoList.slice(6, 12), [fullPhotoList]);

  // Double tracks for seamless continuous infinite marquee loop
  const loopTrack1 = useMemo(() => [...track1, ...track1, ...track1], [track1]);
  const loopTrack2 = useMemo(() => [...track2, ...track2, ...track2], [track2]);

  return (
    <div className="absolute inset-0 overflow-hidden select-none z-[5] pointer-events-auto">
      
      {/* Background Dimmer Mask Layers */}
      <div className="absolute inset-0 bg-[#08080b]/40 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080b]/80 via-transparent to-[#08080b]/90 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(8,8,11,0.85)_85%)] pointer-events-none z-0" />

      {/* Film Strip Row 1 — Upper Track */}
      <div className="absolute top-12 sm:top-16 inset-x-0 overflow-visible py-1 z-10 transform -rotate-1 pointer-events-auto">
        <div className="film-track animate-film-left flex items-center gap-6 px-4 pointer-events-auto">
          {loopTrack1.map((item, idx) => (
            <div
              key={`t1-${idx}`}
              onClick={() => onPhotoClick?.(item, idx % fullPhotoList.length)}
              className="group relative flex-shrink-0 w-44 sm:w-56 aspect-[16/10] bg-[#121218] border-y-4 border-zinc-900 rounded-sm overflow-hidden shadow-2xl transition-all duration-300 hover:scale-110 hover:z-50 cursor-pointer pointer-events-auto"
            >
              {/* Sprocket Perforations Top & Bottom */}
              <div className="absolute top-0 inset-x-0 h-2 bg-[#0c0c10] z-20 flex items-center justify-around px-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1 bg-zinc-600/90 rounded-sm" />
                ))}
              </div>
              <div className="absolute bottom-0 inset-x-0 h-2 bg-[#0c0c10] z-20 flex items-center justify-around px-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1 bg-zinc-600/90 rounded-sm" />
                ))}
              </div>

              {/* Photo frame */}
              <div className="w-full h-full p-2 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.caption || 'Film reel archived memory'}
                  className="w-full h-full object-cover grayscale opacity-80 contrast-125 group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100 transition-all duration-300 ease-out border border-white/10 group-hover:border-[#d4af37] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.8)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Film Strip Row 2 — Lower Track */}
      <div className="absolute top-[290px] sm:top-[330px] inset-x-0 overflow-visible py-1 z-10 transform -rotate-1 pointer-events-auto">
        <div className="film-track animate-film-right flex items-center gap-6 px-4 pointer-events-auto">
          {loopTrack2.map((item, idx) => (
            <div
              key={`t2-${idx}`}
              onClick={() => onPhotoClick?.(item, idx % fullPhotoList.length)}
              className="group relative flex-shrink-0 w-44 sm:w-56 aspect-[16/10] bg-[#121218] border-y-4 border-zinc-900 rounded-sm overflow-hidden shadow-2xl transition-all duration-300 hover:scale-110 hover:z-50 cursor-pointer pointer-events-auto"
            >
              {/* Sprocket Perforations Top & Bottom */}
              <div className="absolute top-0 inset-x-0 h-2 bg-[#0c0c10] z-20 flex items-center justify-around px-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1 bg-zinc-600/90 rounded-sm" />
                ))}
              </div>
              <div className="absolute bottom-0 inset-x-0 h-2 bg-[#0c0c10] z-20 flex items-center justify-around px-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1 bg-zinc-600/90 rounded-sm" />
                ))}
              </div>

              {/* Photo frame */}
              <div className="w-full h-full p-2 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.caption || 'Film reel archived memory'}
                  className="w-full h-full object-cover grayscale opacity-80 contrast-125 group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100 transition-all duration-300 ease-out border border-white/10 group-hover:border-[#d4af37] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.8)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
