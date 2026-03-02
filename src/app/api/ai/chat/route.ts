import { NextRequest, NextResponse } from "next/server";
import { chat, mentorChat, mentorCircle, generateDailyWisdom, recommendMentors } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      message,
      mentorName,
      mentorSystemPrompt,
      mentorContext,
      conversationHistory,
      mentors,
      question,
      goals,
      mentorMemory,
      activeGoals,
    } = body;

    let response: string | Array<{ mentorName: string; response: string }>;

    switch (action) {
      case "mentor-chat": {
        // Inject mentor memory and active goals into the system prompt
        let enhancedPrompt = mentorSystemPrompt || "";
        if (mentorMemory) {
          enhancedPrompt += mentorMemory;
        }
        if (activeGoals) {
          enhancedPrompt += activeGoals;
        }
        response = await mentorChat(mentorName, enhancedPrompt, message, conversationHistory || []);
        break;
      }
      case "mentor-circle":
        response = await mentorCircle(mentors, question || message);
        break;
      case "daily-wisdom":
        response = await generateDailyWisdom(mentorName, mentorContext);
        break;
      case "recommend-mentors":
        response = await recommendMentors(goals);
        break;
      case "chat":
      default:
        response = await chat([
          {
            role: "system",
            content: "You are Mentor.ai's guide. Help users find the right mentors and get the most from their mentoring sessions.",
          },
          { role: "user", content: message },
        ]);
        break;
    }

    return NextResponse.json({ success: true, response });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "AI request failed";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ available: false, error: "ANTHROPIC_API_KEY is not set" });
  }
  return NextResponse.json({ available: true, model: "claude-sonnet-4-20250514" });
}
