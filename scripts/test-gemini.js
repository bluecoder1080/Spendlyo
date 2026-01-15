/**
 * Test script for Gemini API integration
 * Run with: node scripts/test-gemini.js
 */

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = (color, ...args) => console.log(color, ...args, COLORS.reset)

async function testModel(model) {
  log(COLORS.cyan, `\n${'='.repeat(60)}`)
  log(COLORS.bright, `🧪 Testing model: ${model}`)
  log(COLORS.cyan, '='.repeat(60))
  
  try {
    // Test 1: Basic generation
    log(COLORS.yellow, '\n📝 Test 1: Basic text generation...')
    const res1 = await fetch(`http://localhost:3000/api/test-gemini?model=${model}`)
    const data1 = await res1.json()
    
    if (data1.success) {
      log(COLORS.green, '✅ Text generation successful!')
      console.log('   Category:', data1.tests.textGeneration.parsed.category)
      console.log('   Note:', data1.tests.textGeneration.parsed.note)
      console.log('   Tokens used:', data1.usage.totalTokens)
    } else {
      log(COLORS.red, '❌ Text generation failed:', data1.error)
      return false
    }
    
    // Test 2: Streaming
    log(COLORS.yellow, '\n🌊 Test 2: Streaming generation...')
    const res2 = await fetch('http://localhost:3000/api/test-gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: 'What does "kharcha" mean in Hindi? Answer in one sentence.'
      })
    })
    const data2 = await res2.json()
    
    if (data2.success) {
      log(COLORS.green, '✅ Streaming successful!')
      console.log('   Response:', data2.response)
    } else {
      log(COLORS.red, '❌ Streaming failed:', data2.error)
      return false
    }
    
    return true
    
  } catch (error) {
    log(COLORS.red, '❌ Error testing model:', error.message)
    return false
  }
}

async function main() {
  log(COLORS.bright + COLORS.blue, '\n🚀 Gemini API Test Suite for Kharcha')
  log(COLORS.blue, '=' .repeat(60))
  
  const models = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-3-flash'
  ]
  
  const results = {}
  
  for (const model of models) {
    const success = await testModel(model)
    results[model] = success
    await new Promise(resolve => setTimeout(resolve, 1000)) // Rate limit delay
  }
  
  // Summary
  log(COLORS.bright + COLORS.cyan, '\n' + '='.repeat(60))
  log(COLORS.bright, '📊 TEST SUMMARY')
  log(COLORS.cyan, '='.repeat(60))
  
  Object.entries(results).forEach(([model, success]) => {
    const icon = success ? '✅' : '❌'
    const color = success ? COLORS.green : COLORS.red
    log(color, `${icon} ${model.padEnd(30)} ${success ? 'PASSED' : 'FAILED'}`)
  })
  
  const allPassed = Object.values(results).every(r => r)
  log(COLORS.bright, '\n' + '='.repeat(60))
  if (allPassed) {
    log(COLORS.green, '🎉 All tests passed! Gemini integration is working.')
  } else {
    log(COLORS.yellow, '⚠️  Some tests failed. Check the output above.')
  }
  log(COLORS.bright, '='.repeat(60) + '\n')
}

// Check if server is running
fetch('http://localhost:3000/api/test-gemini')
  .then(() => main())
  .catch(() => {
    log(COLORS.red, '\n❌ Error: Development server is not running!')
    log(COLORS.yellow, '   Please start the server with: npm run dev')
    log(COLORS.yellow, '   Then run this script again.\n')
  })
