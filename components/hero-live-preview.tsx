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
  deadlineId: "kilat" | "cepat" | "normal";
  difficultyId: "standar" | "menengah" | "riset";
  tag: string;
}

const PRESETS: PresetItem[] = [
  {
    id: "parafrase",
    label: "Parafrase 1.000 Kata",
    serviceId: "parafrase",
    qty: 1000,
    deadlineId: "kilat",
    difficultyId: "standar",
    tag: "⚡ Selesai Hari Ini",
  },
  {
    id: "makalah",
    label: "Makalah 15 Hal",
    serviceId: "makalah",
    qty: 15,
    deadlineId: "cepat",
    difficultyId: "standar",
    tag: "📚 Lengkap Sitasi",
  },
  {
    id: "powerpoint",
    label: "PPT 10 Slide",
    serviceId: "powerpoint",
    qty: 10,
    deadlineId: "kilat",
    difficultyId: "standar",
    tag: "📊 Siap Presentasi",
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
      <div className="absolute -top-4 -left-3 z-20 hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white/95 px-3 py-1 shadow-md shadow-emerald-950/10 backdrop-blur text-[0.72rem] font-bold text-emerald-800 ">
        <span className="size-2 rounded-full bg-emerald-500 " />
        <span>Kalkulator Otomatis Live</span>
      </div>

      {/* Main Unified Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-brand/25 bg-white p-5 shadow-2xl shadow-brand/15 sm:p-6 backdrop-blur-sm">
        {/* Mascot & Sapaan */}
        <div className="flex items-center gap-4 border-b border-dashed border-line pb-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border-2 border-brand/30 bg-white shadow-md ring-4 ring-white">
            <Image
              src="/mas-joki.jpg"
              alt="Maskot Mas Joki Jempol"
              width={64}
              height={64}
              className="size-full object-cover object-top"
              priority
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-[0.98rem] font-black text-ink">
                Mas Joki
              </span>
              <span className="rounded-full bg-brand px-2 py-0.5 font-mono text-[0.62rem] font-bold text-white">
                Resmi
              </span>
            </div>
            <p className="mt-0.5 text-[0.8rem] text-ink-soft font-medium leading-snug">
              &ldquo;Coba klik contoh tugas di bawah, angkanya langsung muncul transparan!&rdquo; 👍
            </p>
          </div>
        </div>

        {/* Tab Pilihan Simulasi Cepat */}
        <div className="mt-4">
          <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-wider text-muted">
            Pilih Contoh Simulasi Tugas:
          </p>
          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-paper-2 p-1">
            {PRESETS.map((preset) => {
              const aktif = preset.id === selectedId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedId(preset.id)}
                  className={`rounded-lg py-2 px-1 text-center font-display text-[0.74rem] font-bold transition-all ${
                    aktif
                      ? "bg-white text-brand shadow-xs ring-1 ring-brand/20"
                      : "text-ink-soft hover:bg-white/60 hover:text-ink"
                  }`}
                >
                  <span className="block truncate">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Receipt Card */}
        <div className="mt-4">
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
          />
        </div>

        {/* Action: Bawa Ke Kalkulator */}
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-3.5 border border-line shadow-xs">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-wider text-muted">
              Punya jumlah tugas berbeda?
            </p>
            <p className="font-display text-[0.84rem] font-bold text-ink">
              Hitung nominal persismu sekarang
            </p>
          </div>
          <button
            type="button"
            onClick={() => pilihLayanan(service.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2.5 text-[0.78rem] font-bold text-white shadow-xs transition-all hover:bg-brand-dark hover:shadow-md cursor-pointer"
          >
            <span>Buka Kalkulator</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
