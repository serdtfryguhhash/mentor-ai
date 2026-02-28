import { NextRequest, NextResponse } from "next/server";
import { mentors } from "@/data/mentors";

export async function GET(req: NextRequest) {
  const mentor = mentors[Math.floor(Math.random() * mentors.length)];
  const types = ["quote", "challenge", "thought"] as const;
  const type = types[Math.floor(Math.random() * types.length)];

  let content = "";
  if (type === "quote") {
    content = mentor.famousQuotes[Math.floor(Math.random() * mentor.famousQuotes.length)];
  } else if (type === "challenge") {
    content = `Today's challenge: ${mentor.challengeStyle}`;
  } else {
    content = mentor.philosophy;
  }

  return NextResponse.json({
    mentor_id: mentor.id,
    mentor_name: mentor.name,
    content,
    type,
    date: new Date().toISOString().split("T")[0],
  });
}
