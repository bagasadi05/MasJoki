"use server";

import { pesanPesanan, pesanOrderSpesifik, pesanPenawaran } from "@/lib/pesan";
import { computePrice } from "@/lib/pricing";
import { ambilAlamatIp, cekRateLimit } from "@/lib/rate-limit";
import { getService } from "@/lib/services";
import { waLink } from "@/lib/site";
import type { ActionResult } from "@/lib/types";
import type { VoucherRedeemResult } from "@/lib/humanizer/types";
import { verifyVoucherCode } from "@/lib/humanizer/vouchers.server";
import {
  checkLicense,
  deductLicenseWords,
  type CheckLicenseResult,
  type DeductLicenseResult,
} from "@/lib/humanizer/licenses.server";
import {
  humanizeWithGemini,
  type GeminiHumanizeOptions,
  type GeminiHumanizeResult,
} from "@/lib/humanizer/gemini.server";
import {
  fieldErrors,
  firstIssue,
  orderSchema,
  specializedOrderSchema,
  quoteSchema,
  voucherCodeSchema,
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

/**
 * Batas per IP di luar honeypot. Bot yang masuk honeypot tidak kena di sini.
 * Setiap aksi punya keranjang sendiri supaya kuota order tidak menghabiskan
 * kuota klaim voucher.
 */
async function blokirKalauBanjir(
  aksi: string,
  batas = 10,
): Promise<ActionResult | null> {
  const limit = await cekRateLimit(aksi, batas);
  if (limit.ok) return null;

  const menit = Math.max(1, Math.ceil((limit.cobaLagiDalamDetik ?? 60) / 60));
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

  const blokir = await blokirKalauBanjir("order");
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

  const blokir = await blokirKalauBanjir("order");
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

  const blokir = await blokirKalauBanjir("quote");
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

/**
 * Klaim voucher. Verifikasi tanda tangan dan pencatatan pemakaian dilakukan di
 * server (lihat lib/humanizer/vouchers.server.ts); kunci rahasia tidak pernah
 * ikut ke browser.
 */
export async function redeemVoucherAction(code: string): Promise<VoucherRedeemResult> {
  const parsed = voucherCodeSchema.safeParse(code);
  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error) };
  }

  // Kuota klaim terpisah dan lebih ketat daripada formulir pesanan.
  const limit = await cekRateLimit("voucher", 5);
  if (!limit.ok) {
    const menit = Math.max(1, Math.ceil((limit.cobaLagiDalamDetik ?? 60) / 60));
    return {
      ok: false,
      error: `Terlalu banyak percobaan klaim voucher. Coba lagi dalam ${menit} menit.`,
    };
  }

  const ip = await ambilAlamatIp();
  return verifyVoucherCode(parsed.data, ip);
}

/**
 * Cek status kuota kunci token dari database Supabase.
 */
export async function checkLicenseAction(code: string): Promise<CheckLicenseResult> {
  const limit = await cekRateLimit("license-check", 15);
  if (!limit.ok) {
    const menit = Math.max(1, Math.ceil((limit.cobaLagiDalamDetik ?? 60) / 60));
    return {
      ok: false,
      error: `Terlalu banyak permintaan cek lisensi. Coba lagi dalam ${menit} menit.`,
    };
  }

  return checkLicense(code);
}

/**
 * Potong kuota kata dari kunci token di Supabase saat humanize dijalankan.
 */
export async function deductLicenseAction(
  code: string,
  words: number,
): Promise<DeductLicenseResult> {
  const limit = await cekRateLimit("license-deduct", 20);
  if (!limit.ok) {
    return {
      ok: false,
      error: "Terlalu banyak permintaan pemotongan token. Silakan tunggu sebentar.",
    };
  }

  return deductLicenseWords(code, words);
}

/**
 * Humanize naskah menggunakan model resmi Google Gemini AI (Server Action aman).
 * Kunci API tersimpan di server dan naskah diproses dengan system prompt cerdas.
 */
export async function humanizeWithGeminiAction(
  text: string,
  options?: GeminiHumanizeOptions
): Promise<GeminiHumanizeResult> {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return { ok: false, error: "Teks yang ingin di-humanize tidak boleh kosong." };
  }

  // Batasi panggilan per IP agar kuota API aman dari penyalahgunaan
  const limit = await cekRateLimit("gemini-ai", 30);
  if (!limit.ok) {
    const menit = Math.max(1, Math.ceil((limit.cobaLagiDalamDetik ?? 60) / 60));
    return {
      ok: false,
      error: `Terlalu banyak permintaan AI. Silakan coba lagi dalam ${menit} menit.`,
    };
  }

  return humanizeWithGemini(trimmed, options);
}

