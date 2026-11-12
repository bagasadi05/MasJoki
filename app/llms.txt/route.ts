import { SITE_URL } from "@/lib/config";
import { hargaTampil } from "@/lib/harga-tampil";
import { CATALOG_SERVICES } from "@/lib/services";
import { site } from "@/lib/site";
import { faq } from "@/content/faq";

/**
 * llms.txt — ringkasan situs untuk asisten AI yang menjelajah halaman.
 *
 * Dibuat dari data yang sama dengan situs (SERVICES, hargaTampil, faq),
 * bukan file statis, supaya harga dan daftar layanan tidak pernah basi.
 */
export function GET() {
  const layanan = CATALOG_SERVICES.map((service) => {
    const harga = hargaTampil(service.id);
    const satuan = harga.angka === "Minta Penawaran" ? "sesuai brief" : harga.satuan;
    return `- [${service.name}](${SITE_URL}/jasa/${service.id}): ${harga.angka} ${satuan}`;
  }).join("\n");

  const tanyaJawab = faq
    .slice(0, 6)
    .map((item) => `### ${item.q}\n${item.a}`)
    .join("\n\n");

  const isi = `# ${site.name}

> ${site.tagline}
Bantuan penulisan, penyuntingan, dan perapian format tugas akademik — dikerjakan langsung oleh Mas Joki tanpa perantara. Harga dihitung sendiri lewat kalkulator dan terkunci sejak awal.

## Layanan dan tarif
${layanan}

## Halaman penting
- [Kalkulator biaya](${SITE_URL}/hitung): hitung estimasi sendiri sebelum chat
- [Daftar layanan](${SITE_URL}/jasa): katalog lengkap
- [Cara kerja](${SITE_URL}/cara-kerja): empat langkah pemesanan
- [FAQ](${SITE_URL}/faq): pertanyaan umum
- [AI Humanizer](${SITE_URL}/humanizer): alat mandiri untuk menulis ulang naskah

## Ketentuan yang berlaku
- Pembayaran lewat ShopeePay, GoPay, atau DANA. DP 50% di awal, pelunasan setelah hasil diperiksa.
- Revisi 2 kali gratis. File sumber .docx/.pptx diserahkan.
- Tidak ada jaminan skor detektor tertentu; yang dijanjikan hanya pemeriksaan angka, sitasi, dan istilah yang dipertahankan.
- Naskah tidak disimpan di server setelah diproses.

## Tanya jawab ringkas

${tanyaJawab}
`;

  return new Response(isi, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
