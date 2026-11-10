"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthUserSummary {
  id: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
}

export type PasswordAuthResult =
  | { ok: true; requiresEmailConfirmation?: boolean }
  | { ok: false; error: string };

async function getRequestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return host
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
});

export async function signInWithPasswordAction(
  email: string,
  password: string,
): Promise<PasswordAuthResult> {
  const parsed = credentialsSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, error: "Email atau password belum valid." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { ok: false, error: "Email atau password salah." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Layanan login belum siap. Silakan coba lagi nanti." };
  }
}

export async function signUpWithPasswordAction(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<PasswordAuthResult> {
  const parsed = credentialsSchema
    .extend({ confirmPassword: z.string() })
    .safeParse({ email, password, confirmPassword });
  if (!parsed.success) {
    return { ok: false, error: "Email valid dan password minimal 8 karakter diperlukan." };
  }
  if (parsed.data.password !== parsed.data.confirmPassword) {
    return { ok: false, error: "Konfirmasi password belum sama." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const redirectTo = `${await getRequestOrigin()}/auth/callback?next=/humanizer`;
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      return { ok: false, error: "Pendaftaran belum berhasil. Email mungkin sudah terdaftar." };
    }

    if (!data.session) {
      return { ok: true, requiresEmailConfirmation: true };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Layanan pendaftaran belum siap. Silakan coba lagi nanti." };
  }
}

export async function getCurrentUserAction(): Promise<AuthUserSummary | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const metadata = data.user.user_metadata ?? {};
    const name =
      (typeof metadata.full_name === "string" && metadata.full_name) ||
      (typeof metadata.name === "string" && metadata.name) ||
      data.user.email?.split("@")[0] ||
      "Pengguna";

    return {
      id: data.user.id,
      email: data.user.email ?? null,
      name,
      avatarUrl: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    };
  } catch {
    return null;
  }
}

export async function signOutAction() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } finally {
    redirect("/humanizer");
  }
}
