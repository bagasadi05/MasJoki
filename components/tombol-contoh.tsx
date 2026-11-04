"use client";

import { useCalculator } from "./calculator-context";
import type { ServiceId } from "@/lib/services";

export function TombolContoh({ serviceId }: { serviceId: ServiceId }) {
  const { pilihLayanan } = useCalculator();

  return (
    <button
      type="button"
      onClick={() => pilihLayanan(serviceId)}
      className="mt-3.5 inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-brand transition-colors hover:text-brand-dark"
    >
      <span>Coba hitung tugas ini</span>
      <span aria-hidden>→</span>
    </button>
  );
}
