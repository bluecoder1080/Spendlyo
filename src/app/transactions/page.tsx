import { TransactionList } from "@/components/transactions/transaction-list"
import { AddTransaction } from "@/components/transactions/add-transaction"

export default function TransactionsPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Manage your transaction history here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddTransaction />
        </div>
      </div>
      <TransactionList />
    </div>
  )
}
