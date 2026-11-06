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
  const daftarTambahan =
    price.selectedAddons.length > 0
      ? price.selectedAddons
          .map((item) => `${item.shortLabel} (+${rupiah(item.price)})`)
          .join(", ")
      : null;

  return rapikan([
    "Halo Mas Joki, saya mau pesan:",
    "",
    `Layanan: ${service.name}`,
    `Jumlah: ${price.qty} ${BASIS_LABEL[service.basis]} (${price.equivalentLabel})`,
    `Tenggat: ${price.deadline.label} (Estimasi: ${price.estimatedTurnaround})`,
    "Tingkat: Standar (dikonfirmasi setelah Mas Joki cek brief)",
    daftarTambahan ? `Opsi Tambahan: ${daftarTambahan}` : false,
    price.discountAmount > 0 && price.discountLabel
      ? `Potongan: -${rupiah(price.discountAmount)} (${price.discountLabel})`
      : false,
    price.minimumAdjustmentNote ? `Catatan: ${price.minimumAdjustmentNote}` : false,
    `Estimasi Total: ${rupiah(price.total)} (Bisa DP 50%: ${rupiah(price.dpAmount)})`,
    "",
    `Nama: ${name}`,
    `WhatsApp: ${whatsapp}`,
    fileUrl ? `File: ${fileUrl}` : false,
    notes ? `Catatan: ${notes}` : false,
    "",
    `Pembayaran via ${pembayaran.metode.join("/")} ke ${pembayaran.nomor} setelah Mas Joki konfirmasi.`,
  ]);
}

export function pesanOrderSpesifik({
  service,
  price,
  name,
  whatsapp,
  fileUrl,
  notes,
  checkerTool,
  currentScore,
  targetScore,
  citationStyle,
  customPreference,
}: {
  service: Service;
  price: PriceResult;
  name: string;
  whatsapp: string;
  fileUrl?: string;
  notes?: string;
  checkerTool?: string;
  currentScore?: string;
  targetScore?: string;
  citationStyle?: string;
  customPreference?: string;
}): string {
  const daftarTambahan =
    price.selectedAddons.length > 0
      ? price.selectedAddons
          .map((item) => `${item.shortLabel} (+${rupiah(item.price)})`)
          .join(", ")
      : null;

  return rapikan([
    `Halo Mas Joki, saya mau pesan order khusus ${service.name}:`,
    "",
    `Layanan: ${service.name}`,
    `Jumlah: ${price.qty} ${BASIS_LABEL[service.basis]} (${price.equivalentLabel})`,
    checkerTool ? `Pengecek/Sistem: ${checkerTool}` : false,
    currentScore ? `Kondisi/Skor Saat Ini: ${currentScore}` : false,
    targetScore ? `Target Skor Akhir: ${targetScore}` : false,
    citationStyle ? `Format Sitasi/Rujukan: ${citationStyle}` : false,
    customPreference ? `Spesifikasi Khusus: ${customPreference}` : false,
    `Tenggat: ${price.deadline.label} (Estimasi: ${price.estimatedTurnaround})`,
    "Tingkat: Standar (dikonfirmasi setelah Mas Joki cek brief)",
    daftarTambahan ? `Opsi Tambahan: ${daftarTambahan}` : false,
    price.discountAmount > 0 && price.discountLabel
      ? `Potongan: -${rupiah(price.discountAmount)} (${price.discountLabel})`
      : false,
    price.minimumAdjustmentNote ? `Catatan: ${price.minimumAdjustmentNote}` : false,
    `Estimasi Total: ${rupiah(price.total)} (Bisa DP 50%: ${rupiah(price.dpAmount)})`,
    "",
    `Nama: ${name}`,
    `WhatsApp: ${whatsapp}`,
    fileUrl ? `File Dokumen: ${fileUrl}` : false,
    notes ? `Catatan Khusus: ${notes}` : false,
    "",
    `Pembayaran via ${pembayaran.metode.join("/")} ke ${pembayaran.nomor} setelah Mas Joki konfirmasi.`,
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
