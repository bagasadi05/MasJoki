"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { navigasi } from "@/lib/nav";
import { pembayaran, waLink } from "@/lib/site";

const waAdmin = waLink(
  "Halo Mas Joki, saya mau tanya dulu sebelum pesan.",
);

export function MenuSeluler({
  items,
}: {
  items: typeof navigasi;
}) {
  const [buka, setBuka] = useState(false);
  const tombolRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buka) return;

    // Fokuskan tautan pertama supaya pengguna keyboard tidak tersesat.
    const tautanPertama =
      panelRef.current?.querySelector<HTMLElement>("a, button");
    tautanPertama?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setBuka(false);
      tombolRef.current?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        tombolRef.current?.contains(target)
      ) {
        return;
      }
      setBuka(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [buka]);

  return (
    <div className="md:hidden">
      <button
        ref={tombolRef}
        type="button"
        aria-expanded={buka}
        aria-controls="menu-seluler"
        aria-label={buka ? "Tutup menu" : "Buka menu"}
        onClick={() => setBuka((nilai) => !nilai)}
        className="grid size-11 place-items-center rounded-md border border-line bg-white text-ink-soft transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="size-5"
        >
          {buka ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {buka ? (
        <div
          ref={panelRef}
          id="menu-seluler"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-paper shadow-[0_24px_40px_-30px_rgba(16,26,51,0.5)]"
        >
          <nav aria-label="Navigasi seluler" className="mx-auto max-w-6xl px-5 sm:px-8">
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setBuka(false)}
                    className="flex items-center justify-between py-3.5 text-[0.9rem] text-ink-soft transition-colors hover:text-brand"
                  >
                    {item.label}
                    <span aria-hidden className="text-muted">
                      →
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/jasa"
                  onClick={() => setBuka(false)}
                  className="flex items-center justify-between py-3.5 text-[0.9rem] text-ink-soft transition-colors hover:text-brand"
                >
                  Semua layanan
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </Link>
              </li>
            </ul>

            <div className="py-4">
              <p className="text-[0.72rem] leading-relaxed text-muted">
                Pembayaran {pembayaran.metode.join(" · ")} ke{" "}
                <span className="font-mono tabular-nums text-ink-soft">
                  {pembayaran.nomor}
                </span>
              </p>
              <a
                href={waAdmin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setBuka(false)}
                className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-[0.84rem] font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Tanya admin di WhatsApp
                <span aria-hidden>↗</span>
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
