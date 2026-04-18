'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, Heart, Target, ArrowRight, Star, Quote, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const [prizePool, setPrizePool] = useState(0);

  useEffect(() => {
    // Animate counter effect
    const target = 5820;
    const duration = 2000;
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setPrizePool(target);
        clearInterval(timer);
      } else {
        setPrizePool(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0f4c35]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#d4a947]/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next Draw: May 31, 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Play Golf. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f4c35] via-[#228b63] to-[#0f4c35]">Do Good.</span> <br />
            Win Big.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white/40 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The world's first subscription-based golf platform where every round you play fuels real-world impact and gives you a shot at a massive monthly jackpot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:row items-center justify-center gap-6"
          >
            <Button asChild size="lg" className="h-16 px-10 bg-[#0f4c35] text-white hover:bg-[#156b4a] font-black text-xl rounded-2xl shadow-2xl shadow-[#0f4c35]/40 transition-all hover:scale-105 active:scale-95">
              <Link href="/subscribe">Start Playing <ArrowRight className="ml-2 w-6 h-6" /></Link>
            </Button>
            <Link href="/how-it-works" className="font-bold text-white/60 hover:text-white transition-colors">See how it works</Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Infographic */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">The Cycle of Impact</h2>
            <p className="text-white/40 max-w-xl mx-auto">Simple for you, life-changing for them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <StepCard 
              number="01"
              icon={<CreditCard className="w-8 h-8 text-emerald-400" />}
              title="Subscribe"
              desc="Join the community for £20/mo. 10% goes directly to your chosen charity partner before we even start the prize pool."
            />
            <StepCard 
              number="02"
              icon={<Target className="w-8 h-8 text-cyan-400" />}
              title="Enter Scores"
              desc="Log your Stableford scores from any official round. Your 5 most recent rounds are your golden ticket into the draw."
            />
            <StepCard 
              number="03"
              icon={<Award className="w-8 h-8 text-amber-400" />}
              title="Win + Give"
              desc="At the end of the month, if your numbers match, you win a share of the pool. Win big, while you do good."
            />
          </div>
        </div>
      </section>

      {/* Prize Pool Teaser */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
          <div className="mb-6 p-4 rounded-3xl bg-[#d4a947]/10 border border-[#d4a947]/20">
            <Trophy className="text-[#d4a947] w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-white/40 uppercase tracking-widest mb-4">Current Prize Pool</h2>
          <div className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none mb-10 text-white">
            £{prizePool.toLocaleString()}
          </div>
          <p className="text-white/40 text-xl font-medium mb-12">
            Growing daily with <span className="text-white">1,452 active heroes</span> entered.
          </p>
          <Button asChild className="h-16 px-12 bg-white text-black hover:bg-white/90 font-black rounded-2xl text-xl">
            <Link href="/prizes">View Prize Tiers</Link>
          </Button>
        </div>
      </section>

      {/* Charity Spotlight */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8 border border-emerald-500/20">
              Impact Spotlight
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Driven by <br />Pure Purpose.</h2>
            <p className="text-white/40 text-xl leading-relaxed mb-12">
              We've partnered with organizations that use sport as a vehicle for change. From junior links programs to environmental fairway conservation, your membership fuels their mission.
            </p>
            <div className="space-y-6 mb-12">
              <FeatureItem label="Direct contribution from every sub" />
              <FeatureItem label="Zero platform fees on donations" />
              <FeatureItem label="Total transparency reports monthly" />
            </div>
            <Button asChild variant="outline" className="h-14 px-10 border-white/10 hover:bg-white/5 font-bold rounded-xl text-lg">
              <Link href="/charities">Meet Our Partners</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 group">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" 
                alt="Community Impact" 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <p className="text-2xl font-bold mb-1">Impact Golf Program</p>
                <p className="text-white/40 text-sm">Empowering 500+ youth through sport this year.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <TestimonialCard 
              quote="I played golf for 20 years, but never with this much purpose. Knowing my round helps kids while I chase the pot is incredible."
              author="Tom R."
              role="Hero Member"
            />
            <TestimonialCard 
              quote="The excitement on draw day is real! Won a share of the 4-match tier last month and it paid for my club membership for the year."
              author="Sophie L."
              role="4-Match Winner"
            />
            <TestimonialCard 
              quote="Transparency is everything. The monthly impact reports show exactly where our money goes. True heroes."
              author="Marcus D."
              role="Yearly Legend"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 overflow-hidden">
        <motion.div 
          whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
          className="max-w-4xl mx-auto text-center p-16 md:p-24 rounded-[4rem] bg-gradient-to-br from-[#0f4c35] to-[#041a12] border border-white/10 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4a947]/10 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 relative z-10">Ready to <br />be a Hero?</h2>
          <p className="text-white/60 text-xl mb-12 relative z-10 max-w-xl mx-auto">
            Join the 1,452 golfers already playing for something bigger. Subscriptions for the May draw close in 4 days.
          </p>
          <div className="flex flex-col sm:row items-center justify-center gap-6 relative z-10">
            <Button asChild size="lg" className="h-16 px-12 bg-white text-black hover:bg-white/90 font-black text-xl rounded-2xl shadow-2xl transition-all">
              <Link href="/subscribe">Join Now</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

interface StepCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function StepCard({ number, icon, title, desc }: StepCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-[#0f4c35]/50 transition-all duration-500"
    >
      <div className="flex justify-between items-start mb-10">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          {icon}
        </div>
        <span className="text-4xl font-black text-white/10">{number}</span>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-white/40 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}

function FeatureItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 text-white/70 font-medium">
      <div className="w-6 h-6 rounded-full bg-[#0f4c35] flex items-center justify-center">
        <ChevronRight size={14} className="text-emerald-400" />
      </div>
      {label}
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative">
      <Quote className="text-white/5 absolute top-10 right-10 w-12 h-12" />
      <p className="text-white/60 text-lg leading-relaxed italic mb-10 relative z-10">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f4c35] to-[#d4a947] opacity-50" />
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">{role}</p>
        </div>
      </div>
    </div>
  );
}

function CreditCard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
  );
}
