'use client';

import React from 'react';
import CharitySelector from '@/components/charity/CharitySelector';
import { Heart, Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CharityDashboard() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Charity Impact</h1>
          <p className="text-white/40">Select your heroes and set your contribution level.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold">
          <ShieldCheck size={14} /> 100% Tax Deductible
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem]">
            <CharitySelector />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <section className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
              <Globe className="text-black w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Independent Donation</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed px-6">
              Want to make an even bigger impact? Send a one-time donation outside your monthly subscription to any of our partners.
            </p>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 font-bold">
              Donate Extra via Stripe
            </Button>
          </section>

          <section className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
            <h4 className="font-bold text-white/60 uppercase text-[10px] tracking-widest mb-6">Transparency Report</h4>
            <div className="space-y-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Platform Fee</span>
                <span className="text-white/60">0% (Covered by us)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Charity Processing</span>
                <span className="text-white/60">£0.00</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="font-bold">Net Transferred</span>
                <span className="text-emerald-400 font-black">100%</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
