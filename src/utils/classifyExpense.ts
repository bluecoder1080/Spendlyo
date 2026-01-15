import { Category } from "@/lib/types"

// Rule-based keyword categorization  
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Food: [
    // Beverages
    'chai', 'coffee', 'tea', 'juice', 'drink', 'water', 'soda', 'beer', 'wine', 'lassi', 'shake', 'milkshake', 'smoothie',
    // Meals
    'lunch', 'dinner', 'breakfast', 'brunch', 'food', 'meal', 'snack', 'eat', 'ate',
    // Indian food
    'dosa', 'idli', 'vada', 'samosa', 'pakora', 'biryani', 'curry', 'dal', 'rice', 'roti', 'chapati', 'paratha', 'naan', 'paneer', 'masala', 'thali', 'puri', 'bhaji', 'chaat', 'pav',
    'khichdi', 'poha', 'upma', 'uttapam', 'dhokla', 'kachori', 'jalebi', 'gulab jamun', 'rasgulla', 'kulfi', 'halwa', 'ladoo', 'barfi',
    'rajma', 'chole', 'palak', 'aloo', 'gobi', 'bhindi', 'baingan', 'tikka', 'tandoori', 'korma', 'vindaloo',
    // Fast food
    'pizza', 'burger', 'sandwich', 'fries', 'momos', 'roll', 'wrap', 'pasta', 'noodles', 'sushi', 'tacos', 'burrito', 'kebab', 'shawarma',
    // Snacks/Desserts
    'cake', 'pastry', 'croissant', 'brownie', 'cookies', 'chips', 'muffin', 'biscuit', 'namkeen', 'sev',
    // Restaurants/Delivery
    'restaurant', 'cafe', 'swiggy', 'zomato', 'delivery', 'takeaway', 'order', 'dominos', 'mcdonalds', 'kfc', 'subway'
  ],
  Groceries: [
    'grocery', 'groceries', 'vegetables', 'veggies', 'fruits', 'milk', 'bread', 'egg', 'eggs', 'chicken', 'meat', 'fish', 'mutton', 'beef', 'pork',
    'supermarket', 'market', 'kirana', 'store', 'provisions', 'ration'
  ],
  Transport: ['uber', 'ola', 'rapido', 'auto', 'taxi', 'cab', 'metro', 'bus', 'train', 'petrol', 'diesel', 'fuel', 'parking', 'bike', 'car', 'rickshaw', 'toll', 'gas'],
  Travel: ['flight', 'hotel', 'trip', 'vacation', 'travel', 'tour', 'booking', 'airbnb', 'stay', 'holiday'],
  Clothes: [
    'clothes', 'clothing', 'shirt', 'jeans', 'shoes', 'dress', 'pants', 'tshirt', 't-shirt', 'jacket', 'sweater', 'saree', 'suit', 'kurta', 'footwear', 'sandals',
    'baniyan', 'underwear', 'innerwear', 'socks', 'belt', 'tie', 'scarf', 'dupatta', 'lehenga', 'salwar', 'kameez', 'dhoti', 'lungi', 'pyjama', 'pajama',
    'sneakers', 'boots', 'slippers', 'chappal', 'heels', 'watch', 'cap', 'hat', 'gloves'
  ],
  Shopping: ['shopping', 'amazon', 'flipkart', 'myntra', 'meesho', 'bought', 'purchase', 'shop', 'mall', 'electronics', 'phone', 'laptop', 'gadget'],
  Entertainment: ['movie', 'cinema', 'netflix', 'spotify', 'hotstar', 'prime', 'youtube', 'subscription', 'game', 'concert', 'party', 'club', 'theatre'],
  Bill: ['electricity', 'water', 'wifi', 'internet', 'broadband', 'mobile', 'phone', 'recharge', 'bill', 'gas', 'cylinder', 'rent', 'hostel', 'pg', 'room', 'flat', 'apartment', 'lease', 'emi', 'loan'],
  Health: ['doctor', 'medicine', 'medical', 'hospital', 'clinic', 'pharmacy', 'chemist', 'health', 'gym', 'fitness', 'yoga', 'checkup', 'test', 'lab'],
  Education: ['book', 'books', 'course', 'tuition', 'class', 'fees', 'college', 'university', 'school', 'exam', 'study', 'notebook', 'pen', 'pencil'],
  Salary: ['salary', 'income', 'credit', 'received', 'earning'],
  Investment: ['stock', 'stocks', 'mutual', 'fund', 'investment', 'sip', 'fd', 'deposit'],
  Other: []
}

export function categorizeByKeywords(text: string): Category | null {
  const normalized = text.toLowerCase()
  console.log('🔎 Checking keywords for:', normalized)
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        console.log(`✅ Keyword matched! "${keyword}" → ${category}`)
        return category as Category
      }
    }
  }
  
  console.log('❌ No keyword match found')
  return null
}

// AI categorization fallback
export async function categorizeWithAI(text: string, amount: number): Promise<{
  category: Category
  note: string
}> {
  try {
    console.log('📡 Calling AI API:', { text, amount })
    
    const response = await fetch('/api/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, amount })
    })
    
    console.log('📡 API response status:', response.status)
    
    const data = await response.json()
    console.log('📡 API response data:', data)
    
    return {
      category: data.category || 'Other',
      note: data.note || text
    }
  } catch (error) {
    console.error('❌ AI categorization error:', error)
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
  console.log('🔍 Starting classification for:', { text, amount })
  
  // Step 1: Try rule-based first
  const ruleCategory = categorizeByKeywords(text)
  
  if (ruleCategory) {
    console.log('✅ Keyword match found:', ruleCategory)
    return {
      category: ruleCategory,
      note: text
    }
  }
  
  // Step 2: Fallback to AI
  console.log('🤖 No keyword match - calling AI...')
  const aiResult = await categorizeWithAI(text, amount)
  console.log('🤖 AI result:', aiResult)
  return aiResult
}
