import { headers } from "next/headers";

/**
 * Rate limit sederhana untuk server action formulir, di memori per pekerja.
 *
 * Batasan yang jujur:
 * - Cocok untuk satu instance dan deploy kecil. Jangan andalkan kalau nanti
 *   dijalankan di banyak instance/edge — ganti dengan penyimpanan bersama
 *   (Upstash/Redis) setelah traffic riil naik.
 * - Reset sehabis restart server. Itu sifat alami in-memory.
 * - Entri lama dibersihkan berkala supaya Map tidak tumbuh tanpa batas.
 *
 * Prinsip: lebih baik menolak pengiriman salah (dan minta coba lagi) daripada
 * menyimpan spam. Gabungan honeypot + limit ini cukup untuk formulir publik
 * tanpa membuat pengguna asli kesulitan.
 */

const RIWAYAT = new Map<string, number[]>();

export const BATAS_DEFAULT = 10; // pengiriman per jendela
export const JENDELA_DETIK_DEFAULT = 60 * 60; // 1 jam
const UMUR_MAKSIMAL_MS = 24 * 60 * 60 * 1000; // entri yang lebih tua dari ini dibuang
const SAPU_SETIAP = 200; // jumlah panggilan sebelum penyapuan berikutnya

let jumlahPanggilan = 0;

export interface HasilLimit {
  ok: boolean;
  /** Detik sebelum boleh mencoba lagi, kalau ditolak. */
  cobaLagiDalamDetik?: number;
}

function sapuEntriBasi(sekarang: number): void {
  for (const [kunci, riwayat] of RIWAYAT) {
    const terakhir = riwayat[riwayat.length - 1] ?? 0;
    if (sekarang - terakhir > UMUR_MAKSIMAL_MS) {
      RIWAYAT.delete(kunci);
    }
  }
}

/**
 * Inti logika, dipecah agar bisa diuji tanpa scope request. `sekarang`
 * diinjeksi supaya boleh memakai jam berbeda.
 */
export function batasiKunci(
  kunci: string,
  sekarang = Date.now(),
  batas = BATAS_DEFAULT,
  jendelaDetik = JENDELA_DETIK_DEFAULT,
): HasilLimit {
  const arr = (RIWAYAT.get(kunci) ?? []).filter(
    (t) => sekarang - t < jendelaDetik * 1000,
  );

  if (arr.length >= batas) {
    const terlama = arr[0] ?? sekarang;
    const sisa = Math.max(
      1,
      Math.ceil((terlama + jendelaDetik * 1000 - sekarang) / 1000),
    );
    return { ok: false, cobaLagiDalamDetik: sisa };
  }

  arr.push(sekarang);
  RIWAYAT.set(kunci, arr);

  jumlahPanggilan += 1;
  if (RIWAYAT.size > 1000 || jumlahPanggilan % SAPU_SETIAP === 0) {
    sapuEntriBasi(sekarang);
  }

  return { ok: true };
}

/** Alamat IP permintaan saat ini, dipakai juga untuk ledger voucher. */
export async function ambilAlamatIp(): Promise<string> {
  try {
    const h = await headers();

    // Header yang diisi platform tepercaya lebih dulu. `x-forwarded-for`
    // hanya dipakai terakhir dan diambil entri paling kanan (proxy terdekat),
    // bukan entri paling kiri yang bisa dipalsukan klien.
    const real = h.get("x-real-ip");
    if (real?.trim()) return real.trim();

    const vercel = h.get("x-vercel-forwarded-for");
    if (vercel?.trim()) return vercel.split(",")[0].trim();

    const cf = h.get("cf-connecting-ip");
    if (cf?.trim()) return cf.trim();

    const forwarded = h.get("x-forwarded-for");
    if (forwarded?.trim()) {
      const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
      if (parts.length > 0) return parts[parts.length - 1];
    }

    return "lokal";
  } catch {
    return "lokal";
  }
}

/**
 * Cek kuota per aksi. Setiap aksi punya keranjang sendiri supaya pengguna yang
 * mengirim dua pesanan tidak ikut terkunci saat mencoba klaim voucher.
 */
export async function cekRateLimit(
  aksi = "umum",
  batas = BATAS_DEFAULT,
  jendelaDetik = JENDELA_DETIK_DEFAULT,
): Promise<HasilLimit> {
  const kunci = `${aksi}:${await ambilAlamatIp()}`;
  return batasiKunci(kunci, Date.now(), batas, jendelaDetik);
}
