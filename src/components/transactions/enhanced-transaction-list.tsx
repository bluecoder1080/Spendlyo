"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTransactionStore } from "@/store/useTransactionStore"
import { format } from "date-fns"
import { Trash2, Download, Save, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { exportToExcel } from "@/utils/exportExcel"
import { Category } from "@/lib/types"
import { toast } from "sonner"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface SortableRowProps {
  transaction: any
  isEditing: boolean
  editData: any
  setEditData: (data: any) => void
  startEditing: (tx: any) => void
  saveEdit: () => void
  cancelEditing: () => void
  removeTransaction: (id: string) => void
  categories: Category[]
}

function SortableRow({
  transaction,
  isEditing,
  editData,
  setEditData,
  startEditing,
  saveEdit,
  cancelEditing,
  removeTransaction,
  categories
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: transaction.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      className={isEditing ? "bg-muted/50" : "hover:bg-muted/30"}
    >
      {/* Drag Handle */}
      <TableCell className="w-[40px]">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>

      {/* Description */}
      <TableCell className="font-medium">
        {isEditing ? (
          <Input
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="h-8"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => startEditing(transaction)}
            className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
          >
            {transaction.description}
          </div>
        )}
      </TableCell>

      {/* Category */}
      <TableCell>
        {isEditing ? (
          <Select
            value={editData.category}
            onValueChange={(val) => setEditData({ ...editData, category: val as Category })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div 
            onClick={() => startEditing(transaction)}
            className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
          >
            {transaction.category}
          </div>
        )}
      </TableCell>

      {/* Date */}
      <TableCell>{format(new Date(transaction.date), "PPP")}</TableCell>

      {/* Amount */}
      <TableCell className={`text-right font-bold ${
        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
      }`}>
        {isEditing ? (
          <Input
            type="number"
            value={editData.amount}
            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
            className="h-8 text-right"
          />
        ) : (
          <div 
            onClick={() => startEditing(transaction)}
            className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
          >
            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </div>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={saveEdit}
                className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelEditing}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeTransaction(transaction.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function EnhancedTransactionList() {
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{
    description: string
    category: Category
    amount: string
  }>({ description: "", category: "Food", amount: "" })
  const [localTransactions, setLocalTransactions] = useState<any[]>([])

  const transactions = useTransactionStore((state) => state.transactions)
  const removeTransaction = useTransactionStore((state) => state.removeTransaction)
  const updateTransaction = useTransactionStore((state) => state.updateTransaction)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setLocalTransactions(transactions)
  }, [transactions])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setLocalTransactions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
      toast.success("Transaction reordered")
    }
  }

  const handleExport = () => {
    if (localTransactions.length === 0) {
      toast.error("No transactions to export")
      return
    }
    exportToExcel(localTransactions, 'spendlyoai_transactions')
    toast.success(`Exported ${localTransactions.length} transactions`)
  }

  const startEditing = (transaction: any) => {
    setEditingId(transaction.id)
    setEditData({
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount.toString()
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditData({ description: "", category: "Food", amount: "" })
  }

  const saveEdit = async () => {
    if (!editingId) return

    try {
      await updateTransaction(editingId, {
        description: editData.description,
        category: editData.category,
        amount: parseFloat(editData.amount)
      })
      
      toast.success("Transaction updated successfully")
      cancelEditing()
    } catch (error) {
      console.error('Error updating transaction:', error)
      toast.error('Failed to update transaction')
    }
  }

  if (!mounted) {
    return <div className="p-8 text-center text-muted-foreground">Loading transactions...</div>
  }

  if (localTransactions.length === 0) {
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

  const categories: Category[] = ["Food", "Transport", "Shopping", "Entertainment", "Health", "Education", "Bill", "Salary", "Investment", "Other"]

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={handleExport} variant="outline" className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {/* Transaction Table with Drag and Drop */}
      <div className="rounded-md border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={localTransactions.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {localTransactions.map((transaction) => (
                  <SortableRow
                    key={transaction.id}
                    transaction={transaction}
                    isEditing={editingId === transaction.id}
                    editData={editData}
                    setEditData={setEditData}
                    startEditing={startEditing}
                    saveEdit={saveEdit}
                    cancelEditing={cancelEditing}
                    removeTransaction={removeTransaction}
                    categories={categories}
                  />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* Hint Text */}
      <p className="text-sm text-muted-foreground text-center">
        💡 Click any field to edit • Drag rows to reorder • Click save to confirm changes
      </p>
    </div>
  )
}
