import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const POST = async (req: Request) => {
  try {
    const { prompt } = await req.json()
    const { text} = await generateText({
      model: openai("gpt-5-nano"),
      prompt,
      temperature: 0.7
    })
    
    return Response.json({ text });
  }
  catch ( error ) {
    console.error( "[Error]: Generating text failed", error );
    return Response.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
