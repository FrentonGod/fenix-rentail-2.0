import Stripe from 'stripe';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const STRIPE_SECRET = Deno.env.get('STRIPE_SECRET_KEY');
const stripe = new Stripe(STRIPE_SECRET!, { apiVersion: '2024-06-20' });

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  try {
    const { amount, currency = 'mxn', description = 'Pago MQerK', success_url, cancel_url } = await req.json();
    if (!amount || !success_url || !cancel_url) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url,
      cancel_url,
    });

    return new Response(JSON.stringify({ id: session.id, url: session.url }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
});
