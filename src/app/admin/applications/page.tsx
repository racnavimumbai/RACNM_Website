'use client';

import { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus, JoinApplication } from '@/lib/data/api';
import { Inbox, Mail, Phone, User, Search, CheckCircle, XCircle, Clock, Eye, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'accepted' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<JoinApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    const list = await getApplications();
    setApplications(list);
  }

  const filteredApps = applications.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: JoinApplication['status']) => {
    await updateApplicationStatus(id, newStatus);
    await loadApplications();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="border-b border-zinc-800 pb-6">
        <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest block">
          MEMBERSHIP PROSPECTUS INBOX
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white">
          Member Applications Inbox
        </h1>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-800 rounded-xl bg-[#0e0e12]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-zinc-800 rounded pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors ${statusFilter === 'all' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded transition-colors ${statusFilter === 'pending' ? 'bg-zinc-800 text-[#d4af37] font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Pending ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-3 py-1.5 rounded transition-colors ${statusFilter === 'contacted' ? 'bg-zinc-800 text-sky-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Contacted ({applications.filter(a => a.status === 'contacted').length})
          </button>
          <button
            onClick={() => setStatusFilter('accepted')}
            className={`px-3 py-1.5 rounded transition-colors ${statusFilter === 'accepted' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Accepted ({applications.filter(a => a.status === 'accepted').length})
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#0e0e12]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 font-mono text-[11px] text-zinc-400 uppercase tracking-wider bg-[#0a0a0c]">
                <th className="p-4">Applicant Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Occupation / College</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors">
                  
                  <td className="p-4">
                    <span className="font-serif-heading text-lg font-normal text-white block">
                      {app.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 line-clamp-1 max-w-xs">
                      {app.reason}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-zinc-300 space-y-0.5">
                    <span className="block flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                      <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                    </span>
                    <span className="block flex items-center gap-1.5 text-zinc-500">
                      <Phone className="w-3.5 h-3.5" />
                      <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
                    </span>
                  </td>

                  <td className="p-4 font-mono text-zinc-400">
                    {app.occupation || '—'}
                  </td>

                  <td className="p-4 font-mono text-zinc-500 text-[11px]">
                    {formatDate(app.created_at)}
                  </td>

                  <td className="p-4 font-mono">
                    <select
                      value={app.status}
                      onChange={e => handleStatusChange(app.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0a0a0c] border ${
                        app.status === 'pending' ? 'text-[#d4af37] border-[#d4af37]/40' :
                        app.status === 'contacted' ? 'text-sky-400 border-sky-800' :
                        app.status === 'accepted' ? 'text-emerald-400 border-emerald-800' :
                        'text-red-400 border-red-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 inline-flex items-center gap-1 font-mono text-xs"
                    >
                      <Eye className="w-4 h-4 text-[#d4af37]" />
                      <span>View Detail</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-zinc-800 rounded-xl w-full max-w-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest">
                  MEMBERSHIP APPLICATION DETAIL
                </span>
                <h2 className="font-serif-heading text-2xl text-white">
                  {selectedApp.name}
                </h2>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-zinc-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0a0c] p-3 rounded border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Email Address</span>
                  <a href={`mailto:${selectedApp.email}`} className="text-white hover:underline block">{selectedApp.email}</a>
                </div>
                <div className="bg-[#0a0a0c] p-3 rounded border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Phone Number</span>
                  <a href={`tel:${selectedApp.phone}`} className="text-white hover:underline block">{selectedApp.phone}</a>
                </div>
              </div>

              <div className="bg-[#0a0a0c] p-3 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Occupation / Institution</span>
                <span className="text-white block">{selectedApp.occupation || 'Not specified'}</span>
              </div>

              <div className="bg-[#0a0a0c] p-3 rounded border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Reason / Interest Statement</span>
                <p className="text-zinc-200 leading-relaxed font-sans text-sm">
                  {selectedApp.reason || 'No statement provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-zinc-500 text-[10px]">Submitted: {formatDate(selectedApp.created_at)}</span>
                <select
                  value={selectedApp.status}
                  onChange={e => handleStatusChange(selectedApp.id, e.target.value as any)}
                  className="bg-[#0a0a0c] border border-zinc-800 rounded px-3 py-1.5 text-xs text-white"
                >
                  <option value="pending">Mark as Pending</option>
                  <option value="contacted">Mark as Contacted</option>
                  <option value="accepted">Mark as Accepted</option>
                  <option value="rejected">Mark as Rejected</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button onClick={() => setSelectedApp(null)} className="btn-editorial-secondary">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
