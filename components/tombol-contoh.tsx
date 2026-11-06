"use client";

import { ArrowRight } from "lucide-react";
import { useCalculator } from "./calculator-context";
import type { ServiceId } from "@/lib/services";

export function TombolContoh({
  serviceId,
  qty,
  deadlineId,
}: {
  serviceId: ServiceId;
  qty?: number;
  deadlineId?: string;
}) {
  const { pilihLayanan } = useCalculator();

  return (
    <button
      type="button"
      onClick={() => pilihLayanan(serviceId, qty, deadlineId)}
      className="mt-3.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand transition-colors hover:text-brand-dark cursor-pointer"
    >
      <span>Coba hitung tugas ini</span>
      <ArrowRight className="size-3.5" />
    </button>
  );
}
