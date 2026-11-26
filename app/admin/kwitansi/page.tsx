import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { signOutAction } from "@/app/auth/actions";
import { getPenggunaAuth, isEmailAdmin } from "@/lib/admin-auth";
import { AdminKwitansiForm } from "@/components/admin/admin-kwitansi-form";
import { ArrowLeft, ReceiptText } from "lucide-react";

export const metadata: Metadata = {
  title: "Buat Kwitansi Custom",
  robots: { index: false, follow: false },
};

// Halaman membaca session (cookies) untuk guard admin, jadi tidak bisa
// di-prerender — sama seperti halaman dynamic lain di proyek ini.
export const instant = false;

/**
 * Halaman khusus pengelola untuk mencetak kwitansi custom (rincian diisi
 * manual). Guard dua lapis: belum login → redirect ke /auth/sign-in; sudah
 * login tapi email tidak ada di ADMIN_EMAILS → 404 (tidak membocorkan halaman
 * ini ada). Route POST /admin/kwitansi/buat memeriksa lagi di server.
 */
export default async function AdminKwitansiPage() {
  const pengguna = await getPenggunaAuth();
  if (!pengguna) redirect("/auth/sign-in");
  if (!isEmailAdmin(pengguna.email)) notFound();

  return (
    <main id="konten" className="min-h-dvh bg-paper px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted transition hover:text-brand"
          >
            <ArrowLeft className="size-4" />
            Kembali ke beranda
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-bold text-ink-soft transition hover:bg-paper-2 hover:text-ink"
            >
              Keluar
            </button>
          </form>
        </div>

        <section className="mt-8 rounded-3xl border border-line bg-card p-6 shadow-xs sm:p-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20">
            <ReceiptText className="size-6" />
          </div>

          <p className="mt-5 font-mono text-[0.7rem] font-semibold text-muted">
            Khusus pengelola · {pengguna.email}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">
            Buat kwitansi custom
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Isi rincian secara manual untuk pesanan di luar kalkulator harga — misalnya
            paket negosiasi atau koreksi harga. Kwitansi yang tercetak tetap bertulis
            sebagai dokumen estimasi, bukan bukti pembayaran.
          </p>

          <AdminKwitansiForm />
        </section>
      </div>
    </main>
  );
}
