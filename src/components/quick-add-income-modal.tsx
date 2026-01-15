"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTransactionStore } from "@/store/useTransactionStore"
import { toast } from "sonner"
import { Loader2, TrendingUp } from "lucide-react"
import { Category } from "@/lib/types"

export function QuickAddIncomeModal() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Category>("Salary")
  const [isProcessing, setIsProcessing] = useState(false)
  const addTransaction = useTransactionStore((state) => state.addTransaction)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) return

    setIsProcessing(true)

    try {
      await addTransaction({
        amount: parseFloat(amount),
        description,
        type: 'income',
        category,
        date: new Date().toISOString().split('T')[0]
      })

      toast.success(`₹${amount} income added to ${category} 💰`)

      // Reset form
      setAmount("")
      setDescription("")
      setCategory("Salary")
      setOpen(false)
    } catch (error) {
      console.error('Add income error:', error)
      toast.error('Failed to add income. Try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400 cursor-pointer">
          <TrendingUp className="mr-2 h-4 w-4" />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Income</DialogTitle>
          <DialogDescription>
            Add income like salary, investments, or other earnings
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              className="text-lg"
              autoFocus
              disabled={isProcessing}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Monthly salary, freelance income..."
              disabled={isProcessing}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as Category)}
              disabled={isProcessing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Income Categories</SelectLabel>
                  <SelectItem value="Salary">💼 Salary</SelectItem>
                  <SelectItem value="Investment">📈 Investment</SelectItem>
                  <SelectItem value="Other">💰 Other Income</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !amount || !description}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Income'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
