import { randomBytes } from "node:crypto";

import { getWibDate } from "./time";
import { orderSchema } from "./validation";

/**
 * Kwitansi PDF: payload yang dikirim klien ke POST /kwitansi sama dengan
 * field formulir order — server memvalidasi ulang (zod) dan menghitung ulang
 * harga, jadi PDF tidak pernah memakai angka hasil edit browser.
 */
export const kwitansiInputSchema = orderSchema;

export type KwitansiPayload = {
  serviceId: string;
  qty: number;
  deadlineId: string;
  difficultyId?: string;
  addons?: string[];
  name: string;
  whatsapp: string;
};

const KODE_REGEX = /^MJ-\d{8}-[A-Z0-9]{4}$/;

export function kodeKwitansiValid(value: unknown): value is string {
  return typeof value === "string" && KODE_REGEX.test(value);
}

/**
 * Kode kwitansi unik: MJ-YYYYMMDD-XXXX (WIB), 16 bit entropi cukup untuk
 * kode tampilan; PDF tidak memuat data sensitif selain nama & nomor WA pemesan.
 */
export function buatKodeKwitansi(sekarang: Date = new Date()): string {
  const d = getWibDate(sekarang);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const acak = randomBytes(2).toString("hex").toUpperCase();
  return `MJ-${yyyy}${mm}${dd}-${acak}`;
}

/** Tanggal tampil di kwitansi, format Indonesia WIB. */
export function formatTanggalWib(sekarang: Date = new Date()): string {
  const d = getWibDate(sekarang);
  const hari = String(d.getDate()).padStart(2, "0");
  const bulan = String(d.getMonth() + 1).padStart(2, "0");
  const tahun = d.getFullYear();
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${hari}/${bulan}/${tahun}, ${jam}.${menit} WIB`;
}
