"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  /** Sudut maksimum dalam derajat. */
  maks?: number;
  className?: string;
}

/**
 * Membuat bidang terasa seperti kertas: mengikuti pointer beberapa derajat,
 * lalu kembali datar saat pointer keluar. Nonaktif untuk perangkat sentuh
 * dan pengguna yang meminta gerak dikurangi.
 */
export function Tilt({ children, maks = 5, className = "" }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const terakhir = useRef(0);

  const nonaktif = () =>
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches);

  const geser = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || nonaktif()) return;

    const sekarang = performance.now();
    if (sekarang - terakhir.current < 16) return;
    terakhir.current = sekarang;

    const kotak = el.getBoundingClientRect();
    const x = (e.clientX - kotak.left) / kotak.width - 0.5;
    const y = (e.clientY - kotak.top) / kotak.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * maks).toFixed(2)}deg) rotateY(${(x * maks).toFixed(2)}deg)`;
  };

  const datar = () => {
    terakhir.current = 0;
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={geser}
      onPointerLeave={datar}
      className={`transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
