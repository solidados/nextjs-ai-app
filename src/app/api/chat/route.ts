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
    
    const content = [
      'You are a friendly teacher who explains concepts using simple analogies. Always relate technical concepts to everyday experiences',
      'You are helpful coding assistant. Keep responses under 3 or 4 sentences and focus on practical examples.',
      'Convert users questions about React into code examples',
      'How to toggle a boolean?',
      'const [isOpen, setIsOpen] = useState<boolean>(false);\nconst toggle = () => setIsOpen(!isOpen)'
    ]
    const result = streamText({
      model: openai('gpt-5-nano'),
      messages: [
        {
          role: 'system',
          content: content[2]
        },
        {
          role: 'user',
          content: content[3]
        },
        {
          role: 'assistant',
          content: content[4]
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
