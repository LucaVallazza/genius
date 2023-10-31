import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { StringMappingType } from "typescript";
import { checkApiLimit } from '@/lib/api-limit';

export async function POST(req: Request) {
  console.log('api/webhook')
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {

    console.log(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log('Session: ' , session)
  
  console.log('CheckoutSession: ',event.type)
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session.metadata?.userId) {
      console.log('User ID IS REQ')
      return new NextResponse("User id is required", { status: 400 });
    }

    console.log("Mandamo sub checkApiLimit" , subscription);
    await prismadb.userSubscription.create({
      data:{ 
        userID: session?.metadata?.userId,
        stripeSubscriptionID: subscription.id,
        stripeCustomerID: subscription.customer as string,
        //We just have one item in data array, so we use 0
        stripePriceID: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),

      }
    })
  }

  if(event.type === "invoice.payment_succeeded"){
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await prismadb.userSubscription.update({
      where: {
        stripeSubscriptionID: subscription.id
      },
      data: {
        stripePriceID: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, {status: 200});
}
