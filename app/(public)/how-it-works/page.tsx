'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, Heart, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="bg-[#050505] text-white pt-32 pb-24 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            Win Big, <br />
            <span className="text-[#0f4c35]">Give Better.</span>
          </motion.h1>
          <p className="text-white/40 text-xl max-w-2xl mx-auto">
            Everything you need to know about how Digital Heroes combines 
            competition with contribution.
          </p>
        </header>

        {/* Scoring System */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#0f4c35]/30 blur-[80px] rounded-full" />
            <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 relative z-10">
              <h3 className="text-2xl font-bold mb-8">Stableford Explained</h3>
              <p className="text-white/60 mb-10 leading-relaxed">
                We use the Stableford scoring system because it rewards great play without punishing a single bad hole. Your points are your "draw numbers".
              </p>
              <div className="space-y-4">
                <ScoreValue points={5} label="Albatross / Eagle" color="text-amber-400" />
                <ScoreValue points={4} label="Birdie" color="text-emerald-400" />
                <ScoreValue points={3} label="Par" color="text-cyan-400" />
                <ScoreValue points={2} label="Bogey" color="text-white/40" />
                <ScoreValue points={1} label="Double Bogey" color="text-white/20" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-8">Your Performance <br />is Your Entry.</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-8">
              Every round you play matters. When you submit a score (between 1 and 45 points), that number becomes one of your five unique entries into the monthly draw.
            </p>
            <ul className="space-y-6">
              <ListItem text="Submit any round from any official course" />
              <ListItem text="Your 5 most recent rounds are automatically used" />
              <ListItem text="Higher scores don't mean higher odds—every number is unique" />
            </ul>
          </div>
        </section>

        {/* Draw Mechanics */}
        <section className="mb-40">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Match Tiers & Prizes</h2>
            <p className="text-white/40">The monthly pool is split across three winning tiers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TierCard 
              match="5"
              pool="40%"
              label="The Jackpot"
              desc="Match all 5 numbers to win a share of the primary jackpot. If no one matches all 5, the pool rolls over!"
            />
            <TierCard 
              match="4"
              pool="35%"
              label="Pro Tier"
              desc="Match 4 out of 5 numbers for a significant payout. Perfect for consistent performers."
            />
            <TierCard 
              match="3"
              pool="25%"
              label="Hero Tier"
              desc="Match 3 out of 5. The high-probability tier designed to reward as many players as possible."
            />
          </div>
        </section>

        {/* Pool Structure */}
        <section className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-[#0f4c35] to-transparent border border-[#0f4c35]/30 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8">Transparency in Every Pound.</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                We believe in total transparency. Here is exactly how your £20 monthly subscription is distributed:
              </p>
              <div className="space-y-8">
                <DistributionItem label="Charity Partner (Direct)" percent="10%" desc="Goes straight to your chosen cause immediately." />
                <DistributionItem label="Prize Pool Contribution" percent="70%" desc="The net amount fueling the 3 winning tiers." />
                <DistributionItem label="Platform & Growth" percent="20%" desc="Covers Stripe fees, security, and building the future." />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 rounded-full border-[20px] border-[#0f4c35] border-t-emerald-500 border-r-amber-500 relative flex items-center justify-center">
                <div className="text-center">
                  <Heart className="text-[#d4a947] w-10 h-10 mx-auto mb-2" />
                  <p className="text-xs font-black uppercase tracking-widest text-[#d4a947]">Impact First</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-10">Clear? Let's get on the fairway.</h2>
          <Button asChild size="lg" className="h-16 px-12 bg-white text-black font-black rounded-2xl text-xl">
            <Link href="/subscribe">Join Digital Heroes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ScoreValueProps {
  points: number;
  label: string;
  color: string;
}

function ScoreValue({ points, label, color }: ScoreValueProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
      <span className="text-sm font-bold text-white/60">{label}</span>
      <span className={`text-xl font-black ${color}`}>{points} pts</span>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-white/70 font-medium">
      <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
      {text}
    </li>
  );
}

interface TierCardProps {
  match: string;
  pool: string;
  label: string;
  desc: string;
}

function TierCard({ match, pool, label, desc }: TierCardProps) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8">
        <span className="text-4xl font-black">{match}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{label}</h3>
      <div className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6">
        {pool} of Prize Pool
      </div>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

interface DistributionItemProps {
  label: string;
  percent: string;
  desc: string;
}

function DistributionItem({ label, percent, desc }: DistributionItemProps) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <p className="font-bold text-lg">{label}</p>
        <p className="text-2xl font-black text-emerald-500">{percent}</p>
      </div>
      <p className="text-white/20 text-sm">{desc}</p>
    </div>
  );
}
