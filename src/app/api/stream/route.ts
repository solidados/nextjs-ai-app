import { LanguageModelV2Usage } from '@ai-sdk/provider';
import { streamText } from 'ai';
// import { openai } from '@ai-sdk/openai';

import { google } from '@ai-sdk/google'
// import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const { prompt } = await req.json();
  
    const result = streamText({
      // model: openai('gpt-5-nano'),
      model: google('gemini-2.0-flash-lite'),
      prompt,
    })
    
    /** Logging token usage:
     * - every `request` costs tokens
     * - every `token` costs money*/
    const usd = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
    })
    
    result.usage.then((usage: LanguageModelV2Usage) => {
      const inputTokens = usage.inputTokens ?? 0
      const outputTokens = usage.outputTokens ?? 0
      const totalTokens = usage.totalTokens ?? inputTokens + outputTokens
      
      const INPUT_RATE= 0.10 / 1000000
      const OUTPUT_RATE= 0.40 / 1000000
      
      const inputCost = inputTokens * INPUT_RATE
      const outputCost = outputTokens * OUTPUT_RATE
      const totalCost = inputCost + outputCost
      
      console.log({
        input: { tokens: inputTokens, cost: usd.format(inputCost) },
        output: { tokens: outputTokens, cost: usd.format(outputCost) },
        total: { tokens: totalTokens, cost: usd.format(totalCost) }
      })
    })
  
    return result.toUIMessageStreamResponse()
  }
  catch ( error ) {
    console.error("Error streaming text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }
};
