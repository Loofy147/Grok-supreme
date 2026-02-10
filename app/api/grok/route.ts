import { streamText } from 'ai'
import { xai } from '@ai-sdk/xai'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemPrompt } = await request.json()

    if (!prompt) {
      return new Response('Prompt is required', { status: 400 })
    }

    const result = streamText({
      model: xai('grok-4', {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: prompt,
      system: systemPrompt || 'You are Grok, a helpful AI assistant. Provide accurate, insightful responses.',
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error calling Grok:', error)
    return new Response('Failed to generate response', { status: 500 })
  }
}
