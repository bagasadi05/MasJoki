"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  FileText,
  MessageCircle,
  Pause,
  Play,
} from "lucide-react";
import { rupiah } from "@/lib/format";

export const LANGKAH_PEMESANAN = [
  {
    nomor: "01",
    judul: "Pilih layanan & hitung",
    ringkas: "Jumlah dan tenggat diatur, estimasi muncul seketika.",
  },
  {
    nomor: "02",
    judul: "Kirim pesanan via WhatsApp",
    ringkas: "Rincian tersusun otomatis, tinggal tekan kirim.",
  },
  {
    nomor: "03",
    judul: "Bayar DP 50%",
    ringkas: "Setengah di awal, sisanya setelah hasil kamu cek.",
  },
  {
    nomor: "04",
    judul: "Terima hasil & revisi",
    ringkas: "File .docx/.pptx diserahkan, termasuk 2× revisi.",
  },
];

const TOTAL = 15000;
const DP = 7500;
const JEDA_MS = 4200;

/** Angka yang naik dari 0 setiap kali barisnya muncul. */
function AngkaNaik({ nilai, className = "" }: { nilai: number; className?: string }) {
  const [tampil, setTampil] = useState(nilai);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTampil(nilai);
      return;
    }

    let raf = 0;
    const mulai = performance.now();
    const durasi = 520;

    setTampil(0);

    const tick = (waktu: number) => {
      const progres = Math.min(1, (waktu - mulai) / durasi);
      const halus = 1 - Math.pow(1 - progres, 3);
      setTampil(Math.round(nilai * halus));
      if (progres < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    // Jaring pengaman: kalau rAF dihentikan (tab background / browser hemat daya),
    // angka tetap berakhir di nilai penuh, bukan tertahan di nol.
    const jaring = window.setTimeout(() => setTampil(nilai), durasi + 160);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(jaring);
    };
  }, [nilai]);

  return <span className={className}>{rupiah(tampil)}</span>;
}

/**
 * Demo alur pesan: nota di kanan terisi sendiri mengikuti langkah yang aktif.
 * Berjalan otomatis sampai pengunjung memilih langkah atau menekan jeda.
 */
