import { buatTransaksiSnap } from "@/lib/midtrans";
import { STATUS_AKHIR, statusPesanan } from "@/lib/payment-status";
import { supabaseAdmin } from "@/lib/supabase";

const POLA_KODE = /^MJ-P[A-Z0-9]{6,12}$/;

export async function POST(request: Request) {
  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ pesan: "Permintaan tidak valid." }, { status: 400 });
  }

  const code = String(body.code ?? "").trim().toUpperCase();
  if (!POLA_KODE.test(code)) {
    return Response.json({ pesan: "Kode pesanan tidak valid." }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return Response.json(
      {
        pesan:
          "Pembayaran belum aktif: Supabase dan Midtrans belum dihubungkan.",
      },
      { status: 503 },
    );
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      "code, customer_name, whatsapp, service_id, service_name, total, status, snap_token, snap_redirect_url",
    )
    .eq("code", code)
    .maybeSingle();

  if (error) {
    console.error("[pembayaran] gagal membaca pesanan", error.message);
    return Response.json({ pesan: "Gagal membaca pesanan." }, { status: 500 });
  }

  if (!order) {
    return Response.json({ pesan: "Pesanan tidak ditemukan." }, { status: 404 });
  }

  const status = statusPesanan(order.status);

  if (STATUS_AKHIR.includes(status)) {
    return Response.json(
      { pesan: "Pesanan ini sudah dibayar. Tidak perlu bayar lagi." },
      { status: 409 },
    );
  }

  // Token masih berlaku: jangan buat transaksi baru, pakai tautan yang ada.
  if (order.snap_token && order.snap_redirect_url) {
    return Response.json({ redirectUrl: order.snap_redirect_url, diulang: true });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  try {
    const snap = await buatTransaksiSnap({
      orderId: order.code,
      grossAmount: order.total,
      customerName: order.customer_name,
      customerPhone: order.whatsapp,
      items: [
        {
          id: order.service_id,
          price: order.total,
          quantity: 1,
          name: `Jasa ${order.service_name}`.slice(0, 50),
        },
      ],
      finishUrl: `${origin}/pesanan/${order.code}`,
    });

    const { error: errorSimpan } = await supabaseAdmin
      .from("orders")
      .update({
        status: "menunggu_pembayaran",
        midtrans_order_id: order.code,
        snap_token: snap.token,
        snap_redirect_url: snap.redirectUrl,
      })
      .eq("code", order.code);

    if (errorSimpan) {
      console.error("[pembayaran] gagal menyimpan token", errorSimpan.message);
      return Response.json(
        { pesan: "Pembayaran dibuat, tetapi gagal disimpan. Hubungi admin." },
        { status: 500 },
      );
    }

    return Response.json({ redirectUrl: snap.redirectUrl });
  } catch (error) {
    console.error("[pembayaran]", error);
    return Response.json(
      {
        pesan:
          "Gagal membuat tautan pembayaran. Coba lagi sebentar, atau hubungi admin lewat WhatsApp.",
      },
      { status: 502 },
    );
  }
}
