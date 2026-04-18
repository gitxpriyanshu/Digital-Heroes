import { getServiceRoleClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

/**
 * Configure a new draw.
 */
export async function POST(req: Request) {
  const supabase = getServiceRoleClient();
  const { draw_month, draw_logic, prize_pool_total } = await req.json();

  const { data, error } = await supabase
    .from('draws')
    .insert({
      draw_month,
      draw_logic,
      prize_pool_total,
      status: 'draft'
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
