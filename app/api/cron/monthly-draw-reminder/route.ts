import { getServiceRoleClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  // Check for Vercel Cron header to prevent unauthorized calls
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = getServiceRoleClient();

  // 1. Get all active subscribers
  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('user_id, users(email, full_name)')
    .eq('status', 'active');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 2. Send reminders (Batching would be better for high volumes)
  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      if (!sub.users?.email) return;
      
      return resend.emails.send({
        from: 'Digital Heroes <no-reply@digital-heroes.com>',
        to: sub.users.email,
        subject: '⛳️ Important: Log your scores before the draw!',
        html: `
          <div style="font-family: sans-serif; padding: 40px; background: #000; color: #fff;">
            <h1 style="color: #10b981;">Final Call for Scores!</h1>
            <p>Hi ${sub.users.full_name},</p>
            <p>This is a friendly reminder to ensure you have 5 scores logged in your dashboard before this month's draw.</p>
            <p>Your 5 most recent scores are your entry to winning the jackpot. Don't miss out!</p>
            <a href="https://digital-heroes.com/dashboard/scores" style="display: inline-block; padding: 12px 24px; background: #10b981; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;">Log Scores Now</a>
          </div>
        `
      });
    })
  );

  return NextResponse.json({ 
    processed: subs.length,
    successCount: results.filter(r => r.status === 'fulfilled').length 
  });
}
