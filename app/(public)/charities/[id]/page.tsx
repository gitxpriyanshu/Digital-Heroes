'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CharityProfilePage({ params }: { params: { id: string } }) {
  const [charity, setCharity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCharity() {
      const res = await fetch(`/api/charities/${params.id}`);
      const data = await res.json();
      setCharity(data);
      setLoading(false);
    }
    fetchCharity();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
    </div>
  );

  if (!charity) return <div>Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Header */}
      <div className="h-[50vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
        <img 
          src={charity.logo_url} 
          alt={charity.name}
          className="w-full h-full object-cover opacity-20 blur-xl scale-110" 
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 h-48 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 flex items-center justify-center"
          >
            <img src={charity.logo_url} alt={charity.name} className="max-w-full max-h-full object-contain filter drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-30 pb-32">
        <Link href="/charities" className="inline-flex items-center text-white/40 hover:text-white mb-10 transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Partners
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">{charity.name}</h1>
            <div className="flex items-center gap-6">
              <a href={charity.website} target="_blank" rel="noreferrer" className="flex items-center text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                <Globe className="mr-2 w-5 h-5" /> Visit Website
              </a>
              <span className="text-white/20 font-medium">Est. Partner since 2024</span>
            </div>
          </div>
          
          <Button className="h-14 px-10 bg-emerald-500 text-black hover:bg-emerald-400 font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/20">
            Select as My Charity
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">About the Organization</h2>
              <p className="text-white/60 text-lg leading-relaxed whitespace-pre-line">
                {charity.description}
              </p>
            </section>

            <section className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="text-emerald-400 w-6 h-6" /> Upcoming Events
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors duration-300 group-hover:text-black">
                    <span className="text-xs font-black uppercase">May</span>
                    <span className="text-xl font-black">12</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Annual Charity Golf Day</h3>
                    <p className="text-white/40 text-sm">Royal Zash National Club • 09:00 AM</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20">
              <h3 className="font-bold text-xl mb-4">Impact Score</h3>
              <div className="text-5xl font-black mb-2">9.8</div>
              <p className="text-xs text-white/30 uppercase tracking-widest font-black">Platform Rating</p>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Total Contribution</span>
                  <span className="font-bold">£124,500</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-emerald-500" 
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
