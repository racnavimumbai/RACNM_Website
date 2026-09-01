'use client';

import { useState, useEffect } from 'react';
import { getEditorials, saveEditorial, deleteEditorial, Editorial } from '@/lib/data/api';
import { FileText, Plus, Edit, Trash2, Search, X, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminEditorialsPage() {
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEditorial, setEditingEditorial] = useState<Partial<Editorial> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEditorials();
  }, []);

  async function loadEditorials() {
    const list = await getEditorials();
    setEditorials(list);
  }

  const filteredEditorials = editorials.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingEditorial({
      title: '',
      slug: '',
      author: 'Editorial Board',
      category: 'Monthly Newsletter',
      pdf_url: '',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
      summary: '',
      content: '',
      status: 'published',
      published_at: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (editorial: Editorial) => {
    setEditingEditorial({ ...editorial });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEditorial?.title) return;

    setSaving(true);
    try {
      await saveEditorial(editingEditorial);
      await loadEditorials();
      setIsModalOpen(false);
      setEditingEditorial(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this editorial publication?')) {
      await deleteEditorial(id);
      await loadEditorials();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest block">
            PUBLICATION SUITE
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white">
            Editorial & Newsletter Publisher
          </h1>
        </div>

        <button onClick={handleOpenAddModal} className="btn-editorial-primary">
          <Plus className="w-4 h-4" />
          <span>Publish New Bulletin</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-xl bg-[#0e0e12]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by article title or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-zinc-800 rounded pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* List */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#0e0e12]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 font-mono text-[11px] text-zinc-400 uppercase tracking-wider bg-[#0a0a0c]">
                <th className="p-4">Publication Title & Cover</th>
                <th className="p-4">Author & Category</th>
                <th className="p-4">PDF Link Status</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {filteredEditorials.map(ed => (
                <tr key={ed.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden border border-zinc-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ed.cover_image} alt={ed.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-serif-heading text-base text-white block">{ed.title}</span>
                        <span className="text-[10px] font-mono text-zinc-500 block">/{ed.slug}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-zinc-300">
                    <span className="block text-white font-bold">{ed.author}</span>
                    <span className="text-[10px] text-[#d4af37] block">{ed.category}</span>
                  </td>

                  <td className="p-4 font-mono">
                    {ed.pdf_url ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px]">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>PDF Ready</span>
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  <td className="p-4 font-mono text-zinc-400 text-[11px]">
                    {formatDate(ed.published_at)}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEditModal(ed)} className="p-1.5 text-zinc-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ed.id)} className="p-1.5 text-zinc-400 hover:text-red-400">
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

      {/* Modal */}
      {isModalOpen && editingEditorial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="font-serif-heading text-2xl text-white">
                {editingEditorial.id ? 'Edit Editorial Article' : 'Publish New Editorial Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400 block">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingEditorial.title || ''}
                  onChange={e => setEditingEditorial({ ...editingEditorial, title: e.target.value })}
                  placeholder="e.g. MAGNUM OPUS July Edition"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Author *</label>
                  <input
                    type="text"
                    required
                    value={editingEditorial.author || ''}
                    onChange={e => setEditingEditorial({ ...editingEditorial, author: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Category</label>
                  <input
                    type="text"
                    value={editingEditorial.category || 'Monthly Newsletter'}
                    onChange={e => setEditingEditorial({ ...editingEditorial, category: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">PDF Document URL (Optional for PDF Viewer Modal)</label>
                <input
                  type="url"
                  value={editingEditorial.pdf_url || ''}
                  onChange={e => setEditingEditorial({ ...editingEditorial, pdf_url: e.target.value })}
                  placeholder="https://example.com/newsletter.pdf"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingEditorial.cover_image || ''}
                  onChange={e => setEditingEditorial({ ...editingEditorial, cover_image: e.target.value })}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                />
                {editingEditorial.cover_image && (
                  <div className="mt-2 h-28 rounded overflow-hidden border border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editingEditorial.cover_image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Article Summary</label>
                <textarea
                  rows={2}
                  value={editingEditorial.summary || ''}
                  onChange={e => setEditingEditorial({ ...editingEditorial, summary: e.target.value })}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Full Article Content</label>
                <textarea
                  rows={4}
                  value={editingEditorial.content || ''}
                  onChange={e => setEditingEditorial({ ...editingEditorial, content: e.target.value })}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3 font-sans">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-editorial-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-editorial-primary">
                  {saving ? 'Publishing...' : 'Save & Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
