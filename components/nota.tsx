"use client";

import { rupiah } from "@/lib/format";
import type { Aksen } from "@/lib/aksen";
import { AnimatedPrice } from "./animated-number";
import { Check, Clock, CreditCard, Ruler, Sparkles } from "lucide-react";

export interface NotaLine {
  label: string;
  detail?: string;
  amount: number;
  kind?: "base" | "discount" | "surcharge" | "addon";
}

interface NotaProps {
  code?: string;
  lines: NotaLine[];
  total: number;
  dpAmount?: number;
  effectiveUnitLabel?: string;
  estimatedTurnaround?: string;
  equivalentLabel?: string;
  note?: string;
  stamp?: string;
  animate?: boolean;
  className?: string;
  /** Warna layanan aktif: menggambar pita warna di atas nota. */
  aksen?: Aksen;
  /** TUGAS 8: Varian ringkas khusus hero agar tidak terpotong di viewport 1080p dan 768p */
  ringkas?: boolean;
  /** REVISI 4: Catatan penyesuaian batas minimum transaksi Rp15.000 */
  minimumAdjustmentNote?: string | null;
}

/**
 * Nota harga: Elemen visual utama brand Mas Joki.
 * Menggabungkan estetika kwitansi transparan dengan desain kartu modern yang elegan dan rapi.
 */
