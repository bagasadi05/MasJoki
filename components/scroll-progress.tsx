"use client";

import { useEffect, useRef } from "react";

/**
 * Garis progres baca di tepi atas halaman. Hanya mengubah scaleX, tidak
 * memicu layout. Throttle memakai timestamp supaya tetap jalan walau
 * requestAnimationFrame dijeda (tab background / mode hemat daya).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const terakhir = useRef(0);

  useEffect(() => {
    const perbarui = () => {
      const doc = document.documentElement;
      const sisa = doc.scrollHeight - window.innerHeight;
      const progres = sisa > 0 ? Math.min(1, Math.max(0, window.scrollY / sisa)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progres.toFixed(4)})`;
      }
    };

    const onScroll = () => {
      const sekarang = performance.now();
      if (sekarang - terakhir.current < 16) return;
      terakhir.current = sekarang;
      perbarui();
    };

    perbarui();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent print:hidden"
    >
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-brand"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
