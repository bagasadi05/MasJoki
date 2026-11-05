"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Calculator } from "lucide-react";
import { MenuSeluler } from "./menu-seluler";
import { navigasi } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Brand Logo & Mascot Avatar */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform duration-150 hover:scale-[1.02]"
            aria-label="Mas Joki, beranda"
          >
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full border-2 border-brand/30 bg-brand-soft shadow-xs ring-2 ring-white">
              <Image
                src="/mas-joki.jpg"
                alt="Avatar Mas Joki"
                width={40}
                height={40}
                className="size-full object-cover object-top"
                priority
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-mint" />
            </div>

            <div className="flex flex-col">
              <span className="font-display text-[1.22rem] font-bold tracking-tight text-ink leading-tight">
                Mas Joki
              </span>
              <span className="hidden font-mono text-[0.62rem] font-medium text-muted sm:inline-block">
                Asisten Akademik Transparan
              </span>
            </div>
          </Link>

          {/* Status badge online */}
          <span className="hidden items-center gap-1.5 rounded-full border border-mint/25 bg-mint-soft/90 px-2.5 py-0.5 text-[0.7rem] font-bold text-mint md:inline-flex">
            <span className="size-1.5 rounded-full bg-mint " />
            Admin Online
          </span>
        </div>

        {/* Desktop Nav */}
        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-1 lg:gap-1.5">
            {navigasi.map((item) => {
              const aktif =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-xl px-3.5 py-2 text-[0.86rem] font-bold transition-all ${
                      aktif
                        ? "bg-brand-soft text-brand shadow-2xs"
                        : "text-ink-soft hover:bg-paper-2 hover:text-brand"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA & Mobile Trigger */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/hitung"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-[0.82rem] font-bold text-white shadow-sm shadow-brand/25 transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md hover:shadow-brand/30 active:translate-y-0"
          >
            <Calculator className="size-3.5" />
            <span>Hitung Biaya</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <MenuSeluler items={navigasi} />
        </div>
      </div>
      <div aria-hidden className="pita h-[3px]" />
    </header>
  );
}
