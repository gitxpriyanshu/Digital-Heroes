'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Plus, 
  Search, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  Star, 
  Image as ImageIcon,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClientClient } from '@/lib/supabase';

export default function AdminCharities() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createClientClient();

  useEffect(() => {
    async function fetchCharities() {
      const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false });
      if (data) setCharities(data);
      setLoading(false);
    }
    fetchCharities();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (editingCharity) {
        await supabase.from('charities').update(data).eq('id', editingCharity.id);
      } else {
        await supabase.from('charities').insert(data);
      }
      window.location.reload();
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('charities').update({ is_featured: !current }).eq('id', id);
    window.location.reload();
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Charity Partners</h1>
          <p className="text-white/40">Onboard new impact partners and manage their profiles.</p>
        </div>
        <Button 
          onClick={() => { setEditingCharity(null); setModalOpen(true); }}
          className="h-12 bg-emerald-500 text-black font-bold rounded-xl px-8 flex gap-2"
        >
          <Plus size={18} /> Add New Partner
        </Button>
      </header>

      <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Partner</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Feature Status</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Impact Rating</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black">Status</th>
              <th className="px-8 py-5 text-[10px] text-white/30 uppercase tracking-widest font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {charities.map((charity) => (
              <tr key={charity.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 p-2 border border-white/5 flex items-center justify-center">
                      <img src={charity.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-bold">{charity.name}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold truncate max-w-[200px]">
                        {charity.website}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => toggleFeatured(charity.id, charity.is_featured)}
                    className={`flex items-center gap-2 text-xs font-bold transition-colors ${charity.is_featured ? 'text-amber-400' : 'text-white/10 hover:text-white/40'}`}
                  >
                    <Star size={14} fill={charity.is_featured ? 'currentColor' : 'none'} />
                    {charity.is_featured ? 'Featured Spotlight' : 'Standard Partner'}
                  </button>
                </td>
                <td className="px-8 py-6 text-sm font-bold">9.8/10</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    charity.is_active 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {charity.is_active ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-white/5 hover:text-emerald-400 transition-all rounded-xl">
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-white/5 hover:text-rose-500 transition-all rounded-xl">
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charity CRUD Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-40" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-black border border-white/10 rounded-[3rem] p-12 z-50 shadow-2xl"
            >
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-10 right-10 text-white/20 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                <Heart className="text-rose-500" /> {editingCharity ? 'Edit Partner' : 'Add New Partner'}
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <Label className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Charity Name</Label>
                    <Input name="name" defaultValue={editingCharity?.name} className="bg-white/5 border-white/10 h-14 rounded-2xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Logo URL</Label>
                    <Input name="logo_url" defaultValue={editingCharity?.logo_url} className="bg-white/5 border-white/10 h-14 rounded-2xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Website</Label>
                    <Input name="website" defaultValue={editingCharity?.website} className="bg-white/5 border-white/10 h-14 rounded-2xl" required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Description</Label>
                    <textarea 
                      name="description" 
                      defaultValue={editingCharity?.description}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-emerald-500/50"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={saving}
                  className="w-full h-14 bg-emerald-500 text-black font-bold rounded-2xl text-lg shadow-xl shadow-emerald-500/20"
                >
                  {saving ? <Loader2 className="animate-spin" /> : 'Save Partner Profile'}
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
