"use server";

import { computePrice } from "@/lib/pricing";
import { rupiah } from "@/lib/format";
import { cekRateLimit } from "@/lib/rate-limit";
import { getService } from "@/lib/services";
import { supabaseAdmin } from "@/lib/supabase";
import type { ActionResult } from "@/lib/types";
import { firstIssue, orderSchema, quoteSchema } from "@/lib/validation";

function buatKode(prefix: "P" | "Q"): string {
  const waktu = Date.now().toString(36).slice(-4).toUpperCase();
  const acak = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `MJ-${prefix}${waktu}${acak}`;
}

function isBot(formData: FormData): boolean {
  // Honeypot: kolom yang tidak pernah diisi manusia.
  return String(formData.get("perusahaan") ?? "").trim().length > 0;
}

/** Batas per IP di luar honeypot. Bot yang masuk honeypot tidak kena di sini. */
async function blokirKalauByarpet(): Promise<ActionResult | null> {
  const limit = await cekRateLimit();
  if (limit.ok) return null;

  const menit = Math.max(1, Math.ceil(limit.cobaLagiDalamDetik! / 60));
  return {
    status: "error",
    message: `Terlalu banyak percobaan. Coba lagi dalam ${menit} menit.`,
  };
}

export async function submitOrder(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (isBot(formData)) {
    return { status: "ok", message: "Pesanan diterima." };
  }

  const blokir = await blokirKalauByarpet();
  if (blokir) return blokir;

  const parsed = orderSchema.safeParse({
    serviceId: formData.get("serviceId"),
    qty: formData.get("qty"),
    deadlineId: formData.get("deadlineId"),
    difficultyId: formData.get("difficultyId"),
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    fileUrl: formData.get("fileUrl") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: firstIssue(parsed.error) };
  }

  const data = parsed.data;
  const service = getService(data.serviceId);
  // Harga dihitung ulang di server; total dari browser tidak dipercaya.
  const price = computePrice(service, data.qty, data.deadlineId, data.difficultyId);
  const code = buatKode("P");

  if (!supabaseAdmin) {
    return {
      status: "ok",
      code,
      demo: true,
      message: `Estimasi ${rupiah(price.total)} tersimpan sebagai draf. Supabase belum dihubungkan, jadi pesanan ini belum masuk database.`,
    };
  }

  const { error } = await supabaseAdmin.from("orders").insert({
    code,
    customer_name: data.name,
    whatsapp: data.whatsapp,
    service_id: service.id,
    service_name: service.name,
    quantity: price.qty,
    deadline: data.deadlineId,
    difficulty: data.difficultyId,
    subtotal: price.subtotal,
    total: price.total,
    file_url: data.fileUrl || null,
    notes: data.notes || null,
    status: "menunggu_konfirmasi",
  });

  if (error) {
    console.error("[submitOrder]", error.message);
    return {
      status: "error",
      message: "Pesanan gagal disimpan. Coba lagi, atau kirim lewat WhatsApp.",
    };
  }

  return {
    status: "ok",
    code,
    message:
      "Pesanan masuk. Admin akan konfirmasi lewat WhatsApp sebelum kamu bayar.",
  };
}

export async function submitQuote(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (isBot(formData)) {
    return { status: "ok", message: "Permintaan diterima." };
  }

  const blokir = await blokirKalauByarpet();
  if (blokir) return blokir;

  const parsed = quoteSchema.safeParse({
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    serviceId: formData.get("serviceId"),
    detail: formData.get("detail"),
    deadlineId: formData.get("deadlineId"),
    budget: formData.get("budget") ?? "",
    fileUrl: formData.get("fileUrl") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: firstIssue(parsed.error) };
  }

  const data = parsed.data;
  const code = buatKode("Q");

  if (!supabaseAdmin) {
    return {
      status: "ok",
      code,
      demo: true,
      message:
        "Permintaan penawaran siap dikirim. Supabase belum dihubungkan, jadi data ini belum masuk database.",
    };
  }

  const { error } = await supabaseAdmin.from("quote_requests").insert({
    code,
    customer_name: data.name,
    whatsapp: data.whatsapp,
    service_id: data.serviceId,
    detail: data.detail,
    deadline: data.deadlineId,
    budget: data.budget || null,
    file_url: data.fileUrl || null,
    status: "baru",
  });

  if (error) {
    console.error("[submitQuote]", error.message);
    return {
      status: "error",
      message: "Permintaan gagal disimpan. Coba lagi, atau kirim lewat WhatsApp.",
    };
  }

  return {
    status: "ok",
    code,
    message:
      "Permintaan masuk. Admin balas dengan rincian harga, biasanya di bawah 1 jam kerja.",
  };
}
