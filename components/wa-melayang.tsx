"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { waLink, waPesanUmum } from "@/lib/site";

/**
 * Tombol WhatsApp melayang dengan Maskot Mas Joki:
 * Otomatis bersembunyi saat area form kalkulator, pembayaran, CTA bawah, atau footer terlihat
 * agar tidak menutupi tombol aksi utama (TUGAS 13f).
 */
export function WaMelayang() {
  const [sembunyi, setSembunyi] = useState(false);

  useEffect(() => {
    const bagian = document.querySelectorAll("#hitung, #bayar, #cta-bawah, footer");
    if (bagian.length === 0) return;

    const pengamat = new IntersectionObserver(
      (entries) => {
        setSembunyi(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );

    bagian.forEach((el) => pengamat.observe(el));
    return () => pengamat.disconnect();
  }, []);

  return (
    <a
      href={waLink(waPesanUmum)}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-[max(1.2rem,env(safe-area-inset-bottom))] right-4 z-50 hidden lg:inline-flex items-center gap-2.5 rounded-full border border-mint/25 bg-white/95 p-1.5 pr-4 text-sm font-bold text-ink shadow-lg shadow-mint/15 backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-mint/40 hover:shadow-xl hover:shadow-mint/20 active:translate-y-0 sm:bottom-[max(1.8rem,env(safe-area-inset-bottom))] sm:right-6 ${
        sembunyi
          ? "pointer-events-none translate-y-3 opacity-0"
          : "translate-y-0 opacity-100"
      } print:hidden`}
      aria-hidden={sembunyi}
      tabIndex={sembunyi ? -1 : undefined}
      aria-label="Chat Mas Joki di WhatsApp (buka tab baru)"
    >
      {/* 3D Mascot Avatar */}
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-mint/25 bg-mint-soft shadow-2xs">
        <Image
          src="/mas-joki.jpg"
          alt="Mas Joki Avatar"
          width={32}
          height={32}
          className="size-full object-cover object-top"
          priority
        />
        <span className="absolute bottom-0 right-0 size-2 rounded-full border border-white bg-mint" />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-ink leading-none">
          Chat Mas Joki
        </span>
        <span className="text-xs font-semibold text-mint leading-tight">
          Online 07:00 – 23:00
        </span>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-4 text-[#25D366] ml-1 shrink-0"
        fill="currentColor"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>
    </a>
  );
}
