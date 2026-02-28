import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, mentorSystemPrompt, mentorName } = await req.json();

    // In production, this would call OpenAI GPT-4 Turbo
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4-turbo-preview",
    //   messages: [
    //     { role: "system", content: mentorSystemPrompt },
    //     ...messages,
    //   ],
    //   temperature: 0.85,
    //   max_tokens: 1000,
    //   presence_penalty: 0.6,
    //   frequency_penalty: 0.3,
    // });
    // const response = completion.choices[0].message.content;

    const response = `Thank you for sharing that with me. As ${mentorName}, I want to offer you this perspective from my own experience and philosophy. The challenges you describe are not new - they are part of the human condition that spans all ages and civilizations. What matters is not the challenge itself, but how you choose to meet it. I encourage you to reflect deeply on what truly matters to you, and let that clarity guide your next step.`;

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
