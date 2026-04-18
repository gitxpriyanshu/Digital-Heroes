'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Award, 
  Heart, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientClient } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Suspense } from 'react';

// Create a sub-component that uses useSearchParams
function DashboardContent() {
  const [data, setData] = useState<DashboardOverviewData>({
    subscription: null,
    scores: [],
    winnings: [],
    charity: null
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('subscribed') === 'true') {
      toast.success('Subscription active! Welcome to the community. Please select your charity below.');
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [sub, scores, wins, charity] = await Promise.all([
        supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('scores').select('*').eq('user_id', user.id).order('score_date', { ascending: false }),
        supabase.from('winners').select('*').eq('user_id', user.id),
        supabase.from('charity_selections').select('*, charities(*)').eq('user_id', user.id).maybeSingle()
      ]);

      setData({
        subscription: sub.data,
        scores: scores.data || [],
        winnings: wins.data || [],
        charity: charity.data
      });
      setLoading(false);
    }
    loadDashboardData();
  }, [supabase]);

  const totalWon = data.winnings.reduce((acc, win) => acc + Number(win.prize_amount), 0);
  const pendingVerification = data.winnings.filter((w) => w.status === 'pending').length;

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-10 uppercase-tracking">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Impact Overview</h1>
        <p className="text-white/40">You're making a difference. Here's your hero report.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Card */}
        <StatCard 
          title="Subscription"
          value={data.subscription?.status === 'active' ? (data.subscription.plan === 'yearly' ? 'Yearly Legend' : 'Monthly Hero') : 'No Active Plan'}
          subtext={data.subscription?.status === 'active' ? `Renews ${new Date(data.subscription.current_period_end).toLocaleDateString()}` : 'Subscribe to start your impact'}
          icon={<CreditCard className={data.subscription?.status === 'active' ? "text-emerald-400" : "text-white/40"} />}
          action={
            <Link href="/subscribe">
              <Button variant={data.subscription?.status === 'active' ? "ghost" : "default"} className={data.subscription?.status === 'active' ? "h-8 px-3 text-xs font-bold border border-white/10 rounded-lg" : "h-8 px-4 text-xs font-bold bg-emerald-500 text-black rounded-lg hover:bg-emerald-400"}>
                {data.subscription?.status === 'active' ? 'Manage' : 'Subscribe Now'}
              </Button>
            </Link>
          }
        />

        {/* Score Progress */}
        <StatCard 
          title="Scores Entered"
          value={`${data.scores.length}/5`}
          subtext={data.scores.length === 5 ? 'Eligible for next draw' : `${5 - data.scores.length} more needed for entry`}
          icon={<Target className="text-cyan-400" />}
          action={<Link href="/dashboard/scores"><Button variant="ghost" className="h-8 px-3 text-xs font-bold border border-white/10 rounded-lg">Add Score</Button></Link>}
        />

        {/* Winnings */}
        <StatCard 
          title="Total Winnings"
          value={`£${totalWon.toFixed(2)}`}
          subtext={pendingVerification > 0 ? `${pendingVerification} pending verification` : 'Verified & Paid'}
          icon={<Trophy className="text-amber-400" />}
          action={<Link href="/dashboard/draws"><Button variant="ghost" className="h-8 px-3 text-xs font-bold border border-white/10 rounded-lg">View History</Button></Link>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Charity Spotlight */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Heart size={120} />
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-6">Supporting Partner</p>
          {data.charity ? (
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 p-3 border border-white/5 shrink-0">
                <img src={data.charity.charities.logo_url} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{data.charity.charities.name}</h3>
                <p className="text-white/40 text-sm mb-4">You're contributing {data.charity.contribution_percentage}% of your net sub.</p>
                <Link href="/dashboard/charity" className="text-emerald-400 text-xs font-bold flex items-center gap-1 hover:text-emerald-300 transition-colors">
                  Change Partner <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/40 mb-4 font-medium">No charity selected yet.</p>
              <Button asChild className="bg-emerald-500 text-black font-bold rounded-xl">
                <Link href="/dashboard/charity">Select a Charity</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Upcoming Draw */}
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
          <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Next Monthly Draw
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/40 text-xs font-medium uppercase mb-1">Estimated Pool</p>
              <div className="text-5xl font-black tracking-tighter">£5,820</div>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs font-medium uppercase mb-1">Draw Date</p>
              <p className="text-lg font-bold">May 31, 2026</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-sm">
            <span className="text-white/40">Status</span>
            <span className={data.scores.length === 5 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {data.scores.length === 5 ? 'Entered • Good Luck!' : 'Incomplete Entries'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component with Suspense
export default function DashboardOverview() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactElement;
  action?: React.ReactNode;
}

function StatCard({ title, value, subtext, icon, action }: StatCardProps) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
          {React.cloneElement(icon, { size: 20 })}
        </div>
        {action}
      </div>
      <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-1">{title}</p>
      <h3 className="text-2xl font-black mb-1">{value}</h3>
      <p className="text-xs text-white/20 font-medium">{subtext}</p>
    </div>
  );
}
