import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-redirect";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"), request.nextUrl.origin);

  if (tokenHash) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });
    if (error) {
      return NextResponse.redirect(
        new URL("/humanizer?auth_error=magic_link_failed", request.url),
      );
    }
  } else if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL("/humanizer?auth_error=callback_failed", request.url),
      );
    }
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
