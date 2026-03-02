import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessions, insights, goals, totalSessionsAllTime, totalInsightsAllTime } = body;

    const response = await chat([
      {
        role: "system",
        content: `You are Mentor.ai's weekly growth analyst. Generate a concise, encouraging weekly growth report for the user. Include:
1. **Sessions Recap**: Brief summary of mentoring activity this week
2. **Key Insights**: Themes from their saved insights
3. **Goal Progress**: Status of active goals
4. **Recommended Next Steps**: 2-3 actionable suggestions for next week
5. **Growth Challenge**: One specific challenge for the coming week

Keep it concise (200-300 words). Use markdown formatting. Be encouraging but honest. Reference specific mentors and topics when available.`,
      },
      {
        role: "user",
        content: `Generate my weekly growth report.

Sessions this week: ${JSON.stringify(sessions)}
Insights saved: ${JSON.stringify(insights)}
Active goals: ${JSON.stringify(goals)}
All-time stats: ${totalSessionsAllTime} total sessions, ${totalInsightsAllTime} total insights`,
      },
    ], { temperature: 0.7, maxTokens: 800 });

    return NextResponse.json({ success: true, report: response });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate report";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
