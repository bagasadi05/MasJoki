import { renderToBuffer } from "@react-pdf/renderer";

import {
  buatKodeKwitansi,
  formatTanggalWib,
  kodeKwitansiValid,
  kwitansiInputSchema,
} from "@/lib/kwitansi";
import { KwitansiPdf } from "@/lib/kwitansi-pdf";
import { hitungOrder } from "@/lib/order-hitung";
import { fieldErrors, firstIssue } from "@/lib/validation";
import { cekRateLimit } from "@/lib/rate-limit";

/**
 * POST /kwitansi — buat PDF kwitansi estimasi pesanan.
 *
 * Body: field formulir order (serviceId, qty, deadlineId, difficultyId,
 * addons, name, whatsapp) + opsional `kode`. Server memvalidasi ulang dengan
 * zod dan MENGHITUNG ULANG harga (lib/order-hitung.ts), jadi PDF tidak pernah
 * memakai angka hasil edit di browser. Tanpa database: PDF hanya dicetak,
 * tidak ada yang disimpan.
 */
// POST tidak pernah di-cache (cacheComponents aktif): handler selalu jalan
// saat request dengan runtime Node bawaan.
const BATAS_BODY = 16 * 1024;

export async function POST(request: Request) {
  const limit = await cekRateLimit("kwitansi", 10);
  if (!limit.ok) {
    const menit = Math.max(1, Math.ceil((limit.cobaLagiDalamDetik ?? 60) / 60));
    return Response.json(
      { error: `Terlalu banyak permintaan kwitansi. Coba lagi dalam ${menit} menit.` },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > BATAS_BODY) {
      return Response.json({ error: "Data pesanan terlalu besar." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Body bukan JSON yang valid." }, { status: 400 });
  }

  const parsed = kwitansiInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: firstIssue(parsed.error), fieldErrors: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  // Harga dihitung ulang di server dari serviceId + qty.
  const hasil = hitungOrder(parsed.data);
  if (!hasil.ok) {
    return Response.json({ error: hasil.message }, { status: 422 });
  }

  const kode =
    body && typeof body === "object" && kodeKwitansiValid((body as { kode?: unknown }).kode)
      ? (body as { kode: string }).kode
      : buatKodeKwitansi();

  const buffer = await renderToBuffer(
    <KwitansiPdf
      kode={kode}
      tanggal={formatTanggalWib()}
      service={hasil.service}
      price={hasil.price}
      data={hasil.data}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="kwitansi-${kode}.pdf"`,
      "X-Kode-Kwitansi": kode,
      "Cache-Control": "no-store",
    },
  });
}
