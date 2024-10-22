import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // Validate the prompt
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not found' }, { status: 500 })
    }

    // Make the request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', // Specify the model
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates poems.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200, // Adjust token limit based on poem length
        temperature: 0.7, // Optional: tweak creativity level
      }),
    })

    const data = await response.json()

    // Check if the OpenAI response has choices and return the poem
    if (data.choices && data.choices.length > 0) {
      const generatedPoem = data.choices[0].message.content
      return NextResponse.json({ poem: generatedPoem })
    } else {
      return NextResponse.json({ error: 'No poem generated' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error generating poem:', error)
    return NextResponse.json({ error: 'Failed to generate poem' }, { status: 500 })
  }
}
