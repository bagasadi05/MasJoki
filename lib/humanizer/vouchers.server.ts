import { createHmac, timingSafeEqual } from "node:crypto";
import type { VoucherRedeemResult } from "./types";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * vouchers.server.ts — modul KHUSUS SERVER.
 *
 * Mendukung verifikasi voucher sekali pakai langsung ke Supabase:
 * 1. Kunci/Voucher Pembelian (tersimpan di token_licenses):
 *    - Begitu diklaim, status langsung diubah menjadi `is_redeemed = true`.
 *    - Percobaan klaim kedua oleh siapa pun akan ditolak: "Voucher sudah expired".
 * 2. Voucher Promo Publik (seperti MASJOKIBARU):
 *    - Dicatat di tabel promo_claims per alamat IP agar tidak bisa diklaim berulang kali.
 * 3. Fallback HMAC in-memory untuk pengujian lokal & backward compatibility.
 */

if (typeof window !== "undefined") {
  throw new Error("vouchers.server.ts hanya boleh diimpor dari kode server.");
}

// Voucher promosi publik (boleh dibagikan, TIDAK rahasia).
export const PROMO_VOUCHERS: Record<string, { words: number; note: string }> = {
  MASJOKIBARU: { words: 500, note: "Bonus Pengguna Baru Mas Joki" },
  GPTZEROFREE: { words: 300, note: "Voucher Spesial Uji GPTZero" },
  TURNITINAMAN: { words: 400, note: "Voucher Spesial Uji Turnitin" },
  ANTIGRAVITY: { words: 1000, note: "Bonus Komunitas Akademik" },
};

const BATAS_KATA_VOUCHER = 200_000;
const UMUR_LEDGER_MS = 30 * 24 * 60 * 60 * 1000;
const LEDGER_MAKS = 5_000;

/** Catatan pemakaian lokal/fallback memory: kunci -> waktu dipakai (epoch ms). */
const LEDGER = new Map<string, number>();

function sapuLedger(sekarang: number): void {
  if (LEDGER.size <= LEDGER_MAKS) return;
  for (const [kunci, dipakaiPada] of LEDGER) {
    if (sekarang - dipakaiPada > UMUR_LEDGER_MS) {
      LEDGER.delete(kunci);
    }
  }
}

function sudahDipakai(kunci: string, sekarang: number): boolean {
  const dipakaiPada = LEDGER.get(kunci);
  if (dipakaiPada === undefined) return false;
  if (sekarang - dipakaiPada > UMUR_LEDGER_MS) {
    LEDGER.delete(kunci);
    return false;
  }
  return true;
}

function catatPemakaian(kunci: string, sekarang: number): void {
  LEDGER.set(kunci, sekarang);
  sapuLedger(sekarang);
}

/** Untuk pengujian: kosongkan ledger tanpa merestart proses. */
export function resetVoucherLedger(): void {
  LEDGER.clear();
}

function ambilSecret(): string {
  return (process.env.HUMANIZER_VOUCHER_SECRET ?? "").trim();
}

