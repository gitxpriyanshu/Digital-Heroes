'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Charity {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
  is_featured: boolean;
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharities() {
      const res = await fetch('/api/charities');
      const data = await res.json();
      if (Array.isArray(data)) setCharities(data);
      setLoading(false);
    }
    fetchCharities();
  }, []);

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const featured = charities.find(c => c.is_featured);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6"
          >
            Our Impact Partners
          </motion.h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto">
            Choose which heroes you want to support. 10% of every subscription 
            goes directly to these life-changing organizations.
          </p>
        </header>

        {/* Featured Section */}
        {featured && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-20 relative p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/20 overflow-hidden group"
          >
            <div className="absolute top-10 right-10">
              <Star className="text-emerald-400 w-12 h-12 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest mb-6">
                  Featured Partner
                </span>
                <h2 className="text-4xl font-bold mb-4">{featured.name}</h2>
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  {featured.description.slice(0, 250)}...
                </p>
                <div className="flex gap-4">
                  <Button asChild className="h-12 px-8 bg-emerald-500 text-black hover:bg-emerald-400 font-bold rounded-xl">
                    <Link href={`/charities/${featured.id}`}>Support {featured.name}</Link>
                  </Button>
                  <Button variant="outline" asChild className="h-12 px-8 border-white/10 hover:bg-white/5 font-bold rounded-xl">
                    <a href={featured.website} target="_blank" rel="noreferrer">Visit Website</a>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src={featured.logo_url} 
                  alt={featured.name} 
                  className="w-64 h-64 object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-12 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <Input 
              placeholder="Search charities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:border-emerald-500/50 transition-all text-lg"
            />
          </div>
        </div>

        {/* Charity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCharities.map((charity, i) => (
              <motion.div
                key={charity.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all group"
              >
                <div className="h-16 w-16 mb-6 rounded-2xl bg-white/5 p-3 flex items-center justify-center border border-white/5">
                  <img src={charity.logo_url} alt={charity.name} className="max-w-full max-h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-3">{charity.name}</h3>
                <p className="text-white/40 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {charity.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <Button asChild variant="ghost" className="text-emerald-400 p-0 hover:bg-transparent hover:text-emerald-300 font-bold">
                    <Link href={`/charities/${charity.id}`}>
                      View Profile <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-emerald-500/10 hover:text-emerald-400 text-white/20">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
