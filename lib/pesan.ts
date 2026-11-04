import { rupiah } from "./format";
import { getDeadline, type PriceResult } from "./pricing";
import { BASIS_LABEL, type Service } from "./services";
import { pembayaran } from "./site";

/**
 * Penyusun teks pesanan WhatsApp. Dipisah dari server action supaya bisa
 * diuji tanpa scope request, dan supaya format pesan hanya ada di satu tempat.
 * Tidak ada data yang disimpan di server.
 */

function rapikan(baris: (string | false | null | undefined)[]): string {
  // Baris kosong ("") sengaja dipertahankan sebagai pemisah antar-bagian.
  return baris
    .filter((b) => b !== false && b !== null && b !== undefined)
    .join("\n");
}

export function pesanPesanan({
  service,
  price,
  name,
  whatsapp,
  fileUrl,
  notes,
}: {
  service: Service;
  price: PriceResult;
  name: string;
  whatsapp: string;
  fileUrl?: string;
  notes?: string;
}): string {
  return rapikan([
    "Halo Mas Joki, saya mau pesan:",
    "",
    `Layanan: ${service.name}`,
    `Jumlah: ${price.qty} ${BASIS_LABEL[service.basis]}`,
    `Tenggat: ${price.deadline.label}`,
    `Tingkat: ${price.difficulty.label}`,
    `Estimasi: ${rupiah(price.total)}`,
    "",
    `Nama: ${name}`,
    `WhatsApp: ${whatsapp}`,
    fileUrl ? `File: ${fileUrl}` : false,
    notes ? `Catatan: ${notes}` : false,
    "",
    `Pembayaran via ${pembayaran.metode.join("/")} ke ${pembayaran.nomor} setelah admin konfirmasi.`,
  ]);
}

export function pesanPenawaran({
  layanan,
  deadlineId,
  budget,
  fileUrl,
  detail,
  name,
  whatsapp,
}: {
  layanan: string;
  deadlineId: string;
  budget?: string;
  fileUrl?: string;
  detail: string;
  name: string;
  whatsapp: string;
}): string {
  const deadline = getDeadline(deadlineId);

  return rapikan([
    "Halo Mas Joki, saya mau minta penawaran:",
    "",
    `Jenis tugas: ${layanan}`,
    `Tenggat: ${deadline.label}`,
    budget ? `Anggaran: ${budget}` : false,
    fileUrl ? `File: ${fileUrl}` : false,
    "",
    "Detail:",
    detail,
    "",
    `Nama: ${name}`,
    `WhatsApp: ${whatsapp}`,
  ]);
}
