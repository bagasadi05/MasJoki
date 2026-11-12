"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  signInWithPasswordAction,
  signUpWithPasswordAction,
} from "@/app/auth/actions";

type AuthMode = "signin" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage(null);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setMessage(null);
    setError(null);

    try {
      const result =
        mode === "signin"
          ? await signInWithPasswordAction(email, password)
          : await signUpWithPasswordAction(email, password, confirmPassword);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.requiresEmailConfirmation) {
        setMessage("Akun berhasil dibuat. Cek email kamu untuk konfirmasi sebelum masuk.");
        return;
      }

      router.replace("/humanizer");
      router.refresh();
    } catch {
      setError("Koneksi ke layanan login gagal. Silakan coba lagi.");
    } finally {
      setIsSending(false);
    }
  }

  const isSignUp = mode === "signup";

  return (
    <main id="konten" className="min-h-dvh bg-paper px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <Link
          href="/humanizer"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted transition hover:text-brand"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Humanizer
        </Link>

        <section className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-xs dark:bg-card sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20">
              <ShieldCheck className="size-6" />
            </div>
            <div className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand">
              Saldo aman di akun
            </div>
          </div>

          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-wider text-brand">
            Akun Mas Joki
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">
            {isSignUp ? "Buat akun baru" : "Masuk ke akun"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {isSignUp
              ? "Daftar dengan email supaya saldo token tetap tersimpan saat berganti perangkat."
              : "Masuk untuk memakai saldo token dan melanjutkan humanizer."}
          </p>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-paper-2 p-1" role="tablist" aria-label="Mode akun">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignUp}
              onClick={() => switchMode("signin")}
              className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${
                !isSignUp ? "bg-white text-brand shadow-xs dark:bg-card" : "text-muted hover:text-ink"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignUp}
              onClick={() => switchMode("signup")}
              className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${
                isSignUp ? "bg-white text-brand shadow-xs dark:bg-card" : "text-muted hover:text-ink"
              }`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="auth-email" className="mb-1.5 block text-xs font-bold text-ink">
                Alamat email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@email.com…"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-line bg-paper px-10 py-3 text-sm text-ink outline-hidden focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1.5 block text-xs font-bold text-ink">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isSignUp ? "Minimal 8 karakter…" : "Masukkan password…"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-line bg-paper px-10 py-3 text-sm text-ink outline-hidden focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="auth-confirm-password" className="mb-1.5 block text-xs font-bold text-ink">
                  Ulangi password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input
                    id="auth-confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Ulangi password…"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-line bg-paper px-10 py-3 text-sm text-ink outline-hidden focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-3 text-xs font-semibold text-rose-800" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-3 text-xs font-semibold text-emerald-800" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSending || !email.trim() || !password}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="size-4" />
              {isSending ? "Memproses…" : isSignUp ? "Daftar dengan Email" : "Masuk dengan Email"}
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
            Password diproses oleh Supabase Auth dan tidak disimpan oleh aplikasi Mas Joki.
          </p>
        </section>
      </div>
    </main>
  );
}
