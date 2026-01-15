import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('Testing Groq API...')
    console.log('API Key:', process.env.GROQ_API_KEY?.substring(0, 20) + '...')
    
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
            content: 'Is "khichdi" a food item? Return JSON: {"isFood": true/false, "category": "Food" or "Other"}'
          }
        ],
        temperature: 0.1,
      })
    })
    
    const data = await response.json()
    console.log('Groq response:', data)
    
    if (data.error) {
      return NextResponse.json({
        success: false,
        error: data.error.message || 'Groq API error',
        details: data.error
      }, { status: 500 })
    }
    
    const content = data.choices?.[0]?.message?.content || '{}'
    
    return NextResponse.json({
      success: true,
      rawResponse: content,
      parsed: JSON.parse(content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    })
    
  } catch (error: any) {
    console.error('Test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        message: error.message
      }
    }, { status: 500 })
  }
}
