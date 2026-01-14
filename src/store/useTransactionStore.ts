import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Transaction } from '@/lib/types'

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  removeTransaction: (id: string) => void
  getTotalBalance: () => number
  getTotalIncome: () => number
  getTotalExpense: () => number
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
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
    }),
    {
      name: 'kharcha-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
