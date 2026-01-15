import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  let text = ''
  let amount = 0
  
  try {
    const body = await req.json()
    text = body.text
    amount = body.amount
    
    console.log('🔍 Categorizing expense with Gemini:', { text, amount })
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite' // Faster and sufficient for categorization
    })
    
    const prompt = `Categorize this expense for an Indian expense tracker.

Text: "${text}"
Amount: ₹${amount}

Valid categories: Food, Groceries, Transport, Travel, Shopping, Clothes, Entertainment, Education, Health, Bill, Salary, Investment, Other

Rules:
- Food items (dosa, pizza, restaurant, cafe) = Food
- Grocery shopping (vegetables, milk, supermarket, big bazaar, dmart) = Groceries 
- Clothing (shirt, jeans, shoes, clothes) = Clothes
- Trips/hotels/flights/vacation = Travel
- Daily transport (uber, ola, metro, petrol, bus) = Transport
- Movies, games, fun = Entertainment
- Medicine, doctor, hospital = Health
- Electricity, water, internet, phone = Bill
- Income = Salary
- Stocks, mutual funds, gold = Investment
- Return ONLY valid JSON: {"category": "Food", "note": "brief description"}

Output:`

    const result = await model.generateContent(prompt)
    const response = result.response
    let content = response.text()
    
    console.log('✨ Gemini response:', content)
    
    // Clean markdown if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const parsed = JSON.parse(content)
    
    console.log('✅ AI result:', parsed)
    
    // Validate category
    const validCategories = [
      'Food', 'Groceries', 'Transport', 'Travel', 'Shopping', 
      'Clothes', 'Entertainment', 'Education', 'Health', 
      'Bill', 'Salary', 'Investment', 'Other'
    ]
    const category = validCategories.includes(parsed.category) ? parsed.category : 'Other'
    
    // Log token usage
    if (result.response.usageMetadata) {
      console.log('📊 Token usage:', {
        prompt: result.response.usageMetadata.promptTokenCount,
        completion: result.response.usageMetadata.candidatesTokenCount,
        total: result.response.usageMetadata.totalTokenCount
      })
    }
    
    return NextResponse.json({
      category: category,
      note: parsed.note || text,
      ai: 'gemini' // Indicate which AI was used
    })
    
  } catch (error: any) {
    console.error('❌ Gemini categorization error:', error)
    
    // Fallback to basic keyword matching
    const fallbackCategory = getFallbackCategory(text, amount)
    
    return NextResponse.json({
      category: fallbackCategory,
      note: text || 'Expense',
      ai: 'fallback'
    })
  }
}

// Fallback categorization using keywords
function getFallbackCategory(text: string, amount: number): string {
  const lowerText = text.toLowerCase()
  
  // Salary/Income (usually large amounts)
  if (lowerText.includes('salary') || lowerText.includes('income') || amount > 10000) {
    return 'Salary'
  }
  
  // Food
  if (lowerText.match(/food|restaurant|cafe|dosa|pizza|burger|biryani|lunch|dinner|breakfast/)) {
    return 'Food'
  }
  
  // Groceries
  if (lowerText.match(/grocery|groceries|vegetables|milk|supermarket|dmart|big bazaar|reliance/)) {
    return 'Groceries'
  }
  
  // Transport
  if (lowerText.match(/uber|ola|taxi|metro|bus|petrol|fuel|transport|auto/)) {
    return 'Transport'
  }
  
  // Travel
  if (lowerText.match(/hotel|flight|trip|vacation|travel|booking|airbnb/)) {
    return 'Travel'
  }
  
  // Shopping
  if (lowerText.match(/amazon|flipkart|shopping|shop|purchase|buy/)) {
    return 'Shopping'
  }
  
  // Clothes
  if (lowerText.match(/clothes|shirt|jeans|shoes|dress|fashion/)) {
    return 'Clothes'
  }
  
  // Entertainment
  if (lowerText.match(/movie|cinema|game|netflix|spotify|entertainment/)) {
    return 'Entertainment'
  }
  
  // Health
  if (lowerText.match(/doctor|hospital|medicine|pharmacy|health|medical/)) {
    return 'Health'
  }
  
  // Bills
  if (lowerText.match(/bill|electricity|water|internet|phone|gas|rent/)) {
    return 'Bill'
  }
  
  // Investment
  if (lowerText.match(/investment|stock|mutual fund|gold|sip/)) {
    return 'Investment'
  }
  
  // Education
  if (lowerText.match(/education|school|college|course|book|tuition/)) {
    return 'Education'
  }
  
  return 'Other'
}
