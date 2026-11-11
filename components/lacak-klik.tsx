"use client";

import type { ReactNode } from "react";
import { lacak, type NamaEvent } from "@/lib/analytics";

/**
 * Pembungkus tipis untuk tautan di server component: klik tetap ditangani
 * tautan aslinya, sementara event analytics ikut terkirim lewat bubbling.
 * `contents` membuat pembungkus ini tidak menghasilkan kotak layout.
 */
export function LacakKlik({
  nama,
  data,
  children,
}: {
  nama: NamaEvent;
  data?: Record<string, string | number | boolean>;
  children: ReactNode;
}) {
  return (
    <span className="contents" onClick={() => lacak(nama, data)}>
      {children}
    </span>
  );
}
