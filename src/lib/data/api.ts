import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  initialInitiatives,
  initialEvents,
  initialGalleryPhotos,
  initialEditorials,
  initialBoardMembers,
  initialApplications,
  Initiative,
  EventItem,
  GalleryPhoto,
  Editorial,
  BoardMember,
  JoinApplication
} from './mockData';

export type { Initiative, EventItem, GalleryPhoto, Editorial, BoardMember, JoinApplication };

// Helper for localStorage persistence in mock mode
const STORAGE_KEYS = {
  INITIATIVES: 'rcnm_initiatives',
  EVENTS: 'rcnm_events',
  GALLERY: 'rcnm_gallery',
  EDITORIALS: 'rcnm_editorials',
  TEAM: 'rcnm_team',
  APPLICATIONS: 'rcnm_applications'
};

function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

// INITIATIVES
export async function getInitiatives(): Promise<Initiative[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await (supabase.from('initiatives' as any) as any).select('*').order('created_at', { ascending: false });
    if (!error && data) return data as Initiative[];
  }
  return getLocal<Initiative[]>(STORAGE_KEYS.INITIATIVES, initialInitiatives);
}

export async function getInitiativeBySlug(slug: string): Promise<Initiative | null> {
  const list = await getInitiatives();
  return list.find(i => i.slug === slug) || null;
}

export async function saveInitiative(item: Partial<Initiative>): Promise<Initiative> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    if (item.id) {
      const { data, error } = await (supabase.from('initiatives' as any) as any).update(item).eq('id', item.id).select().single();
      if (!error && data) return data as Initiative;
    } else {
      const newItem = {
        ...item,
        slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'initiative',
        created_at: new Date().toISOString()
      };
      const { data, error } = await (supabase.from('initiatives' as any) as any).insert(newItem).select().single();
      if (!error && data) return data as Initiative;
    }
  }

  // Local fallback
  const list = getLocal<Initiative[]>(STORAGE_KEYS.INITIATIVES, initialInitiatives);
  if (item.id) {
    const idx = list.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...item };
      setLocal(STORAGE_KEYS.INITIATIVES, list);
      return list[idx];
    }
  }
  const created: Initiative = {
    id: `init-${Date.now()}`,
    title: item.title || 'Untitled Initiative',
    slug: item.slug || (item.title || 'initiative').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    summary: item.summary || '',
    description: item.description || '',
    category: item.category || 'General',
    cover_image: item.cover_image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    is_featured: item.is_featured ?? false,
    created_at: new Date().toISOString()
  };
  list.unshift(created);
  setLocal(STORAGE_KEYS.INITIATIVES, list);
  return created;
}

export async function deleteInitiative(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { error } = await (supabase.from('initiatives' as any) as any).delete().eq('id', id);
    if (!error) return true;
  }
  const list = getLocal<Initiative[]>(STORAGE_KEYS.INITIATIVES, initialInitiatives).filter(i => i.id !== id);
  setLocal(STORAGE_KEYS.INITIATIVES, list);
  return true;
}

// EVENTS
export async function getEvents(): Promise<EventItem[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await (supabase.from('events' as any) as any).select('*').order('event_date', { ascending: false });
    if (!error && data) return data as EventItem[];
  }
  return getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, initialEvents);
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const list = await getEvents();
  return list.find(e => e.slug === slug) || null;
}

export async function saveEvent(item: Partial<EventItem>): Promise<EventItem> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    if (item.id) {
      const { data, error } = await (supabase.from('events' as any) as any).update(item).eq('id', item.id).select().single();
      if (!error && data) return data as EventItem;
    } else {
      const { data, error } = await (supabase.from('events' as any) as any).insert({
        ...item,
        slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'event',
        status: item.status || 'published',
        rotaract_year: item.rotaract_year || '2024-25',
        created_at: new Date().toISOString()
      }).select().single();
      if (!error && data) return data as EventItem;
    }
  }

  const list = getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, initialEvents);
  if (item.id) {
    const idx = list.findIndex(e => e.id === item.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...item };
      setLocal(STORAGE_KEYS.EVENTS, list);
      return list[idx];
    }
  }
  const created: EventItem = {
    id: `evt-${Date.now()}`,
    initiative_id: item.initiative_id || null,
    title: item.title || 'New Rotaract Event',
    slug: item.slug || (item.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    rotaract_year: item.rotaract_year || '2024-25',
    event_date: item.event_date || new Date().toISOString().split('T')[0],
    location: item.location || 'Navi Mumbai',
    summary: item.summary || '',
    description: item.description || '',
    impact_metrics: item.impact_metrics || [],
    cover_image: item.cover_image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
    gallery_images: item.gallery_images || [],
    status: item.status || 'published',
    is_featured: item.is_featured ?? false,
    is_upcoming: item.is_upcoming ?? false,
    created_at: new Date().toISOString()
  };
  list.unshift(created);
  setLocal(STORAGE_KEYS.EVENTS, list);
  return created;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { error } = await (supabase.from('events' as any) as any).delete().eq('id', id);
    if (!error) return true;
  }
  const list = getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, initialEvents).filter(e => e.id !== id);
  setLocal(STORAGE_KEYS.EVENTS, list);
  return true;
}

