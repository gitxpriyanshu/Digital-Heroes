'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Check, X, History, Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Score {
  id: string;
  score: number;
  score_date: string;
}

export default function ScoreList({ refreshKey }: { refreshKey: number }) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchScores = async () => {
    try {
      const res = await fetch('/api/scores');
      const data = await res.json();
      if (res.ok) setScores(data);
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [refreshKey]);

  const handleEdit = (score: Score) => {
    setEditingId(score.id);
    setEditValue(score.score);
  };

  const saveEdit = async (id: string) => {
    if (editValue < 1 || editValue > 45) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/scores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: editValue }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchScores();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return;
    
    // Optimistic Update
    const previousScores = [...scores];
    setScores(scores.filter(s => s.id !== id));
    toast.info('Deleting score...');

    try {
      const res = await fetch(`/api/scores/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete score');
      toast.success('Score deleted.');
    } catch (err) {
      setScores(previousScores);
      toast.error('Failed to delete. Round restored.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold">Recent Scores</h2>
        </div>
        <span className="text-xs text-white/30 uppercase tracking-widest font-black">
          Top 5 Entries
        </span>
      </div>

      <div className="divide-y divide-white/5">
        <AnimatePresence mode="popLayout">
          {scores.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/40 font-medium">No scores found yet.</p>
              <p className="text-xs text-white/20 mt-1">Submit your first round above to see it here.</p>
            </motion.div>
          ) : (
            scores.map((score, index) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">
                    {new Date(score.score_date).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  {editingId === score.id ? (
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-20 h-8 bg-white/5 border-white/20 text-sm py-0"
                        min={1}
                        max={45}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => saveEdit(score.id)}
                        className="w-8 h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setEditingId(null)}
                        className="w-8 h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
                      {score.score}
                      <span className="text-[10px] text-emerald-500/50 uppercase tracking-tighter">pts</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {editingId !== score.id && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={actionLoading === score.id}
                        onClick={() => handleEdit(score)}
                        className="w-10 h-10 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={actionLoading === score.id}
                        onClick={() => handleDelete(score.id)}
                        className="w-10 h-10 rounded-xl hover:bg-white/5 text-rose-500/40 hover:text-rose-400 transition-all"
                      >
                        {actionLoading === score.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
