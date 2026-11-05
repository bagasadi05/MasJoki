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
}: NotaProps) {
  return (
    <div className={`nota ${animate ? "nota-masuk" : ""} ${className}`}>
      {aksen ? (
        <span
          aria-hidden
          className="absolute -top-px left-0 right-0 z-10 h-[6px]"
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

      <div className="p-6 sm:p-7">
        {/* Header Nota */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 -rotate-3 place-items-center rounded-xl border border-brand/20 bg-brand-soft text-brand shadow-xs">
              <span className="font-display text-[0.82rem] font-bold">MJ</span>
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-none tracking-tight text-ink">
                Mas Joki
              </p>
              <p className="mt-1 text-[0.72rem] font-medium text-muted">
                Estimasi Biaya Transparan
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block rounded-md bg-paper-2 px-2.5 py-1 font-mono text-[0.66rem] font-extrabold uppercase tracking-wider text-muted border border-line">
              REC-{code}
            </span>
          </div>
        </div>

        {/* Garis batas putus-putus */}
        <div className="my-5 border-t border-dashed border-line" />

        {/* Rincian item */}
        <dl className="space-y-3.5">
          {lines.map((line, index) => {
            const isDiscount = line.amount < 0 || line.kind === "discount";
            const isAddon = line.kind === "addon";

            return (
              <div
                key={`${line.label}-${index}`}
                className="flex items-baseline justify-between gap-3 text-[0.88rem]"
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
                      className={`mt-0.5 block text-[0.74rem] leading-snug font-normal ${
                        isDiscount ? "text-mint font-medium" : "text-muted"
                      }`}
                    >
                      {line.detail}
                    </span>
                  ) : null}
                </dt>
                <dd
                  className={`shrink-0 font-mono text-[0.84rem] font-semibold tabular-nums ${
                    isDiscount
                      ? "font-bold text-mint"
                      : isAddon
                        ? "text-brand"
                        : "text-ink-soft"
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
        <div className="my-5 border-t border-dashed border-line" />

        {/* Total Akhir dengan Animasi Angka Berputar Halus */}
        <div className="flex items-end justify-between gap-3 rounded-2xl bg-paper-2/70 p-4 border border-line/60">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-wider text-muted">
              Total Akhir
            </p>
            <p className="text-[0.68rem] text-muted">
              {effectiveUnitLabel
                ? `Rata-rata ${effectiveUnitLabel}`
                : "Terkunci sebelum chat"}
            </p>
          </div>
          <p className="font-display text-[1.85rem] font-bold leading-none tracking-tight text-brand tabular-nums">
            <AnimatedPrice value={total} />
          </p>
        </div>

        {/* Info Opsi DP 50% & Estimasi Pengerjaan */}
        {dpAmount || estimatedTurnaround || equivalentLabel ? (
          <div className="mt-3.5 space-y-2 rounded-2xl border border-brand/15 bg-brand-soft/40 p-3.5 text-[0.75rem]">
            {dpAmount ? (
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-semibold text-ink-soft">
                  <CreditCard className="size-3.5 text-brand" />
                  <span>Opsi DP 50% (Uang Muka):</span>
                </span>
                <span className="font-mono font-bold text-ink tabular-nums">
                  <AnimatedPrice value={dpAmount} />
                </span>
              </div>
            ) : null}

            {estimatedTurnaround ? (
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-semibold text-ink-soft">
                  <Clock className="size-3.5 text-brand" />
                  <span>Estimasi Selesai:</span>
                </span>
                <span className="font-bold text-ink">{estimatedTurnaround}</span>
              </div>
            ) : null}

            {equivalentLabel ? (
              <div className="flex items-center gap-1.5 border-t border-brand/10 pt-1.5 text-[0.71rem] text-muted">
                <Ruler className="size-3 text-muted shrink-0" />
                <span>{equivalentLabel}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {note ? (
          <p className="mt-3.5 text-[0.74rem] leading-relaxed text-muted">
            {note}
          </p>
        ) : null}

        {/* Stempel verifikasi & Barcode Kwitansi Fisik */}
        <div className="mt-5 flex items-center justify-between gap-2 pt-2 border-t border-dashed border-line">
          <div className="flex flex-col">
            <span
              aria-hidden
              className="font-mono text-[0.78rem] tracking-[0.22em] text-muted/60 select-none uppercase font-bold"
            >
              ||||| ||| |||| || |||||
            </span>
            <span className="font-mono text-[0.58rem] text-muted tracking-wider">
              VERIFIED LEDGER #MJ-2026
            </span>
          </div>

          {stamp ? (
            <span className={`stempel ${animate ? "stempel-masuk" : ""}`}>
              <Check className="size-3 inline mr-1 stroke-[3]" />
              {stamp}
            </span>
          ) : null}
        </div>

        {/* Sobekan Fisik Kwitansi */}
        <div className="mt-4 pt-2.5 border-t border-dotted border-line/60 flex items-center justify-between text-[0.6rem] text-muted/50 font-mono select-none">
          <span className="flex items-center gap-1">
            <span>✂</span>
            <span>BATAS POTONG RESMI</span>
          </span>
          <span>MAS JOKI ACADEMIC</span>
        </div>
      </div>
    </div>
  );
}
