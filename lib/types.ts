export type ActionStatus = "idle" | "ok" | "error";

export interface ActionResult {
  status: ActionStatus;
  message: string;
  /**
   * Tautan WhatsApp berisi ringkasan pesanan. Tidak ada database: begitu
   * pengguna membukanya, pesanan langsung masuk ke chat admin.
   */
  waUrl?: string;
  /** Pesan per kolom, supaya kesalahan tampil di tempat yang tepat. */
  fieldErrors?: Record<string, string>;
}
