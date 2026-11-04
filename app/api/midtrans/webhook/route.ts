import crypto from "node:crypto";
import {
  bolehDitimpa,
  mapStatusMidtrans,
  statusPesanan,
} from "@/lib/payment-status";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Webhook Midtrans.
 *
 * Yang dijaga di sini:
 * 1. signature_key diverifikasi sebelum menyentuh database
 * 2. nominal notifikasi harus sama dengan nominal pesanan
 * 3. notifikasi lama tidak boleh menimpa status yang sudah maju
 * 4. selalu balas 2xx setelah diproses, supaya Midtrans tidak retry selamanya
 */

interface Notifikasi {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
  payment_type?: string;
}

function signatureValid(payload: Notifikasi, serverKey: string): boolean {
  const bahan = `${payload.order_id ?? ""}${payload.status_code ?? ""}${payload.gross_amount ?? ""}${serverKey}`;
  const diharapkan = crypto
    .createHash("sha512")
    .update(bahan)
    .digest("hex");
  const diterima = String(payload.signature_key ?? "");

  if (diterima.length !== diharapkan.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(diterima, "utf8"),
    Buffer.from(diharapkan, "utf8"),
  );
}

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";

  if (!serverKey || !supabaseAdmin) {
    console.error("[webhook] Midtrans atau Supabase belum dikonfigurasi");
    return Response.json({ pesan: "Belum dikonfigurasi" }, { status: 503 });
  }

  let payload: Notifikasi;
  try {
    payload = (await request.json()) as Notifikasi;
  } catch {
    return Response.json({ pesan: "Body bukan JSON" }, { status: 400 });
  }

  if (!payload.order_id || !payload.signature_key) {
    return Response.json({ pesan: "Field wajib tidak ada" }, { status: 400 });
  }

  if (!signatureValid(payload, serverKey)) {
    console.warn("[webhook] signature tidak cocok", payload.order_id);
    return Response.json({ pesan: "Signature tidak valid" }, { status: 401 });
  }

  const code = payload.order_id.trim().toUpperCase();

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("code, total, status")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    console.error("[webhook] gagal membaca pesanan", error.message);
    return Response.json({ pesan: "Gagal membaca pesanan" }, { status: 500 });
  }

  if (!order) {
    // Bukan pesanan kita, atau sudah dihapus. Balas 200 agar tidak retry.
    console.warn("[webhook] pesanan tidak dikenal", code);
    return Response.json({ pesan: "Diabaikan" }, { status: 200 });
  }

  const nominal = Math.round(Number(payload.gross_amount ?? 0));
  if (!Number.isFinite(nominal) || nominal !== order.total) {
    console.warn("[webhook] nominal tidak cocok", code, nominal, order.total);
    return Response.json({ pesan: "Nominal tidak cocok" }, { status: 400 });
  }

  const berikutnya = mapStatusMidtrans(
    String(payload.transaction_status ?? ""),
    payload.fraud_status,
  );

  if (!berikutnya) {
    return Response.json({ pesan: "Status diabaikan" }, { status: 200 });
  }

  const sekarang = statusPesanan(order.status);
  if (!bolehDitimpa(sekarang, berikutnya)) {
    return Response.json({ pesan: "Status sudah maju" }, { status: 200 });
  }

  const perubahan: Record<string, unknown> = { status: berikutnya };
  if (berikutnya === "dibayar") {
    perubahan.paid_at = new Date().toISOString();
  }

  const { error: errorUpdate } = await supabaseAdmin
    .from("orders")
    .update(perubahan)
    .eq("code", code);

  if (errorUpdate) {
    console.error("[webhook] gagal update", errorUpdate.message);
    return Response.json({ pesan: "Gagal update" }, { status: 500 });
  }

  console.info(
    "[webhook]",
    code,
    sekarang,
    "->",
    berikutnya,
    payload.payment_type ?? "-",
  );

  return Response.json({ pesan: "Diterima" }, { status: 200 });
}
