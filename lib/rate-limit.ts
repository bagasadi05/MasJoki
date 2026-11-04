import { headers } from "next/headers";

/**
 * Rate limit sederhana untuk server action formulir, di memori per pekerja.
 *
 * Batasan yang jujur:
 * - Cocok untuk satu instance dan deploy kecil. Jangan andalkan kalau nanti
 *   dijalankan di banyak instance/edge — ganti dengan penyimpanan bersama
 *   (Upstash/Redis) setelah traffic riil naik.
 * - Reset sehabis restart server. Itu sifat alami in-memory.
 *
 * Prinsip: lebih baik menolak pengiriman salah (dan minta coba lagi) daripada
 * menyimpan spam. Gabungan honeypot + limit ini cukup untuk formulir publik
 * tanpa membuat pengguna asli kesulitan.
 */

const RIWAYAT = new Map<string, number[]>();

const BATAS = 10; // pengiriman per jendela
const JENDELA_DETIK = 60 * 60; // 1 jam

interface HasilLimit {
  ok: boolean;
  /** Detik sebelum boleh mencoba lagi, kalau ditolak. */
  cobaLagiDalamDetik?: number;
}

/**
 * Inti logika, dipecah agar bisa diuji tanpa scope request. `sekarang`
 * diinjeksi supaya boleh memakai jam berbeda.
 */
export function batasiKunci(
  kunci: string,
  sekarang = Date.now(),
): HasilLimit {
  const arr = (RIWAYAT.get(kunci) ?? []).filter(
    (t) => sekarang - t < JENDELA_DETIK * 1000,
  );

  if (arr.length >= BATAS) {
    const terlama = arr[0] ?? sekarang;
    const sisa = Math.max(
      1,
      Math.ceil((terlama + JENDELA_DETIK * 1000 - sekarang) / 1000),
    );
    return { ok: false, cobaLagiDalamDetik: sisa };
  }

  arr.push(sekarang);
  RIWAYAT.set(kunci, arr);
  return { ok: true };
}

export async function cekRateLimit(): Promise<HasilLimit> {
  const kunci = await asalPermintaan();
  return batasiKunci(kunci);
}

async function asalPermintaan(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "lokal";
}
