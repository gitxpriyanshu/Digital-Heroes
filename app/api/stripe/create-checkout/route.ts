import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { plan } = json;

    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selection' }, { status: 400 });
    }

    const priceId = plan === 'monthly' 
      ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID 
      : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;

    if (typeof priceId !== 'string' || priceId.trim() === '') {
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }

    // Safeguard to prevent duplicate subscriptions and get Customer ID
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('status, stripe_customer_id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (existingSub?.status === 'active') {
      return NextResponse.json({ error: 'User is already subscribed' }, { status: 409 });
    }

    const checkoutConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
      metadata: {
        userId: session.user.id,
        user_id: session.user.id,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          user_id: session.user.id,
          plan: plan,
        }
      }
    };

    if (existingSub?.stripe_customer_id) {
      checkoutConfig.customer = existingSub.stripe_customer_id;
    } else if (session.user.email) {
      checkoutConfig.customer_email = session.user.email;
    }

    // Idempotency: Deterministic time-window key to block parallel clicks, while allowing future valid retries
    const timeWindow = Math.floor(Date.now() / 30000); // 30-second window
    const idempotencyKey = `checkout_${session.user.id}_${plan}_${timeWindow}`;

    const stripeSession = await stripe.checkout.sessions.create(checkoutConfig, {
      idempotencyKey
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('[STRIPE CHECKOUT ERROR]', error);
    return NextResponse.json({ error: 'An internal server error occurred while creating checkout' }, { status: 500 });
  }
}
