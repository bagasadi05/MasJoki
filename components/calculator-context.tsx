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

export function scrollKeKalkulator() {
  const target = document.getElementById("hitung");
  if (!target) return;
  const kurangiGerak = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: kurangiGerak ? "auto" : "smooth",
    block: "start",
  });
}

export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serviceId, setServiceId] = useState<ServiceId>("parafrase");
  const [mode, setMode] = useState<Mode>("hitung");

  // Halaman layanan menaut ke /?layanan=makalah#hitung supaya kalkulator
  // langsung terbuka pada layanan yang sedang dibaca.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const layanan = params.get("layanan");
    if (layanan && SERVICES.some((service) => service.id === layanan)) {
      // Sinkronisasi awal dari URL setelah hidrasi. Sengaja bukan state turunan:
      // server tidak boleh membaca query string agar halaman tetap statis.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setServiceId(layanan as ServiceId);
    }

    if (params.get("mode") === "penawaran") {
      setMode("penawaran");
    }
  }, []);

  const pilihLayanan = useCallback((id: ServiceId) => {
    setServiceId(id);
    setMode("hitung");
    scrollKeKalkulator();
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

export function useCalculator(): CalculatorState {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator harus dipakai di dalam CalculatorProvider");
  }
  return context;
}
