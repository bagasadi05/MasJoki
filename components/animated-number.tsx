"use client";

import { useEffect, useRef } from "react";
import { rupiah } from "@/lib/format";

interface AnimatedPriceProps {
  value: number;
  className?: string;
  format?: (val: number) => string;
}

/**
 * Komponen animasi angka mata uang yang berputar halus saat nilai berubah.
 * Memperbarui textContent langsung via DOM ref untuk performa 60 FPS tanpa cascading render.
 */
export function AnimatedPrice({
  value,
  className = "",
  format = rupiah,
}: AnimatedPriceProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const kurangiGerak =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startValue = prevValueRef.current;
    const endValue = value;
    const diff = endValue - startValue;

    if (kurangiGerak || diff === 0) {
      el.textContent = format(value);
      prevValueRef.current = value;
      return;
    }

    const duration = 350;
    const startTime = performance.now();
    let animId: number;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startValue + diff * easeProgress);

      if (el) {
        el.textContent = format(currentVal);
      }

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        if (el) el.textContent = format(endValue);
        prevValueRef.current = endValue;
      }
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [value, format]);

  return (
    <span ref={spanRef} className={className}>
      {format(value)}
    </span>
  );
}
