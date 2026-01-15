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
import { parseExpenseText } from "@/utils/parseText"
import { classifyExpense } from "@/utils/classifyExpense"
import { toast } from "sonner"
import { Loader2, Plus, Mic, Edit3, Sparkles } from "lucide-react"
import { useSpeechRecognition } from "@/lib/hooks/useSpeechRecognition"
import { Category, TransactionType } from "@/lib/types"

export function QuickAddModal() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'smart' | 'manual'>('smart')
  
  // Smart mode state
  const [input, setInput] = useState("")
  const [amountPrompt, setAmountPrompt] = useState<number | null>(null)
  
  // Manual mode state
  const [manualAmount, setManualAmount] = useState("")
  const [manualDescription, setManualDescription] = useState("")
  const [manualType, setManualType] = useState<TransactionType>("expense")
  const [manualCategory, setManualCategory] = useState<Category>("Food")
  
  const [isProcessing, setIsProcessing] = useState(false)
  const addTransaction = useTransactionStore((state) => state.addTransaction)
  
  // Voice recognition
  const { transcript, isListening, isSupported, error: voiceError, startListening } = useSpeechRecognition()

  // Auto-submit when speech is recognized
  useEffect(() => {
    if (transcript && !isListening && open) {
      setInput(transcript)
      // Auto-submit after a brief delay to allow user to see the transcript
      setTimeout(() => {
        handleSubmit()
      }, 300)
    }
  }, [transcript, isListening, open])

  // Show voice error toast
  useEffect(() => {
    if (voiceError) {
      toast.error(voiceError, { duration: 2000 })
    }
  }, [voiceError])

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
        <Button className="cursor-pointer">
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
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Type like: spent 120 chai / hostel ka kharcha 300"}
                className="text-lg py-6 pr-12"
                autoFocus={!isListening}
                disabled={isProcessing || isListening}
              />
              {isSupported && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={startListening}
                  disabled={isProcessing || isListening}
                  title={isListening ? "Listening..." : "Click to speak"}
                >
                  {isListening ? (
                    <Mic className="h-4 w-4 text-red-500 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {isListening && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Listening...
              </p>
            )}
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
