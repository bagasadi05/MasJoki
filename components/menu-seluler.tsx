"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ExternalLink, Menu, X } from "lucide-react";
import type { navigasi } from "@/lib/nav";
import { pembayaran, waLink } from "@/lib/site";

const waAdmin = waLink(
  "Halo Mas Joki, saya mau tanya soal biaya tugas saya.",
);

export function MenuSeluler({
  items,
}: {
  items: typeof navigasi;
}) {
  const [buka, setBuka] = useState(false);
  const pathname = usePathname();
  const tombolRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buka) return;

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
    <div className="lg:hidden">
      <button
        ref={tombolRef}
        type="button"
        aria-expanded={buka}
        aria-controls="menu-seluler"
        aria-label={buka ? "Tutup menu" : "Buka menu"}
        onClick={() => setBuka((nilai) => !nilai)}
        className="grid size-10 place-items-center rounded-xl border border-line bg-white text-ink-soft transition-colors hover:border-line-strong hover:text-ink cursor-pointer"
      >
        {buka ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </button>

      {buka ? (
        <div
          ref={panelRef}
          id="menu-seluler"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-paper shadow-2xl animate-fade-in"
        >
          <nav aria-label="Navigasi seluler" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <ul className="divide-y divide-line">
              {items.map((item) => {
                const aktif =
                  item.href === "/"
                    ? pathname === "/"
                    : item.href === "/cara-kerja"
                      ? pathname.startsWith("/cara-kerja") || pathname.startsWith("/faq")
                      : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={aktif ? "page" : undefined}
                      onClick={() => setBuka(false)}
                      className={`flex items-center justify-between py-3.5 text-[0.92rem] font-bold transition-colors ${
                        aktif
                          ? "text-brand"
                          : "text-ink-soft hover:text-brand"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="size-4 text-muted" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 border-t border-line pt-4">
              <p className="text-xs leading-relaxed text-slate-600">
                Pembayaran resmi {pembayaran.metode.join(" · ")} ke{" "}
                <span className="font-mono font-bold text-ink">
                  {pembayaran.nomor}
                </span>{" "}
                (a.n. Mas Joki)
              </p>
              <a
                href={waAdmin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setBuka(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-[0.86rem] font-bold text-white shadow-md shadow-brand/20 transition-colors hover:bg-brand-dark"
              >
                <span>Tanya Mas Joki di WhatsApp</span>
                <ExternalLink className="size-3.5 opacity-70" />
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
