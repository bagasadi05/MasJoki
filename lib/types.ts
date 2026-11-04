export type ActionStatus = "idle" | "ok" | "error";

export interface ActionResult {
  status: ActionStatus;
  message: string;
  /** Kode pesanan/penawaran yang bisa disebutkan ke pelanggan. */
  code?: string;
  /** true bila Supabase belum dikonfigurasi; data tidak tersimpan. */
  demo?: boolean;
}
