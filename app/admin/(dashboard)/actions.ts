"use server";

import { revalidatePath } from "next/cache";
import { sudahMasuk } from "@/lib/auth";
import { cekStatusTransaksi } from "@/lib/midtrans";
import {
  STATUS_LABEL,
  bolehDitimpa,
  mapStatusMidtrans,
  statusPesanan,
  type StatusPesanan,
} from "@/lib/payment-status";
import { supabaseAdmin } from "@/lib/supabase";

const STATUS_PESANAN = Object.keys(STATUS_LABEL) as StatusPesanan[];
const STATUS_KUTIPAN = ["baru", "dibalas", "deal", "ditutup"] as const;

export async function ubahStatus(formData: FormData) {
  if (!(await sudahMasuk())) throw new Error("Tidak berhak");
  if (!supabaseAdmin) throw new Error("Database belum dikonfigurasi");

  const jenis = String(formData.get("jenis") ?? "");
  const kode = String(formData.get("kode") ?? "").trim().toUpperCase();
  const status = String(formData.get("status") ?? "");

  if (!kode) throw new Error("Kode kosong");

  if (jenis === "pesanan") {
    if (!STATUS_PESANAN.includes(status as StatusPesanan)) {
      throw new Error("Status pesanan tidak dikenal");
    }
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("code", kode);
    if (error) throw new Error(error.message);
  } else if (jenis === "kutipan") {
    if (!STATUS_KUTIPAN.includes(status as (typeof STATUS_KUTIPAN)[number])) {
      throw new Error("Status penawaran tidak dikenal");
    }
    const { error } = await supabaseAdmin
      .from("quote_requests")
      .update({ status })
      .eq("code", kode);
    if (error) throw new Error(error.message);
  } else {
    throw new Error("Jenis tidak dikenal");
  }

  revalidatePath("/admin");
}

/**
 * Rekonsiliasi manual dengan Midtrans. Dipakai kalau webhook telat: ambil
 * status terkini dari Core API, lalu terapkan aturan yang sama dengan webhook
 * (mapStatusMidtrans + bolehDitimpa).
 */
export async function cekStatusPembayaran(
  kodeDirty: string,
): Promise<{ ok: boolean; pesan: string }> {
  if (!(await sudahMasuk())) return { ok: false, pesan: "Tidak berhak." };
  if (!supabaseAdmin) {
    return { ok: false, pesan: "Database belum dikonfigurasi." };
  }

  const kode = kodeDirty.trim().toUpperCase();
  if (!kode) return { ok: false, pesan: "Kode kosong." };

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("code, midtrans_order_id, status")
    .eq("code", kode)
    .maybeSingle();

  if (!order) return { ok: false, pesan: "Pesanan tidak ditemukan." };
  if (!order.midtrans_order_id) {
    return { ok: false, pesan: "Belum ada transaksi Midtrans untuk pesanan ini." };
  }

  let statusMidtrans;
  try {
    statusMidtrans = await cekStatusTransaksi(order.midtrans_order_id);
  } catch (error) {
    const pesan = error instanceof Error ? error.message : "Cek status gagal.";
    return { ok: false, pesan };
  }

  const berikutnya = mapStatusMidtrans(
    statusMidtrans.transaction_status,
    statusMidtrans.fraud_status,
  );

  if (!berikutnya) {
    return {
      ok: false,
      pesan: `Status Midtrans tidak dikenal: ${statusMidtrans.transaction_status}.`,
    };
  }

  const sekarang = statusPesanan(order.status);
  if (!bolehDitimpa(sekarang, berikutnya)) {
    return { ok: true, pesan: `Sudah ${STATUS_LABEL[berikutnya]}, tidak diubah.` };
  }

  const perubahan: Record<string, unknown> = { status: berikutnya };
  if (berikutnya === "dibayar") {
    perubahan.paid_at = new Date().toISOString();
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update(perubahan)
    .eq("code", order.code);

  if (error) return { ok: false, pesan: "Gagal simpan: " + error.message };

  revalidatePath("/admin");
  return { ok: true, pesan: `Diperbarui ke: ${STATUS_LABEL[berikutnya]}.` };
}
