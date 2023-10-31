import {auth, currentUser} from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

import { isAbsoluteUrl } from "next/dist/shared/lib/utils";
import { absoluteURL } from "@/lib/utils";

const settingsUrl = absoluteURL('/settings')

export async function GET(){
    try{
        const {userId} = auth()
        const user = await currentUser()

        if(!userId || !user){
            return new NextResponse("[NEXT] Unauthorized" , {status:401})
        }
        console.log("GET a api/stripe - [USER] ", user)
        const userSubscription = await prismadb.userSubscription.findUnique({where: {userID: userId}})

        if(userSubscription && userSubscription.stripeSubscriptionID){
            console.log('User has suscription!')
            console.log(userSubscription)
            // If we have a subscription -> We dont create a paycheck. We send the user to the refund
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerID!, 
                return_url: settingsUrl
            });
            return new NextResponse(JSON.stringify({url:stripeSession.url}))
        }
        else{
            console.log('User has NO suscription!')
            console.log(userSubscription)
            
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "Genius PRO",
                                description: "Unlimited AI Generations"
                            },
                            unit_amount: 2000,
                            recurring: {
                                interval: "month"
                            }
                        },

                        quantity: 1,
                    },
                ],
                metadata: {
                    userId, 
                },
            })
            return new NextResponse(JSON.stringify({url:stripeSession.url}))
        }

    }catch(error){
        console.log("[STRIPE_ERROR] ", error)
        return new NextResponse("Internal error", {status:500})
    }
}