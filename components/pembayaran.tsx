"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { pembayaran, waLink } from "@/lib/site";

const METODE: Record<
  string,
  { ikon: string; badge: string; border: string; bg: string; text: string }
> = {
  ShopeePay: {
    ikon: "🛍️",
    badge: "bg-[#EE4D2D] text-white",
    border: "border-orange-200",
    bg: "bg-orange-50/70",
    text: "text-orange-950",
  },
  GoPay: {
    ikon: "💳",
    badge: "bg-[#00AED6] text-white",
    border: "border-sky-200",
    bg: "bg-sky-50/70",
    text: "text-sky-950",
  },
  DANA: {
    ikon: "📱",
    badge: "bg-[#118EEA] text-white",
    border: "border-blue-200",
    bg: "bg-blue-50/70",
    text: "text-blue-950",
  },
};

const waKonfirmasi = waLink(
  "Halo Mas Joki, saya mau konfirmasi pembayaran pesanan saya.",
);

export function Pembayaran() {
  const [tersalin, setTersalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(pembayaran.nomor);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <section id="bayar" className="border-t border-line bg-paper-2/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.52fr_0.48fr] lg:gap-16">
        <div>
          <span className="stempel">
            SATU NOMOR RESMI
          </span>

          <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
            Pembayaran praktis lewat e-wallet resmi.
          </h2>

          <p className="mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-ink-soft">
            ShopeePay, GoPay, atau DANA — cukup transfer ke satu nomor yang sama.
            Bebas repot tanpa perlu token bank atau scan QR yang sering gagal.
          </p>

          {/* Payment Card Box */}
          <div className="mt-7 rounded-3xl border border-line bg-white p-7 shadow-sm">
            <p className="text-[0.72rem] font-bold uppercase tracking-wider text-muted">
              Nomor Akun E-Wallet Mas Joki
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper-2 p-4 border border-line">
              <span className="font-mono text-2xl font-black tabular-nums tracking-tight text-ink sm:text-3xl">
                {pembayaran.nomor}
              </span>
              <button
                type="button"
                onClick={salin}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[0.82rem] font-bold transition-all cursor-pointer ${
                  tersalin
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-brand text-white hover:bg-brand-dark shadow-xs"
                }`}
              >
                {tersalin ? (
                  <>
                    <Check className="size-4" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    <span>Salin Nomor</span>
                  </>
                )}
              </button>
              <span aria-live="polite" className="sr-only">
                {tersalin ? "Nomor pembayaran tersalin" : ""}
              </span>
            </div>

            {/* Metode Pills */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {pembayaran.metode.map((metode) => {
                const info = METODE[metode];
                if (!info) return null;

                return (
                  <div
                    key={metode}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center ${info.border} ${info.bg}`}
                  >
                    <span className="text-xl">{info.ikon}</span>
                    <span className={`mt-1 font-display text-[0.82rem] font-bold ${info.text}`}>
                      {metode}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-[0.76rem] leading-relaxed text-muted">
              🔒 Nomor ini resmi atas nama admin Mas Joki. Tidak ada nomor rekening lain selain yang tercantum di atas.
            </p>
          </div>

          <div className="mt-6">
            <a
              href={waKonfirmasi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-6 py-3.5 text-[0.88rem] font-bold text-ink shadow-xs transition-colors hover:bg-ink hover:text-white"
            >
              <span>Konfirmasi Pembayaran di WhatsApp</span>
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* 3 Step Flow */}
        <div className="lg:pt-4">
          <h3 className="font-display text-xl font-bold text-ink">
            Alur Konfirmasi &amp; Pembayaran
          </h3>

          <ol className="mt-6 space-y-6 border-l-2 border-brand/20 pl-6">
            {[
              {
                nomor: "1",
                warna: "bg-brand text-white",
                judul: "Kirim pesanan via kalkulator / WhatsApp",
                isi: "Lengkapi kalkulator, lalu klik kirim. Teks pesanan beserta estimasi biaya langsung masuk ke chat admin.",
              },
              {
                nomor: "2",
                warna: "bg-amber-600 text-white",
                judul: "Admin konfirmasi & kunci total biaya",
                isi: "Admin memeriksa file dan instruksi tugasmu, kemudian mengonfirmasi total biaya tetap tanpa biaya tambahan tersembunyi.",
              },
              {
                nomor: "3",
                warna: "bg-emerald-600 text-white",
                judul: "Transfer e-wallet & kirim bukti chat",
                isi: "Kirim pembayaran ke nomor di samping, kirim screenshot bukti transfer, dan pengerjaan tugas langsung dimulai tepat waktu.",
              },
            ].map((langkah) => (
              <li key={langkah.judul} className="relative">
                <span
                  aria-hidden
                  className={`absolute -left-[2.2rem] top-0.5 grid size-6 place-items-center rounded-full font-mono text-xs font-bold shadow-xs ${langkah.warna}`}
                >
                  {langkah.nomor}
                </span>
                <p className="font-display text-[1rem] font-bold text-ink">
                  {langkah.judul}
                </p>
                <p className="mt-1 text-[0.86rem] leading-relaxed text-ink-soft/85">
                  {langkah.isi}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-[0.92rem] font-bold text-ink">
                  Garansi Revisi &amp; File Asli Lengkap
                </p>
                <p className="mt-0.5 text-[0.8rem] text-muted">
                  Setiap pesanan mencakup 2× revisi gratis sesuai brief awal, plus seluruh file dokumen mentah (.docx / .pptx).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
