'use client';

import { useState, useEffect } from 'react';
import { getGalleryPhotos, saveGalleryPhoto, deleteGalleryPhoto, GalleryPhoto } from '@/lib/data/api';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { deleteUploadedImage } from '@/lib/utils';

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Partial<GalleryPhoto> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    const list = await getGalleryPhotos();
    setPhotos(list);
  }

  const albums = Array.from(new Set(photos.map(p => p.album_name)));

  const filteredPhotos = photos.filter(p => {
    const matchesSearch = p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.album_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAlbum = selectedAlbum === 'all' || p.album_name === selectedAlbum;
    return matchesSearch && matchesAlbum;
  });

  const handleOpenAddModal = () => {
    setEditingPhoto({
      album_name: 'General Archive',
      image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
      caption: 'Rotaract Club of Navi Mumbai Moment',
      rotaract_year: '2024-25',
      sort_order: photos.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (photo: GalleryPhoto) => {
    setEditingPhoto({ ...photo });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto?.image_url) return;

    setSaving(true);
    try {
      if (editingPhoto.id) {
        const original = photos.find(p => p.id === editingPhoto.id);
        if (original && original.image_url && original.image_url !== editingPhoto.image_url) {
          deleteUploadedImage(original.image_url);
        }
      }
      await saveGalleryPhoto(editingPhoto);
      await loadPhotos();
      setIsModalOpen(false);
      setEditingPhoto(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this photograph from the archive?')) {
      const target = photos.find(p => p.id === id);
      if (target?.image_url) {
        deleteUploadedImage(target.image_url);
      }
      await deleteGalleryPhoto(id);
      await loadPhotos();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest block">
            VISUAL ARCHIVE MANAGER
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white">
            Photo Gallery Manager
          </h1>
        </div>

        <button onClick={handleOpenAddModal} className="btn-editorial-primary">
          <Plus className="w-4 h-4" />
          <span>Upload New Photograph</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-800 rounded-xl bg-[#0e0e12]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by photo caption or album name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-zinc-800 rounded pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setSelectedAlbum('all')}
            className={`px-3 py-1.5 rounded transition-colors ${selectedAlbum === 'all' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            All Albums ({photos.length})
          </button>
          {albums.map(alb => (
            <button
              key={alb}
              onClick={() => setSelectedAlbum(alb)}
              className={`px-3 py-1.5 rounded transition-colors ${selectedAlbum === alb ? 'bg-zinc-800 text-[#d4af37] font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              {alb}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map(photo => (
          <div
            key={photo.id}
            className="border border-zinc-800 rounded-xl overflow-hidden bg-[#0e0e12] flex flex-col justify-between group hover:border-zinc-700 transition-colors"
          >
            <div className="relative aspect-square overflow-hidden bg-[#0a0a0c]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.image_url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#d4af37]">
                {photo.album_name}
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-zinc-300 text-xs line-clamp-2 font-mono">
                {photo.caption}
              </p>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500">Order: #{photo.sort_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(photo)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="p-1 text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-zinc-800 rounded-xl w-full max-w-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="font-serif-heading text-2xl text-white">
                {editingPhoto.id ? 'Edit Photograph' : 'Add New Photograph'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <ImageUploader
                label="Photo Image (Uploads to GitHub Repo)"
                required
                value={editingPhoto.image_url || ''}
                onChange={url => setEditingPhoto({ ...editingPhoto, image_url: url })}
              />

              <div className="space-y-1">
                <label className="text-zinc-400 block">Album Name *</label>
                <input
                  type="text"
                  required
                  value={editingPhoto.album_name || ''}
                  onChange={e => setEditingPhoto({ ...editingPhoto, album_name: e.target.value })}
                  placeholder="e.g. Mega Health Camp / General Archive"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Photo Caption *</label>
                <textarea
                  rows={2}
                  required
                  value={editingPhoto.caption || ''}
                  onChange={e => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  placeholder="Brief description of the photograph..."
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Rotaract Year</label>
                  <input
                    type="text"
                    value={editingPhoto.rotaract_year || '2024-25'}
                    onChange={e => setEditingPhoto({ ...editingPhoto, rotaract_year: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Sort Order</label>
                  <input
                    type="number"
                    value={editingPhoto.sort_order || 1}
                    onChange={e => setEditingPhoto({ ...editingPhoto, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3 font-sans">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-editorial-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-editorial-primary">
                  {saving ? 'Saving...' : 'Save Photograph'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
