'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Play, 
  Send, 
  RefreshCw, 
  Trophy, 
  Settings2, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Cpu,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClientClient } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminDraws() {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);

  // New Draw Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newDraw, setNewDraw] = useState({
    draw_month: '',
    draw_logic: 'random' as 'random' | 'algorithmic',
    prize_pool_total: '',
  });

  const supabase = createClientClient();

  const fetchDraws = async () => {
    const { data } = await supabase.from('draws').select('*').order('draw_month', { ascending: false });
    if (data) setDraws(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDraws();
  }, [supabase]);

  const handleCreateDraw = async () => {
    if (!newDraw.draw_month || !newDraw.prize_pool_total) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const poolNum = parseFloat(newDraw.prize_pool_total);
    if (isNaN(poolNum) || poolNum <= 0) {
      toast.error('Prize pool must be a positive number.');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/admin/draws/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draw_month: newDraw.draw_month + '-01',
          draw_logic: newDraw.draw_logic,
          prize_pool_total: poolNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create draw cycle.');
      }

      toast.success(`Draw for ${new Date(newDraw.draw_month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} created successfully.`);
      setShowCreateModal(false);
      setNewDraw({ draw_month: '', draw_logic: 'random', prize_pool_total: '' });
      await fetchDraws();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleSimulate = async (drawId: string) => {
    setSimulating(true);
    try {
      const res = await fetch('/api/admin/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawId }),
      });
      const data = await res.json();
      setSimulationData(data);
    } finally {
      setSimulating(false);
    }
  };

  const handlePublish = async (drawId: string) => {
    if (!confirm('Are you sure you want to publish? This will finalize results and send emails.')) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/admin/draws/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawId }),
      });
      if (res.ok) {
        toast.success('Draw published successfully!');
        await fetchDraws();
        setSimulationData(null);
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Draw Management</h1>
          <p className="text-white/40">Configure cycles, simulate outcomes, and publish results.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="h-12 bg-emerald-500 text-black font-bold rounded-xl px-8 flex gap-2"
        >
          <Settings2 size={18} /> New Draw Cycle
        </Button>
      </header>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CREATE DRAW MODAL                                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-lg mx-4 p-10 rounded-[2.5rem] bg-[#111] border border-white/10 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black tracking-tight mb-2">Create Draw Cycle</h2>
            <p className="text-white/40 text-sm mb-10">Configure a new monthly draw pipeline.</p>

            <div className="space-y-8">
              {/* Draw Month */}
              <div className="space-y-2">
                <Label className="text-white/50 text-xs font-black uppercase tracking-widest ml-1">
                  Draw Month
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <Input
                    type="month"
                    value={newDraw.draw_month}
                    onChange={(e) => setNewDraw(prev => ({ ...prev, draw_month: e.target.value }))}
                    className="bg-white/5 border-white/10 h-14 pl-12 rounded-xl focus:border-emerald-500/50 transition-all text-white [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Draw Logic */}
              <div className="space-y-2">
                <Label className="text-white/50 text-xs font-black uppercase tracking-widest ml-1">
                  Draw Logic
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewDraw(prev => ({ ...prev, draw_logic: 'random' }))}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      newDraw.draw_logic === 'random'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    <RefreshCw size={20} className="mb-3" />
                    <p className="font-bold text-sm">Random</p>
                    <p className="text-[10px] opacity-60 mt-1">5 unique random numbers</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDraw(prev => ({ ...prev, draw_logic: 'algorithmic' }))}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      newDraw.draw_logic === 'algorithmic'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    <Cpu size={20} className="mb-3" />
                    <p className="font-bold text-sm">Algorithmic</p>
                    <p className="text-[10px] opacity-60 mt-1">Based on score frequency</p>
                  </button>
                </div>
              </div>

              {/* Prize Pool */}
              <div className="space-y-2">
                <Label className="text-white/50 text-xs font-black uppercase tracking-widest ml-1">
                  Prize Pool Total (£)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <Input
                    type="number"
                    placeholder="5000"
                    min="0"
                    step="100"
                    value={newDraw.prize_pool_total}
                    onChange={(e) => setNewDraw(prev => ({ ...prev, prize_pool_total: e.target.value }))}
                    className="bg-white/5 border-white/10 h-14 pl-12 rounded-xl focus:border-emerald-500/50 transition-all text-white"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleCreateDraw}
                disabled={creating}
                className="w-full h-14 bg-emerald-500 text-black font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
              >
                {creating ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={20} />
                    <span>Create Draw Cycle</span>
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Draft Draws / Simulation Area */}
      {draws.filter(d => d.status === 'draft').map(draw => (
        <motion.div 
          key={draw.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/10"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-10">
            <div className="space-y-6 flex-1">
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Draft Draw Pipeline</span>
                <h2 className="text-4xl font-black tracking-tighter">
                  {new Date(draw.draw_month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Logic Type</p>
                  <p className="text-sm font-bold capitalize">{draw.draw_logic}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Total Pool</p>
                  <p className="text-sm font-bold">£{draw.prize_pool_total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Rollover</p>
                  <p className="text-sm font-bold">£{draw.jackpot_carried?.toLocaleString() || '0'}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => handleSimulate(draw.id)} 
                  disabled={simulating}
                  className="bg-white text-black font-bold h-12 px-8 rounded-xl gap-2"
                >
                  {simulating ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                  Run Simulation
                </Button>
                <Button 
                  onClick={() => handlePublish(draw.id)}
                  disabled={publishing}
                  className="bg-emerald-500 text-black font-bold h-12 px-8 rounded-xl gap-2"
                >
                  {publishing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Publish Results
                </Button>
              </div>
            </div>

            {/* Simulation Preview Area */}
            <AnimatePresence>
              {simulationData && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="lg:w-[400px] p-6 rounded-[2rem] bg-black/50 border border-white/5 flex flex-col gap-6"
                >
                  <div>
                    <h4 className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-4">Simulation Result</h4>
                    <div className="flex gap-2">
                      {simulationData.winningNumbers.map((num: number) => (
                        <div key={num} className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center font-black">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <WinnerStat label="5 Match" count={simulationData.winners.fiveMatch.length} amount={simulationData.prizes.fiveMatchAmount} />
                    <WinnerStat label="4 Match" count={simulationData.winners.fourMatch.length} amount={simulationData.prizes.fourMatchAmount} />
                    <WinnerStat label="3 Match" count={simulationData.winners.threeMatch.length} amount={simulationData.prizes.threeMatchAmount} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}

      {/* Past Draws Table */}
      <section>
        <h3 className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-8">Draw History</h3>
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Month</th>
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Winning Numbers</th>
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Total Winners</th>
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Pool Paid</th>
                <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {draws.filter(d => d.status === 'published').map(draw => (
                <tr key={draw.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6 font-bold">{new Date(draw.draw_month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</td>
                  <td className="px-8 py-6 text-sm flex gap-1">
                    {/* Winning numbers would come from draw_results, mock display here */}
                    <span className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-[10px]">7</span>
                    <span className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-[10px]">12</span>
                    <span className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-[10px]">22</span>
                    <span className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-[10px]">35</span>
                    <span className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-[10px]">44</span>
                  </td>
                  <td className="px-8 py-6 text-sm">18 Members</td>
                  <td className="px-8 py-6 font-bold text-emerald-400">£{draw.prize_pool_total.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">Released</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function WinnerStat({ label, count, amount }: any) {
  return (
    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
      <div>
        <p className="text-[10px] text-white/40 uppercase font-bold">{label}</p>
        <p className="text-xl font-black">{count}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-white/40 uppercase font-bold italic">Each Recipient</p>
        <p className="text-sm font-black text-emerald-400">£{amount.toFixed(2)}</p>
      </div>
    </div>
  );
}
