import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // In production: Resend + ConvertKit integration
    // await resend.emails.send({
    //   from: 'wisdom@mentor.ai',
    //   to: email,
    //   subject: 'Welcome to the Wisdom Digest',
    //   html: '...',
    // });

    return NextResponse.json({ success: true, message: "Subscribed to Wisdom Digest!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
