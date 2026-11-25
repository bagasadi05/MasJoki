"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

import type { KwitansiPayload } from "@/lib/kwitansi";
import { lacak } from "@/lib/analytics";

interface UnduhKwitansiProps {
  payload: KwitansiPayload;
  className?: string;
}

/**
 * Tombol "Unduh Kwitansi (PDF)". Mengirim data pesanan mentah ke POST
 * /kwitansi — server yang memvalidasi & menghitung ulang harga sebelum
 * me-render PDF, jadi angka di kwitansi selalu versi server.
 */
export function UnduhKwitansi({ payload, className = "" }: UnduhKwitansiProps) {
  const [loading, setLoading] = useState(false);
  const [kode, setKode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function unduh() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/kwitansi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Gagal membuat kwitansi. Coba lagi sebentar.");
      }

      const kodeHeader = res.headers.get("x-kode-kwitansi");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kwitansi-${kodeHeader ?? "mas-joki"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Jangan revoke langsung: Safari/Firefox bisa membatalkan unduhan.
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      if (kodeHeader) setKode(kodeHeader);
      lacak("poster_unduh", { jenis: "kwitansi" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunduh kwitansi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={unduh}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-ink bg-ink px-5 py-3.5 text-[0.88rem] font-bold text-white transition hover:bg-ink/90 disabled:cursor-wait disabled:opacity-60 cursor-pointer dark:border-line-strong dark:bg-[#1e293b] dark:hover:bg-[#293548]"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin text-stabilo" aria-hidden />
        ) : (
          <FileText className="size-4 text-stabilo" aria-hidden />
        )}
        <span>{loading ? "Membuat PDF…" : "Unduh Kwitansi (PDF)"}</span>
      </button>
      {kode && (
        <p className="mt-2 text-center text-[11px] font-semibold text-muted" role="status">
          Kode kwitansi: <span className="font-mono font-bold text-ink">{kode}</span> — simpan
          untuk arsip pesananmu.
        </p>
      )}
      {error && (
        <p className="mt-2 text-center text-[11px] font-semibold text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
