import { NextRequest, NextResponse } from "next/server";
import { mentors } from "@/data/mentors";

export async function POST(req: NextRequest) {
  try {
    const answers = await req.json();
    const recommended = mentors
      .filter((m) => answers.interests?.includes(m.category))
      .slice(0, 5)
      .map((m) => ({ id: m.id, name: m.name, category: m.category }));

    return NextResponse.json({ recommended });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process onboarding" }, { status: 500 });
  }
}
