'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, History, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClientClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface DashboardWinner {
  id: string;
  draw_id: string;
  match_type: string;
  prize_amount: number;
  status: 'pending' | 'verified' | 'paid' | 'rejected';
  draws: {
    draw_month: string;
  };
}

interface DashboardData {
  winners: DashboardWinner[];
  myNumbers: number[];
  currentDraw: {
    draw_month: string;
    prize_pool_total: number;
  } | null;
}

export default function DrawsDashboard() {
  const [data, setData] = useState<DashboardData>({
    winners: [],
    myNumbers: [],
    currentDraw: null,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientClient();

  useEffect(() => {
    async function loadDrawData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [winners, scores, draws] = await Promise.all([
        supabase.from('winners').select('*, draws(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('scores').select('score').eq('user_id', user.id).order('score_date', { ascending: false }).limit(5),
        supabase.from('draws').select('*').eq('status', 'draft').order('draw_month', { ascending: true }).maybeSingle()
      ]);

      setData({
        winners: winners.data || [],
        myNumbers: scores.data?.map(s => s.score) || [],
        currentDraw: draws.data
      });
      setLoading(false);
    }
    loadDrawData();
  }, [supabase]);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Rewards & Draws</h1>
        <p className="text-white/40">Check your entries, results, and claim your winnings.</p>
      </header>

      {/* Current Participation */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-black mb-2">My Entry</p>
              <h2 className="text-2xl font-bold">Next Draw Numbers</h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              Live Entry
            </div>
          </div>

          <div className="flex gap-4 mb-10">
            {data.myNumbers.length > 0 ? (
              data.myNumbers.map((num: number, i: number) => (
                <div key={i} className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl font-black">
                  {num}
                </div>
              ))
            ) : (
              <div className="text-white/20 italic text-sm">No scores entered yet.</div>
            )}
            {data.myNumbers.length < 5 && data.myNumbers.length > 0 && (
              Array.from({ length: 5 - data.myNumbers.length }).map((_, i) => (
                <div key={i} className="w-14 h-14 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex items-center justify-center opacity-30">
                  ?
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-white/30">
            <Clock size={14} />
            <span>Updated automatically when you log new scores.</span>
          </div>
        </div>

        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 to-transparent border border-white/5">
          <div className="mb-10">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-2">Draw Statistics</p>
            <h2 className="text-2xl font-bold">Historical Participation</h2>
          </div>
          <div className="space-y-6">
            <StatRow label="Draws Entered" value={data.winners.length + 0 /* Mock count */} />
            <StatRow label="Times Won" value={data.winners.length} />
            <StatRow label="Win Rate" value={`${data.winners.length > 0 ? (data.winners.length / 1 * 100) : 0}%`} />
          </div>
        </div>
      </section>

      {/* Winnings Table */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-amber-400 w-6 h-6" />
          <h2 className="text-2xl font-bold">Winnings History</h2>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-left">
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Draw Date</th>
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Match Type</th>
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Amount</th>
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Status</th>
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.winners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-white/20">
                    No winnings recorded yet. Your rounds enter you into next month's draw.
                  </td>
                </tr>
              ) : (
                data.winners.map((win) => (
                  <tr key={win.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6 font-bold">{new Date(win.draws.draw_month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold">
                        {win.match_type} Match
                      </span>
                    </td>
                    <td className="px-8 py-6 text-emerald-400 font-black">£{win.prize_amount.toFixed(2)}</td>
                    <td className="px-8 py-6 text-sm">
                      <div className="flex items-center gap-2">
                        {win.status === 'paid' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                        <span className="capitalize">{win.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {win.status === 'pending' && (
                        <Button variant="ghost" className="h-9 px-4 text-xs font-bold border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
                          Verify Proof
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-white/40 text-sm">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
