'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreHorizontal, User, Mail, CreditCard, ChevronRight, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClientClient } from '@/lib/supabase';

interface UserSubscription {
  status: string;
  plan: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  subscriptions?: UserSubscription[];
  scores?: { count: number }[];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClientClient();

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await supabase
        .from('users')
        .select('*, subscriptions(*), scores(count)');
      
      if (data) setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, [supabase]);

  const filtered = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Member Directory</h1>
          <p className="text-white/40">Manage user accounts, subscriptions, and golf data.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
            <Input 
              placeholder="Search members..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border-white/10 h-12 pl-12 rounded-xl" 
            />
          </div>
          <Button variant="outline" className="h-12 border-white/10 rounded-xl px-6 font-bold flex gap-2">
            <Filter size={18} /> Filters
          </Button>
        </div>
      </header>

      <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] text-white/30 uppercase tracking-widest font-black">Member</th>
              <th className="px-8 py-6 text-[10px] text-white/30 uppercase tracking-widest font-black">Status</th>
              <th className="px-8 py-6 text-[10px] text-white/30 uppercase tracking-widest font-black">Sub Pool</th>
              <th className="px-8 py-6 text-[10px] text-white/30 uppercase tracking-widest font-black">Scores</th>
              <th className="px-8 py-6 text-[10px] text-white/30 uppercase tracking-widest font-black">Joined</th>
              <th className="px-8 py-6 text-[10px] text-white/30 uppercase tracking-widest font-black text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            {filtered.map((user) => (
              <tr 
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className="hover:bg-white/[0.01] transition-colors cursor-pointer group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 uppercase font-black text-xs">
                      {user.full_name?.[0] || 'H'}
                    </div>
                    <div>
                      <p className="font-bold">{user.full_name || 'Anonymous Hero'}</p>
                      <p className="text-xs text-white/30">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    user.subscriptions?.[0]?.status === 'active' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-white/5 border-white/10 text-white/30'
                  }`}>
                    {user.subscriptions?.[0]?.status || 'Free'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold capitalize">{user.subscriptions?.[0]?.plan || '--'}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.scores?.[0]?.count === 5 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-sm">{user.scores?.[0]?.count || 0}/5</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-white/40">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <Button variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={18} className="text-white/20" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Panel (Sliding) */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-[500px] bg-black border-l border-white/5 z-50 p-12 overflow-y-auto"
            >
              <button onClick={() => setSelectedUser(null)} className="absolute top-10 right-10 text-white/20 hover:text-white">
                <X size={24} />
              </button>

              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center uppercase font-black text-2xl text-emerald-500">
                  {selectedUser.full_name?.[0]}
                </div>
                <div>
                  <h2 className="text-3xl font-black">{selectedUser.full_name}</h2>
                  <p className="text-white/40">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-10">
                <section>
                  <h3 className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mb-6">Subscription Access</h3>
                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <CreditCard className="text-emerald-500" size={24} />
                        <div>
                          <p className="font-bold capitalize">{selectedUser.subscriptions?.[0]?.plan || 'Free Member'}</p>
                          <p className="text-xs text-white/40">Status: {selectedUser.subscriptions?.[0]?.status || 'Inactive'}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-[10px] font-black uppercase h-8 border-white/10 rounded-lg">Override</Button>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mb-6">Golf Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                      <p className="text-[10px] font-black uppercase text-white/20 mb-1">Entry Status</p>
                      <p className="text-xl font-black text-emerald-400">{selectedUser.scores?.[0]?.count}/5</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                      <p className="text-[10px] font-black uppercase text-white/20 mb-1">AVG Score</p>
                      <p className="text-xl font-black">74.2</p>
                    </div>
                  </div>
                </section>

                <div className="pt-10 flex gap-4">
                  <Button className="flex-1 h-12 bg-white text-black font-bold rounded-xl">Edit Profile</Button>
                  <Button variant="ghost" className="h-12 border border-rose-500/20 text-rose-500 font-bold px-6 rounded-xl">Suspend</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
