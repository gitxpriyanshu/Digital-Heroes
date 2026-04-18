'use client';

import React, { useState } from 'react';
import ScoreEntry from '@/components/scores/ScoreEntry';
import ScoreList from '@/components/scores/ScoreList';
import { Info, Target, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScoresDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

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
        <div className="lg:col-span-5">
          <ScoreEntry onScoreAdded={handleScoreAdded} />
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
