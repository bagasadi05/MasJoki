"use client";

import { useCalculator } from "./calculator-context";
import { priceLabel, SERVICES } from "@/lib/services";

export function ServiceList() {
  const { pilihLayanan } = useCalculator();

  return (
    <ul className="divide-y divide-line border-y border-line">
      {SERVICES.map((service) => (
        <li key={service.id}>
          <button
            type="button"
            onClick={() => pilihLayanan(service.id)}
            className="group flex w-full flex-col gap-3 py-5 text-left transition-colors hover:bg-paper-2/60 focus-visible:bg-paper-2/60 sm:flex-row sm:items-baseline sm:gap-4 sm:px-2"
          >
            <span className="min-w-0 sm:w-[54%]">
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-[1.15rem] leading-none tracking-tight text-ink">
                  {service.name}
                </span>
                {service.popular ? (
                  <span className="inline-flex items-center gap-1.5 text-[0.68rem] text-muted">
                    <span
                      aria-hidden
                      className="inline-block size-1.5 rounded-full bg-brand"
                    />
                    sering dipesan
                  </span>
                ) : null}
              </span>
              <span className="mt-1.5 block max-w-[46ch] text-[0.82rem] leading-relaxed text-muted">
                {service.promise}
              </span>
            </span>

            <span className="hidden flex-1 sm:block">
              <span className="leader block" aria-hidden />
            </span>

            <span className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
              <span className="whitespace-nowrap font-mono text-[0.82rem] tabular-nums text-ink-soft">
                {priceLabel(service)}
              </span>
              <span className="whitespace-nowrap text-[0.75rem] font-semibold text-brand group-hover:underline group-hover:underline-offset-4">
                Hitung
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
