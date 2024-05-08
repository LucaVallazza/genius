import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function LoadingRoute() {
    const router = useRouter();
  
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        const handleStart = (url:any) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url:any) => (url === router.asPath) && setLoading(false);
  
        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)
  
        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })
    
    return <div>Loading....{/*I have an animation here*/}</div>;
  }