'use client';

import { useState, useEffect } from 'react';
import { getAllBoardMembers, saveBoardMember, deleteBoardMember, BoardMember } from '@/lib/data/api';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Edit2, Trash2, Users, Check, X } from 'lucide-react';

export default function AdminTeamPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<BoardMember>>({});
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    const data = await getAllBoardMembers();
    setMembers(data);
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenCreate = () => {
    setEditingMember({
      name: '',
      role: 'Board Director',
      rotaract_year: '2024-25',
      bio: '',
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      sort_order: members.length + 1,
      social_links: { instagram: '', linkedin: '', email: '' }
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: BoardMember) => {
    setEditingMember(m);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember.name) return;

    await saveBoardMember(editingMember);
    setIsModalOpen(false);
    showToast('Board member saved!');
    loadMembers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete board member?')) {
      await deleteBoardMember(id);
      showToast('Member removed!');
      loadMembers();
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
            Team & Leadership Manager
          </h1>
          <p className="text-zinc-400 text-xs">
            Manage Board of Directors for current and past Rotaract years.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f3e5ab] transition-colors flex items-center gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Board Member</span>
        </button>
      </div>

      <div className="bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#18181c] border-b border-white/10 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Member Name</th>
                <th className="p-4">Role / Designation</th>
                <th className="p-4">Rotaract Year</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image_url} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                    <span>{m.name}</span>
                  </td>
                  <td className="p-4 text-[#d4af37] font-semibold">{m.role}</td>
                  <td className="p-4">{m.rotaract_year}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121215] border border-[#d4af37]/40 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif-heading font-bold text-white text-xl">
                {editingMember.id ? 'Edit Board Member' : 'Add Board Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase">Member Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ''}
                  onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="e.g. Rtr. Yash Sarawgi"
                  className="w-full px-4 py-2 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Role / Position</label>
                  <input
                    type="text"
                    value={editingMember.role || ''}
                    onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                    placeholder="e.g. President (45th Year)"
                    className="w-full px-4 py-2 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Rotaract Year</label>
                  <input
                    type="text"
                    value={editingMember.rotaract_year || '2024-25'}
                    onChange={e => setEditingMember({ ...editingMember, rotaract_year: e.target.value })}
                    placeholder="2024-25"
                    className="w-full px-4 py-2 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Photo Image (Uploads to GitHub Repo)"
                value={editingMember.image_url || ''}
                onChange={url => setEditingMember({ ...editingMember, image_url: url })}
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase">Short Bio</label>
                <textarea
                  rows={2}
                  value={editingMember.bio || ''}
                  onChange={e => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Brief 1-2 sentence bio..."
                  className="w-full px-4 py-2 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:border-[#d4af37]"
                />
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
                  Save Board Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
