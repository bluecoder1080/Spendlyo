import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const modelName = searchParams.get('model') || 'gemini-2.5-flash'
    
    console.log(`🧪 Testing Gemini API with model: ${modelName}`)
    console.log('API Key:', process.env.GEMINI_API_KEY?.substring(0, 20) + '...')
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: modelName })
    
    // Test 1: Simple text generation
    console.log('📝 Test 1: Simple text generation...')
    const prompt = `Categorize this expense for an Indian expense tracker.

Text: "Bought groceries from Big Bazaar"
Amount: ₹850

Valid categories: Food, Groceries, Transport, Travel, Shopping, Clothes, Entertainment, Education, Health, Bill, Salary, Investment, Other

Return ONLY valid JSON: {"category": "Groceries", "note": "brief description"}`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    console.log('✅ Raw response:', text)
    
    // Parse the JSON response
    let parsed
    try {
      // Clean markdown if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(cleanText)
    } catch (e) {
      parsed = { raw: text, parseError: true }
    }
    
    // Test 2: Get model info
    console.log('📊 Test 2: Model info...')
    const modelInfo = await genAI.getGenerativeModel({ model: modelName })
    
    return NextResponse.json({
      success: true,
      model: modelName,
      timestamp: new Date().toISOString(),
      tests: {
        textGeneration: {
          prompt: "Categorize expense: groceries ₹850",
          rawResponse: text,
          parsed: parsed,
          status: '✅ Success'
        },
        modelInfo: {
          model: modelName,
          status: '✅ Initialized'
        }
      },
      usage: {
        promptTokens: result.response.usageMetadata?.promptTokenCount || 'N/A',
        completionTokens: result.response.usageMetadata?.candidatesTokenCount || 'N/A',
        totalTokens: result.response.usageMetadata?.totalTokenCount || 'N/A'
      }
    })
    
  } catch (error: any) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3)
      }
    }, { status: 500 })
  }
}

// Test streaming response
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const modelName = body.model || 'gemini-2.5-flash'
    const prompt = body.prompt || 'Explain what Kharcha means in 5 words.'
    
    console.log(`🌊 Testing Gemini streaming with model: ${modelName}`)
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: modelName })
    
    const result = await model.generateContentStream(prompt)
    
    let fullText = ''
    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      fullText += chunkText
    }
    
    return NextResponse.json({
      success: true,
      model: modelName,
      prompt: prompt,
      response: fullText,
      streaming: '✅ Streaming works',
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Streaming test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
