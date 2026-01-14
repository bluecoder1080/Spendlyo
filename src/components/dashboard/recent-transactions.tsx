"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useTransactionStore } from "@/store/useTransactionStore"
import { useEffect, useState } from "react"
import { format } from "date-fns"
  
  export function RecentTransactions() {
    // Hydration fix
    const [mounted, setMounted] = useState(false)
    const transactions = useTransactionStore((state) => state.transactions)
    // const fetchTransactions = useTransactionStore((state) => state.fetchTransactions) // Already fetched in Overview? Better to fetch here too or rely on store dedup/SWR? Zustand is global.
    // We assume Overview mounts first or simultaneously. Fetching twice is fine for now, or just let Overview handle it. 
    // Actually, `fetchTransactions` in Overview might be enough.
    
    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) return null

    const recent = transactions.slice(0, 5)

    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            You made {transactions.length} transactions in total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {recent.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No transactions yet.</p>
            )}
            {recent.map((transaction) => (
                <div key={transaction.id} className="flex items-center">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        transaction.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                    }`}>
                        {transaction.category.substring(0, 2).toUpperCase()}
                    </div>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                        {transaction.category} • {format(new Date(transaction.date), 'MMM dd')}
                    </p>
                </div>
                <div className={`ml-auto font-medium ${
                     transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
