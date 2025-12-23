// Direct API test
require('dotenv').config();

async function testDirectAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔍 Testing Gemini API with direct HTTP request...\n');
  console.log('API Key:', apiKey ? apiKey.substring(0, 20) + '...' : 'NOT FOUND');
  
  if (!apiKey) {
    console.error('❌ No API key found');
    return;
  }
  
  // Try the newer API endpoint
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: "Say hello in one word"
      }]
    }]
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API Error:');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.log('\n💡 Error details:');
        console.log('   Message:', data.error.message);
        console.log('   Status:', data.error.status);
        
        if (data.error.message.includes('API key not valid')) {
          console.log('\n⚠️  Your API key appears to be invalid.');
          console.log('   Please verify it at: https://makersuite.google.com/app/apikey');
          console.log('   Or: https://aistudio.google.com/app/apikey');
        }
      }
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testDirectAPI();
