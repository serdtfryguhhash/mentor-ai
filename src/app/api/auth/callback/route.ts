import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // In production: Handle Supabase Auth callback
  // const code = req.nextUrl.searchParams.get('code');
  // if (code) {
  //   const supabase = createRouteHandlerClient({ cookies });
  //   await supabase.auth.exchangeCodeForSession(code);
  // }
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
