const fetch = require('node-fetch');

async function testAPI() {
  try {
    const response = await fetch('https://us-central1-prompt-backend-2025-v1.cloudfunctions.net/askGPT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hello, how are you?'
      })
    });

    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI(); 