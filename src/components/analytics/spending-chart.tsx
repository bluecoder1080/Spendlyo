"use client"

import { useTransactionStore } from "@/store/useTransactionStore"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState, useMemo } from "react"
import { format, subDays, startOfDay, isSameDay } from "date-fns"

export function SpendingChart() {
  const [mounted, setMounted] = useState(false)
  const transactions = useTransactionStore((state) => state.transactions)

  useEffect(() => {
    setMounted(true)
  }, [])

  const data = useMemo(() => {
    const today = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i)
      return {
        date,
        day: format(date, "EEE"), // Mon, Tue...
        income: 0,
        expense: 0,
      }
    })

    transactions.forEach((t) => {
      const tDate = new Date(t.date)
      const dayStat = last7Days.find((d) => isSameDay(d.date, tDate))
      if (dayStat) {
        if (t.type === "income") {
          dayStat.income += t.amount
        } else {
          dayStat.expense += t.amount
        }
      }
    })

    return last7Days
  }, [transactions])

  if (!mounted) return null

  return (
    <Card className="col-span-1 lg:col-span-4 transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          Income vs Expense for the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            />
            <Bar
              dataKey="income"
              fill="rgb(34, 197, 94)" 
              radius={[4, 4, 0, 0]}
              name="Income"
            />
            <Bar
              dataKey="expense"
              fill="rgb(239, 68, 68)"
              radius={[4, 4, 0, 0]}
              name="Expense"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