// GALLERY
export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await (supabase.from('gallery_photos' as any) as any).select('*').order('sort_order', { ascending: true });
    if (!error && data) return data as GalleryPhoto[];
  }
  return getLocal<GalleryPhoto[]>(STORAGE_KEYS.GALLERY, initialGalleryPhotos);
}

export async function saveGalleryPhoto(photo: Partial<GalleryPhoto>): Promise<GalleryPhoto> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    if (photo.id) {
      const { data, error } = await (supabase.from('gallery_photos' as any) as any).update(photo).eq('id', photo.id).select().single();
      if (!error && data) return data as GalleryPhoto;
    } else {
      const { data, error } = await (supabase.from('gallery_photos' as any) as any).insert({
        ...photo,
        album_name: photo.album_name || 'General Archive',
        rotaract_year: photo.rotaract_year || '2024-25',
        created_at: new Date().toISOString()
      }).select().single();
      if (!error && data) return data as GalleryPhoto;
    }
  }

  const list = getLocal<GalleryPhoto[]>(STORAGE_KEYS.GALLERY, initialGalleryPhotos);
  if (photo.id) {
    const idx = list.findIndex(p => p.id === photo.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...photo };
      setLocal(STORAGE_KEYS.GALLERY, list);
      return list[idx];
    }
  }
  const created: GalleryPhoto = {
    id: `gal-${Date.now()}`,
    event_id: photo.event_id || null,
    album_name: photo.album_name || 'General Archive',
    image_url: photo.image_url || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
    caption: photo.caption || 'Rotaract Club of Navi Mumbai Moment',
    rotaract_year: photo.rotaract_year || '2024-25',
    sort_order: photo.sort_order || list.length + 1,
    created_at: new Date().toISOString()
  };
  list.unshift(created);
  setLocal(STORAGE_KEYS.GALLERY, list);
  return created;
}

export async function deleteGalleryPhoto(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { error } = await (supabase.from('gallery_photos' as any) as any).delete().eq('id', id);
    if (!error) return true;
  }
  const list = getLocal<GalleryPhoto[]>(STORAGE_KEYS.GALLERY, initialGalleryPhotos).filter(p => p.id !== id);
  setLocal(STORAGE_KEYS.GALLERY, list);
  return true;
}

// EDITORIALS
export async function getEditorials(): Promise<Editorial[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await (supabase.from('editorials' as any) as any).select('*').order('published_at', { ascending: false });
    if (!error && data) return data as Editorial[];
  }
  return getLocal<Editorial[]>(STORAGE_KEYS.EDITORIALS, initialEditorials);
}

export async function getEditorialBySlug(slug: string): Promise<Editorial | null> {
  const list = await getEditorials();
  return list.find(e => e.slug === slug) || null;
}

export async function saveEditorial(item: Partial<Editorial>): Promise<Editorial> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    if (item.id) {
      const { data, error } = await (supabase.from('editorials' as any) as any).update(item).eq('id', item.id).select().single();
      if (!error && data) return data as Editorial;
    } else {
      const { data, error } = await (supabase.from('editorials' as any) as any).insert({
        ...item,
        slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'editorial',
        status: item.status || 'published',
        published_at: new Date().toISOString()
      }).select().single();
      if (!error && data) return data as Editorial;
    }
  }

  const list = getLocal<Editorial[]>(STORAGE_KEYS.EDITORIALS, initialEditorials);
  if (item.id) {
    const idx = list.findIndex(e => e.id === item.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...item };
      setLocal(STORAGE_KEYS.EDITORIALS, list);
      return list[idx];
    }
  }
  const created: Editorial = {
    id: `ed-${Date.now()}`,
    title: item.title || 'New Editorial Bulletin',
    slug: item.slug || (item.title || 'editorial').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    author: item.author || 'Editorial Board',
    category: item.category || 'Monthly Newsletter',
    pdf_url: item.pdf_url || null,
    cover_image: item.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    summary: item.summary || '',
    content: item.content || '',
    status: item.status || 'published',
    published_at: new Date().toISOString()
  };
  list.unshift(created);
  setLocal(STORAGE_KEYS.EDITORIALS, list);
  return created;
}

