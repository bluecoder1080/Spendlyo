"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Category } from "@/lib/types"

interface CategoryTotal {
  category: Category
  total: number
  count: number
  percentage: number
}

export function CategoryBreakdown() {
  const [categories, setCategories] = useState<CategoryTotal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .lt('amount', 0) // Only expenses (negative amounts)

    if (!expenses) {
      setIsLoading(false)
      return
    }

    // Group by category
    const categoryMap = new Map<Category, { total: number; count: number }>()
    let grandTotal = 0

    expenses.forEach((expense) => {
      const category = expense.category as Category
      const amount = Math.abs(expense.amount)
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { total: 0, count: 0 })
      }
      
      const current = categoryMap.get(category)!
      current.total += amount
      current.count += 1
      grandTotal += amount
    })

    // Convert to array with percentages
    const categoryTotals: CategoryTotal[] = Array.from(categoryMap.entries())
      .map(([category, { total, count }]) => ({
        category,
        total,
        count,
        percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total) // Sort by highest spending

    setCategories(categoryTotals)
    setIsLoading(false)
  }

  const getCategoryIcon = (category: Category) => {
    const icons: Record<string, string> = {
      Food: '🍽️',
      Groceries: '🛒',
      Transport: '🚗',
      Travel: '✈️',
      Shopping: '🛍️',
      Clothes: '👕',
      Entertainment: '🎬',
      Bill: '📄',
      Health: '⚕️',
      Education: '📚',
      Salary: '💰',
      Investment: '📈',
      Other: '📌'
    }
    return icons[category] || '📌'
  }

  const getCategoryColor = (category: Category) => {
    const colors: Record<string, string> = {
      Food: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      Groceries: 'bg-green-500/10 text-green-500 border-green-500/20',
      Transport: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      Travel: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      Shopping: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      Clothes: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      Entertainment: 'bg-red-500/10 text-red-500 border-red-500/20',
      Bill: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      Health: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
      Education: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      Salary: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      Investment: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      Other: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
    return colors[category] || colors.Other
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No expenses yet. Add some expenses to see category breakdown!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map(({ category, total, count, percentage }) => (
            <div
              key={category}
              className={`flex items-center justify-between p-4 rounded-lg border ${getCategoryColor(category)}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <div>
                  <p className="font-semibold">{category}</p>
                  <p className="text-xs opacity-70">{count} transaction{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">₹{total.toLocaleString('en-IN')}</p>
                <p className="text-xs opacity-70">{percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
