'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 p-6 rounded-[3rem] bg-rose-500/10 border border-rose-500/20 inline-block"
        >
          <AlertTriangle className="text-rose-500 w-16 h-16" />
        </motion.div>
        
        <h1 className="text-4xl font-black mb-4">Something went wrong</h1>
        <p className="text-white/40 mb-10 leading-relaxed">
          We've hit a bunker. Our team has been notified. You can try refreshing the page or head back to the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            className="h-14 bg-white text-black font-bold rounded-2xl px-8 flex gap-2"
          >
            <RefreshCcw size={18} /> Try Again
          </Button>
          <Button 
            asChild
            variant="outline"
            className="h-14 border-white/10 hover:bg-white/5 font-bold rounded-2xl px-8 flex gap-2"
          >
            <Link href="/"><Home size={18} /> Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