export async function deleteEditorial(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { error } = await (supabase.from('editorials' as any) as any).delete().eq('id', id);
    if (!error) return true;
  }
  const list = getLocal<Editorial[]>(STORAGE_KEYS.EDITORIALS, initialEditorials).filter(e => e.id !== id);
  setLocal(STORAGE_KEYS.EDITORIALS, list);
  return true;
}

// TEAM
export async function getBoardMembers(year: string = '2024-25'): Promise<BoardMember[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await (supabase.from('board_members' as any) as any).select('*').eq('rotaract_year', year).order('sort_order', { ascending: true });
    if (!error && data && data.length > 0) return data as BoardMember[];
  }
  const list = getLocal<BoardMember[]>(STORAGE_KEYS.TEAM, initialBoardMembers);
  return list.filter(m => m.rotaract_year === year).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllBoardMembers(): Promise<BoardMember[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await (supabase.from('board_members' as any) as any).select('*').order('sort_order', { ascending: true });
    if (!error && data) return data as BoardMember[];
  }
  return getLocal<BoardMember[]>(STORAGE_KEYS.TEAM, initialBoardMembers);
}

export async function saveBoardMember(member: Partial<BoardMember>): Promise<BoardMember> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    if (member.id) {
      const { data, error } = await (supabase.from('board_members' as any) as any).update(member).eq('id', member.id).select().single();
      if (!error && data) return data as BoardMember;
    } else {
      const { data, error } = await (supabase.from('board_members' as any) as any).insert(member).select().single();
      if (!error && data) return data as BoardMember;
    }
  }

  const list = getLocal<BoardMember[]>(STORAGE_KEYS.TEAM, initialBoardMembers);
  if (member.id) {
    const idx = list.findIndex(m => m.id === member.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...member };
      setLocal(STORAGE_KEYS.TEAM, list);
      return list[idx];
    }
  }
  const created: BoardMember = {
    id: `bm-${Date.now()}`,
    name: member.name || 'New Member',
    role: member.role || 'Board Director',
    rotaract_year: member.rotaract_year || '2024-25',
    bio: member.bio || '',
    image_url: member.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    sort_order: member.sort_order || list.length + 1,
    social_links: member.social_links || {}
  };
  list.push(created);
  setLocal(STORAGE_KEYS.TEAM, list);
  return created;
}

export async function deleteBoardMember(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { error } = await (supabase.from('board_members' as any) as any).delete().eq('id', id);
    if (!error) return true;
  }
  const list = getLocal<BoardMember[]>(STORAGE_KEYS.TEAM, initialBoardMembers).filter(m => m.id !== id);
  setLocal(STORAGE_KEYS.TEAM, list);
  return true;
}

// JOIN APPLICATIONS
export async function getApplications(): Promise<JoinApplication[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await (supabase.from('join_applications' as any) as any).select('*').order('created_at', { ascending: false });
    if (!error && data) return data as JoinApplication[];
  }
  return getLocal<JoinApplication[]>(STORAGE_KEYS.APPLICATIONS, initialApplications);
}

export async function submitJoinApplication(app: Omit<JoinApplication, 'id' | 'status' | 'created_at'>): Promise<JoinApplication> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await (supabase.from('join_applications' as any) as any).insert({
      ...app,
      status: 'pending',
      created_at: new Date().toISOString()
    }).select().single();
    if (!error && data) return data as JoinApplication;
  }

  const list = getLocal<JoinApplication[]>(STORAGE_KEYS.APPLICATIONS, initialApplications);
  const created: JoinApplication = {
    id: `app-${Date.now()}`,
    ...app,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  list.unshift(created);
  setLocal(STORAGE_KEYS.APPLICATIONS, list);
  return created;
}

export async function updateApplicationStatus(id: string, status: JoinApplication['status']): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { error } = await (supabase.from('join_applications' as any) as any).update({ status }).eq('id', id);
    if (!error) return true;
  }

  const list = getLocal<JoinApplication[]>(STORAGE_KEYS.APPLICATIONS, initialApplications);
  const idx = list.findIndex(a => a.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    setLocal(STORAGE_KEYS.APPLICATIONS, list);
    return true;
  }
  return false;
}
