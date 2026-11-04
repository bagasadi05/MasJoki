import Link from "next/link";
import { MenuSeluler } from "./menu-seluler";
import { navigasi } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Mas Joki, kembali ke atas"
        >
          <span className="grid size-8 -rotate-3 place-items-center rounded-[3px] border-2 border-brand bg-brand-soft font-display text-[0.8rem] font-bold text-brand">
            MJ
          </span>
          <span className="font-display text-lg tracking-tight text-ink">
            Mas Joki
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-7">
            {navigasi.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[0.84rem] text-ink-soft transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#hitung"
            className="rounded-md border border-ink px-3.5 py-3 text-[0.78rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper sm:px-3.5 sm:py-2 sm:text-[0.8rem]"
          >
            Hitung biaya
          </Link>
          <MenuSeluler items={navigasi} />
        </div>
      </div>
    </header>
  );
}
