'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Heart, 
  Award, 
  Search, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientClient } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    subscribers: 0,
    prizePool: 0,
    charityTotal: 0,
    pendingWinners: 0
  });

  const supabase = createClientClient();

  useEffect(() => {
    async function loadStats() {
      const [subs, draws, winners] = await Promise.all([
        supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('draws').select('prize_pool_total').eq('status', 'draft').maybeSingle(),
        supabase.from('winners').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      setStats({
        subscribers: subs.count || 0,
        prizePool: draws.data?.prize_pool_total || 0,
        charityTotal: (subs.count || 0) * 20 * 0.1, // Mock calc: subs * avg_sub * 10%
        pendingWinners: winners.count || 0
      });
    }
    loadStats();
  }, [supabase]);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Platform Overview</h1>
        <p className="text-white/40">Real-time performance and system health metrics.</p>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Active Subscribers" 
          value={stats.subscribers.toString()} 
          change="+12% this month"
          icon={<Users className="text-emerald-400" />}
        />
        <StatCard 
          label="Est. Prize Pool" 
          value={`£${stats.prizePool.toLocaleString()}`} 
          change="Accumulating"
          icon={<Trophy className="text-amber-400" />}
        />
        <StatCard 
          label="Charity Contrib." 
          value={`£${stats.charityTotal.toLocaleString()}`} 
          change="Net platform impact"
          icon={<Heart className="text-rose-400" />}
        />
        <StatCard 
          label="Pending Winners" 
          value={stats.pendingWinners.toString()} 
          change="Requires verification"
          icon={<Award className="text-cyan-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
          <h2 className="text-xl font-bold mb-8">Admin Quick Actions</h2>
          <div className="space-y-4">
            <ActionButton 
              title="Run New Draw" 
              subtitle="Generate numbers and winners"
              href="/admin/draws"
              variant="emerald"
            />
            <ActionButton 
              title="Review Winners" 
              subtitle={`${stats.pendingWinners} claims awaiting proof`}
              href="/admin/winners"
              variant="amber"
            />
            <ActionButton 
              title="Manage Charities" 
              subtitle="Add or edit platform partners"
              href="/admin/charities"
              variant="white"
            />
          </div>
        </div>

        {/* System Activity */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">System Activity</h2>
            <Button variant="ghost" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest">
              Live Feed
            </Button>
          </div>
          <div className="space-y-6">
            <ActivityRow 
              user="Michael J." 
              action="subscribed to Monthly Hero" 
              time="2 minutes ago" 
              icon={<Users size={14} className="text-emerald-500" />}
            />
            <ActivityRow 
              user="Sarah K." 
              action="submitted a new score (74)" 
              time="14 minutes ago" 
              icon={<TrendingUp size={14} className="text-cyan-500" />}
            />
            <ActivityRow 
              user="System" 
              action="processed recurring Stripe payments" 
              time="1 hour ago" 
              icon={<Clock size={14} className="text-white/20" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon }: any) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          {icon}
        </div>
        <ArrowUpRight className="text-white/20" size={18} />
      </div>
      <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-1">{label}</p>
      <h3 className="text-3xl font-black mb-1 tracking-tighter">{value}</h3>
      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">{change}</p>
    </div>
  );
}

function ActionButton({ title, subtitle, href, variant }: any) {
  const colors: any = {
    emerald: 'bg-emerald-500 text-black hover:bg-emerald-400',
    amber: 'bg-amber-500 text-black hover:bg-amber-400',
    white: 'bg-white text-black hover:bg-white/90'
  };

  return (
    <Link href={href} className="block w-full group">
      <div className={`p-6 rounded-2xl flex items-center justify-between transition-all ${colors[variant]}`}>
        <div>
          <h4 className="font-black text-sm uppercase tracking-wide">{title}</h4>
          <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
        <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
      </div>
    </Link>
  );
}

function ActivityRow({ user, action, time, icon }: any) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-bold text-white">{user}</span>{' '}
          <span className="text-white/40">{action}</span>
        </p>
      </div>
      <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{time}</span>
    </div>
  );
}
