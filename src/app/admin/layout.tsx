'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Users,
  Inbox,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNav = [
  { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Event Manager', href: '/admin/events', icon: Calendar },
  { name: 'Thrust Initiatives', href: '/admin/initiatives', icon: Sparkles },
  { name: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Editorials & Bulletins', href: '/admin/editorials', icon: FileText },
  { name: 'Leadership & Board', href: '/admin/team', icon: Users },
  { name: 'Member Applications', href: '/admin/applications', icon: Inbox }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;

    const checkAuth = async () => {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && localStorage.getItem('racnm_admin_logged') !== 'true') {
          router.push('/admin/login');
          return;
        }
      } else {
        const isLogged = typeof window !== 'undefined' && localStorage.getItem('racnm_admin_logged') === 'true';
        if (!isLogged) {
          router.push('/admin/login');
          return;
        }
      }

      setAuthorized(true);
    };

    checkAuth();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-zinc-400 text-xs font-mono space-y-2">
        <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        <span>Authenticating Admin Session...</span>
      </div>
    );
  }

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('racnm_admin_logged');
    }
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#fcfbf9] flex font-sans-body">
      
      {/* Desktop Administrative Sidebar */}
      <aside className="hidden lg:flex w-72 bg-[#0e0e12] border-r border-zinc-800 flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          
          {/* Header Mark */}
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
            <div className="w-10 h-10 rounded-lg bg-[#0a0a0c] border border-zinc-700 p-1 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/RCNM.png"
                alt="RCNM Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif-heading text-lg font-normal text-white block leading-tight">
                RACNM Suite
              </span>
              <span className="text-[10px] font-mono text-[#d4af37] tracking-wider uppercase block">
                ADMINISTRATIVE CMS
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {adminNav.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-mono tracking-wider transition-colors',
                    isActive
                      ? 'bg-zinc-800 text-white font-bold border-l-2 border-[#d4af37]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                  )}
                >
                  <Icon className="w-4 h-4 text-[#d4af37]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-zinc-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition-colors border border-zinc-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Preview Live Site</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-mono text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-[#0e0e12] border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <span className="font-serif-heading text-white text-base">RACNM Admin CMS</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-[#0e0e12] border-b border-zinc-800 p-6 space-y-4">
            <nav className="space-y-1">
              {adminNav.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono',
                      isActive ? 'bg-zinc-800 text-[#d4af37] font-bold' : 'text-zinc-300 hover:bg-zinc-800/40'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <Link href="/" target="_blank" className="text-[#d4af37]">
                Live Public Site →
              </Link>
              <button onClick={handleLogout} className="text-red-400">
                Sign Out
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
