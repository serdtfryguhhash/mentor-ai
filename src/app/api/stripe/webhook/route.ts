import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    // In production: Verify Stripe webhook signature and handle events
    // const sig = req.headers.get('stripe-signature');
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    // Handle checkout.session.completed, customer.subscription.updated, etc.

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