export function Nota({
  code = "DRAF",
  lines,
  total,
  dpAmount,
  effectiveUnitLabel,
  estimatedTurnaround,
  equivalentLabel,
  note,
  stamp,
  animate = false,
  className = "",
  aksen,
  ringkas = false,
  minimumAdjustmentNote,
}: NotaProps) {
  const displayLines = ringkas ? lines.slice(0, 2) : lines;

  return (
    <div className={`nota ${animate ? "nota-masuk" : ""} ${className}`}>
      {aksen ? (
        <span
          aria-hidden
          className="absolute -top-px left-0 right-0 z-10 h-[5px]"
          style={{
            background: `var(${aksen.varName})`,
            borderRadius: "var(--radius-nota) var(--radius-nota) 0 0",
          }}
        />
      ) : (
        <span
          aria-hidden
          className="pita absolute -top-px left-0 right-0 z-10 h-[5px]"
          style={{
            borderRadius: "var(--radius-nota) var(--radius-nota) 0 0",
          }}
        />
      )}

      <div className={ringkas ? "p-4 sm:p-5" : "p-6 sm:p-7"}>
        {/* Header Nota */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 -rotate-3 place-items-center rounded-xl border border-brand/20 bg-brand-soft text-brand shadow-xs">
              <span className="font-display text-[0.82rem] font-bold">MJ</span>
            </div>
            <div>
              <p className="font-display text-base sm:text-lg font-bold leading-none tracking-tight text-ink">
                Mas Joki
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Estimasi Biaya Transparan
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block rounded-md bg-paper-2 px-2.5 py-1 font-mono text-xs font-extrabold uppercase tracking-wider text-slate-600 border border-line">
              REC-{code}
            </span>
          </div>
        </div>

        {/* Garis batas putus-putus */}
        <div className={`border-t border-dashed border-line ${ringkas ? "my-3.5" : "my-5"}`} />

        {/* Rincian item */}
        <dl className={ringkas ? "space-y-2.5" : "space-y-3.5"}>
          {displayLines.map((line, index) => {
            const isDiscount = line.amount < 0 || line.kind === "discount";
            const isAddon = line.kind === "addon";

            return (
              <div
                key={`${line.label}-${index}`}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <dt
                  className={`min-w-0 pr-2 font-medium leading-snug ${
                    isDiscount
                      ? "font-bold text-mint"
                      : isAddon
                        ? "font-semibold text-brand-dark"
                        : "text-ink"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isAddon ? <Sparkles className="size-3 text-brand shrink-0" aria-hidden /> : null}
                    <span>{line.label}</span>
                  </span>
                  {line.detail ? (
                    <span
                      className={`mt-0.5 block text-xs leading-snug ${
                        isDiscount ? "text-mint font-semibold" : "text-slate-600 font-medium"
                      }`}
                    >
                      {line.detail}
                    </span>
                  ) : null}
                </dt>
                <dd
                  className={`shrink-0 font-mono text-sm font-bold tabular-nums ${
                    isDiscount
                      ? "text-mint"
                      : isAddon
                        ? "text-brand"
                        : "text-ink"
                  }`}
                >
                  {isDiscount
                    ? `- ${rupiah(Math.abs(line.amount))}`
                    : rupiah(line.amount)}
                </dd>
              </div>
            );
          })}
        </dl>

        {/* Garis batas putus-putus */}
        <div className={`border-t border-dashed border-line ${ringkas ? "my-3.5" : "my-5"}`} />

        {/* Total Akhir dengan Animasi Angka Berputar Halus */}
        <div className="flex items-end justify-between gap-3 rounded-2xl bg-paper-2/80 p-3.5 sm:p-4 border border-line/70">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total Akhir
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {effectiveUnitLabel
                ? `Rata-rata ${effectiveUnitLabel}`
                : "Terkunci sebelum chat"}
            </p>
          </div>
          <p className="font-display text-2xl sm:text-[1.85rem] font-bold leading-none tracking-tight text-brand tabular-nums">
            <AnimatedPrice value={total} />
          </p>
        </div>

        {/* REVISI 4: Catatan penyesuaian minimum transaksi Rp15.000 */}
        {minimumAdjustmentNote ? (
          <p className="mt-2 text-center text-xs font-semibold text-amber bg-amber-soft/60 border border-amber/20 rounded-xl py-1.5 px-3">
            ✦ {minimumAdjustmentNote}
          </p>
        ) : null}

        {/* TUGAS 3: Info Opsi DP 50% & Estimasi Pengerjaan */}
        {dpAmount || estimatedTurnaround || equivalentLabel ? (
          <div className="mt-3 space-y-2 rounded-2xl border border-brand/15 bg-brand-soft/50 p-3 sm:p-3.5 text-xs">
            {dpAmount ? (
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-bold text-ink-soft">
                    <CreditCard className="size-3.5 text-brand" />
                    <span>Opsi DP 50% (Uang Muka):</span>
                  </span>
                  <span className="font-mono font-extrabold text-ink tabular-nums">
                    <AnimatedPrice value={dpAmount} />
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-5 font-medium leading-tight">
                  Sudah dibulatkan ke kelipatan Rp500 terdekat.
                </p>
              </div>
            ) : null}

            {estimatedTurnaround ? (
              <div className="flex items-center justify-between gap-2 border-t border-brand/10 pt-1.5">
                <span className="flex items-center gap-1.5 font-semibold text-ink-soft">
                  <Clock className="size-3.5 text-brand" />
                  <span>Estimasi Selesai:</span>
                </span>
                <span className="font-bold text-ink">{estimatedTurnaround}</span>
              </div>
            ) : null}

            {equivalentLabel && !ringkas ? (
              <div className="flex items-center gap-1.5 border-t border-brand/10 pt-1.5 text-xs text-slate-600 font-medium">
                <Ruler className="size-3 text-slate-500 shrink-0" />
                <span>{equivalentLabel}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {note && !ringkas ? (
          <p className="mt-3.5 text-xs leading-relaxed text-slate-600 font-medium">
            {note}
          </p>
        ) : null}

        {/* TUGAS 8: Stempel & Sobekan Fisik hanya tampil di nota lengkap, bukan di hero ringkas */}
        {!ringkas ? (
          <>
            <div className="mt-5 flex items-center justify-between gap-2 pt-2 border-t border-dashed border-line">
              <div className="flex flex-col">
                <span
                  aria-hidden
                  className="font-mono text-[11px] tracking-[0.25em] text-slate-600 uppercase select-none"
                >
                  ||||| | |||| || ||| |
                </span>
                <span className="mt-0.5 font-mono text-[11px] font-bold text-slate-600">
                  REF-{code}-OK
                </span>
              </div>

              {stamp ? (
                <span className="stempel-merah -rotate-2 transform text-xs">
                  ✓ {stamp}
                </span>
              ) : null}
            </div>

            <div
              aria-hidden
              className="mt-5 flex items-center justify-between gap-1 overflow-hidden opacity-60"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full bg-line"
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