function tandaTangan(words: number, secret: string): string {
  return createHmac("sha256", secret)
    .update(`voucher:${words}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
}

function samaPersis(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Buat kode voucher bertanda tangan untuk pemilik toko.
 */
export function generateSignedVoucher(words: number): string {
  const secret = ambilSecret();
  if (!secret) {
    throw new Error(
      "HUMANIZER_VOUCHER_SECRET belum diset. Voucher bertanda tangan tidak bisa dibuat.",
    );
  }
  if (!Number.isInteger(words) || words <= 0 || words > BATAS_KATA_VOUCHER) {
    throw new Error(`Jumlah kata harus bilangan bulat 1–${BATAS_KATA_VOUCHER}.`);
  }
  return `MJ-${words}-${tandaTangan(words, secret)}`;
}

/**
 * Verifikasi dan tukar voucher sekali pakai dengan jaminan database Supabase.
 *
 * @param rawCode kode yang diketik pembeli
 * @param clientKey penanda pemakai (alamat IP) untuk membatasi voucher promo
 * @param walletId wallet tujuan saldo (wajib untuk voucher pembelian)
 */
export async function verifyVoucherCode(
  rawCode: string,
  clientKey = "tanpa-ip",
  walletId?: string,
): Promise<VoucherRedeemResult> {
  if (!rawCode || typeof rawCode !== "string") {
    return { ok: false, error: "Kode voucher tidak valid." };
  }

  const code = rawCode.trim().toUpperCase();
  const sekarang = Date.now();
  const supabase = getSupabaseAdmin();
  const production = process.env.NODE_ENV === "production";

  if (!supabase && production) {
    return {
      ok: false,
      error: "Verifikasi voucher sedang tidak tersedia. Silakan coba lagi nanti.",
    };
  }

  // 1. CEK VOUCHER PROMO PUBLIK (mis. MASJOKIBARU)
  const promo = PROMO_VOUCHERS[code];
  if (promo) {
    const kunciMemori = `promo:${code}:${clientKey}`;

    if (supabase) {
      try {
        const { data: claim, error: claimErr } = await supabase
          .from("promo_claims")
          .select("id")
          .eq("promo_code", code)
          .eq("client_ip", clientKey)
          .maybeSingle();

        // Error baca jangan dianggap "belum pernah klaim".
        if (claimErr) throw claimErr;

        if (claim) {
          return {
            ok: false,
            error:
              "Voucher promo ini sudah pernah kamu klaim di perangkat/jaringan ini. Gunakan voucher lain atau beli paket di Mas Joki.",
          };
        }

        // Catat klaim baru ke Supabase
        const { error: insertErr } = await supabase.from("promo_claims").insert({
          promo_code: code,
          client_ip: clientKey,
        });

        if (insertErr) {
          // Bisa jadi balapan dua request: cek ulang sebelum menyerah.
          const { data: recheck, error: recheckErr } = await supabase
            .from("promo_claims")
            .select("id")
            .eq("promo_code", code)
            .eq("client_ip", clientKey)
            .maybeSingle();

          if (recheckErr) throw insertErr;
          if (recheck) {
            return {
              ok: false,
              error:
                "Voucher promo ini sudah pernah kamu klaim di perangkat/jaringan ini. Gunakan voucher lain atau beli paket di Mas Joki.",
            };
          }
          throw insertErr;
        }
      } catch {
        if (production) {
          return {
            ok: false,
            error: "Verifikasi voucher sedang tidak tersedia. Silakan coba lagi nanti.",
          };
        }
        // Fallback ke in-memory jika tabel promo_claims belum dibuat
        if (sudahDipakai(kunciMemori, sekarang)) {
          return {
            ok: false,
            error: "Voucher promo ini sudah pernah kamu klaim.",
          };
        }
      }
    } else if (sudahDipakai(kunciMemori, sekarang)) {
      return {
        ok: false,
        error: "Voucher promo ini sudah pernah kamu klaim di jaringan ini.",
      };
    }

    catatPemakaian(kunciMemori, sekarang);
    return {
      ok: true,
      tokens: promo.words,
      message: `${promo.note} (+${promo.words.toLocaleString("id-ID")} kata)!`,
    };
  }

  // 2. REDEEM VOUCHER PEMBELIAN (tabel token_licenses).
  //    Voucher ditandai hangus DAN saldo wallet ditambah oleh satu fungsi
  //    database (public.redeem_license), jadi tidak ada lagi kondisi voucher
  //    hangus tetapi saldo gagal masuk.
  //    Lihat supabase/migrations/20261111000100_redeem_license_atomic.sql.
  if (supabase) {
    if (!walletId) {
      return {
        ok: false,
        error: "Saldo token belum siap. Muat ulang halaman lalu coba lagi.",
      };
    }

    try {
      const { data, error: rpcErr } = await supabase.rpc("redeem_license", {
        p_key_code: code,
        p_wallet_id: walletId,
      });

      if (rpcErr) {
        // PGRST202 = fungsi belum ada di database (migrasi belum dijalankan).
        if (rpcErr.code === "PGRST202") {
          console.error(
            "Fungsi redeem_license belum ada. Jalankan supabase/migrations/20261111000100_redeem_license_atomic.sql.",
          );
          return {
            ok: false,
            error: "Sistem voucher belum siap. Hubungi Mas Joki.",
          };
        }

        // P0002 = wallet tidak ditemukan; transaksi dibatalkan, voucher utuh.
        if (rpcErr.code === "P0002") {
          return {
            ok: false,
            error: "Saldo token belum siap. Muat ulang halaman lalu coba lagi.",
          };
        }

        throw rpcErr;
      }

      const row = Array.isArray(data) ? data[0] : data;
      if (!row) {
        return {
          ok: false,
          error: "Kode voucher ini sudah expired / sudah pernah digunakan sebelumnya.",
        };
      }

      const granted = Number(row.granted);
      return {
        ok: true,
        tokens: granted,
        remainingWords: Number(row.remaining_words),
        credited: true,
        message: `Voucher ${row.package_name} berhasil diklaim (+${granted.toLocaleString("id-ID")} kata)!`,
      };
    } catch (err: unknown) {
      console.error("Gagal redeem voucher di Supabase:", err);
      if (production) {
        return {
          ok: false,
          error: "Verifikasi voucher sedang tidak tersedia. Silakan coba lagi nanti.",
        };
      }
    }
  }

  if (production) {
    return {
      ok: false,
      error: "Kode voucher tidak ditemukan atau belum terdaftar di server.",
    };
  }

  // 3. FALLBACK: VOUCHER BERTANDA TANGAN LAMA (HMAC)
  const match = code.match(/^MJ-(\d{1,6})-([A-Z0-9]{12})$/);
  if (!match) {
    return {
      ok: false,
      error:
        "Kode voucher tidak ditemukan atau tidak valid. Pastikan kamu mengetik kodenya dengan benar.",
    };
  }

  const secret = ambilSecret();
  if (!secret) {
    return {
      ok: false,
      error:
        "Voucher bertanda tangan belum aktif di server ini. Hubungi Mas Joki untuk mengaktifkan kunci voucher.",
    };
  }

  const words = parseInt(match[1], 10);
  const expectedSig = match[2];

  if (!Number.isInteger(words) || words <= 0 || words > BATAS_KATA_VOUCHER) {
    return { ok: false, error: "Jumlah kata dalam voucher tidak valid." };
  }

  if (!samaPersis(tandaTangan(words, secret), expectedSig)) {
    return {
      ok: false,
      error: "Kode voucher tidak valid atau salah. Hubungi Mas Joki.",
    };
  }

  const kunciLedger = `signed:${code}`;
  if (sudahDipakai(kunciLedger, sekarang)) {
    return {
      ok: false,
      error: "Kode voucher ini sudah expired / sudah pernah digunakan sebelumnya.",
    };
  }

  catatPemakaian(kunciLedger, sekarang);

  return {
    ok: true,
    tokens: words,
    message: `Voucher resmi Mas Joki berhasil diklaim (+${words.toLocaleString("id-ID")} kata)!`,
  };
}
