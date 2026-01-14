import { OpenRouter } from "@openrouter/sdk"
import { NextResponse } from "next/server"

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!
})

export async function POST(req: Request) {
  try {
    const { text, amount } = await req.json()
    
    const completion = await openrouter.chat.completions.create({
      model: "google/gemini-flash-1.5-8b",
      messages: [
        {
          role: "system",
          content: `You are an expense categorizer. Given a user's expense description, classify it into one of these categories: Food, Transport, Rent, Shopping, Entertainment, Utilities, Education, Health, Bill, Salary, Investment, Other.

Return ONLY a JSON object with this exact format:
{
  "category": "Food",
  "note": "brief cleaned description"
}

Rules:
- category must be one of the listed categories
- note should be a concise, cleaned version of the input
- DO NOT include any explanation or extra text`
        },
        {
          role: "user",
          content: `Expense: ${text}\nAmount: ₹${amount}\n\nCategorize this.`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
    
    return NextResponse.json({
      category: result.category || 'Other',
      note: result.note || text
    })
    
  } catch (error) {
    console.error('AI categorization error:', error)
    return NextResponse.json(
      { category: 'Other', note: text },
      { status: 500 }
    )
  }
}
