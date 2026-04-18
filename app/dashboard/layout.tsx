'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  Award, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Trophy
} from 'lucide-react';
import { createClientClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [subStatus, setSubStatus] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClientClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      setSubStatus(sub);
    }
    loadData();
  }, [supabase]);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard /> },
    { name: 'My Scores', href: '/dashboard/scores', icon: <Target /> },
    { name: 'Draws', href: '/dashboard/draws', icon: <Award /> },
    { name: 'Charity', href: '/dashboard/charity', icon: <Heart /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 border-r border-white/5 bg-black/50 backdrop-blur-3xl z-40">
        <div className="p-8 pb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="text-black w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tight">Digital Heroes</span>
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
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-white/30 hover:text-white hover:bg-white/5'
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

        {/* Subscription Status Badge */}
        <div className="p-6 m-4 rounded-[2rem] bg-white/[0.03] border border-white/10">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-3">Status</p>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${subStatus?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-white/10'}`} />
            <span className="font-bold text-sm capitalize">{subStatus?.status || 'No Subscription'}</span>
          </div>
          {subStatus?.current_period_end && (
            <p className="text-[10px] text-white/20 mt-2 font-medium">
              Renews: {new Date(subStatus.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 overflow-hidden border border-white/10">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black font-black uppercase">
                {user?.email?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.user_metadata?.full_name || 'Hero'}</p>
            <p className="text-xs text-white/30 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
            className="text-white/20 hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden h-20 border-b border-white/5 bg-black/50 backdrop-blur-3xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Trophy className="text-black w-4 h-4" />
          </div>
          <span className="font-black tracking-tight">Digital Heroes</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white/60">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="md:hidden fixed inset-0 bg-black z-40 pt-24 px-8"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-6 py-4 text-xl font-bold"
                >
                  {item.icon} {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-72 min-h-screen">
        <div className="p-6 md:p-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around h-20 px-4 z-50">
        {navItems.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`p-3 rounded-xl ${active ? 'text-emerald-400 bg-white/5' : 'text-white/20'}`}>
              {React.cloneElement(item.icon as React.ReactElement, { className: 'w-6 h-6' })}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// Minimal implementation of AnimatePresence for layout
function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
