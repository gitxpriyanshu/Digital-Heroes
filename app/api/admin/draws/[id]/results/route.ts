import { getServiceRoleClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getServiceRoleClient();

  const { data: results, error } = await supabase
    .from('draw_results')
    .select('*, draws(*)')
    .eq('draw_id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: winners } = await supabase
    .from('winners')
    .select('*, users(full_name, email)')
    .eq('draw_id', params.id);

  return NextResponse.json({
    draw: results.draws,
    winningNumbers: results.winning_numbers,
    winners
  });
}
