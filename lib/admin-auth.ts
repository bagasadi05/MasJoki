/**
 * Guard halaman & route khusus pengelola (admin).
 *
 * Fail-closed: tanpa env `ADMIN_EMAILS` (daftar email dipisah koma/titik-koma/
 * spasi, huruf besar/kecil sama) ATAU tanpa session Supabase yang valid,
 * tidak ada yang dianggap admin. Email dicek dari `auth.getUser()` di server,
 * bukan dari input klien.
 *
 * Supabase di-import dinamis supaya modul ini tetap bisa di-import di tes
 * (paket `server-only` akan melempar kalau di-import di luar server Next).
 */

export interface PenggunaAuth {
  id: string;
  email: string | null;
}

/** Daftar email admin dari env, dinormalisasi huruf kecil. */
export function daftarEmailAdmin(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const daftar = daftarEmailAdmin();
  if (daftar.length === 0) return false;
  return daftar.includes(email.toLowerCase());
}

/** Pengguna yang sedang login (session Supabase), atau null. */
export async function getPenggunaAuth(): Promise<PenggunaAuth | null> {
  try {
    const { createSupabaseServerClient } = await import("./supabase/server");
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email ?? null };
  } catch {
    return null;
  }
}

/** Pengguna login DAN terdaftar sebagai admin, atau null (fail-closed). */
export async function getAdminUser(): Promise<PenggunaAuth | null> {
  const pengguna = await getPenggunaAuth();
  if (!pengguna || !isEmailAdmin(pengguna.email)) return null;
  return pengguna;
}
