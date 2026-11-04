export type StatusPesanan =
  | "menunggu_konfirmasi"
  | "menunggu_pembayaran"
  | "dibayar"
  | "dikerjakan"
  | "revisi"
  | "selesai"
  | "kedaluwarsa"
  | "gagal"
  | "dikembalikan"
  | "batal";

export const STATUS_LABEL: Record<StatusPesanan, string> = {
  menunggu_konfirmasi: "Menunggu konfirmasi admin",
  menunggu_pembayaran: "Menunggu pembayaran",
  dibayar: "Sudah dibayar",
  dikerjakan: "Sedang dikerjakan",
  revisi: "Revisi",
  selesai: "Selesai",
  kedaluwarsa: "Pembayaran kedaluwarsa",
  gagal: "Pembayaran gagal",
  dikembalikan: "Dana dikembalikan",
  batal: "Dibatalkan",
};

/** Urutan tahap yang ditampilkan sebagai linimasa di halaman pesanan. */
export const ALUR: StatusPesanan[] = [
  "menunggu_konfirmasi",
  "menunggu_pembayaran",
  "dibayar",
  "dikerjakan",
  "selesai",
];

export const STATUS_AKHIR: StatusPesanan[] = [
  "dibayar",
  "dikerjakan",
  "revisi",
  "selesai",
  "dikembalikan",
];

/**
 * Status yang sudah "maju" tidak boleh ditimpa notifikasi lama.
 * Midtrans bisa mengirim ulang `pending` setelah `settlement`.
 */
export function bolehDitimpa(
  sekarang: StatusPesanan,
  berikutnya: StatusPesanan,
): boolean {
  if (sekarang === berikutnya) return true;
  if (berikutnya === "dikembalikan") return true;
  if (STATUS_AKHIR.includes(sekarang)) return false;
  return true;
}

/**
 * Pemetaan satu pintu dari status Midtrans. Dipakai webhook dan rekonsiliasi
 * supaya tidak ada dua aturan berbeda.
 */
export function mapStatusMidtrans(
  transactionStatus: string,
  fraudStatus?: string,
): StatusPesanan | null {
  switch (transactionStatus) {
    case "settlement":
      return "dibayar";
    case "capture":
      // Kartu kredit: hanya lunas kalau fraud check lolos.
      return fraudStatus === "accept" || !fraudStatus
        ? "dibayar"
        : "menunggu_pembayaran";
    case "pending":
      return "menunggu_pembayaran";
    case "deny":
    case "cancel":
    case "failure":
      return "gagal";
    case "expire":
      return "kedaluwarsa";
    case "refund":
    case "partial_refund":
      return "dikembalikan";
    default:
      return null;
  }
}

export function statusPesanan(value: string): StatusPesanan {
  return (Object.keys(STATUS_LABEL) as StatusPesanan[]).includes(
    value as StatusPesanan,
  )
    ? (value as StatusPesanan)
    : "menunggu_konfirmasi";
}
