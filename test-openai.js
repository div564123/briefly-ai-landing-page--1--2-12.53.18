// Quick test script to verify OpenAI API key is working
// Run with: node test-openai.js

// Try to load dotenv if available
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv might not be needed if Next.js handles it
}

async function testOpenAI() {
  const OpenAI = require('openai');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    console.log('Make sure you added: OPENAI_API_KEY=sk-your-actual-key');
    process.exit(1);
  }

  if (process.env.OPENAI_API_KEY === 'sk-your-api-key-here' || process.env.OPENAI_API_KEY.startsWith('sk-your')) {
    console.error('❌ OPENAI_API_KEY is still a placeholder!');
    console.log('Please replace "sk-your-api-key-here" with your actual API key in .env.local');
    process.exit(1);
  }

  console.log('🔑 API Key found:', process.env.OPENAI_API_KEY.substring(0, 7) + '...');
  console.log('🧪 Testing OpenAI connection...\n');

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: 'Say "Hello! OpenAI API is working correctly."',
        },
      ],
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content || '';
    console.log('✅ SUCCESS! OpenAI API is working!');
    console.log('📝 Response:', response);
    console.log('\n🎉 Your API key is valid and ready to use!');
  } catch (error) {
    console.error('❌ ERROR testing OpenAI API:');
    if (error.message?.includes('API key')) {
      console.error('   → Invalid API key. Please check your OPENAI_API_KEY in .env.local');
    } else if (error.message?.includes('quota')) {
      console.error('   → API quota exceeded. Check your OpenAI account billing.');
    } else if (error.message?.includes('rate_limit')) {
      console.error('   → Rate limit exceeded. Wait a moment and try again.');
    } else {
      console.error('   →', error.message);
    }
    process.exit(1);
  }
}

testOpenAI();

