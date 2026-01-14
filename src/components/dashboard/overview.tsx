"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, IndianRupee, Wallet } from "lucide-react"
import { useTransactionStore } from "@/store/useTransactionStore"
import { useEffect, useState } from "react"

export function Overview() {
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false)
  const totalBalance = useTransactionStore((state) => state.getTotalBalance())
  const totalIncome = useTransactionStore((state) => state.getTotalIncome())
  const totalExpense = useTransactionStore((state) => state.getTotalExpense())

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const netSavings = totalIncome - totalExpense

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalBalance.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Current available balance
          </p>
        </CardContent>
      </Card>
      <Card className="border-t-4 border-t-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">₹{totalIncome.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
             Total earnings
          </p>
        </CardContent>
      </Card>
      <Card className="border-t-4 border-t-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
           <ArrowDownIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">₹{totalExpense.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
             Total spending
          </p>
        </CardContent>
      </Card>
       <Card className="border-t-4 border-t-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <IndianRupee className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">₹{netSavings.toLocaleString()}</div>
           <p className="text-xs text-muted-foreground">
            Income - Expenses
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
