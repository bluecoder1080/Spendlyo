"use client"

import { useTransactionStore } from "@/store/useTransactionStore"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState, useMemo } from "react"
import { Category } from "@/lib/types"

const COLORS = [
  "#0ea5e9", // Sky
  "#f43f5e", // Rose
  "#eab308", // Yellow
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#64748b", // Slate
]

export function CategoryPieChart() {
  const [mounted, setMounted] = useState(false)
  const transactions = useTransactionStore((state) => state.transactions)

  useEffect(() => {
    setMounted(true)
  }, [])

  const data = useMemo(() => {
    const categoryMap: Record<string, number> = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0
        }
        categoryMap[t.category] += t.amount
      })

    return Object.keys(categoryMap).map((cat) => ({
      name: cat,
      value: categoryMap[cat],
    }))
    .sort((a, b) => b.value - a.value)
  }, [transactions])

  if (!mounted) return null

  return (
    <Card className="col-span-1 lg:col-span-3 transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          Distribution of your expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
           <div className="h-[300px] flex items-center justify-center text-muted-foreground">
             No expense data yet
           </div>
        ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                 formatter={(value: number | undefined) => `₹${(value || 0).toLocaleString()}`}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
