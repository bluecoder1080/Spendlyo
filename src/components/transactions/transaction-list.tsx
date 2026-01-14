"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTransactionStore } from "@/store/useTransactionStore"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function TransactionList() {
  const [mounted, setMounted] = useState(false)
  const transactions = useTransactionStore((state) => state.transactions)
  const removeTransaction = useTransactionStore((state) => state.removeTransaction)

  useEffect(() => {
     setMounted(true)
  }, [])

  if (!mounted) {
      return <div className="p-8 text-center text-muted-foreground">Loading transactions...</div>
  }

  if (transactions.length === 0) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Add your first transaction to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
             <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
               <TableCell className="font-medium">
                  {transaction.description}
               </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{format(new Date(transaction.date), "PPP")}</TableCell>
              <TableCell className={`text-right font-bold ${
                   transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                 {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
              </TableCell>
              <TableCell>
                  <Button
                    variant="ghost"
                     size="icon"
                     onClick={() => removeTransaction(transaction.id)}
                     className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                  </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
