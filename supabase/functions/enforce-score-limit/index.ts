import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { record, table, type } = await req.json()

  // This function would be called via a Database Webhook on INSERT
  if (table === 'scores' && type === 'INSERT') {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: scores, error } = await supabaseClient
      .from('scores')
      .select('id')
      .eq('user_id', record.user_id)
      .order('score_date', { ascending: true })

    if (scores && scores.length > 5) {
      const oldestScore = scores[0]
      await supabaseClient
        .from('scores')
        .delete()
        .eq('id', oldestScore.id)
    }
  }

  return new Response(JSON.stringify({ message: "Processed" }), {
    headers: { "Content-Type": "application/json" },
  })
})
