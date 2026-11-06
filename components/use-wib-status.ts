"use client";

import { useEffect, useState } from "react";
import { getEstimatedDateRange, isWibOperational } from "@/lib/time";

export function useWibStatus() {
  const [isOpen, setIsOpen] = useState(true); // Default optimis (07.00 - 23.00)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOpen(isWibOperational());

    const timer = setInterval(() => {
      setIsOpen(isWibOperational());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return { isOpen, mounted };
}

/**
 * Hook client-side untuk menghitung rentang tanggal kalender target selesai.
 * Menghindari pemanggilan new Date() saat static prerender Next.js.
 */
export function useEstimatedDateRange(deadlineId: string): string {
  const [range, setRange] = useState("");

  useEffect(() => {
    setRange(getEstimatedDateRange(deadlineId));
  }, [deadlineId]);

  return range;
}
