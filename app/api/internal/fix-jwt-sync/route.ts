import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase-server';

// This endpoint serves as a headless cron-compatible recovery task.
// It detects and natively patches any JWT Auth metadata failures that 
// Postgres flagged during high-velocity Stripe webhooks.
export async function POST(req: Request) {
  // Hard authorization boundary. Rejects any execution lacking the physical Cron secret.
  const internalSecret = req.headers.get('x-internal-secret');
  if (!internalSecret || internalSecret !== process.env.INTERNAL_SECRET) {
    console.error('[JWT RECOVERY] Unauthorized execution attempt blocked.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  const BATCH_LIMIT = 50; // Cap execution cycle to prevent Vercel timeout exhaustion

  // 1. Fetch dropped syncs using strict chronological sorting and queue-limit filtering
  const { data: subs, error: fetchErr } = await supabase
    .from('subscriptions')
    .select('id, user_id, status, jwt_sync_retries')
    .eq('needs_jwt_sync', true)
    .lt('jwt_sync_retries', 5) // Circuit Breaker: Prevents permanently dead profiles from starving the queue
    .order('created_at', { ascending: true }) // First-in, First-out processing guarantee
    .limit(BATCH_LIMIT);

  if (fetchErr) {
    console.error('[JWT RECOVERY] Failed to fetch out-of-sync subscriptions:', fetchErr);
    return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
  }

  if (!subs || subs.length === 0) {
    return NextResponse.json({ status: 'healthy', repaired: 0, pending: 0 });
  }

  console.log(`[JWT RECOVERY] Initiating batch execution. Target count: ${subs.length}`);

  let repairedCount = 0;
  let failedCount = 0;

  // 2. Perform sequential Admin API overwrites
  // Sequential looping prevents ratelimiting the Supabase GoTrue Auth API cluster.
  for (const sub of subs) {
    const isActive = sub.status === 'active';
    
    // Natively execute the GoTrue repair override
    const { error: authErr } = await supabase.auth.admin.updateUserById(sub.user_id, {
      user_metadata: { is_subscribed: isActive }
    });

    if (!authErr) {
      // Clear the local state flag strictly after 100% guarantee from the Auth network
      await supabase
        .from('subscriptions')
        .update({ needs_jwt_sync: false, jwt_sync_retries: 0 })
        .eq('id', sub.id);
        
      repairedCount++;
      console.log(`[JWT RECOVERY] Synced JWT User ID: ${sub.user_id} -> ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
    } else {
      failedCount++;
      const nextIteration = (sub.jwt_sync_retries || 0) + 1;
      
      if (nextIteration >= 5) {
        // PERMANENT DEAD-LETTER QUEUE
        // Remove from the active CRON cycle but mark as explicitly broken for Administrator dashboards.
        await supabase
          .from('subscriptions')
          .update({ 
            needs_jwt_sync: false, 
            is_dead: true, 
            jwt_sync_retries: nextIteration 
          })
          .eq('id', sub.id);
          
        console.error(`[JWT DEAD-LETTER] Critical: User ID ${sub.user_id} structurally failed 5 recovery attempts. Marked as DEAD.`);
      } else {
        // Standard exponential retry step
        await supabase
          .from('subscriptions')
          .update({ jwt_sync_retries: nextIteration })
          .eq('id', sub.id);

        console.error(`[JWT RECOVERY] Failed to repair auth.users for User ID: ${sub.user_id} (Attempt ${nextIteration}/5):`, authErr.message);
      }
    }
  }

  console.log(`[JWT RECOVERY BATCH COMPLETE] Repaired: ${repairedCount} | Failed: ${failedCount}`);

  return NextResponse.json({ 
    status: 'completed', 
    batch_size: subs.length,
    repaired: repairedCount,
    failed: failedCount,
    has_more: subs.length === BATCH_LIMIT 
  });
}
