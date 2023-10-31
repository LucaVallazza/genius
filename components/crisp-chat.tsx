"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat=()=>{
    useEffect(()=> {
        Crisp.configure("56f97f47-8c5f-479c-9eb3-c5e957eaef41")
    } , [])

    return null
}