'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Check, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Charity {
  id: string;
  name: string;
  logo_url: string;
}

export default function CharitySelector({ 
  initialCharityId, 
  initialPercentage = 10,
  subscriptionPrice = 20, // Default to monthly
  onSave
}: { 
  initialCharityId?: string, 
  initialPercentage?: number,
  subscriptionPrice?: number,
  onSave?: (charityId: string, percentage: number) => void 
}) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(initialCharityId || '');
  const [percentage, setPercentage] = useState(initialPercentage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCharities() {
      const res = await fetch('/api/charities');
      const data = await res.json();
      if (Array.isArray(data)) setCharities(data);
      setLoading(false);
    }
    fetchCharities();
  }, []);

  const filtered = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await fetch('/api/user/charity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charity_id: selectedId, contribution_percentage: percentage }),
      });
      if (res.ok) {
        onSave?.(selectedId, percentage);
      }
    } finally {
      setSaving(false);
    }
  };

  const calculatedAmount = (subscriptionPrice * percentage) / 100;

  return (
    <div className="space-y-8">
      {/* Charity List */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-white/40 uppercase tracking-widest ml-1">
          Select Recipient
        </label>
        
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <Input 
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/10 h-12 pl-12 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="col-span-2 flex justify-center py-10">
              <Loader2 className="animate-spin text-emerald-500" />
            </div>
          ) : (
            filtered.map(charity => (
              <div 
                key={charity.id}
                onClick={() => setSelectedId(charity.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedId === charity.id 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                    : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                <img src={charity.logo_url} alt="" className="w-8 h-8 object-contain" />
                <span className="font-bold text-sm truncate">{charity.name}</span>
                {selectedId === charity.id && <Check className="ml-auto w-4 h-4" />}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Percentage Slider */}
      <div className="space-y-6 pt-4 border-t border-white/5">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest">
              Contribution Level
            </label>
            <p className="text-xs text-white/20">A minimum of 10% is required.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-white">{percentage}%</span>
          </div>
        </div>

        <input 
          type="range"
          min="10"
          max="100"
          step="5"
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
          className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />

        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Heart className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest">Calculated Support</p>
              <p className="text-xl font-black text-white">£{calculatedAmount.toFixed(2)}</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving || !selectedId}
            className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-8 h-12 rounded-xl"
          >
            {saving ? <Loader2 className="animate-spin" /> : 'Confirm Selection'}
          </Button>
        </div>
      </div>
      
      <p className="text-[10px] text-white/20 flex items-center gap-2">
        <Info className="w-3 h-3" />
        This setting will apply to your next billing cycle.
      </p>
    </div>
  );
}
