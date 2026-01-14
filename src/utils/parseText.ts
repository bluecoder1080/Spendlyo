// Text parsing utility for Quick Add
export interface ParsedExpense {
  amount: number | null
  rawText: string
}

export function parseExpenseText(input: string): ParsedExpense {
  const normalized = input.toLowerCase().trim()
  
  // Try to extract amount using multiple patterns
  // Pattern 1: "spent 120 on chai" or "120 for chai"
  const patterns = [
    /(?:spent|paid|spend)\s+(\d+)/,
    /(\d+)\s+(?:for|on|rupees|rs|₹)/,
    /₹\s*(\d+)/,
    /rs\s*(\d+)/,
    /^(\d+)\s+/, // number at start
    /\s+(\d+)$/, // number at end
    /(\d+)/ // any number
  ]
  
  let amount: number | null = null
  
  for (const pattern of patterns) {
    const match = normalized.match(pattern)
    if (match && match[1]) {
      amount = parseInt(match[1], 10)
      break
    }
  }
  
  return {
    amount,
    rawText: input.trim()
  }
}
