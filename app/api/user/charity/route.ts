import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('charity_selections')
    .select('*, charities(*)')
    .eq('user_id', session.user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || null);
}

export async function POST(req: Request) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { charity_id, contribution_percentage } = await req.json();

    if (!charity_id) {
      return NextResponse.json({ error: 'Charity ID is required' }, { status: 400 });
    }

    const percentage = Math.min(100, Math.max(10, contribution_percentage || 10));

    const { data, error } = await supabase
      .from('charity_selections')
      .upsert({
        user_id: session.user.id,
        charity_id,
        contribution_percentage: percentage,
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
