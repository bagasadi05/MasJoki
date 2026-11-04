"use server";

import { revalidatePath } from "next/cache";
import { sudahMasuk } from "@/lib/auth";
import { STATUS_LABEL, type StatusPesanan } from "@/lib/payment-status";
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
