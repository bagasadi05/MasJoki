"use client";

import { track } from "@vercel/analytics";

/**
 * Event analytics untuk situs Mas Joki.
 *
 * Aturan: hanya nama event + data non-pribadi (jenis layanan, jumlah kata,
 * sumber proses). JANGAN pernah mengirim nama, nomor WhatsApp, isi naskah,
 * atau tautan Drive ke analytics.
 */
export type NamaEvent =
  | "cta_hitung"
  | "cta_humanizer"
  | "chat_whatsapp"
  | "order_terkirim"
  | "penawaran_terkirim"
  | "humanize_mulai"
  | "humanize_sukses"
  | "token_modal"
  | "poster_unduh";

export function lacak(
  nama: NamaEvent,
  data?: Record<string, string | number | boolean>,
) {
  try {
    track(nama, data);
  } catch {
    /* analytics diblokir atau gagal dimuat: jangan ganggu alur pengguna */
  }
}
