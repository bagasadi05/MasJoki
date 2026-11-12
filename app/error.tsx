"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, MessageCircle, RotateCcw } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { waLink, waPesanUmum } from "@/lib/site";

/**
 * Batas kesalahan untuk seluruh halaman. Pesan asli tidak ditampilkan ke
 * pengunjung (bisa memuat detail internal); hanya dicatat ke konsol.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Kesalahan halaman:", error);
  }, [error]);

  return (
    <>
      <SiteHeader />

      <main id="konten" className="bg-paper">
        <section className="relative overflow-hidden border-b border-line px-5 py-16 sm:px-8 sm:py-24">
          <div
            aria-hidden
            className="kertas-garis pointer-events-none absolute inset-0 opacity-30"
          />

          <div className="relative mx-auto max-w-2xl">
            <div className="nota p-8 sm:p-10">
              <span className="stempel-merah rotate-2">Gagal dimuat</span>

              <h1 className="mt-4 font-display text-[2rem] leading-tight tracking-[-0.03em] text-ink sm:text-[2.4rem]">
                Halaman ini gagal dicetak.
              </h1>

              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-slate-600 font-medium">
                Ada gangguan saat memuat halaman. Coba muat ulang dulu — kalau
                tetap gagal, chat Mas Joki dan sebutkan halaman yang kamu buka.
              </p>

              {error.digest && (
                <p className="mt-3 font-mono text-[0.7rem] text-muted">
                  Kode laporan: {error.digest}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand-dark active:translate-y-0"
                >
                  <RotateCcw className="size-4" />
                  <span>Coba muat ulang</span>
                </button>
                <a
                  href={waLink(waPesanUmum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-card px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <MessageCircle className="size-4" />
                  <span>Chat Mas Joki</span>
                </a>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-dashed border-line pt-4 text-xs text-muted">
                <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
                <span>Saldo token tidak berkurang kalau proses gagal di tengah jalan.</span>
              </div>

              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
              >
                <Home className="size-3.5" />
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
