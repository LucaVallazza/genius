"use client"

import {
  ArrowRight,
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  MusicIcon,
  Settings,
  VideoIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const routes = [
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Image generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    label: "Video generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
  },
  {
    label: "Music generation",
    icon: MusicIcon,
    href: "/music",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Code generation",
    icon: Code,
    href: "/code",
    color: "text-green-700",
    bgColor: "bg-green-700/10",
  },
];

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div>
      <div className="mb-8 space-y-4 ">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center ">
          {/* text-muted-foreground is a STYLE from SHADCN  */}
          Select one of our tools to start exploring!
        </p>
        <div className="flex-col px-5 md:px-15 lg:px-32 justify-center align-top space-y-4">
          {routes.map((r) => (
            <Card
            onClick={() => router.push(r.href)}
              key={r.href}
              className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition duration-300 ease-out cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className={cn("p-2 w-fit rounded-md", r.bgColor)}>
                  <r.icon className={cn("w-8 h-8", r.color)}>  </r.icon>
                </div>
                <div className="font-semibold">
                  {r.label}
                </div>
              </div>
              <ArrowRight className="w-5 h-5"></ArrowRight>

            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
