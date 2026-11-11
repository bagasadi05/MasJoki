"use client";

import { rupiah } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { getService } from "@/lib/services";
import { Tilt } from "./tilt";

/**
 * Receipt statis untuk Hero (desktop-only):
 * Menggantikan live interactive preview yang lambat & berisik.
 * Menampilkan contoh nota kwitansi transparan dengan angka riil dari pricing engine.
 */
export function HeroStaticReceipt() {
  const service = getService("parafrase");
  const price = computePrice(service, 1000, "santai", "standar");

  return (
    <Tilt maks={4} className="relative mx-auto max-w-[340px] drop-shadow-xl">
      <div className="nota nota-masuk bg-white p-5 sm:p-6">
        {/* Accent strip */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 rounded-t-[13px] bg-brand"
        />

        {/* Header Nota */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 -rotate-3 place-items-center rounded-xl border border-brand/20 bg-brand-soft text-brand shadow-xs">
              <span className="font-display text-sm font-bold">MJ</span>
            </div>
            <div>
              <p className="font-display text-base font-bold leading-none tracking-tight text-ink">
                Mas Joki
              </p>
              <p className="mt-1 text-[13px] font-semibold text-slate-600">
                Kwitansi Transparan
              </p>
            </div>
          </div>
          <span className="rounded-md bg-paper-2 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-slate-600 border border-line">
            CONTOH
          </span>
        </div>

        <div className="my-4 border-t border-dashed border-line" />

        {/* Baris Item Contoh */}
        <div className="space-y-1.5 text-xs font-medium">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-bold text-ink">Parafrase — 1.000 kata</span>
            <span className="font-mono font-bold text-ink tabular-nums">
              {rupiah(price.total)}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-line" />

        {/* Total & Opsi DP 50% */}
        <div className="rounded-xl bg-paper-2/80 p-3 border border-line/60">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total Akhir
            </span>
            <span className="font-display text-xl font-black tracking-tight text-brand tabular-nums">
              {rupiah(price.total)}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-dashed border-line pt-2 text-xs">
            <span className="font-bold text-slate-600">Opsi DP 50%:</span>
            <span className="font-mono font-bold text-mint tabular-nums">
              {rupiah(price.dpAmount)}
            </span>
          </div>
        </div>

        {/* Stempel */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[13px] text-slate-600 font-medium">
            *Dihitung dari modul harga
          </span>
          <span className="stempel stempel-masuk text-xs py-0.5 px-2">
            HARGA TRANSPARAN
          </span>
        </div>
      </div>
    </Tilt>
  );
}
