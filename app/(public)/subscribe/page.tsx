'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    if (!user) {
      router.push(`/signup?redirect=/subscribe&plan=${plan}`);
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: user.id }),
      });

      const { url, error } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        console.error(error);
        setLoading(null);
      }
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Choose Your Impact</h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto">
            Select a plan to start competing, winning, and supporting your favorite charities.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Plan */}
        <PricingCard 
          title="Monthly Hero"
          price="20"
          period="month"
          description="Perfect for testing the waters and consistent monthly impact."
          features={[
            'Unlimited score submissions',
            'Full prize draw entry',
            '10% charity contribution',
            'Rolling 5-score tracking',
            'Basic hero dashboard'
          ]}
          isLoading={loading === 'monthly'}
          onAction={() => handleSubscribe('monthly')}
          icon={<Zap className="w-6 h-6 text-emerald-400" />}
        />

        {/* Yearly Plan */}
        <PricingCard 
          title="Yearly Legend"
          price="200"
          period="year"
          description="The ultimate impact package. Save £40 every year."
          features={[
            'Everything in Monthly',
            'Priority verified support',
            'Yearly impact report',
            'Early access to new draws',
            'Exclusive legend badge'
          ]}
          highlight
          savings="Save 16%"
          isLoading={loading === 'yearly'}
          onAction={() => handleSubscribe('yearly')}
          icon={<Crown className="w-6 h-6 text-amber-400" />}
        />
      </div>
    </div>
  );
}

function PricingCard({ 
  title, price, period, description, features, highlight, savings, onAction, isLoading, icon 
}: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative p-8 rounded-[2rem] border transition-all duration-300 ${
        highlight 
          ? 'bg-gradient-to-b from-white/[0.08] to-transparent border-emerald-500/30 shadow-2xl shadow-emerald-500/10' 
          : 'bg-white/[0.03] border-white/10'
      }`}
    >
      {savings && (
        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider">
          {savings}
        </div>
      )}

      <div className="mb-8 p-3 w-fit rounded-xl bg-white/5 border border-white/5">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-black">£{price}</span>
        <span className="text-white/40 text-sm">/{period}</span>
      </div>
      <p className="text-white/50 text-sm mb-8 leading-relaxed">
        {description}
      </p>

      <ul className="space-y-4 mb-10">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm text-white/70">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={onAction}
        disabled={isLoading}
        className={`w-full h-14 rounded-2xl font-bold text-lg shadow-xl transition-all ${
          highlight 
            ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20' 
            : 'bg-white text-black hover:bg-white/90 shadow-white/5'
        }`}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : `Get Started`}
      </Button>
    </motion.div>
  );
}
