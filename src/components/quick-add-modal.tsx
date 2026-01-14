"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTransactionStore } from "@/store/useTransactionStore"
import { parseExpenseText } from "@/utils/parseText"
import { classifyExpense } from "@/utils/classifyExpense"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

export function QuickAddModal() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [amountPrompt, setAmountPrompt] = useState<number | null>(null)
  const addTransaction = useTransactionStore((state) => state.addTransaction)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    setIsProcessing(true)

    try {
      // Parse amount
      const parsed = parseExpenseText(input)
      
      // If no amount found, ask user
      if (parsed.amount === null) {
        setAmountPrompt(0)
        setIsProcessing(false)
        return
      }

      // Classify expense
      const { category, note } = await classifyExpense(parsed.rawText, parsed.amount)

      // Save to Supabase
      await addTransaction({
        amount: parsed.amount,
        description: note,
        type: 'expense',
        category,
        date: new Date().toISOString().split('T')[0]
      })

      // Success feedback
      toast.success(`₹${parsed.amount} added to ${category} ${getCategoryEmoji(category)}`, {
        duration: 3000
      })

      // Reset
      setInput("")
      setOpen(false)
      setAmountPrompt(null)
    } catch (error) {
      console.error('Quick add error:', error)
      toast.error('Failed to add expense. Try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAmountSubmit = async (amount: number) => {
    if (amount <= 0) return

    setIsProcessing(true)

    try {
      const { category, note } = await classifyExpense(input, amount)

      await addTransaction({
        amount,
        description: note,
        type: 'expense',
        category,
        date: new Date().toISOString().split('T')[0]
      })

      toast.success(`₹${amount} added to ${category} ${getCategoryEmoji(category)}`)

      setInput("")
      setOpen(false)
      setAmountPrompt(null)
    } catch (error) {
      toast.error('Failed to add expense.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quick Add Expense</DialogTitle>
          <DialogDescription>
            Type naturally like: "spent 120 on chai" or "hostel ka kharcha 300"
          </DialogDescription>
        </DialogHeader>

        {amountPrompt === null ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type like: spent 120 chai / hostel ka kharcha 300"
              className="text-lg py-6"
              autoFocus
              disabled={isProcessing}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing || !input.trim()}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Add Expense'
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">How much was spent?</p>
            <Input
              type="number"
              placeholder="Enter amount"
              className="text-lg py-6"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const amount = parseInt((e.target as HTMLInputElement).value)
                  if (amount > 0) handleAmountSubmit(amount)
                }
              }}
              disabled={isProcessing}
            />
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setAmountPrompt(null)
                  setInput("")
                }}
                disabled={isProcessing}
              >
                Back
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    Food: '🍽️',
    Transport: '🚗',
    Rent: '🏠',
    Shopping: '🛍️',
    Entertainment: '🎬',
    Utilities: '💡',
    Education: '📚',
    Health: '⚕️',
    Bill: '📄',
    Salary: '💰',
    Investment: '📈',
    Other: '📌'
  }
  return emojis[category] || '📌'
}
