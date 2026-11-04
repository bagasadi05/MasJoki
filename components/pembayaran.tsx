"use client";

import { useState } from "react";
import { pembayaran } from "@/lib/site";

const WARNA: Record<string, string> = {
  ShopeePay: "bg-orange-500",
  GoPay: "bg-sky-500",
  DANA: "bg-blue-600",
};

export function Pembayaran() {
  const [tersalin, setTersalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(pembayaran.nomor);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 2000);
    } catch {
      // Kalau clipboard ditolak, nomornya tetap terbaca di layar.
    }
  }

  return (
    <section id="bayar" className="border-y border-line bg-paper-2/50">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.52fr_0.48fr] lg:gap-16">
        <div>
          <h2 className="max-w-md font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
            Bayar lewat e-wallet.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink-soft">
            ShopeePay, GoPay, atau DANA — satu nomor untuk ketiganya. Tidak perlu
            transfer bank atau scan QR.
          </p>

          <div className="mt-7 rounded-md border border-line bg-white p-5">
            <p className="text-[0.74rem] text-muted">Nomor pembayaran</p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[1.45rem] font-semibold tabular-nums tracking-tight text-ink">
                {pembayaran.nomor}
              </span>
              <button
                type="button"
                onClick={salin}
                className="rounded border border-line px-3 py-1.5 text-[0.76rem] font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand"
              >
                {tersalin ? "Tersalin" : "Salin nomor"}
              </button>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {pembayaran.metode.map((metode) => (
                <li
                  key={metode}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[0.74rem] text-ink-soft"
                >
                  <span
                    aria-hidden
                    className={`size-1.5 rounded-full ${WARNA[metode] ?? "bg-ink-soft"}`}
                  />
                  {metode}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 max-w-[46ch] text-[0.76rem] leading-relaxed text-muted">
            Nomor ini atas nama admin Mas Joki yang membalas chat-mu. Kalau ada
            nama atau nomor lain yang mengatasnamakan Mas Joki, jangan
            ditransfer.
          </p>
        </div>

        <div className="lg:pt-2">
          <ol className="space-y-5 border-l border-line pl-5">
            {[
              {
                judul: "Kirim pesanan lewat WhatsApp",
                isi: "Isi kalkulator, lalu tekan kirim. Ringkasan pesanan masuk ke chat admin secara otomatis.",
              },
              {
                judul: "Tunggu konfirmasi total",
                isi: "Admin cek file dan tenggat, lalu mengunci harga. Tidak ada biaya yang muncul tiba-tiba.",
              },
              {
                judul: "Bayar, lalu kirim bukti",
                isi: "Transfer sesuai total yang dikonfirmasi ke nomor di samping, lalu kirim bukti di chat yang sama.",
              },
            ].map((langkah, index) => (
              <li key={langkah.judul} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[1.62rem] top-0.5 grid size-5 place-items-center rounded-full border border-line bg-paper font-mono text-[0.62rem] text-brand"
                >
                  {index + 1}
                </span>
                <p className="text-[0.88rem] font-semibold text-ink">
                  {langkah.judul}
                </p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">
                  {langkah.isi}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-[0.76rem] leading-relaxed text-muted">
            Pengerjaan dimulai setelah pembayaran dikonfirmasi. Revisi tetap dua
            kali, tanpa biaya tambahan.
          </p>
        </div>
      </div>
    </section>
  );
}
