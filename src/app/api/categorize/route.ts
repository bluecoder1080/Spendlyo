import { NextResponse } from "next/server"

export async function POST(req: Request) {
  let text = ''
  let amount = 0
  
  try {
    const body = await req.json()
    text = body.text
    amount = body.amount
    
    console.log('Categorizing expense:', { text, amount })
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Categorize this expense for an Indian expense tracker.

Text: "${text}"
Amount: ₹${amount}

Valid categories: Food, Groceries, Transport, Travel, Shopping, Clothes, Entertainment, Education, Health, Bill, Salary, Investment, Other

Rules:
- Food items eaten at restaurants (dosa, pizza, biryani, restaurant, cafe, dhaba) = Food
- Grocery shopping for cooking at home (rice, chawal, atta, dal, vegetables, milk, supermarket, dmart, big bazaar) = Groceries 
- Clothing items (shirt, jeans, shoes, saree, kurta) = Clothes
- Trips/hotels/flights/vacation = Travel
- Daily transport (uber, ola, metro, petrol, bus, auto) = Transport
- Entertainment (movies, netflix, games) = Entertainment
- Return ONLY valid JSON: {"category": "Groceries", "note": "brief description"}

Output:`
          }
        ],
        temperature: 0.1,
      })
    })
    
    const data = await response.json()
    console.log('Groq response:', data)
    
    if (data.error) {
      console.error('Groq API error:', data.error)
      return NextResponse.json({
        category: 'Other',
        note: text
      })
    }
    
    let content = data.choices?.[0]?.message?.content || '{}'
    
    // Clean markdown if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const parsed = JSON.parse(content)
    
    console.log('🤖 AI result:', parsed)
    
    // Validate category - FIXED: Added missing Groceries and Clothes!
    const validCategories = [
      'Food', 'Groceries', 'Transport', 'Travel', 'Shopping', 
      'Clothes', 'Entertainment', 'Education', 'Health', 
      'Bill', 'Salary', 'Investment', 'Other'
    ]
    const category = validCategories.includes(parsed.category) ? parsed.category : 'Other'
    
    return NextResponse.json({
      category: category,
      note: parsed.note || text
    })
    
  } catch (error: any) {
    console.error('AI categorization error:', error)
    return NextResponse.json({
      category: 'Other',
      note: text || 'Expense'
    })
  }
}
