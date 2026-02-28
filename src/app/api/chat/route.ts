import { NextRequest, NextResponse } from "next/server";
import { mentorChat } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { messages, mentorSystemPrompt, mentorName } = await req.json();

    // Extract the latest user message from the messages array
    const userMessages = messages?.filter(
      (m: { role: string }) => m.role === "user"
    );
    const latestUserMessage =
      userMessages?.[userMessages.length - 1]?.content ?? "";

    // Build conversation history from prior messages (excluding the latest user message)
    const conversationHistory = (messages ?? []).slice(0, -1).map(
      (m: { role: string; content: string }) => ({
        role: m.role === "mentor" ? "assistant" : m.role,
        content: m.content,
      })
    );

    const response = await mentorChat(
      mentorName,
      mentorSystemPrompt,
      latestUserMessage,
      conversationHistory
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
