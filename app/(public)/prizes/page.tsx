'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, History, TrendingUp, Star, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const prizeData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 1800 },
  { month: 'Mar', amount: 3200 },
  { month: 'Apr', amount: 4800 },
  { month: 'May', amount: 5820 },
];

const pastWinners = [
  { name: 'Alex M.', prize: '£1,420', match: '5 Match', date: 'April 2024' },
  { name: 'Sarah J.', prize: '£450', match: '4 Match', date: 'April 2024' },
  { name: 'David K.', prize: '£120', match: '3 Match', date: 'April 2024' },
  { name: 'Michael R.', prize: '£1,100', match: '5 Match', date: 'March 2024' },
  { name: 'Elena W.', prize: '£380', match: '4 Match', date: 'March 2024' },
];

export default function PrizesPage() {
  return (
    <div className="bg-[#050505] text-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-9xl font-black mb-8 tracking-tighter"
          >
            The Hero's <br />
            <span className="text-amber-500">Jackpot.</span>
          </motion.h1>
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="flex flex-col items-center">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Current Pool</span>
              <span className="text-4xl font-black text-white">£5,820</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Last Paid Out</span>
              <span className="text-4xl font-black text-emerald-500">£4,250</span>
            </div>
          </div>
        </header>

        {/* Prize Tiers */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          <PrizeTierCard 
            title="5-Match Jackpot"
            amount="£2,328"
            match="5 / 5 Numbers"
            status="Active"
            color="border-amber-500/50 bg-amber-500/5"
            icon={<Trophy className="text-amber-500 w-8 h-8" />}
          />
          <PrizeTierCard 
            title="Pro Series"
            amount="£2,037"
            match="4 / 5 Numbers"
            status="Active"
            color="border-white/10 bg-white/[0.03]"
            icon={<Award className="text-white/60 w-8 h-8" />}
          />
          <PrizeTierCard 
            title="Foundation Hero"
            amount="£1,455"
            match="3 / 5 Numbers"
            status="Active"
            color="border-white/10 bg-white/[0.03]"
            icon={<Users className="text-white/40 w-8 h-8" />}
          />
        </section>

        {/* Growth Chart */}
        <section className="p-12 md:p-20 rounded-[4rem] bg-white/[0.02] border border-white/5 mb-40">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
            <div>
              <h2 className="text-4xl font-black mb-4 flex items-center gap-4">
                <TrendingUp className="text-emerald-500" /> Exponential Growth
              </h2>
              <p className="text-white/40 max-w-md">
                As more heroes join the platform, the prize pools grow for everyone. 
                Our community is scaling 20% month-on-month.
              </p>
            </div>
            <div className="bg-white text-black font-black px-6 py-3 rounded-2xl">
              May 2026 Target: £10,000
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff10' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px', padding: '16px' }}
                />
                <Bar dataKey="amount" fill="#d4a947" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Past Winners */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <History className="text-white/20 w-8 h-8" />
            <h2 className="text-4xl font-black">Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastWinners.map((winner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-white/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0f4c35] to-emerald-500 opacity-50" />
                  <Star className="text-amber-500/20 group-hover:text-amber-500 transition-colors" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{winner.name}</h3>
                <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-6">{winner.date}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Tier</p>
                    <p className="font-bold">{winner.match}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Won</p>
                    <p className="text-2xl font-black text-emerald-500">{winner.prize}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mt-40 text-center">
          <Button asChild size="lg" className="h-16 px-12 bg-[#0f4c35] text-white font-black rounded-2xl text-xl shadow-2xl shadow-[#0f4c35]/20">
            <Link href="/subscribe">Start Playing Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PrizeTierCardProps {
  title: string;
  amount: string;
  match: string;
  status: string;
  color: string;
  icon: React.ReactNode;
}

function PrizeTierCard({ title, amount, match, status, color, icon }: PrizeTierCardProps) {
  return (
    <div className={`p-10 rounded-[3rem] border flex flex-col items-center text-center transition-all hover:scale-105 ${color}`}>
      <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-1">{title}</h3>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-8">{match}</p>
      
      <div className="text-5xl font-black mb-8 tracking-tighter">{amount}</div>
      
      <div className="mt-auto px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
        Estimated Tier Pool
      </div>
    </div>
  );
}
