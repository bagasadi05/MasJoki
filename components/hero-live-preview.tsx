"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useCalculator } from "./calculator-context";
import { Nota } from "./nota";
import { aksenLayanan } from "@/lib/aksen";
import { computePrice } from "@/lib/pricing";
import { getService, type ServiceId } from "@/lib/services";

interface PresetItem {
  id: string;
  label: string;
  serviceId: ServiceId;
  qty: number;
  deadlineId: "kilat" | "cepat" | "normal" | "santai";
  difficultyId: "standar" | "menengah" | "riset";
  tag: string;
}

/**
 * TUGAS 8: Label tab simulasi ringkas agar tidak terpotong pada layar 1080p & 768p.
 * Preset default Parafrase 1.000 kata kilat (<24 jam) menghasilkan Total Rp48.000 -> DP Rp24.000 (TUGAS 3).
 */
const PRESETS: PresetItem[] = [
  {
    id: "parafrase",
    label: "Parafrase",
    serviceId: "parafrase",
    qty: 1000,
    deadlineId: "kilat",
    difficultyId: "standar",
    tag: "1.000 kata · kilat",
  },
  {
    id: "makalah",
    label: "Makalah",
    serviceId: "makalah",
    qty: 10,
    deadlineId: "cepat",
    difficultyId: "standar",
    tag: "10 halaman · cepat",
  },
  {
    id: "powerpoint",
    label: "PPT",
    serviceId: "powerpoint",
    qty: 10,
    deadlineId: "normal",
    difficultyId: "standar",
    tag: "10 slide · normal",
  },
];

export function HeroLivePreview() {
  const [selectedId, setSelectedId] = useState<string>("parafrase");
  const { pilihLayanan } = useCalculator();

  const activePreset = PRESETS.find((p) => p.id === selectedId) ?? PRESETS[0];
  const service = getService(activePreset.serviceId);
  const aksen = aksenLayanan(service.id);

  const priceResult = computePrice(
    service,
    activePreset.qty,
    activePreset.deadlineId,
    activePreset.difficultyId,
  );

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Top Floating Badge */}
      <div className="absolute -top-3.5 -left-2.5 z-20 hidden sm:flex items-center gap-2 rounded-full border border-mint/25 bg-white/95 px-3 py-1 shadow-md shadow-mint/15 backdrop-blur text-xs font-bold text-mint animate-float">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-mint" />
        </span>
        <span>Kalkulator Otomatis Live</span>
      </div>

      {/* Main Unified Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-brand/25 bg-white p-4 sm:p-5 shadow-xl shadow-brand/10 backdrop-blur-sm">
        {/* Mascot & Sapaan */}
        <div className="flex items-center gap-3.5 border-b border-dashed border-line pb-3.5">
          <div className="relative size-13 shrink-0 overflow-hidden rounded-2xl border-2 border-brand/30 bg-white shadow-md ring-2 ring-white animate-float-delayed">
            <Image
              src="/mas-joki.jpg"
              alt="Maskot Mas Joki"
              width={52}
              height={52}
              className="size-full object-cover object-top"
              priority
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-ink">
                Mas Joki
              </span>
              <span className="rounded-full bg-brand px-2 py-0.5 font-mono text-xs font-bold text-white">
                Online
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600 font-medium leading-snug">
              &ldquo;Coba klik contoh tugas di bawah, angkanya langsung muncul transparan!&rdquo;
            </p>
          </div>
        </div>

        {/* Tab Pilihan Simulasi Cepat (TUGAS 8: Ringkas & Tidak Terpotong) */}
        <div className="mt-3.5">
          <p className="mb-1.5 text-xs font-bold text-slate-600">
            Pilih Contoh Simulasi Tugas:
          </p>
          <div
            role="tablist"
            aria-label="Simulasi cepat tugas"
            className="grid grid-cols-3 gap-1.5 rounded-2xl border border-line bg-paper-2 p-1"
          >
            {PRESETS.map((preset) => {
              const aktif = preset.id === selectedId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="tab"
                  aria-selected={aktif}
                  onClick={() => setSelectedId(preset.id)}
                  className={`rounded-xl py-2 px-1 text-center transition-all cursor-pointer ${
                    aktif
                      ? "bg-white text-ink shadow-xs ring-2 ring-brand/30"
                      : "text-slate-600 hover:bg-white/60 hover:text-ink"
                  }`}
                >
                  <span className="block font-display text-xs font-black truncate leading-tight">
                    {preset.label}
                  </span>
                  <span className="block font-mono text-xs text-slate-600 font-medium truncate mt-0.5">
                    {preset.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Receipt Card (TUGAS 8: Varian Ringkas maks 2 baris item + Total + DP, tanpa barcode) */}
        <div className="mt-3">
          <Nota
            lines={priceResult.lines}
            total={priceResult.total}
            dpAmount={priceResult.dpAmount}
            effectiveUnitLabel={priceResult.effectiveUnitLabel}
            estimatedTurnaround={priceResult.estimatedTurnaround}
            equivalentLabel={priceResult.equivalentLabel}
            stamp="Harga Transparan"
            code="LIVE-SIM"
            aksen={aksen}
            ringkas={true}
          />
        </div>

        {/* Action: Bawa Ke Kalkulator */}
        <div className="mt-3.5 flex items-center justify-between gap-3 rounded-2xl bg-paper-2/80 p-3 border border-line">
          <div>
            <p className="text-xs font-bold text-slate-600">
              Punya jumlah tugas berbeda?
            </p>
            <p className="font-display text-xs sm:text-sm font-bold text-ink">
              Hitung biaya persismu sekarang
            </p>
          </div>
          <button
            type="button"
            onClick={() => pilihLayanan(service.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-dark hover:shadow-md cursor-pointer shrink-0"
          >
            <span>Buka Kalkulator</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
