"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import {usePathname} from "next/navigation"

import { cn } from "@/lib/utils";
import { Code, ImageIcon, LayoutDashboard, MessageSquare, MusicIcon, Settings, VideoIcon } from "lucide-react";
import UsesCounter from "./uses-counter";
import { checkSubscription } from '@/lib/subscription';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

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

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-red-500",
  },
  {
    label: "Video generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-pink-600",
  },
  {
    label: "Music generation",
    icon: MusicIcon,
    href: "/music",
    color: "text-emerald-500",
  },
  {
    label: "Code generation",
    icon: Code,
    href: "/code",
    color: "text-green-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "white",
  },
];

interface SidebarProps {
  apiLimitCount : number;
  isPro: boolean
}

const Sidebar = ({apiLimitCount = 0, isPro = false} : SidebarProps) => {
 const pathname = usePathname(); 

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href={"/dashboard"} className="flex items-center pl-3 mb-14">
          <div
            className="relative w-8 h-8
                    mr-4"
          >
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1
            className={cn(
              "text-2xl font-bold tracking-wide",
              montserrat.className
            )}
          >
            GENIUS
          </h1>
        </Link>
        <div className="space-y-1">
          <div className="group"></div>

          {/* Map every route into the SIDEBAR component */}
          {routes.map((r) => (
            <Link
              href={r.href}
              key={r.href}
              className={cn(
                // Styles for EVERY route
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer  hover:bg-white/10 rounded-lg hover:text-white transition duration-300",
              
                // Assign a CUSTOM STYLE to the route if we are on its path
                pathname === r.href? "text-white bg-white/10" : 'text-zinc-400'
              )}
            >
              <div className="flex items-center flex-1 ">
                <r.icon className={cn("h-5 w-5 mr-3", r.color)} />
                {r.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <LoadingRoute></LoadingRoute>
      <UsesCounter isPro={isPro} count = {apiLimitCount}></UsesCounter>
    </div>
  );
};

export default Sidebar;
