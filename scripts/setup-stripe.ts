import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY is not defined in .env.local');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27' as any,
});

async function setupStripe() {
  console.log('🚀 Starting Stripe Product Setup...');

  try {
    // 1. Create Monthly Product
    const monthlyProduct = await stripe.products.create({
      name: 'Digital Hero Monthly',
      description: 'Monthly subscription to Digital-Heroes platform.',
      images: ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=400'],
    });

    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 2000, // £20.00
      currency: 'gbp',
      recurring: { interval: 'month' },
    });

    console.log(`✅ Monthly Product Created: ${monthlyProduct.name}`);
    console.log(`💰 Monthly Price ID: ${monthlyPrice.id}`);

    // 2. Create Yearly Product
    const yearlyProduct = await stripe.products.create({
      name: 'Digital Hero Yearly',
      description: 'Yearly subscription to Digital-Heroes platform (Discounted).',
      images: ['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=400'],
    });

    const yearlyPrice = await stripe.prices.create({
      product: yearlyProduct.id,
      unit_amount: 20000, // £200.00 (Save £40/year)
      currency: 'gbp',
      recurring: { interval: 'year' },
    });

    console.log(`✅ Yearly Product Created: ${yearlyProduct.name}`);
    console.log(`💰 Yearly Price ID: ${yearlyPrice.id}`);

    console.log('\n✨ Setup Complete! Add these Price IDs to your .env.local:');
    console.log(`NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
    console.log(`NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}`);

  } catch (error) {
    console.error('❌ Setup Failed:', error);
  }
}

setupStripe();
