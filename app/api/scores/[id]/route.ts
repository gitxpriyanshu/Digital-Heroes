import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateSchema = z.object({
  score: z.number().min(1).max(45),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const json = await req.json();
    const { score } = updateSchema.parse(json);

    const { data, error } = await supabase
      .from('scores')
      .update({ score })
      .eq('id', params.id)
      .eq('user_id', session.user.id) // Ensure ownership
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', params.id)
    .eq('user_id', session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
