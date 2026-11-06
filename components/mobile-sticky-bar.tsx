"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator } from "lucide-react";
import { useOptionalCalculator } from "./calculator-context";
import { rupiah } from "@/lib/format";
import { waLink, waPesanUmum } from "@/lib/site";

export function MobileStickyBar() {
  const pathname = usePathname();
  const calc = useOptionalCalculator();

  // Jangan tampilkan di halaman wizard order khusus karena sudah punya sticky bar wizard tersendiri
  if (pathname?.includes("/order")) {
    return null;
  }

  const isHitungPage = pathname === "/hitung";
  const estimasi = calc?.estimasiRingkas;
  const targetHitungUrl = calc?.serviceId
    ? `/hitung?layanan=${calc.serviceId}`
    : "/hitung";

  return (
    <div
      role="region"
      aria-label="Aksi cepat seluler"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-white/95 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] backdrop-blur-md shadow-2xl lg:hidden print:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        {/* Sisi Kiri: Estimasi singkat atau identitas Mas Joki */}
        <div className="min-w-0 flex-1">
          {estimasi ? (
            <div>
              <p className="truncate text-xs font-semibold text-slate-600">
                {estimasi.label}
                {estimasi.qtyLabel ? ` (${estimasi.qtyLabel})` : ""}
              </p>
              <p className="font-display text-base font-bold text-brand leading-tight tabular-nums">
                {rupiah(estimasi.total)}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-display text-sm font-bold text-ink leading-tight">
                Mas Joki
              </p>
              <p className="text-xs font-medium text-slate-500 truncate">
                Harga transparan di awal
              </p>
            </div>
          )}
        </div>

        {/* Sisi Kanan: TEPAT DUA AKSI (Hitung Biaya & Chat WhatsApp) */}
        <div className="flex shrink-0 items-center gap-2">
          {isHitungPage ? (
            <a
              href="#kalkulator-area"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
            >
              <Calculator className="size-3.5" />
              <span>Hitung Biaya</span>
            </a>
          ) : (
            <Link
              href={targetHitungUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
            >
              <Calculator className="size-3.5" />
              <span>Hitung Biaya</span>
            </Link>
          )}

          <a
            href={waLink(waPesanUmum)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#25D366]/35 bg-[#25D366]/10 px-3.5 py-2 text-xs font-bold text-[#166534] shadow-xs transition-transform active:scale-95 hover:bg-[#25D366]/20"
            aria-label="Chat WhatsApp Mas Joki"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-3.5 text-[#25D366] shrink-0"
              fill="currentColor"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
            </svg>
            <span>Chat</span>
          </a>
        </div>
      </div>
    </div>
  );
}
