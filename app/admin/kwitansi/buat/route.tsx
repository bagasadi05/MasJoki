import { renderToBuffer } from "@react-pdf/renderer";

import { getAdminUser } from "@/lib/admin-auth";
import { buatKodeKwitansi, formatTanggalWib, kodeKwitansiValid } from "@/lib/kwitansi";
import { hitungTotalKwitansi, parseKwitansiCustom } from "@/lib/kwitansi-custom";
import { KwitansiCustomPdf } from "@/lib/kwitansi-custom-pdf";
import { cekRateLimit } from "@/lib/rate-limit";

/**
 * POST /admin/kwitansi/buat — cetak PDF kwitansi custom. KHUSUS pengelola:
 * session Supabase + email di ADMIN_EMAILS dicek lagi di server pada setiap
 * request (fail-closed). Body divalidasi zod; kode boleh dikustom kalau lolos
 * pola MJ-YYYYMMDD-XXXX, kalau tidak, server yang membuat kode baru.
 */
const BATAS_BODY = 16 * 1024;

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return Response.json({ error: "Halaman ini khusus pengelola. Masuk dulu." }, { status: 401 });
  }

  const limit = await cekRateLimit("admin-kwitansi", 20);
  if (!limit.ok) {
    const menit = Math.max(1, Math.ceil((limit.cobaLagiDalamDetik ?? 60) / 60));
    return Response.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${menit} menit.` },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > BATAS_BODY) {
      return Response.json({ error: "Data terlalu besar." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Body bukan JSON yang valid." }, { status: 400 });
  }

  const parsed = parseKwitansiCustom(body);
  if (!parsed.ok) {
    return Response.json(
      { error: parsed.message, fieldErrors: parsed.fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const kode = kodeKwitansiValid(data.kode) ? data.kode : buatKodeKwitansi();
  const total = hitungTotalKwitansi(data.lines);

  const buffer = await renderToBuffer(
    <KwitansiCustomPdf
      kode={kode}
      tanggal={formatTanggalWib()}
      judul={data.judul}
      name={data.name}
      whatsapp={data.whatsapp}
      lines={data.lines}
      total={total}
      catatan={data.catatan}
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
