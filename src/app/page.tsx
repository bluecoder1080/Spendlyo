"use client"

import dynamic from "next/dynamic"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AddTransaction } from "@/components/transactions/add-transaction"

// Lazy load analytics charts for better performance
const SpendingChart = dynamic(() => import("@/components/analytics/spending-chart").then(mod => ({ default: mod.SpendingChart })), {
  loading: () => <div className="col-span-1 lg:col-span-4 h-[450px] animate-pulse bg-muted rounded-lg" />,
  ssr: false
})

const CategoryPieChart = dynamic(() => import("@/components/analytics/category-pie-chart").then(mod => ({ default: mod.CategoryPieChart })), {
  loading: () => <div className="col-span-1 lg:col-span-3 h-[400px] animate-pulse bg-muted rounded-lg" />,
  ssr: false
})

export default function Home() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <AddTransaction />
        </div>
      </div>
      <div className="space-y-6">
        <Overview />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <SpendingChart />
          <CategoryPieChart />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
           <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
