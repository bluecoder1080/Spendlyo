import { Transaction } from "@/lib/types"

export function exportToExcel(transactions: Transaction[], filename = 'transactions') {
  // Convert transactions to CSV format
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  
  const csvRows = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      `"${t.description}"`, // Wrap in quotes to handle commas
      t.category,
      t.type,
      t.amount
    ].join(','))
  ]
  
  const csvContent = csvRows.join('\n')
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
