'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Map, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="mb-12 inline-block p-8 rounded-[3rem] bg-[#0f4c35]/20 border border-[#0f4c35]/30"
        >
          <Map className="text-[#d4a947] w-20 h-20" />
        </motion.div>

        <h1 className="text-6xl font-black mb-6 tracking-tighter italic">Out of Bounds.</h1>
        <p className="text-white/40 text-lg mb-12">
          Looks like this page doesn't exist. Let's get you back on the green.
        </p>

        <Button asChild size="lg" className="h-16 px-10 bg-[#0f4c35] text-white font-black rounded-2xl shadow-2xl">
          <Link href="/">Back to Fairway <ArrowRight className="ml-2" /></Link>
        </Button>
      </div>
    </div>
  );
}
