import crypto from "node:crypto";
import { cookies } from "next/headers";

const NAMA_COOKIE = "mj_admin";
const UMUR_DETIK = 60 * 60 * 12;

/**
 * Sesi admin sederhana: cookie berisi HMAC dari password.
 *
 * Bukan pengganti autentikasi penuh (tidak ada user, tidak ada rotasi sesi),
 * tapi cukup untuk satu admin dan tidak menyimpan password di cookie.
 */
function tokenSesi(): string | null {
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (password.length < 8) return null;

  return crypto
    .createHmac("sha256", password)
    .update("mas-joki-admin-v1")
    .digest("hex");
}

export function adminAktif(): boolean {
  return tokenSesi() !== null;
}

export function passwordCocok(masukan: string): boolean {
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (password.length < 8) return false;

  const a = Buffer.from(masukan, "utf8");
  const b = Buffer.from(password, "utf8");
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

export async function sudahMasuk(): Promise<boolean> {
  const token = tokenSesi();
  if (!token) return false;

  const cookie = (await cookies()).get(NAMA_COOKIE)?.value;
  if (!cookie || cookie.length !== token.length) return false;

  return crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(token));
}

export async function buatSesi(): Promise<void> {
  const token = tokenSesi();
  if (!token) return;

  (await cookies()).set(NAMA_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_DETIK,
  });
}

export async function hapusSesi(): Promise<void> {
  (await cookies()).delete(NAMA_COOKIE);
}
