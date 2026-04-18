'use client';

import React, { useState } from 'react';
import ScoreEntry from '@/components/scores/ScoreEntry';
import ScoreList from '@/components/scores/ScoreList';
import { Info, Target, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClientClient } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ScoresDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasSub, setHasSub] = useState(true);
  const [hasCharity, setHasCharity] = useState(true);
  
  const supabase = createClientClient();

  React.useEffect(() => {
    async function checkFlow() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [subData, charityData] = await Promise.all([
        supabase.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle(),
        supabase.from('charity_selections').select('id').eq('user_id', user.id).maybeSingle()
      ]);

      if (!subData.data || subData.data.status !== 'active') setHasSub(false);
      if (!charityData.data) setHasCharity(false);
    }
    checkFlow();
  }, [supabase]);

  const handleScoreAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">My Scores</h1>
        <p className="text-white/40">Track your rounds and qualify for the monthly jackpot.</p>
      </header>

      {/* Rules Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4"
      >
        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h3 className="font-bold text-emerald-400 mb-1">Entry Rule</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Your 5 most recent scores are automatically submitted as your numbers for the monthly draw. 
            Maintain exactly 5 scores to stay eligible for all prize tiers.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 relative">
          {(!hasSub || !hasCharity) && (
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center border border-white/5">
              <AlertCircle className="w-10 h-10 text-rose-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Requirement Missing</h3>
              <p className="text-sm text-white/60 mb-4">
                {!hasSub 
                  ? 'You must have an active subscription to submit scores to the draw.' 
                  : 'You must select a supporting charity before entering your scores.'}
              </p>
              <Link href={!hasSub ? "/subscribe" : "/dashboard/charity"} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-colors">
                {!hasSub ? 'Subscribe Now' : 'Select Charity'}
              </Link>
            </div>
          )}
          <div className={(!hasSub || !hasCharity) ? 'opacity-30 pointer-events-none' : ''}>
            <ScoreEntry onScoreAdded={handleScoreAdded} />
          </div>
        </div>
        <div className="lg:col-span-7">
          <ScoreList refreshKey={refreshKey} />
          
          <div className="mt-8 p-8 rounded-[2rem] border border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="text-white/20 w-5 h-5" />
              <h4 className="font-bold text-white/60 uppercase text-[10px] tracking-widest">How it works</h4>
            </div>
            <ul className="space-y-4 text-sm text-white/40">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-1.5 shrink-0" />
                Only 1-45 Stableford scores are accepted.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-1.5 shrink-0" />
                One score per date. New entries for the same date will be rejected.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-1.5 shrink-0" />
                When you enter a 6th score, your oldest entry is automatically retired.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
