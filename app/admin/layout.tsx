'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Heart, 
  Award, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <BarChart3 /> },
    { name: 'Users', href: '/admin/users', icon: <Users /> },
    { name: 'Draws', href: '/admin/draws', icon: <Award /> },
    { name: 'Charities', href: '/admin/charities', icon: <Heart /> },
    { name: 'Winners', href: '/admin/winners', icon: <Trophy /> },
    { name: 'Reports', href: '/admin/reports', icon: <BarChart3 /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Admin Sidebar */}
      <aside className="w-72 h-screen sticky top-0 border-r border-white/5 bg-black z-40 flex flex-col pt-10">
        <div className="px-8 mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="text-black w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight block">Admin Panel</span>
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Digital Heroes</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
                  active 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                    : 'text-white/20 hover:text-white hover:bg-white/5'
                }`}
              >
                {React.cloneElement(item.icon as React.ReactElement, { 
                  className: `w-5 h-5 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}` 
                })}
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
                {active && <ChevronRight className="ml-auto w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
          <Button variant="ghost" className="w-full justify-start gap-4 text-white/40 hover:text-rose-500 hover:bg-white/5 p-4 rounded-xl">
            <LogOut size={20} />
            <span className="font-bold text-sm">Return to Site</span>
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen">
        <header className="h-20 border-b border-white/5 bg-black/30 backdrop-blur-xl flex items-center justify-between px-12 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30 font-bold uppercase tracking-widest">System Status</span>
            <span className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Operational
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-[10px] text-emerald-500 uppercase font-black">Super Administrator</p>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
