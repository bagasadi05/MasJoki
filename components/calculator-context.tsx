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

interface CalculatorState {
  serviceId: ServiceId;
  mode: Mode;
  setMode: (mode: Mode) => void;
  setServiceId: (id: ServiceId) => void;
  /** Pilih layanan dari daftar harga, lalu antar ke kalkulator. */
  pilihLayanan: (id: ServiceId) => void;
}

const CalculatorContext = createContext<CalculatorState | null>(null);

export function scrollKeKalkulator(id?: ServiceId) {
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
    window.location.href = id ? `/hitung?layanan=${id}` : "/hitung";
  }
}

export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serviceId, setServiceId] = useState<ServiceId>("parafrase");
  const [mode, setMode] = useState<Mode>("hitung");

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
  }, []);

  const pilihLayanan = useCallback((id: ServiceId) => {
    setServiceId(id);
    if (id === "turnitin_ai") {
      setMode("penawaran");
    } else {
      setMode("hitung");
    }
    scrollKeKalkulator(id);
  }, []);

  const value = useMemo(
    () => ({ serviceId, mode, setMode, setServiceId, pilihLayanan }),
    [serviceId, mode, pilihLayanan],
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
