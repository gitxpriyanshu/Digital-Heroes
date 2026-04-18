'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Heart, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Trophy className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Digital Heroes</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#charity" className="hover:text-white transition-colors">Charity</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/5">
              <Link href="/login">
                <span>Sign In</span>
              </Link>
            </Button>
            <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-400 font-semibold px-6">
              <Link href="/subscribe">
                <span>Get Started</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              The Future of Golf Subscriptions
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
              PLAY GOLF.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                BE A HERO.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-white/50 leading-relaxed mb-12">
              The premier platform for golfers who give back. Submit your scores, enter monthly draws, 
              and support life-changing charities with every round you play.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-14 px-10 bg-emerald-500 text-black hover:bg-emerald-400 font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/20">
                <Link href="/subscribe">
                  <span>Join the Club</span>
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-10 border-white/10 hover:bg-white/5 font-bold text-lg rounded-2xl">
                <Link href="/how-it-works">
                  <span>How it Works</span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Total Raised', value: '$1.2M+' },
              { label: 'Active Heros', value: '45k+' },
              { label: 'Scores Tracked', value: '250k+' },
              { label: 'Charity Partners', value: '120+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Game-Changing Features</h2>
            <p className="text-white/50">Everything you need to elevate your game and impact.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Target className="w-8 h-8 text-emerald-400" />}
              title="Rolling Score Window"
              description="Maintain your top 5 most recent scores automatically. Our system replaces the oldest as you improve."
            />
            <FeatureCard 
              icon={<Award className="w-8 h-8 text-cyan-400" />}
              title="Monthly Mega Draws"
              description="Every subscription enters you into our algorithmic prize draws with massive jackpot pools."
            />
            <FeatureCard 
              icon={<Heart className="w-8 h-8 text-rose-400" />}
              title="Charity Integration"
              description="A minimum of 10% of every subscription goes directly to your chosen charitable partners."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Trophy className="text-black w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight">Digital Heroes</span>
          </div>
          <div className="text-white/30 text-sm">
            © 2026 Digital Heroes. All rights reserved.
          </div>
          <div className="flex gap-8 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all duration-300"
    >
      <div className="mb-6 p-4 w-fit rounded-2xl bg-white/5 border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-white/50 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
