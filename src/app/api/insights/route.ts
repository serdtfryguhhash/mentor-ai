import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const insight = await req.json();
    // In production: Save to Supabase
    return NextResponse.json({ success: true, insight });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save insight" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // In production: Fetch from Supabase
  return NextResponse.json({ insights: [] });
}
