'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? 'py-4 bg-black/80 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0f4c35] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4a947]/10">
            <Trophy className="text-[#d4a947] w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">Digital Heroes</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink href="/how-it-works" label="How it Works" />
          <NavLink href="/prizes" label="Prizes" />
          <NavLink href="/charities" label="Charities" />
          <Button asChild className="bg-[#0f4c35] text-white hover:bg-[#156b4a] font-bold px-8 h-12 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#0f4c35]/20">
            <Link href="/subscribe">Start Playing</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white">
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-black border-b border-white/5 p-8 flex flex-col gap-6"
        >
          <Link href="/how-it-works" className="text-xl font-bold" onClick={() => setMobileMenu(false)}>How it Works</Link>
          <Link href="/prizes" className="text-xl font-bold" onClick={() => setMobileMenu(false)}>Prizes</Link>
          <Link href="/charities" className="text-xl font-bold" onClick={() => setMobileMenu(false)}>Charities</Link>
          <Button asChild className="bg-[#0f4c35] text-white font-bold h-14 rounded-2xl">
            <Link href="/subscribe" onClick={() => setMobileMenu(false)}>Subscribe Now</Link>
          </Button>
        </motion.div>
      )}
    </nav>
  );
}

function NavLink({ href, label }: { href: string, label: string }) {
  return (
    <Link 
      href={href} 
      className="text-white/60 hover:text-white font-bold text-sm tracking-wide transition-colors relative group"
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4a947] transition-all group-hover:w-full" />
    </Link>
  );
}
