"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SERVICES, type ServiceId } from "@/lib/services";

type Mode = "hitung" | "penawaran";

export interface EstimasiRingkas {
  total: number;
  label: string;
  qtyLabel?: string;
}

interface CalculatorState {
  serviceId: ServiceId;
  mode: Mode;
  setMode: (mode: Mode) => void;
  setServiceId: (id: ServiceId) => void;
  /** Pilih layanan dari daftar harga, lalu antar ke kalkulator. */
  pilihLayanan: (id: ServiceId, qty?: number, deadlineId?: string) => void;
  estimasiRingkas: EstimasiRingkas | null;
  setEstimasiRingkas: (est: EstimasiRingkas | null) => void;
  preselectedQty: number | null;
  preselectedDeadline: string | null;
}

const CalculatorContext = createContext<CalculatorState | null>(null);

export function scrollKeKalkulator(
  id?: ServiceId,
  qty?: number,
  deadlineId?: string,
) {
  const target =
    document.getElementById("hitung") ||
    document.getElementById("kalkulator-area");

  if (target) {
    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: kurangiGerak ? "auto" : "smooth",
      block: "start",
    });
    document.getElementById("judul-hitung")?.focus({ preventScroll: true });
  } else if (typeof window !== "undefined") {
    const params = new URLSearchParams();
    if (id) params.set("layanan", id);
    if (qty !== undefined) params.set("jumlah", String(qty));
    if (deadlineId !== undefined) params.set("tenggat", deadlineId);
    const queryString = params.toString();
    window.location.href = queryString ? `/hitung?${queryString}` : "/hitung";
  }
}

export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serviceId, setServiceId] = useState<ServiceId>("parafrase");
  const [mode, setMode] = useState<Mode>("hitung");
  const [estimasiRingkas, setEstimasiRingkas] = useState<EstimasiRingkas | null>(
    null,
  );
  const [preselectedQty, setPreselectedQty] = useState<number | null>(null);
  const [preselectedDeadline, setPreselectedDeadline] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const layanan = params.get("layanan");
    if (layanan && SERVICES.some((service) => service.id === layanan)) {
      setServiceId(layanan as ServiceId);
      if (layanan === "turnitin_ai") {
        setMode("penawaran");
      }
    }

    if (params.get("mode") === "penawaran" || params.get("tab") === "penawaran") {
      setMode("penawaran");
    }

    const jumlah = params.get("jumlah") || params.get("qty");
    if (jumlah && !isNaN(Number(jumlah))) {
      setPreselectedQty(Number(jumlah));
    }

    const tenggat = params.get("tenggat") || params.get("deadline");
    if (tenggat) {
      setPreselectedDeadline(tenggat);
    }
  }, []);

  const pilihLayanan = useCallback(
    (id: ServiceId, qty?: number, deadlineId?: string) => {
      setServiceId(id);
      if (id === "turnitin_ai") {
        setMode("penawaran");
      } else {
        setMode("hitung");
      }
      if (qty !== undefined) {
        setPreselectedQty(qty);
      }
      if (deadlineId !== undefined) {
        setPreselectedDeadline(deadlineId);
      }
      scrollKeKalkulator(id, qty, deadlineId);
    },
    [],
  );

  const value = useMemo(
    () => ({
      serviceId,
      mode,
      setMode,
      setServiceId,
      pilihLayanan,
      estimasiRingkas,
      setEstimasiRingkas,
      preselectedQty,
      preselectedDeadline,
    }),
    [
      serviceId,
      mode,
      pilihLayanan,
      estimasiRingkas,
      preselectedQty,
      preselectedDeadline,
    ],
  );

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useOptionalCalculator(): CalculatorState | null {
  return useContext(CalculatorContext);
}

export function useCalculator(): CalculatorState {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator harus dipakai di dalam CalculatorProvider");
  }
  return context;
}
