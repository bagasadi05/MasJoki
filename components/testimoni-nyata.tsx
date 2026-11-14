"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  Maximize2,
  MessageSquareQuote,
  ShieldCheck,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  KATEGORI_TESTIMONI,
  TESTIMONI_BUKTI,
  URUTAN_TAMPIL_TESTIMONI,
  type TestimoniBukti,
  type TestimoniKategori,
} from "@/content/testimoni";
import { AKSEN } from "@/lib/aksen";

const BUKTI_TERURUT: TestimoniBukti[] = URUTAN_TAMPIL_TESTIMONI.map(
  (id) => TESTIMONI_BUKTI.find((item) => item.id === id)!,
).filter(Boolean);

function jumlahPerKategori(kategori: TestimoniKategori): number {
  if (kategori === "semua") return BUKTI_TERURUT.length;
  return BUKTI_TERURUT.filter((item) => item.kategori === kategori).length;
}

function PratinjauScreenshot({
  item,
  onBuka,
  sizes,
  tinggiTerbatas = false,
  compactStrip = false,
}: {
  item: TestimoniBukti;
  onBuka: (id: TestimoniBukti["id"]) => void;
  sizes: string;
  tinggiTerbatas?: boolean;
  compactStrip?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onBuka(item.id)}
      aria-label={`Perbesar tangkapan layar chat ${item.klienLabel}`}
      className="group block w-full cursor-pointer overflow-hidden rounded-xl border border-line bg-[#0b141a] text-left shadow-xs transition duration-200 hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#111b21] px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
          <span>Privasi klien disamarkan</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-bold text-white transition-colors group-hover:border-brand group-hover:bg-[#1f3be0] dark:group-hover:bg-[#2f4fd8] motion-reduce:transition-none">
          <Maximize2 className="size-3.5 shrink-0" aria-hidden />
          <span>Perbesar Chat</span>
        </span>
      </div>

      <div
        className={`relative w-full bg-[#0b141a] p-2 sm:p-2.5 ${
          tinggiTerbatas
            ? "sm:flex sm:h-60 sm:items-center sm:justify-center"
            : compactStrip
              ? "sm:flex sm:h-44 sm:items-center sm:justify-center"
              : ""
        }`}
      >
        <Image
          src={item.gambar.src}
          alt={item.gambar.alt}
          width={item.gambar.width}
          height={item.gambar.height}
          sizes={sizes}
          className={`mx-auto h-auto w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none motion-reduce:group-hover:scale-none ${
            tinggiTerbatas
              ? "sm:max-h-52"
              : compactStrip
                ? "sm:max-h-36"
                : ""
          }`}
        />
      </div>
    </button>
  );
}

