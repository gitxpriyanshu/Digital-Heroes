'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientClient } from '@/lib/supabase';

export default function ProofUpload({ winnerId, onUploadSuccess }: { winnerId: string, onUploadSuccess: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClientClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${winnerId}-${Math.random()}.${fileExt}`;
      const filePath = `winner-proofs/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('winner-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('winner-proofs')
        .getPublicUrl(filePath);

      // 3. Update Winners Table
      const { error: updateError } = await supabase
        .from('winners')
        .update({ 
          proof_url: publicUrl,
          status: 'verified' // Automatically mark as verified or keep as pending for admin check
        })
        .eq('id', winnerId);

      if (updateError) throw updateError;

      setSuccess(true);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center">
      {!success ? (
        <div className="space-y-4">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-emerald-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Verification Required</h3>
          <p className="text-white/40 text-sm max-w-xs mx-auto mb-6">
            Please upload a photo of your scorecard or a screenshot of the official club results to claim your prize.
          </p>
          
          <div className="relative inline-block">
            <input 
              type="file" 
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <Button disabled={uploading} className="bg-emerald-500 text-black font-bold h-12 px-8 rounded-xl">
              {uploading ? <Loader2 className="animate-spin" /> : 'Choose File'}
            </Button>
          </div>

          {error && (
            <p className="text-rose-400 text-xs mt-4 flex items-center justify-center gap-1">
              <AlertCircle size={12} /> {error}
            </p>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4"
        >
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-black w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Proof Submitted</h3>
          <p className="text-white/40 text-sm">
            Thank you! Our team will review your proof and process your payment shortly.
          </p>
        </motion.div>
      )}
    </div>
  );
}
