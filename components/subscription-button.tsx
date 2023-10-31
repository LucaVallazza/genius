"use client"

import { Loader, Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface SubscriptionButtonProps{
    isPro: boolean;
}

export const SubscriptionButton = ({isPro = false}:SubscriptionButtonProps) => {
    const [isLoading, setLoading] = useState(false)

    const onClick = async () =>{
        try {
            setLoading(true)
            const response = await axios.get("api/stripe")
            console.log(response.data)
            window.location.href = response.data.url;
        } catch (error) {
            toast.error("Something went wrong")
            console.log("BILLING_ERROR", error)
        } finally {
            setLoading(false)
        }
    }
    return(
        <Button className="my-4"  onClick={onClick} variant={isPro? "default" : "premium"} disabled = {isLoading}>
            {isPro? "Manage Subscription" : "Upgrade"}
            {isLoading && <Loader className="w-4 h-4 ml-2 animate-spin" />}
            {!isPro && !isLoading && <Zap className="w-4 h-4 ml-2 fill-white" /> }
        </Button>
    )

}