import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/lib/types'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  fetchTransactions: () => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  removeTransaction: (id: string) => Promise<void>
  getTotalBalance: () => number
  getTotalIncome: () => number
  getTotalExpense: () => number
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  fetchTransactions: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      set({ transactions: [], isLoading: false })
      return
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      set({ isLoading: false })
      return
    }

    // Map DB expenses to app Transactions
    interface DBExpense {
      id: string
      amount: number
      category: string
      note: string | null
      expense_date: string
    }

    const mappedTransactions: Transaction[] = (data || []).map((item: DBExpense) => ({
      id: item.id,
      description: item.note || '', // map note to description
      amount: Math.abs(item.amount), // use absolute for display
      category: item.category as any, // Cast to Category (or string), fix type if strictly verified
      date: item.expense_date, // use expense_date as date
      type: item.amount >= 0 ? 'income' : 'expense' // Inference: positive = income, negative = expense
    }))

    set({ transactions: mappedTransactions, isLoading: false })
  },
  
  addTransaction: async (transaction) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Prepare for DB
    // Store 'income' as positive, 'expense' as negative
    const dbAmount = transaction.type === 'income' 
      ? Math.abs(transaction.amount) 
      : -Math.abs(transaction.amount)

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        amount: dbAmount,
        category: transaction.category,
        note: transaction.description,
        expense_date: transaction.date, // ensure valid date string
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding transaction:', error)
      return
    }

    if (data) {
        // Optimistic update or refetch
        // We'll just refetch for simplicity and consistency
        get().fetchTransactions()
    }
  },

  removeTransaction: async (id) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting transaction:', error)
      return
    }

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }))
  },

  getTotalBalance: () => {
    const { transactions } = get()
    // Since we store strict types in the store state now (after mapping), we calculate normally
    // Wait, in fetch we mapped amount to ABSOLUTE. So we need to use type.
    return transactions.reduce(
      (acc, cur) =>
        cur.type === 'income' ? acc + cur.amount : acc - cur.amount,
      0
    )
  },
  getTotalIncome: () => {
    const { transactions } = get()
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, cur) => acc + cur.amount, 0)
  },
  getTotalExpense: () => {
    const { transactions } = get()
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, cur) => acc + cur.amount, 0)
  },
}))
