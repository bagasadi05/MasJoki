"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { getCurrentUserAction, signOutAction } from "@/app/auth/actions";
import type { AuthUserSummary } from "@/app/auth/actions";
import { MenuSeluler } from "./menu-seluler";
import { ThemeToggle } from "./theme-toggle";
import { useWibStatus } from "./use-wib-status";
import { lacak } from "@/lib/analytics";
import { navigasi } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();
  const { isOpen } = useWibStatus();
  const [currentUser, setCurrentUser] = useState<AuthUserSummary | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getCurrentUserAction()
      .then((user) => setCurrentUser(user))
      .catch(() => setCurrentUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Brand Logo & Mascot Avatar */}
        <div className="flex min-w-max shrink-0 items-center gap-3">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 transition-transform duration-150 hover:scale-[1.02]"
            aria-label="Mas Joki, beranda"
          >
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full border-2 border-brand/30 bg-brand-soft shadow-xs ring-2 ring-card">
              <Image
                src="/mas-joki.jpg"
                alt="Avatar Mas Joki"
                width={40}
                height={40}
                className="size-full object-cover object-top"
                priority
              />
              <span className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card ${isOpen ? "bg-mint" : "bg-amber"}`} />
            </div>

            <div className="flex flex-col">
              <span className="font-display text-[1.22rem] font-bold tracking-tight text-ink leading-tight">
                Mas Joki
              </span>
              <span className="hidden font-mono text-xs font-medium text-slate-500 xl:inline-block">
                Asisten Akademik Transparan
              </span>
            </div>
          </Link>

          {/* Status badge operasional WIB */}
          <span
            className={`hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold md:inline-flex shadow-2xs ${
              isOpen
                ? "border-mint/25 bg-mint-soft/90 text-mint"
                : "border-amber/25 bg-amber-soft/90 text-amber"
            }`}
          >
            <span
              className={`inline-flex size-1.5 rounded-full ${
                isOpen ? "bg-mint" : "bg-amber"
              }`}
            />
            {isOpen ? "Mas Joki Online" : "Luar Jam Kerja (Buka 07.00)"}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav aria-label="Navigasi utama" className="hidden shrink-0 lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {navigasi.map((item) => {
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
                    className={`whitespace-nowrap rounded-xl px-3 py-2 text-[0.86rem] font-bold transition xl:px-3.5 ${
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
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          {!authLoading && currentUser ? (
            <form action={signOutAction} className="hidden items-center gap-2 md:flex">
              <span
                className="max-w-28 truncate text-xs font-semibold text-muted"
                title={currentUser.email ?? currentUser.name}
              >
                Hai, {currentUser.name}
              </span>
              <button
                type="submit"
                className="cursor-pointer whitespace-nowrap rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-bold text-ink transition hover:border-brand/40 dark:bg-card"
              >
                Keluar
              </button>
            </form>
          ) : !authLoading ? (
            <Link
              href="/auth/sign-in"
              className="inline-flex shrink-0 cursor-pointer items-center whitespace-nowrap rounded-xl bg-ink px-3 py-2.5 text-xs font-bold text-white transition hover:bg-ink/90"
            >
              <span className="sm:hidden">Masuk</span>
              <span className="hidden sm:inline">Masuk Email</span>
            </Link>
          ) : null}
          <Link
            href="/hitung"
            onClick={() => lacak("cta_hitung", { lokasi: "header" })}
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-brand px-4 py-2.5 text-[0.82rem] font-bold text-white shadow-sm shadow-brand/25 transition duration-150 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md hover:shadow-brand/30 active:translate-y-0 sm:inline-flex"
          >
            <Calculator className="size-3.5" />
            <span>Hitung Biaya</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <MenuSeluler items={navigasi} />
        </div>
      </div>
    </header>
  );
}
