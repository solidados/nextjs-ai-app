import { tryCatch } from '@/utils/tryCatch';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const POST = async (req: Request) => {
  try {
    const { prompt } = await req.json();
  
    const result = streamText({
      model: openai('gpt-5-nano'),
      prompt,
    })
  
    return result.toUIMessageStreamResponse()
  }
  catch ( error ) {
    console.error("Error streaming text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }
  // const result = await tryCatch((async () => {
  //   const { prompt } = await req.json();
  //
  //   const stream = streamText({
  //     model: openai('gpt-5-nano'),
  //     prompt,
  //   });
  //
  //   return stream.toUIMessageStreamResponse();
  // })());
  //
  // if (!result.ok) {
  //   return new Response(
  //     JSON.stringify({ error: result.error.message }),
  //     { status: 500, headers: { 'Content-Type': 'application/json' } }
  //   );
  // }
};
