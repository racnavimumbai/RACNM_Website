'use client';

import { useState, useEffect } from 'react';
import { getInitiatives, saveInitiative, deleteInitiative, Initiative } from '@/lib/data/api';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { deleteUploadedImage } from '@/lib/utils';

export default function AdminInitiativesPage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Initiative>>({});
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadInitiatives();
  }, []);

  async function loadInitiatives() {
    const data = await getInitiatives();
    setInitiatives(data);
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenCreate = () => {
    setEditingItem({
      title: '',
      category: 'Education',
      summary: '',
      description: '',
      cover_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
      is_featured: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Initiative) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.title) return;

    if (editingItem.id) {
      const original = initiatives.find(i => i.id === editingItem.id);
      if (original && original.cover_image && original.cover_image !== editingItem.cover_image) {
        deleteUploadedImage(original.cover_image);
      }
    }
    await saveInitiative(editingItem);
    setIsModalOpen(false);
    showToast('Initiative saved!');
    loadInitiatives();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this initiative?')) {
      const target = initiatives.find(i => i.id === id);
      if (target?.cover_image) {
        deleteUploadedImage(target.cover_image);
      }
      await deleteInitiative(id);
      showToast('Initiative deleted!');
      loadInitiatives();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-3xl font-bold text-white">
            Initiatives Manager
          </h1>
          <p className="text-zinc-400 text-xs">
            Manage your flagship thrust areas (Education, Environment, Leadership Growth, etc.).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f3e5ab] transition-colors flex items-center gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Initiative</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initiatives.map((item) => (
          <div key={item.id} className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold">
                {item.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-heading text-xl font-bold text-white">{item.title}</h3>
              <p className="text-zinc-400 text-xs line-clamp-3">{item.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121215] border border-[#d4af37]/40 rounded-3xl w-full max-w-xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif-heading font-bold text-white text-xl">
                {editingItem.id ? 'Edit Initiative' : 'Create Initiative'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase">Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Project Literacy Catalyst"
                  className="w-full px-4 py-2 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase block">Thrust Category (Set Any Custom Category)</label>
                <input
                  type="text"
                  list="category-suggestions"
                  value={editingItem.category || ''}
                  onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                  placeholder="e.g. Education, Environment, Youth Empowerment, Sports..."
                  className="w-full px-4 py-2 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:border-[#d4af37]"
                />
                <datalist id="category-suggestions">
                  <option value="Education" />
                  <option value="Environment" />
                  <option value="Leadership Growth" />
                  <option value="Community Service" />
                  <option value="International Service" />
                  <option value="Youth Empowerment" />
                  <option value="Sports & Culture" />
                  <option value="Vocational Development" />
                  <option value="Health & Sanitation" />
                </datalist>

                {/* Quick Suggestion Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-zinc-500 font-mono">Quick Pick:</span>
                  {['Education', 'Environment', 'Leadership Growth', 'Community Service', 'International Service', 'Youth Empowerment'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, category: cat })}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                        editingItem.category === cat
                          ? 'bg-[#d4af37] text-black border-[#d4af37]'
                          : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <ImageUploader
                label="Cover Image (Uploads to GitHub Repo)"
                value={editingItem.cover_image || ''}
                onChange={url => setEditingItem({ ...editingItem, cover_image: url })}
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase">Summary</label>
                <input
                  type="text"
                  value={editingItem.summary || ''}
                  onChange={e => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="Short tagline summary"
                  className="w-full px-4 py-2 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Detailed initiative description..."
                  className="w-full px-4 py-2 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:border-[#d4af37]"
                />
                <span className="text-[10px] text-zinc-500 block">
                  Supports Markdown formatting (<strong className="text-zinc-400">**bold**</strong>, <em className="text-zinc-400">*italics*</em>, # Headings, - lists, [links](url))
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f3e5ab]"
                >
                  Save Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
