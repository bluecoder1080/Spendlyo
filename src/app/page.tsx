import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AddTransaction } from "@/components/transactions/add-transaction"
import { SpendingChart } from "@/components/analytics/spending-chart"
import { CategoryPieChart } from "@/components/analytics/category-pie-chart"

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
