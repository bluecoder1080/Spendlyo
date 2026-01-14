import { Category } from "@/lib/types"

// Rule-based keyword categorization
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Food: ['chai', 'coffee', 'tea', 'lunch', 'dinner', 'breakfast', 'food', 'restaurant', 'meal', 'snack', 'pizza', 'burger', 'biryani', 'swiggy', 'zomato'],
  Transport: ['uber', 'ola', 'auto', 'taxi', 'metro', 'bus', 'petrol', 'diesel', 'fuel', 'parking', 'travel', 'train', 'flight'],
  Rent: ['rent', 'hostel', 'pg', 'room', 'flat', 'apartment', 'lease'],
  Shopping: ['shopping', 'clothes', 'shirt', 'shoes', 'amazon', 'flipkart', 'myntra', 'bought', 'purchase'],
  Entertainment: ['movie', 'cinema', 'netflix', 'spotify', 'prime', 'hotstar', 'game', 'concert', 'party'],
  Utilities: ['electricity', 'water', 'wifi', 'internet', 'mobile', 'recharge', 'bill', 'gas', 'cylinder'],
  Education: ['book', 'course', 'tuition', 'class', 'fees', 'college', 'university', 'exam', 'test'],
  Health: ['doctor', 'medicine', 'hospital', 'pharmacy', 'medical', 'health', 'gym', 'fitness'],
  Bill: ['bill', 'payment', 'emi', 'installment'],
  Salary: ['salary', 'income', 'credit'],
  Investment: ['stock', 'mutual', 'fund', 'investment', 'sip'],
  Other: []
}

export function categorizByKeywords(text: string): Category | null {
  const normalized = text.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        return category as Category
      }
    }
  }
  
  return null
}

// AI categorization fallback
export async function categorizeWithAI(text: string, amount: number): Promise<{
  category: Category
  note: string
}> {
  try {
    const response = await fetch('/api/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, amount })
    })
    
    if (!response.ok) throw new Error('AI categorization failed')
    
    const data = await response.json()
    return {
      category: data.category || 'Other',
      note: data.note || text
    }
  } catch (error) {
    console.error('AI categorization error:', error)
    return {
      category: 'Other',
      note: text
    }
  }
}

// Main hybrid categorization
export async function classifyExpense(text: string, amount: number): Promise<{
  category: Category
  note: string
}> {
  // Step 1: Try rule-based first
  const ruleCategory = categorizeByKeywords(text)
  
  if (ruleCategory) {
    return {
      category: ruleCategory,
      note: text
    }
  }
  
  // Step 2: Fallback to AI
  return await categorizeWithAI(text, amount)
}
