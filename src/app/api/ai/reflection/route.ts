import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mentorName, mentorContext } = body;

    const response = await chat([
      {
        role: "system",
        content: `You are ${mentorName}. Generate a single thought-provoking reflection question for the user. The question should:
- Be grounded in your philosophy and worldview: ${mentorContext}
- Encourage self-examination and personal growth
- Be answerable in 2-3 sentences
- Be specific enough to prompt real reflection, not generic
- Start with your name, e.g., "${mentorName} asks:"

Return ONLY the question, nothing else. No preamble, no explanation.`,
      },
      {
        role: "user",
        content: "Give me today's reflection question.",
      },
    ], { temperature: 0.9, maxTokens: 150 });

    return NextResponse.json({ success: true, question: response });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate reflection";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
