import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default function Home() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <Overview />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RecentTransactions />
          <div className="col-span-1 lg:col-span-4 rounded-xl border bg-card text-card-foreground shadow p-6">
             <h3 className="font-semibold leading-none tracking-tight mb-4">Analytics (Coming Soon)</h3>
             <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Chart Placeholder
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
