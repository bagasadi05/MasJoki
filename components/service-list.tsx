"use client";

import Link from "next/link";
import { ArrowRight, Clock, Flame, Info } from "lucide-react";
import { useCalculator } from "./calculator-context";
import { ServiceIcon } from "./service-icon";
import { StempelLayanan } from "./stempel-layanan";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import { priceLabel, SERVICES, type ServiceId } from "@/lib/services";

const KODE_LAYANAN: Record<ServiceId, string> = {
  parafrase: "PF-01",
  humanisasi: "HM-02",
  makalah: "MK-03",
  jurnal: "JR-04",
  powerpoint: "PT-05",
  word: "WD-06",
  terjemah: "TJ-07",
  desain: "DS-08",
};

export function ServiceList() {
  const { pilihLayanan } = useCalculator();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICES.map((service) => {
        const aksen = aksenLayanan(service.id);
        const kode = KODE_LAYANAN[service.id];

        return (
          <div
            key={service.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5"
          >
            {/* Top colored accent line */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ backgroundColor: aksen.hex }}
            />

            <div>
              {/* Header Card: Icon, Stamp, Badge & Code */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="grid size-11 place-items-center rounded-2xl border shadow-2xs transition-transform duration-200 group-hover:scale-105"
                    style={{
                      backgroundColor: `${aksen.hex}14`,
                      borderColor: `${aksen.hex}30`,
                      color: aksen.hex,
                    }}
                  >
                    <ServiceIcon id={service.id} className="size-5" />
                  </div>
                  <StempelLayanan id={service.id} ukuran="kecil" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[0.66rem] font-bold text-muted/70 tracking-wider">
                    {kode}
                  </span>
                  {service.popular ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber/25 bg-amber-soft px-2 py-0.5 text-[0.66rem] font-bold text-amber shadow-2xs">
                      <Flame className="size-2.5 text-amber fill-amber" />
                      <span>Populer</span>
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="mt-4 font-display text-[1.22rem] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                {service.name}
              </h3>

              <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-soft/85 line-clamp-2">
                {service.promise}
              </p>

              {/* Turnaround Pill */}
              <div className="mt-3 flex items-center gap-2 text-[0.72rem] text-muted">
                <Clock className="size-3 text-muted/80" />
                <span>Estimasi normal: <strong>{service.turnaround}</strong></span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="mt-6 border-t border-dashed border-line pt-4">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className="block text-[0.66rem] font-bold uppercase tracking-wider text-muted">
                    Tarif Dasar
                  </span>
                  <span className="font-mono text-[0.94rem] font-bold tabular-nums text-ink">
                    {priceLabel(service)}
                  </span>
                </div>
                <span className="text-[0.72rem] font-semibold text-muted">
                  min. {rupiah(service.minPrice)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => pilihLayanan(service.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-paper-2 px-4 py-2.5 text-[0.82rem] font-bold text-ink transition-all duration-200 group-hover:bg-brand group-hover:text-white group-hover:shadow-md group-hover:shadow-brand/20 active:scale-95 cursor-pointer"
                >
                  <span>Hitung Biaya</span>
                  <ArrowRight className="size-3.5" />
                </button>
                <Link
                  href={`/jasa/${service.id}`}
                  title={`Pelajari cakupan ${service.name}`}
                  className="inline-flex size-9.5 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <Info className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
