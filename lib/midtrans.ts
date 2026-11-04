/**
 * Klien Snap Midtrans — tanpa SDK, hanya REST.
 *
 * Aturan yang dipegang di sini:
 * - server key tidak pernah keluar dari server
 * - order_id unik per pesanan, dipakai juga sebagai kunci webhook
 * - item_details harus berjumlah sama dengan gross_amount
 */

const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const midtransConfigured = serverKey.length > 0;

const snapBase = isProduction
  ? "https://app.midtrans.com"
  : "https://app.sandbox.midtrans.com";

export interface SnapItem {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface SnapRequest {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerPhone?: string;
  items: SnapItem[];
  finishUrl: string;
}

export interface SnapResult {
  token: string;
  redirectUrl: string;
}

export async function buatTransaksiSnap(
  request: SnapRequest,
): Promise<SnapResult> {
  if (!midtransConfigured) {
    throw new Error("MIDTRANS_SERVER_KEY belum diisi");
  }

  const otorisasi = Buffer.from(`${serverKey}:`).toString("base64");

  const body = {
    transaction_details: {
      order_id: request.orderId,
      gross_amount: Math.round(request.grossAmount),
    },
    item_details: request.items,
    customer_details: {
      first_name: request.customerName,
      phone: request.customerPhone,
    },
    callbacks: { finish: request.finishUrl },
    credit_card: { secure: true },
    expiry: { duration: 24, unit: "hours" },
  };

  const response = await fetch(`${snapBase}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${otorisasi}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const teks = await response.text();
    // Jangan log seluruh body: bisa memuat data pelanggan.
    console.error("[midtrans] gagal membuat transaksi", response.status, teks.slice(0, 300));
    throw new Error("Midtrans menolak pembuatan transaksi");
  }

  const data = (await response.json()) as {
    token?: string;
    redirect_url?: string;
  };

  if (!data.token || !data.redirect_url) {
    throw new Error("Respons Midtrans tidak lengkap");
  }

  return { token: data.token, redirectUrl: data.redirect_url };
}

export function snapClientKey(): string {
  return process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
}
