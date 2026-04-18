'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SubscribeCTA({ title, subtitle }: { title?: string, subtitle?: string }) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f4c35]/10 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-white/[0.03] border border-white/10 relative z-10 overflow-hidden group"
      >
        {/* Animated Background Decoration */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d4a947]/5 rounded-full blur-3xl group-hover:bg-[#d4a947]/10 transition-colors duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#0f4c35]/5 rounded-full blur-3xl group-hover:bg-[#0f4c35]/10 transition-colors duration-1000" />

        <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
              {title || "Start Your Journey as a Digital Hero."}
            </h2>
            <p className="text-white/40 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              {subtitle || "Join 1,400+ golfers creating real-world impact every month. Your scores are your entry. Your impact is your legacy."}
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-10">
              <CTAFeature icon={<Heart size={16} className="text-rose-500" />} text="10% Charity Share" />
              <CTAFeature icon={<Trophy size={16} className="text-[#d4a947]" />} text="Monthly Jackpots" />
            </div>

            <Button asChild size="lg" className="h-16 px-10 bg-[#0f4c35] text-white hover:bg-[#156b4a] font-black text-xl rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 group/btn">
              <Link href="/subscribe">
                Subscribe & Play <ArrowRight className="ml-2 w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="hidden lg:block w-72 h-72 relative">
             <div className="absolute inset-0 bg-[#0f4c35]/10 rounded-full animate-ping" />
             <div className="relative z-10 w-full h-full bg-black border border-white/10 rounded-full flex items-center justify-center p-12">
               <Trophy className="text-[#d4a947] w-full h-full" />
             </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function CTAFeature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <span className="text-sm font-bold text-white/60 uppercase tracking-widest">{text}</span>
    </div>
  );
}