function DaftarBerkas({ item }: { item: TestimoniBukti }) {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Berkas yang dikirim">
      {item.berkas.map((file) => (
        <li
          key={`${item.id}-${file.format}-${file.label}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper-2 px-2.5 py-1 font-mono text-xs font-semibold text-ink tabular-nums"
        >
          <FileText className="size-3.5 shrink-0 text-ink-soft" aria-hidden />
          <span>{file.format}</span>
          <span aria-hidden className="text-muted">
            ·
          </span>
          <span className="text-ink-soft">{file.ukuran}</span>
        </li>
      ))}
    </ul>
  );
}

function KartuSorotan({
  item,
  onBuka,
}: {
  item: TestimoniBukti;
  onBuka: (id: TestimoniBukti["id"]) => void;
}) {
  const aksen = AKSEN[item.aksenId];

  return (
    <article className="nota relative p-5 sm:p-7">
      <span
        aria-hidden
        className="absolute -top-px left-0 right-0 z-10 h-[5px]"
        style={{
          background: `var(${aksen.varName})`,
          borderRadius: "var(--radius-nota) var(--radius-nota) 0 0",
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-8">
        <div>
          <PratinjauScreenshot
            item={item}
            onBuka={onBuka}
            sizes="(max-width: 1024px) 100vw, 560px"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
            <DaftarBerkas item={item} />
            <span className="font-mono text-xs font-semibold text-muted tabular-nums">
              {item.jamKutipan}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${aksen.chip}`}
              >
                <span aria-hidden className={`size-1.5 rounded-full ${aksen.dot}`} />
                <span>{item.layananLabel}</span>
              </span>
              <span className="rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-xs font-bold text-ink-soft tabular-nums">
                {item.kodeNota}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ink-soft tabular-nums">
              <Clock className="size-3.5 text-muted" aria-hidden />
              <span>{item.turnaround}</span>
            </span>
          </div>

          <p className="mt-3 text-xs font-semibold text-ink-soft">
            {item.klienLabel}
          </p>

          <h3 className="mt-1 font-display text-xl leading-snug font-bold tracking-tight text-ink sm:text-2xl">
            {item.judul}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {item.ringkasan}
          </p>

          {/* Cuplikan percakapan nyata */}
          <div className="mt-4 space-y-2 rounded-xl border border-line bg-paper-2/70 p-3.5 text-xs">
            {item.pertanyaanKlien ? (
              <p className="leading-relaxed text-ink-soft">
                <span className="font-bold text-ink">Klien:</span> &ldquo;
                {item.pertanyaanKlien}&rdquo;
              </p>
            ) : null}
            {item.balasanAdmin ? (
              <p className="leading-relaxed text-ink-soft">
                <span className="font-bold text-ink">Mas Joki:</span> &ldquo;
                {item.balasanAdmin}&rdquo;
              </p>
            ) : null}
            <p className="flex items-start gap-2 leading-relaxed text-ink">
              <MessageSquareQuote
                className={`mt-0.5 size-4 shrink-0 ${aksen.text}`}
                aria-hidden
              />
              <span>
                <span className="font-semibold">&ldquo;{item.kutipanKlien}&rdquo;</span>
                <span className="ml-2 font-mono text-xs text-muted tabular-nums">
                  ({item.jamKutipan})
                </span>
              </span>
            </p>
          </div>

          {/* Detail studi kasus Turnitin (khusus Bukti #04) atau alur singkat */}
          {item.turnitinDetail ? (
            <div className="mt-4 rounded-xl border border-line bg-paper p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink">
                  Hasil Similarity Turnitin (studi kasus {item.turnitinDetail.tanggal})
                </span>
                <span className="inline-flex items-center rounded-md bg-stabilo px-2.5 py-0.5 font-mono text-xs font-extrabold text-[#101a33] tabular-nums">
                  {item.turnitinDetail.similarity}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {item.turnitinDetail.filters.map((filter) => (
                  <span
                    key={filter.label}
                    className="rounded-md border border-line bg-card px-2 py-1 font-mono text-xs font-semibold text-ink-soft tabular-nums"
                  >
                    {filter.label}:{" "}
                    <strong className="text-ink">{filter.nilai}</strong>
                  </span>
                ))}
              </div>

              <p className="mt-3 flex items-start gap-2 rounded-lg border border-amber/30 bg-amber-soft/75 px-3 py-2 text-xs leading-relaxed font-medium text-ink">
                <AlertCircle
                  className="mt-0.5 size-4 shrink-0 text-amber"
                  aria-hidden
                />
                <span>{item.turnitinDetail.disclaimer}</span>
              </p>
            </div>
          ) : (
            <ol className="mt-4 space-y-2 border-t border-dashed border-line pt-4 text-xs">
              {item.timeline.map((step) => (
                <li
                  key={`${item.id}-${step.waktu}`}
                  className="flex items-baseline gap-2.5"
                >
                  <span className="w-24 shrink-0 font-mono font-bold text-ink tabular-nums">
                    {step.waktu}
                  </span>
                  <span className="leading-relaxed text-ink-soft">
                    {step.keterangan}
                  </span>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-4">
            <button
              type="button"
              onClick={() => onBuka(item.id)}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-line-strong bg-paper px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand motion-reduce:transition-none"
            >
              <Maximize2 className="size-3.5" aria-hidden />
              <span>Baca Alur &amp; Perbesar Chat</span>
            </button>

            <Link
              href={item.ctaHref}
              className="inline-flex min-h-10 items-center gap-1.5 text-xs font-bold text-brand hover:underline"
            >
              <span>{item.ctaLabel}</span>
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function KartuBukti({
  item,
  onBuka,
  compactStrip = false,
}: {
  item: TestimoniBukti;
  onBuka: (id: TestimoniBukti["id"]) => void;
  compactStrip?: boolean;
}) {
  const aksen = AKSEN[item.aksenId];

  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
      <span
        aria-hidden
        className="h-1.5 w-full shrink-0"
        style={{ background: `var(${aksen.varName})` }}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${aksen.chip}`}
            >
              <span aria-hidden className={`size-1.5 rounded-full ${aksen.dot}`} />
              <span>{item.layananLabel}</span>
            </span>
            <span className="rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-xs font-bold text-ink-soft tabular-nums">
              {item.kodeNota}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ink-soft tabular-nums">
            <Clock className="size-3.5 text-muted" aria-hidden />
            <span>{item.turnaround}</span>
          </span>
        </div>

        <p className="mt-3 text-xs font-semibold text-ink-soft">
          {item.klienLabel}
        </p>

        <h3 className="mt-1 font-display text-lg leading-snug font-bold tracking-tight text-ink">
          {item.judul}
        </h3>

        <div className="mt-4">
          <PratinjauScreenshot
            item={item}
            onBuka={onBuka}
            sizes="(max-width: 1024px) 100vw, 520px"
            tinggiTerbatas={!compactStrip}
            compactStrip={compactStrip}
          />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          {item.ringkasan}
        </p>

        {/* Kutipan chat klien */}
        <blockquote
          className={`mt-4 rounded-r-xl border-l-2 bg-paper-2/70 px-3.5 py-2.5 text-xs leading-relaxed text-ink ${aksen.border}`}
        >
          <span className="font-semibold">&ldquo;{item.kutipanKlien}&rdquo;</span>
          <footer className="mt-1 font-mono text-xs text-muted tabular-nums">
            Respons klien · {item.jamKutipan}
          </footer>
        </blockquote>

        {/* Timeline ringkas */}
        <ol className="mt-4 space-y-1.5 border-t border-dashed border-line pt-3.5 text-xs">
          {item.timeline.map((step) => (
            <li
              key={`${item.id}-${step.waktu}`}
              className="flex items-baseline gap-2.5"
            >
              <span className="w-24 shrink-0 font-mono font-bold text-ink tabular-nums">
                {step.waktu}
              </span>
              <span className="leading-relaxed text-ink-soft">
                {step.keterangan}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-4">
          <DaftarBerkas item={item} />
          <Link
            href={item.ctaHref}
            className="inline-flex min-h-10 items-center gap-1.5 text-xs font-bold text-brand hover:underline"
          >
            <span>{item.ctaLabel}</span>
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function LightboxBukti({
  item,
  indexAktif,
  total,
  onTutup,
  onPindah,
}: {
  item: TestimoniBukti;
  indexAktif: number;
  total: number;
  onTutup: () => void;
  onPindah: (arah: -1 | 1) => void;
}) {
  const [zoomAsli, setZoomAsli] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onTutupRef = useRef(onTutup);
  const onPindahRef = useRef(onPindah);

  useEffect(() => {
    onTutupRef.current = onTutup;
    onPindahRef.current = onPindah;
  }, [onTutup, onPindah]);

  // Reset mode zoom tiap ganti bukti supaya gambar langsung muat rapi di layar.
  useEffect(() => {
    setZoomAsli(false);
  }, [item.id]);

  // Kunci scroll body, pindahkan fokus ke tombol tutup, tangani Escape / Arrow / Tab trap,
  // lalu kembalikan fokus ke tombol pemicu saat modal ditutup.
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onTutupRef.current();
        return;
      }

      if (
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onPindahRef.current(-1);
          return;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          onPindahRef.current(1);
          return;
        }
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const insideDialog = active ? dialogRef.current.contains(active) : false;

      if (
        event.shiftKey &&
        (!insideDialog || active === first || active === dialogRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!insideDialog || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus();
    };
  }, []);

  const aksen = AKSEN[item.aksenId];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b1120]/80 p-3 backdrop-blur-xs sm:p-5 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-judul"
      aria-describedby="lightbox-ringkasan"
      onClick={(event) => {
        if (event.target === event.currentTarget) onTutup();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden overscroll-contain rounded-2xl border border-line bg-card shadow-2xl"
      >
        {/* Header modal */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-xs font-bold text-ink tabular-nums">
              {item.kodeNota} · {indexAktif + 1}/{total}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${aksen.chip}`}
            >
              <span aria-hidden className={`size-1.5 rounded-full ${aksen.dot}`} />
              <span>{item.layananLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint-soft px-2.5 py-0.5 text-xs font-semibold text-mint">
              <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
              <span>Privasi klien disamarkan</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomAsli((z) => !z)}
              aria-pressed={zoomAsli}
              className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-card px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand motion-reduce:transition-none"
            >
              {zoomAsli ? (
                <>
                  <ZoomOut className="size-4 shrink-0" aria-hidden />
                  <span>Pas Layar</span>
                </>
              ) : (
                <>
                  <ZoomIn className="size-4 shrink-0" aria-hidden />
                  <span>Zoom 1:1</span>
                </>
              )}
            </button>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onTutup}
              aria-label="Tutup pratinjau chat"
              className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-line-strong bg-paper-2 px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand motion-reduce:transition-none"
            >
              <X className="size-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Tutup</span>
            </button>
          </div>
        </div>

        {/* Konten scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-ink-soft">
                {item.klienLabel}
              </p>
              <h3
                id="lightbox-judul"
                className="mt-0.5 font-display text-lg font-bold tracking-tight text-ink sm:text-xl"
              >
                {item.judul}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ink-soft tabular-nums">
              <Clock className="size-3.5 text-muted" aria-hidden />
              <span>{item.turnaround}</span>
            </span>
          </div>

          <p
            id="lightbox-ringkasan"
            className="mt-2 text-sm leading-relaxed text-ink-soft"
          >
            {item.ringkasan}
          </p>

          {/* Kanvas gambar bukti */}
          <div
            className={`mt-4 rounded-xl border border-line bg-[#0b141a] p-2 sm:p-3 ${
              zoomAsli ? "max-h-[58vh] overflow-auto" : "overflow-hidden"
            }`}
          >
            <Image
              src={item.gambar.src}
              alt={item.gambar.alt}
              width={item.gambar.width}
              height={item.gambar.height}
              sizes={zoomAsli ? "1008px" : "(max-width: 1024px) 95vw, 960px"}
              className={
                zoomAsli
                  ? "h-auto w-[960px] max-w-none rounded-lg"
                  : "mx-auto h-auto max-h-[54vh] w-full rounded-lg object-contain"
              }
            />
          </div>

          {zoomAsli ? (
            <p className="mt-1.5 text-xs font-medium text-muted">
              Mode Zoom 1:1 aktif — geser area gambar di atas untuk membaca teks kecil.
            </p>
          ) : null}

          {/* Detail alur & kutipan */}
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="font-display text-sm font-bold text-ink">
                Kronologi Chat Terverifikasi
              </p>
              <ol className="mt-3 space-y-2 text-xs">
                {item.timeline.map((step) => (
                  <li
                    key={`modal-${item.id}-${step.waktu}`}
                    className="flex items-baseline gap-2.5"
                  >
                    <span className="w-24 shrink-0 font-mono font-bold text-ink tabular-nums">
                      {step.waktu}
                    </span>
                    <span className="leading-relaxed text-ink-soft">
                      {step.keterangan}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-line bg-paper-2/70 p-4 text-xs">
                <p className="font-bold text-ink">Respons Klien</p>
                <p className="mt-1.5 font-semibold leading-relaxed text-ink">
                  &ldquo;{item.kutipanKlien}&rdquo;
                </p>
                <p className="mt-1 font-mono text-xs text-muted tabular-nums">
                  {item.jamKutipan}
                </p>
                <div className="mt-3 border-t border-dashed border-line pt-3">
                  <DaftarBerkas item={item} />
                </div>
              </div>

              {item.turnitinDetail ? (
                <div className="rounded-xl border border-amber/30 bg-amber-soft/75 p-3.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-ink">
                      Turnitin {item.turnitinDetail.tanggal}
                    </span>
                    <span className="rounded bg-stabilo px-2 py-0.5 font-mono font-extrabold text-[#101a33] tabular-nums">
                      Similarity {item.turnitinDetail.similarity}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.turnitinDetail.filters.map((f) => (
                      <span
                        key={`modal-f-${f.label}`}
                        className="rounded border border-line bg-card px-2 py-0.5 font-mono font-semibold text-ink-soft"
                      >
                        {f.label}: <strong className="text-ink">{f.nilai}</strong>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2.5 leading-relaxed font-medium text-ink">
                    {item.turnitinDetail.disclaimer}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer navigasi antar 5 bukti */}
        <div className="flex items-center justify-between gap-2 border-t border-line bg-paper px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => onPindah(-1)}
            disabled={total <= 1}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            <span>Sebelumnya</span>
          </button>

          <span className="font-mono text-xs font-bold text-ink-soft tabular-nums">
            Bukti {indexAktif + 1} dari {total}
          </span>

          <button
            type="button"
            onClick={() => onPindah(1)}
            disabled={total <= 1}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          >
            <span>Berikutnya</span>
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TestimoniNyata() {
  const [kategoriAktif, setKategoriAktif] = useState<TestimoniKategori>("semua");
  const [lightboxId, setLightboxId] = useState<TestimoniBukti["id"] | null>(
    null,
  );

  const daftarTampil = useMemo(() => {
    if (kategoriAktif === "semua") return BUKTI_TERURUT;
    return BUKTI_TERURUT.filter((item) => item.kategori === kategoriAktif);
  }, [kategoriAktif]);

  const indexLightbox = useMemo(() => {
    if (!lightboxId) return -1;
    return BUKTI_TERURUT.findIndex((item) => item.id === lightboxId);
  }, [lightboxId]);

  const itemLightbox =
    indexLightbox >= 0 ? BUKTI_TERURUT[indexLightbox] : null;

  const pindahLightbox = useCallback((arah: -1 | 1) => {
    setLightboxId((prevId) => {
      if (!prevId) return BUKTI_TERURUT[0]?.id ?? null;
      const idx = BUKTI_TERURUT.findIndex((item) => item.id === prevId);
      const nextIdx =
        (idx + arah + BUKTI_TERURUT.length) % BUKTI_TERURUT.length;
      return BUKTI_TERURUT[nextIdx]?.id ?? prevId;
    });
  }, []);

  const tutupLightbox = useCallback(() => {
    setLightboxId(null);
  }, []);

  const tampilPenuh = kategoriAktif === "semua" && daftarTampil.length === 5;
  const sorotanUtama = tampilPenuh ? daftarTampil[0] : null;
  const pasanganArtikel = tampilPenuh ? daftarTampil.slice(1, 3) : [];
  const pasanganLebar = tampilPenuh ? daftarTampil.slice(3, 5) : [];

  return (
    <section
      id="testimoni"
      className="relative overflow-hidden border-b border-line bg-paper-2 py-14 scroll-mt-16 sm:py-20"
    >
      <div
        aria-hidden
        className="kertas-titik pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header Bagian */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="stempel-hijau">✓ ARSIP CHAT NYATA</span>
            <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
              Bukti pengerjaan langsung dari WhatsApp.
            </h2>
            <p className="mt-2 text-sm leading-relaxed font-medium text-ink-soft">
              Lima tangkapan layar pesanan sungguhan tanpa rating atau angka karangan. Nama klien, nomor HP, nama kampus, dan judul naskah disamarkan sesuai Pasal 04.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-semibold text-ink shadow-2xs">
            <ShieldCheck className="size-4 shrink-0 text-mint" aria-hidden />
            <span>5 bukti terverifikasi · Klik gambar untuk zoom</span>
          </div>
        </div>

        {/* Filter Kategori Opsional */}
        <div
          role="group"
          aria-label="Saring bukti berdasarkan kategori layanan"
          className="mt-7 flex flex-wrap gap-2"
        >
          {KATEGORI_TESTIMONI.map((kat) => {
            const aktif = kategoriAktif === kat.id;
            const jumlah = jumlahPerKategori(kat.id);

            return (
              <button
                key={kat.id}
                type="button"
                aria-pressed={aktif}
                onClick={() => setKategoriAktif(kat.id)}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors motion-reduce:transition-none ${
                  aktif
                    ? "border-brand bg-brand text-white shadow-xs dark:border-[#2f4fd8] dark:bg-[#2f4fd8]"
                    : "border-line bg-card text-ink-soft hover:border-brand/45 hover:text-ink"
                }`}
              >
                <span>{kat.label}</span>
                <span
                  className={`font-mono tabular-nums ${
                    aktif ? "text-white/90" : "text-muted"
                  }`}
                >
                  ({jumlah})
                </span>
              </button>
            );
          })}
        </div>

        {/* Susunan Grid Editorial */}
        {tampilPenuh && sorotanUtama ? (
          <div className="mt-8 space-y-8">
            <KartuSorotan item={sorotanUtama} onBuka={setLightboxId} />

            <div className="grid gap-6 lg:grid-cols-2">
              {pasanganArtikel.map((item) => (
                <KartuBukti
                  key={item.id}
                  item={item}
                  onBuka={setLightboxId}
                />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {pasanganLebar.map((item) => (
                <KartuBukti
                  key={item.id}
                  item={item}
                  onBuka={setLightboxId}
                  compactStrip
                />
              ))}
            </div>
          </div>
        ) : daftarTampil.length === 1 ? (
          <div className="mt-8 pb-3">
            <KartuSorotan item={daftarTampil[0]} onBuka={setLightboxId} />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {daftarTampil.map((item) => (
              <KartuBukti
                key={item.id}
                item={item}
                onBuka={setLightboxId}
                compactStrip={item.kategori === "kwitansi" || item.kategori === "presentasi"}
              />
            ))}
          </div>
        )}

        {/* Jembatan Alur ke Kalkulator */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:p-6">
          <p className="text-sm font-medium leading-relaxed text-ink-soft">
            Mau cek estimasi biaya tugasmu sendiri sebelum chat seperti bukti di atas?
          </p>
          <Link
            href="/hitung"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#1730bd] dark:bg-[#2f4fd8] dark:hover:bg-[#2643c4] motion-reduce:transition-none"
          >
            <span>Hitung Biaya Sekarang</span>
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      {itemLightbox ? (
        <LightboxBukti
          item={itemLightbox}
          indexAktif={indexLightbox}
          total={BUKTI_TERURUT.length}
          onTutup={tutupLightbox}
          onPindah={pindahLightbox}
        />
      ) : null}
    </section>
  );
}
