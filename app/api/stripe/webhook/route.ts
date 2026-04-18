import { stripe } from '@/lib/stripe';
import { getServiceRoleClient } from '@/lib/supabase-server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = headers().get('Stripe-Signature');

  if (!signature) {
    console.warn('Webhook Error: Missing Stripe-Signature header');
    return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Webhook Error: Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`[WEBHOOK SIGNATURE VERIFICATION FAILED]`, err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (!event || !event.type) {
    return NextResponse.json({ error: 'Malformed Stripe event' }, { status: 400 });
  }

  const supabase = getServiceRoleClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // We defer subscription activation explicitly to invoice.paid
        // This guarantees we only act on authoritative payments rather than intent sessions
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by customer ID
        const { data: userData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer as string)
          .maybeSingle();

        if (userData) {
          let derivedStatus = 'lapsed';
          const isActive = subscription.status === 'active';
          
          if (isActive) {
            derivedStatus = 'active';
          } else if (['incomplete', 'incomplete_expired'].includes(subscription.status)) {
            // Explictly catch SCA/3D-Secure failures and deferred payment processing states
            derivedStatus = subscription.status;
            console.log(`[WEBHOOK WARNING] Subscription ${subscription.id} for UI: ${userData.user_id} shifted to ${derivedStatus} state.`);
          }

          await supabase.from('subscriptions')
            .update({
              status: derivedStatus,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('stripe_customer_id', subscription.customer as string);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const { data: userData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer as string)
          .maybeSingle();

        if (userData) {
          await supabase.from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('stripe_customer_id', subscription.customer as string);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) break;

        const subscriptionId = invoice.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Deep extract the metadata explicitly wired during Create Checkout
        const userId = subscription.metadata?.user_id || invoice.subscription_details?.metadata?.user_id;
        const plan = subscription.metadata?.plan;

        if (!userId) {
          console.warn(`[WEBHOOK WARN] Could not map user_id on invoice.paid. Missing active metadata for ${invoice.id}`);
          break;
        }

        if (!plan || !['monthly', 'yearly'].includes(plan)) {
          console.error(`[WEBHOOK ERROR] Payload rejected due to missing commercial plan strictly on invoice ${invoice.id}`);
          return NextResponse.json({ error: 'Data Integrity Failure: Invalid plan payload' }, { status: 400 });
        }

        const { data: charityData } = await supabase
          .from('charity_selections')
          .select('contribution_percentage, charity_id')
          .eq('user_id', userId)
          .maybeSingle();

        const percentage = (charityData?.contribution_percentage || 10) / 100;
        const totalPaid = invoice.amount_paid / 100;
        
        const charityAmount = totalPaid * percentage;
        const prizePoolAmount = totalPaid * (1 - percentage);

        // ATOMIC PROCESSING: Execute natively inside a single Postgres transaction boundary.
        // It locks idempotency, updates subscriptions, pushes financial ledgers, and allocates draws in one heartbeat.
        const { error: rpcError } = await supabase.rpc('process_stripe_invoice_paid', {
          p_event_id: event.id,
          p_type: event.type,
          p_user_id: userId,
          p_customer_id: invoice.customer as string,
          p_sub_id: subscriptionId,
          p_plan: plan,
          p_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          p_total_paid: totalPaid,
          p_charity_amount: charityAmount,
          p_prize_amount: prizePoolAmount,
          p_charity_pct: percentage * 100
        });

        if (rpcError) {
          console.error('[WEBHOOK RPC CRASH]', rpcError);
          return NextResponse.json({ error: 'Atomic sync failed' }, { status: 500 });
        }

        break;
      }
      
      default:
        console.log(`[WEBHOOK UNHANDLED EVENT] Received unhandled event type: ${event.type}`);
        // We return true so Stripe doesn't infinitely retry ignored events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[WEBHOOK PROCESSING CRASH]', error);
    return NextResponse.json({ error: 'Internal webhook execution failure' }, { status: 500 });
  }
}
