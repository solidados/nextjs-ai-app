import { type UIMessage, streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export const POST = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    const messages: UIMessage[] | undefined = body?.messages;

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages must be an array.' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const result = streamText({
      model: openai('gpt-5-nano'),
      messages: [
        {
          role: 'system',
          content: 'You are helpful assistant. Keep responses under 3 sentences and focus on practical examples.'
        },
        ...convertToModelMessages(messages)
      ]
    })
    
    return result.toUIMessageStreamResponse()
  } catch ( error ) {
    console.error( '[Chat]: Error streaming chat completion', error )
    return new Response('Failed to stream chat completion', { status: 500 })
  }
};
