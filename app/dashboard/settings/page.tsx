'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, CreditCard, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-12 max-w-4xl">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Account Settings</h1>
        <p className="text-white/40">Manage your profile, security, and subscription.</p>
      </header>

      {/* Profile Section */}
      <section className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10">
        <div className="flex items-center gap-3 mb-10">
          <User className="text-emerald-400 w-6 h-6" />
          <h2 className="text-xl font-bold">Public Profile</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <Label className="text-white/60">Full Name</Label>
            <Input className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="John Doe" />
          </div>
          <div className="space-y-4">
            <Label className="text-white/60">Avatar URL</Label>
            <Input className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="https://..." />
          </div>
        </div>
        <Button className="bg-emerald-500 text-black font-bold h-12 px-8 rounded-xl">Save Changes</Button>
      </section>

      {/* Subscription Portal */}
      <section className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="text-cyan-400 w-6 h-6" />
          <h2 className="text-xl font-bold">Billing & Subscription</h2>
        </div>
        <p className="text-white/40 text-sm mb-8 leading-relaxed max-w-xl">
          Change your plan, update payment methods, or download invoices via the secure Stripe customer portal.
        </p>
        <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 font-bold flex items-center gap-4">
          Open Stripe Portal <ArrowRight size={18} />
        </Button>
      </section>

      {/* Security Section */}
      <section className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10">
        <div className="flex items-center gap-3 mb-10">
          <Lock className="text-amber-400 w-6 h-6" />
          <h2 className="text-xl font-bold">Security</h2>
        </div>
        <div className="max-w-md space-y-6 mb-10">
          <div className="space-y-4">
            <Label className="text-white/60">New Password</Label>
            <Input type="password" className="bg-white/5 border-white/10 h-12 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Label className="text-white/60">Confirm New Password</Label>
            <Input type="password" className="bg-white/5 border-white/10 h-12 rounded-xl" />
          </div>
        </div>
        <Button variant="outline" className="border-white/10 h-12 px-8 rounded-xl font-bold">Update Password</Button>
      </section>

      {/* Danger Zone */}
      <section className="p-10 border border-rose-500/20 bg-rose-500/5 rounded-[2.5rem] flex items-center justify-between">
        <div>
          <h3 className="text-rose-400 font-bold text-lg mb-1">Delete Account</h3>
          <p className="text-rose-400/60 text-sm">Once deleted, your score history and entries are lost forever.</p>
        </div>
        <Button variant="ghost" className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-bold px-8 h-12 rounded-xl gap-2">
          <Trash2 size={18} /> Delete Account
        </Button>
      </section>
    </div>
  );
}
