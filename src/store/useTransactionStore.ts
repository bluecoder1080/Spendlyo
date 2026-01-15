import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/lib/types'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  fetchTransactions: () => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => Promise<void>
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
      description: item.note || '',
      amount: Math.abs(item.amount),
      category: item.category as any,
      date: item.expense_date,
      type: item.amount >= 0 ? 'income' : 'expense'
    }))

    set({ transactions: mappedTransactions, isLoading: false })
  },
  
  addTransaction: async (transaction) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

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
        expense_date: transaction.date,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding transaction:', error)
      return
    }

    if (data) {
      get().fetchTransactions()
    }
  },

  updateTransaction: async (id, updates) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Prepare updates for DB format
    const dbUpdates: any = {}
    
    if (updates.description !== undefined) {
      dbUpdates.note = updates.description
    }
    if (updates.category !== undefined) {
      dbUpdates.category = updates.category
    }
    if (updates.date !== undefined) {
      dbUpdates.expense_date = updates.date
    }
    if (updates.amount !== undefined && updates.type !== undefined) {
      dbUpdates.amount = updates.type === 'income' 
        ? Math.abs(updates.amount) 
        : -Math.abs(updates.amount)
    } else if (updates.amount !== undefined) {
      // If only amount changed, need to get current type
      const currentTx = get().transactions.find(t => t.id === id)
      if (currentTx) {
        dbUpdates.amount = currentTx.type === 'income'
          ? Math.abs(updates.amount)
          : -Math.abs(updates.amount)
      }
    }

    const { error } = await supabase
      .from('expenses')
      .update(dbUpdates)
      .eq('id', id)

    if (error) {
      console.error('Error updating transaction:', error)
      throw error
    }

    // Refetch to get updated data
    await get().fetchTransactions()
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
