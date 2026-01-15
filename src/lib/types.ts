export type TransactionType = "income" | "expense"

export type Category = 
  | "Food"
  | "Transport"
  | "Shopping"
  | "Clothes"
  | "Groceries"
  | "Travel"
  | "Entertainment"
  | "Bill"
  | "Health"
  | "Education"
  | "Salary"
  | "Investment"
  | "Other"

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: Category
  description: string
  date: string // ISO string
}
