import Navbar from "@/components/ui/navbar"
import Sidebar from "@/components/ui/sidebar"
import { getApiLimitCount } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription"
import { useState } from "react"



const DashboardLayout = async ({ children }: { children: React.ReactDOM }) => {
  const apiLimitCount = await getApiLimitCount()

  const isPro = await checkSubscription()

  return (
    <div className="relative h-full">
      <div
        className="hidden h-full bg-gray-900 md:fixed
            md:inset-y-0 md:flex md:w-72 md:flex-col"
      >
        <Sidebar isPro = {isPro} apiLimitCount = {apiLimitCount} />
      </div>
      <main className="md:ml-72">
        <Navbar />
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
