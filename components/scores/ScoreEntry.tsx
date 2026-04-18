'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Calendar, Target, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const scoreSchema = z.object({
  score: z.coerce.number().min(1, 'Min score is 1').max(45, 'Max Stableford score is 45'),
  score_date: z.string().min(1, 'Date is required').refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  }, { message: "Date cannot be in the future" }),
});

type ScoreFormValues = z.infer<typeof scoreSchema>;

export default function ScoreEntry({ onScoreAdded }: { onScoreAdded: () => void }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ScoreFormValues>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      score_date: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (values: ScoreFormValues) => {
    setLoading(true);

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save score');
      }

      toast.success('Score saved successfully! Hope it was a great round.');
      reset();
      onScoreAdded();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Plus className="text-emerald-400 w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold">New Score</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="score" className="text-white/60 ml-1">Stableford Score</Label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <Input
                id="score"
                type="number"
                placeholder="1-45"
                {...register('score')}
                className="bg-white/5 border-white/10 h-12 pl-12 rounded-xl focus:border-emerald-500/50 transition-all text-white"
              />
            </div>
            {errors.score && <p className="text-rose-400 text-xs ml-1">{errors.score.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="score_date" className="text-white/60 ml-1">Round Date</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <Input
                id="score_date"
                type="date"
                {...register('score_date')}
                className="bg-white/5 border-white/10 h-12 pl-12 rounded-xl focus:border-emerald-500/50 transition-all text-white [color-scheme:dark]"
              />
            </div>
            {errors.score_date && <p className="text-rose-400 text-xs ml-1">{errors.score_date.message}</p>}
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-14 bg-emerald-500 text-black hover:bg-emerald-400 font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all"
        >
          {loading ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <span className="flex items-center gap-2">
              Submit Score
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
