"use server";

import { pesanPesanan, pesanOrderSpesifik, pesanPenawaran } from "@/lib/pesan";
import { computePrice } from "@/lib/pricing";
import { cekRateLimit } from "@/lib/rate-limit";
import { getService } from "@/lib/services";
import { waLink } from "@/lib/site";
import type { ActionResult } from "@/lib/types";
import {
  fieldErrors,
  firstIssue,
  orderSchema,
  specializedOrderSchema,
  quoteSchema,
} from "@/lib/validation";

/**
 * Tidak ada database. Server action ini hanya memvalidasi isian, menghitung
 * ulang harga, lalu menyusun tautan WhatsApp berisi ringkasan pesanan.
 * Pesanan "tersimpan" sebagai pesan di chat admin.
 */

function isBot(formData: FormData): boolean {
  // Honeypot: kolom yang tidak pernah diisi manusia.
  return String(formData.get("perusahaan") ?? "").trim().length > 0;
}

/** Batas per IP di luar honeypot. Bot yang masuk honeypot tidak kena di sini. */
async function blokirKalauBanjir(): Promise<ActionResult | null> {
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
    // Bot tidak diberi tautan apa pun.
    return { status: "ok", message: "Pesanan diterima." };
  }

  const blokir = await blokirKalauBanjir();
  if (blokir) return blokir;

  const rawAddons = formData
    .getAll("addons")
    .map((item) => String(item))
    .filter(Boolean);

  const parsed = orderSchema.safeParse({
    serviceId: formData.get("serviceId"),
    qty: formData.get("qty"),
    deadlineId: formData.get("deadlineId"),
    difficultyId: formData.get("difficultyId"),
    addons: rawAddons,
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    fileUrl: formData.get("fileUrl") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: firstIssue(parsed.error),
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const service = getService(data.serviceId);
  // Harga dihitung ulang di server; angka dari browser tidak dipercaya.
  const price = computePrice(
    service,
    data.qty,
    data.deadlineId,
    data.difficultyId,
    data.addons,
  );

  const pesan = pesanPesanan({
    service,
    price,
    name: data.name,
    whatsapp: data.whatsapp,
    fileUrl: data.fileUrl,
    notes: data.notes,
  });

  return {
    status: "ok",
    message:
      "Pesanan siap dikirim. Buka WhatsApp dan tekan kirim — admin akan mengonfirmasi harga sebelum kamu bayar.",
    waUrl: waLink(pesan),
  };
}

export async function submitSpecializedOrder(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (isBot(formData)) {
    return { status: "ok", message: "Pesanan diterima." };
  }

  const blokir = await blokirKalauBanjir();
  if (blokir) return blokir;

  const rawAddons = formData
    .getAll("addons")
    .map((item) => String(item))
    .filter(Boolean);

  const parsed = specializedOrderSchema.safeParse({
    serviceId: formData.get("serviceId"),
    qty: formData.get("qty"),
    deadlineId: formData.get("deadlineId"),
    difficultyId: formData.get("difficultyId"),
    addons: rawAddons,
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    fileUrl: formData.get("fileUrl") ?? "",
    notes: formData.get("notes") ?? "",
    checkerTool: formData.get("checkerTool") ?? "",
    currentScore: formData.get("currentScore") ?? "",
    targetScore: formData.get("targetScore") ?? "",
    citationStyle: formData.get("citationStyle") ?? "",
    customPreference: formData.get("customPreference") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: firstIssue(parsed.error),
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const service = getService(data.serviceId);
  const price = computePrice(
    service,
    data.qty,
    data.deadlineId,
    data.difficultyId,
    data.addons,
  );

  const pesan = pesanOrderSpesifik({
    service,
    price,
    name: data.name,
    whatsapp: data.whatsapp,
    fileUrl: data.fileUrl,
    notes: data.notes,
    checkerTool: data.checkerTool,
    currentScore: data.currentScore,
    targetScore: data.targetScore,
    citationStyle: data.citationStyle,
    customPreference: data.customPreference,
  });

  return {
    status: "ok",
    message:
      "Pesanan siap dikirim ke WhatsApp admin. Rincian tugas lengkap sudah terangkum otomatis.",
    waUrl: waLink(pesan),
  };
}

export async function submitQuote(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (isBot(formData)) {
    return { status: "ok", message: "Permintaan diterima." };
  }

  const blokir = await blokirKalauBanjir();
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
    return {
      status: "error",
      message: firstIssue(parsed.error),
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const layanan =
    data.serviceId === "lainnya" ? "Lainnya" : getService(data.serviceId).name;

  const pesan = pesanPenawaran({
    layanan,
    deadlineId: data.deadlineId,
    budget: data.budget,
    fileUrl: data.fileUrl,
    detail: data.detail,
    name: data.name,
    whatsapp: data.whatsapp,
  });

  return {
    status: "ok",
    message:
      "Brief siap dikirim. Buka WhatsApp dan tekan kirim — admin balas dengan rincian harga, biasanya di bawah 1 jam kerja.",
    waUrl: waLink(pesan),
  };
}
