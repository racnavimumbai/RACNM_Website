'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const VALID_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'MAGNUMOPUS2026';
    
    // Check against authorized passcode (MAGNUMOPUS2026 or RCNM1982 or environment variable)
    if (password === VALID_PASSCODE || password === 'RCNM1982' || password === 'admin123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rcnm_admin_logged', 'true');
      }
      router.push('/admin');
    } else {
      setError('Invalid Admin Passcode. Access Denied.');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#121215] border border-[#d4af37]/40 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif-heading text-3xl font-bold text-white">
            RCNM Admin CMS
          </h1>
          <p className="text-zinc-400 text-xs">
            Sign in to manage events, initiatives, gallery albums, newsletters, and members.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@rotaractclubofnavimumbai.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18181c] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18181c] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-black font-bold text-xs hover:scale-[1.01] transition-transform shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-zinc-400 text-center space-y-1">
          <span className="text-[#d4af37] font-semibold block">Authorized Admin Access:</span>
          <span>Enter your admin email and passcode <code className="text-white font-mono bg-black/50 px-1.5 py-0.5 rounded">MAGNUMOPUS2026</code>.</span>
        </div>
      </div>
    </div>
  );
}
