import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";
import { isValid } from "zod";

// We use this as a grace period
const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: { userID: userId },
    select: {
        stripeSubscriptionID: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerID: true,
        stripePriceID: true
    },
  });

  if(!userSubscription){
    return false
  }else{
    const isValid =
    userSubscription.stripePriceID && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
  }

  return !!isValid;
};
