import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-redirect";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const safeNext = safeNextPath(
    request.nextUrl.searchParams.get("next"),
    request.nextUrl.origin,
  );

  if (!tokenHash) {
    return NextResponse.redirect(new URL("/humanizer?auth_error=missing_token", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });

  if (error) {
    return NextResponse.redirect(new URL("/humanizer?auth_error=magic_link_failed", request.url));
  }

  return NextResponse.redirect(new URL(safeNext, request.url));
}