export function AlurKerja() {
  const [aktif, setAktif] = useState(0);
  const [manual, setManual] = useState(false);
  const [terlihat, setTerlihat] = useState(true);
  const bagianRef = useRef<HTMLElement | null>(null);

  // Demo berhenti saat bagian ini keluar layar: tidak ada timer dan render
  // sia-sia ketika pengunjung sedang membaca bagian lain.
  useEffect(() => {
    const el = bagianRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const pengamat = new IntersectionObserver(
      ([entri]) => setTerlihat(entri.isIntersecting),
      { threshold: 0.15 },
    );
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, []);

  useEffect(() => {
    if (manual || !terlihat) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setAktif((n) => (n + 1) % LANGKAH_PEMESANAN.length),
      JEDA_MS,
    );
    return () => window.clearInterval(timer);
  }, [manual, terlihat]);

  const pilih = (i: number) => {
    setAktif(i);
    setManual(true);
  };

  return (
    <section
      ref={bagianRef}
      id="cara-pesan"
      className="border-b border-line bg-paper py-14 scroll-mt-20 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
              Empat langkah, dari hitung sampai file diterima.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft font-medium">
              Perhatikan nota di samping: isinya bertambah setiap langkah. Klik
              salah satu langkah untuk menghentikan dan melihat detailnya.
            </p>
          </div>

          <p className="font-mono text-[0.72rem] font-semibold text-muted">
            ≈ 6 menit total
          </p>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          {/* Kiri: langkah yang bisa dipilih */}
          <ol className="space-y-1.5">
            {LANGKAH_PEMESANAN.map((item, index) => {
              const hidup = aktif === index;

              return (
                <li key={item.nomor}>
                  <button
                    type="button"
                    onClick={() => pilih(index)}
                    aria-current={hidup ? "step" : undefined}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-200 motion-reduce:transition-none ${
                      hidup ? "bg-paper-2/80" : "hover:bg-paper-2/50"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[0.68rem] font-bold transition-all duration-300 motion-reduce:transition-none ${
                        hidup
                          ? "scale-105 border-brand bg-brand text-white shadow-xs shadow-brand/25"
                          : "border-line-strong bg-paper text-muted"
                      }`}
                    >
                      {item.nomor}
                    </span>

                    <span className="min-w-0">
                      <span
                        className={`block font-display text-[0.98rem] font-bold leading-snug tracking-tight transition-colors ${
                          hidup ? "text-ink" : "text-ink-soft"
                        }`}
                      >
                        {item.judul}
                      </span>
                      <span className="mt-0.5 block text-[0.78rem] leading-relaxed text-muted">
                        {item.ringkas}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Kanan: nota demo yang terisi sendiri */}
          <div className="nota p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-dashed border-line pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 -rotate-3 place-items-center rounded-md border border-brand/25 bg-brand-soft font-display text-[0.7rem] font-bold text-brand">
                  MJ
                </span>
                <div>
                  <p className="font-display text-[0.95rem] font-bold leading-none tracking-tight text-ink">
                    Nota demo
                  </p>
                  <p className="mt-1 text-[0.7rem] font-medium text-muted">
                    Parafrase · 500 kata
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.65rem] font-bold text-muted tabular-nums">
                  {LANGKAH_PEMESANAN[aktif].nomor} / 04
                </span>
                <button
                  type="button"
                  onClick={() => setManual((m) => !m)}
                  aria-label={manual ? "Putar otomatis lagi" : "Jeda animasi"}
                  aria-pressed={!manual}
                  className="grid size-8 cursor-pointer place-items-center rounded-md border border-line bg-paper text-ink-soft transition-colors hover:border-brand hover:text-brand"
                >
                  {manual ? (
                    <Play className="size-3.5" aria-hidden />
                  ) : (
                    <Pause className="size-3.5" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 min-h-[264px] space-y-3">
              {/* Langkah 1: baris jasa + total */}
              <div className="baris-masuk space-y-2">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold text-ink">Parafrase · 500 kata</span>
                  <span className="font-mono font-semibold tabular-nums text-ink">
                    {rupiah(TOTAL)}
                  </span>
                </div>
                <p className="text-[0.7rem] text-muted">
                  5 × Rp 3.000 · tenggat santai
                </p>
              </div>

              <div className="baris-masuk flex items-baseline justify-between gap-3 rounded-lg border border-line/70 bg-paper-2/70 p-3">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted">
                  Total
                </span>
                <AngkaNaik
                  nilai={TOTAL}
                  className="font-display text-[1.45rem] font-bold leading-none tracking-tight text-brand tabular-nums"
                />
              </div>

              {/* Langkah 2: pesan terkirim */}
              {aktif >= 1 && (
                <div className="baris-masuk flex items-start gap-2 rounded-lg border border-brand/15 bg-brand-soft/50 p-3">
                  <MessageCircle className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden />
                  <p className="text-[0.75rem] leading-relaxed text-ink-soft">
                    <span className="font-semibold text-ink">Pesanan terkirim.</span>{" "}
                    Rincian dan total sudah tersusun otomatis di chat WhatsApp.
                  </p>
                </div>
              )}

              {/* Langkah 3: DP diterima */}
              {aktif >= 2 && (
                <div className="baris-masuk flex items-baseline justify-between gap-3 text-[0.82rem]">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                    <CheckCircle2 className="size-3.5 text-mint" aria-hidden />
                    DP 50% diterima
                  </span>
                  <AngkaNaik
                    nilai={DP}
                    className="font-mono font-semibold tabular-nums text-mint"
                  />
                </div>
              )}

              {/* Langkah 4: file + stempel */}
              {aktif >= 3 && (
                <div className="baris-masuk flex items-center justify-between gap-3 border-t border-dashed border-line pt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-2 px-2 py-1 font-mono text-[0.68rem] font-semibold text-ink-soft">
                    <FileText className="size-3.5" aria-hidden />
                    naskah.docx
                  </span>
                  <span className="stempel stempel-masuk text-[0.58rem]">
                    File dikirim
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-line pt-3">
              <p className="text-[0.68rem] leading-relaxed text-muted">
                Simulasi dari mesin harga, bukan pesanan sungguhan.
              </p>
              <Link
                href="/hitung"
                className="shrink-0 text-[0.72rem] font-bold text-brand hover:underline"
              >
                Coba sendiri
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/hitung"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-[0.82rem] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            <Calculator className="size-4" aria-hidden />
            <span>Hitung biaya</span>
          </Link>
          <Link
            href="/cara-kerja"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong px-5 py-3 text-[0.82rem] font-bold text-ink transition-colors hover:border-ink hover:bg-paper-2"
          >
            <span>Panduan lengkap</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
