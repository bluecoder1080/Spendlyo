import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Using Groq API (same as categorization)
async function callGroqAI(systemPrompt: string, userMessage: string) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Groq API error:', errorText)
    throw new Error(`Groq API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set')
      return NextResponse.json({ 
        error: 'AI service not configured',
        message: "I'm sorry, but the AI service is not configured yet."
      }, { status: 500 })
    }

    // Get user's transaction data
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's transactions
    const { data: transactions, error: txError } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false })
      .limit(50)

    if (txError) {
      console.error('Error fetching transactions:', txError)
    }

    // Prepare context about user's finances
    let financialContext = ''
    if (transactions && transactions.length > 0) {
      const totalIncome = transactions
        .filter(t => t.amount >= 0)
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalExpenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      const balance = totalIncome - totalExpenses

      const categorySpending: { [key: string]: number } = {}
      transactions.forEach(t => {
        if (t.amount < 0) {
          categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(t.amount)
        }
      })

      const topCategories = Object.entries(categorySpending)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([cat, amt]) => `${cat}: ₹${amt.toLocaleString()}`)
        .join(', ')

      financialContext = `
User's Financial Summary:
- Total Income: ₹${totalIncome.toLocaleString()}
- Total Expenses: ₹${totalExpenses.toLocaleString()}
- Current Balance: ₹${balance.toLocaleString()}
- Top Spending Categories: ${topCategories}
- Number of Transactions: ${transactions.length}
`
    } else {
      financialContext = 'User has no transaction history yet.'
    }

    const systemPrompt = `You are a helpful and professional financial advisor AI assistant for SpendlyoAI.

Your role:
- Provide personalized financial advice based on transaction history
- Help users understand spending patterns
- Suggest budgeting strategies and savings tips
- Be encouraging and supportive
- Use Indian Rupee (₹) for currency

Guidelines:
- Be concise and actionable (max 200 words)
- Use emojis sparingly
- Reference the data provided
- Don't make up data
- If user has no data, encourage them to add transactions

${financialContext}`

    const responseText = await callGroqAI(systemPrompt, message)

    return NextResponse.json({ 
      message: responseText,
      hasTransactionData: transactions && transactions.length > 0
    })

  } catch (error: any) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process message', 
        message: "I'm sorry, I encountered an error. Please try again.",
        details: error.message 
      },
      { status: 500 }
    )
  }
}
