import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { adminAktif, sudahMasuk } from "@/lib/auth";
import { masuk } from "./actions";

export const metadata: Metadata = {
  title: "Masuk admin",
  robots: { index: false, follow: false },
};

export const instant = false;

const PESAN: Record<string, string> = {
  salah: "Password tidak cocok.",
  nonaktif:
    "ADMIN_PASSWORD belum diset atau kurang dari 8 karakter. Isi di .env.local lalu restart server.",
};

export default async function HalamanMasuk({
  searchParams,
}: {
  searchParams: Promise<{ galat?: string }>;
}) {
  if (await sudahMasuk()) redirect("/admin");

  const { galat } = await searchParams;
  const pesan = galat ? PESAN[galat] : undefined;

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 -rotate-3 place-items-center rounded-[3px] border-2 border-brand bg-brand-soft font-display text-[0.8rem] font-bold text-brand">
            MJ
          </span>
          <span className="font-display text-lg tracking-tight text-ink">
            Mas Joki
          </span>
        </Link>

        <h1 className="mt-8 font-display text-2xl tracking-tight text-ink">
          Masuk admin
        </h1>
        <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
          Halaman ini untuk mengubah status pesanan. Tidak terhubung ke akun
          pelanggan.
        </p>

        <form action={masuk} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[0.78rem] font-semibold text-ink"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              autoFocus
              className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand focus:outline-none"
            />
          </div>

          {pesan ? (
            <p
              role="alert"
              className="rounded-md border border-red-300 bg-red-50 px-3.5 py-2.5 text-[0.8rem] leading-relaxed text-red-800"
            >
              {pesan}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!adminAktif()}
            className="w-full rounded-md bg-brand px-5 py-3 text-[0.88rem] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Masuk
          </button>
        </form>

        <p className="mt-6 text-[0.74rem] leading-relaxed text-muted">
          Setel <code className="font-mono">ADMIN_PASSWORD</code> di{" "}
          <code className="font-mono">.env.local</code>. Minimal 8 karakter.
        </p>
      </div>
    </main>
  );
}
