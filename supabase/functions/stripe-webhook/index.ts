import Stripe from 'stripe';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const STRIPE_SECRET = Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const stripe = new Stripe(STRIPE_SECRET!, { apiVersion: '2024-06-20' });

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature');
    let event: Stripe.Event;

    if (!sig || !STRIPE_WEBHOOK_SECRET) {
      return new Response('Webhook signature missing', { status: 400 });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: persist the payment with Supabase client (service role)
        break;
      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
});
