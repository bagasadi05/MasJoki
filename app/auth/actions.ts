"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cekRateLimit, cekRateLimitKunci, type HasilLimit } from "@/lib/rate-limit";

export interface AuthUserSummary {
  id: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
}

export type PasswordAuthResult =
  | { ok: true; requiresEmailConfirmation?: boolean }
  | { ok: false; error: string };

/**
 * Origin untuk tautan konfirmasi email. Env situs dipakai lebih dulu: header
 * Host/x-forwarded-host bisa dipalsukan dan akan mengarahkan tautan verifikasi
 * ke domain penyerang (host header injection).
 */
async function getRequestOrigin(): Promise<string> {
  const dikonfigurasi = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (dikonfigurasi) return dikonfigurasi;

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

const BATAS_MASUK_PER_IP = 10;
const BATAS_MASUK_PER_EMAIL = 5;
const JENDELA_AUTH_DETIK = 15 * 60;

function pesanTunggu(hasil: HasilLimit): string {
  const menit = Math.max(1, Math.ceil((hasil.cobaLagiDalamDetik ?? 60) / 60));
  return `Terlalu banyak percobaan masuk. Coba lagi dalam ${menit} menit.`;
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

  // Per IP menahan percobaan massal; per email menahan tebakan satu akun.
  const batasIp = await cekRateLimit(
    "auth-masuk",
    BATAS_MASUK_PER_IP,
    JENDELA_AUTH_DETIK,
  );
  if (!batasIp.ok) return { ok: false, error: pesanTunggu(batasIp) };

  const batasEmail = await cekRateLimitKunci(
    `auth-masuk-email:${parsed.data.email.toLowerCase()}`,
    BATAS_MASUK_PER_EMAIL,
    JENDELA_AUTH_DETIK,
  );
  if (!batasEmail.ok) return { ok: false, error: pesanTunggu(batasEmail) };

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

  const batasDaftar = await cekRateLimit("auth-daftar", 5, 60 * 60);
  if (!batasDaftar.ok) {
    const menit = Math.max(1, Math.ceil((batasDaftar.cobaLagiDalamDetik ?? 60) / 60));
    return {
      ok: false,
      error: `Terlalu banyak pendaftaran dari jaringan ini. Coba lagi dalam ${menit} menit.`,
    };
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
