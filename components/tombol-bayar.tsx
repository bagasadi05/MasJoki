"use client";

import { useState } from "react";

export function TombolBayar({ code }: { code: string }) {
  const [pending, setPending] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  async function bayar() {
    setPending(true);
    setPesan(null);

    try {
      const response = await fetch("/api/pembayaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = (await response.json()) as {
        redirectUrl?: string;
        pesan?: string;
      };

      if (!response.ok || !data.redirectUrl) {
        setPesan(data.pesan ?? "Gagal membuat tautan pembayaran.");
        return;
      }

      window.location.href = data.redirectUrl;
    } catch {
      setPesan("Koneksi bermasalah. Coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={bayar}
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-md bg-brand px-6 py-3.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Menyiapkan pembayaran…" : "Bayar sekarang"}
      </button>

      <p className="mt-2.5 text-[0.74rem] leading-relaxed text-muted">
        Kamu akan diarahkan ke halaman Midtrans. Bisa pakai QRIS, virtual
        account, atau transfer.
      </p>

      {pesan ? (
        <p
          role="alert"
          className="mt-3 rounded-md border border-red-300 bg-red-50 px-3.5 py-2.5 text-[0.8rem] text-red-800"
        >
          {pesan}
        </p>
      ) : null}
    </div>
  );
}
