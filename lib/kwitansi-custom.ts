import { z } from "zod";

import { fieldErrors, firstIssue, nameSchema, whatsappSchema } from "./validation";

/**
 * Kwitansi custom untuk halaman khusus pengelola: admin mengisi rincian
 * sendiri (bukan hasil kalkulator katalog). Server tetap memvalidasi semua
 * field dengan zod — tidak ada angka atau teks yang dipercaya dari klien.
 */

export const barisKwitansiSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Uraian baris tidak boleh kosong")
    .max(140, "Uraian maksimal 140 karakter"),
  /** Nominal dalam rupiah; negatif berarti potongan/diskon. */
  amount: z.coerce
    .number()
    .int("Nominal harus bilangan bulat")
    .min(-1_000_000_000, "Nominal terlalu kecil")
    .max(1_000_000_000, "Nominal terlalu besar"),
});

export const kwitansiCustomSchema = z.object({
  /** Opsional: kalau kosong, server yang membuat kode baru. */
  kode: z.string().trim().max(20).optional().default(""),
  name: nameSchema,
  whatsapp: whatsappSchema,
  /** Uraian singkat isi kwitansi, mis. "Paket makalah + 2x revisi". */
  judul: z
    .string()
    .trim()
    .min(2, "Judul kwitansi minimal 2 karakter")
    .max(120, "Judul maksimal 120 karakter"),
  lines: z
    .array(barisKwitansiSchema)
    .min(1, "Minimal satu baris rincian")
    .max(20, "Maksimal 20 baris rincian"),
  catatan: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().default(""),
});

export type BarisKwitansi = z.infer<typeof barisKwitansiSchema>;
export type KwitansiCustomInput = z.infer<typeof kwitansiCustomSchema>;

/** Total akhir = jumlah semua baris (baris negatif mengurangi total). */
export function hitungTotalKwitansi(lines: readonly BarisKwitansi[]): number {
  return lines.reduce((total, baris) => total + baris.amount, 0);
}

export type HasilParseKwitansiCustom =
  | { ok: true; data: KwitansiCustomInput }
  | { ok: false; message: string; fieldErrors: Record<string, string> };

/** Validasi payload kwitansi custom; dipakai route POST admin. */
export function parseKwitansiCustom(input: unknown): HasilParseKwitansiCustom {
  const parsed = kwitansiCustomSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: firstIssue(parsed.error),
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  return { ok: true, data: parsed.data };
}
