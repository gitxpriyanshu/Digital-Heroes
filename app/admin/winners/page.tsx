'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  FileCheck, 
  Eye, 
  Loader2,
  X,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientClient } from '@/lib/supabase';

interface UserProfile {
  full_name: string;
  email: string;
}

interface DrawCycle {
  draw_month: string;
}

interface Winner {
  id: string;
  user_id: string;
  prize_amount: number;
  match_type: string;
  status: 'pending' | 'verified' | 'paid' | 'rejected';
  proof_url: string | null;
  users: UserProfile;
  draws: DrawCycle;
  created_at: string;
}

export default function AdminWinners() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWin, setSelectedWin] = useState<Winner | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const supabase = createClientClient();

  useEffect(() => {
    async function fetchWinners() {
      const { data } = await supabase
        .from('winners')
        .select('*, users(full_name, email), draws(draw_month)')
        .order('created_at', { ascending: false });
      if (data) setWinners(data);
      setLoading(false);
    }
    fetchWinners();
  }, [supabase]);

  const updateStatus = async (id: string, status: 'verified' | 'paid' | 'rejected') => {
    setProcessing(id);
    try {
      const { error } = await supabase.from('winners').update({ status }).eq('id', id);
      if (!error) {
        setWinners(prev => prev.map(w => w.id === id ? { ...w, status } : w));
        if (selectedWin?.id === id) setSelectedWin({ ...selectedWin, status });
      }
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Winner Verification</h1>
        <p className="text-white/40">Review claims, verify proof of play, and manage payouts.</p>
      </header>

      <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Winner</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Draw Cycle</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Match / Prize</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Proof</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Status</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {winners.map((win) => (
              <tr key={win.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold">{win.users.full_name}</p>
                  <p className="text-xs text-white/30">{win.users.email}</p>
                </td>
                <td className="px-8 py-6 text-sm">
                  {new Date(win.draws.draw_month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-emerald-400">£{win.prize_amount.toFixed(2)}</span>
                    <span className="text-[10px] text-white/40 font-bold uppercase">({win.match_type} Match)</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {win.proof_url ? (
                    <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                      <FileCheck size={14} /> Submitted
                    </span>
                  ) : (
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Awaiting...</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <StatusBadge status={win.status} />
                </td>
                <td className="px-8 py-6 text-right">
                  <Button 
                    onClick={() => setSelectedWin(win)}
                    variant="ghost" 
                    className="h-10 px-6 rounded-xl border border-white/5 hover:border-emerald-500/30 font-bold text-xs flex gap-2"
                  >
                    <Eye size={14} /> Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Side Overlay */}
      <AnimatePresence>
        {selectedWin && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedWin(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-[600px] bg-black border-l border-white/5 z-50 p-12 overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedWin(null)}
                className="absolute top-10 right-10 text-white/20 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="mb-12">
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2">Claim ID: {selectedWin.id.slice(0,8)}</p>
                <h2 className="text-4xl font-black tracking-tighter">Review Claim</h2>
              </div>

              <div className="space-y-12">
                <section className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10">
                  <h3 className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-6">Winner Details</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs text-white/20 mb-1">Full Name</p>
                      <p className="font-bold">{selectedWin.users.full_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/20 mb-1">Prize Unlocked</p>
                      <p className="font-black text-2xl text-emerald-400">£{selectedWin.prize_amount.toFixed(2)}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-6">Verification Proof</h3>
                  {selectedWin.proof_url ? (
                    <div className="rounded-[2.5rem] overflow-hidden border border-white/10 group relative">
                      <img src={selectedWin.proof_url} alt="Proof" className="w-full h-auto" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button asChild className="bg-white text-black font-bold rounded-xl">
                          <a href={selectedWin.proof_url} target="_blank" rel="noreferrer">Open Full Image</a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20">
                      <AlertCircle size={40} className="mb-4" />
                      <p className="font-bold">No proof submitted yet</p>
                    </div>
                  )}
                </section>

                <div className="pt-10 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => updateStatus(selectedWin.id, 'verified')}
                      disabled={selectedWin.status !== 'pending' || processing === selectedWin.id}
                      className="flex-1 h-16 bg-emerald-500 text-black font-bold rounded-2xl text-lg shadow-xl shadow-emerald-500/20"
                    >
                      {processing === selectedWin.id ? <Loader2 className="animate-spin" /> : 'Approve Claim'}
                    </Button>
                    <Button 
                      onClick={() => updateStatus(selectedWin.id, 'rejected')}
                      disabled={selectedWin.status !== 'pending' || processing === selectedWin.id}
                      variant="ghost" className="h-16 border border-rose-500/20 text-rose-500 font-bold px-8 rounded-2xl"
                    >
                      Reject
                    </Button>
                  </div>
                  
                  {selectedWin.status === 'verified' && (
                    <Button 
                      onClick={() => updateStatus(selectedWin.id, 'paid')}
                      disabled={processing === selectedWin.id}
                      className="h-16 bg-white text-black font-bold rounded-2xl text-lg flex gap-3"
                    >
                      <CreditCard size={20} /> Mark as Paid (Manual)
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: Winner['status'] }) {
  const configs: Record<Winner['status'], string> = {
    pending: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
    verified: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500',
    paid: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    rejected: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${configs[status]}`}>
      {status}
    </span>
  );
}
