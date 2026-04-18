import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const scoreSchema = z.object({
  score: z.number().min(1).max(45),
  score_date: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(date.getTime()) && date <= today;
  }, { message: "Date cannot be in the future" }),
});

export async function GET() {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', session.user.id)
    .order('score_date', { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const json = await req.json();
    const { score, score_date } = scoreSchema.parse(json);

    // Check for duplicate date for this user
    const { data: existing } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('score_date', score_date)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'A score for this date already exists.' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: session.user.id,
        score,
        score_date,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
