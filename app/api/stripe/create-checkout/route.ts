import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json();

    if (!userId || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Map plan to Price IDs (In a real app, these should be in env)
    const priceId = plan === 'monthly' 
      ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID 
      : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan or Price ID missing' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
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
        userId: userId,
        plan: plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
