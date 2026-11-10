"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Sparkles,
  Check,
  Gift,
  MessageCircle,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { TOKEN_PACKAGES, getPackageWhatsAppUrl, STORAGE_KEYS } from "@/lib/humanizer/tokens";
import type { TokenPackage } from "@/lib/humanizer/types";
import { redeemVoucherAction } from "@/app/actions";
import { pembayaran } from "@/lib/site";

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onBalanceChange: (newBalance: number) => void;
  initialTab?: "buy" | "voucher";
}

export function TokenModal({
  isOpen,
  onClose,
  currentBalance,
  onBalanceChange,
  initialTab = "buy",
}: TokenModalProps) {
  const [tab, setTab] = useState<"buy" | "voucher">(initialTab);
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Sinkronkan tab dan pesan saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    setTab(initialTab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setVoucherCode("");
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle klaim voucher sekali pakai (terverifikasi langsung ke database Supabase)
  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!voucherCode.trim()) {
      setErrorMsg("Masukkan kode voucher terlebih dahulu.");
      return;
    }

    const code = voucherCode.trim().toUpperCase();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Cek di storage lokal terlebih dahulu sebagai filter cepat
    try {
      const rawClaimed = localStorage.getItem(STORAGE_KEYS.CLAIMED_VOUCHERS);
      const claimed: string[] = rawClaimed ? JSON.parse(rawClaimed) : [];
      if (claimed.includes(code)) {
        setErrorMsg("Kode voucher ini sudah pernah kamu klaim di perangkat ini.");
        return;
      }
    } catch {
      // Ignore localStorage read error
    }

    setLoading(true);

    try {
      // Verifikasi ke server action (cek database Supabase)
      const res = await redeemVoucherAction(code);
      setLoading(false);

      if (!res.ok || !res.tokens) {
        setErrorMsg(res.error || "Gagal memverifikasi kode voucher.");
        return;
      }

      if (typeof res.remainingWords !== "number") {
        setErrorMsg("Saldo berhasil diverifikasi, tetapi jumlah saldo belum diterima. Silakan coba lagi.");
        return;
      }

      const newBalance = res.remainingWords;
      try {
        const rawClaimed = localStorage.getItem(STORAGE_KEYS.CLAIMED_VOUCHERS);
        const claimed: string[] = rawClaimed ? JSON.parse(rawClaimed) : [];
        if (!claimed.includes(code)) {
          claimed.push(code);
          localStorage.setItem(STORAGE_KEYS.CLAIMED_VOUCHERS, JSON.stringify(claimed));
        }
      } catch {
        // Ignore localStorage write error
      }

      onBalanceChange(newBalance);
      setSuccessMsg(res.message || `Berhasil menambahkan ${res.tokens.toLocaleString("id-ID")} kata ke saldo kamu!`);
      setVoucherCode("");
    } catch (err: unknown) {
      setLoading(false);
      setErrorMsg(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem saat memproses voucher."
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs animate-fade-in print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="token-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-white dark:bg-card border border-line rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] overscroll-contain"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3
                id="token-modal-title"
                className="font-display font-bold text-base sm:text-lg text-ink"
              >
                Isi Ulang Saldo Token AI Humanizer
              </h3>
              <p className="text-xs text-muted">
                Saldo aktif saat ini:{" "}
                <span className="font-mono font-bold text-brand">
                  {currentBalance.toLocaleString("id-ID")} kata
                </span>
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="size-8 rounded-full border border-line bg-white dark:bg-slate-800 text-muted hover:text-ink flex items-center justify-center transition cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-line bg-paper-2/60 px-6 pt-2" role="tablist" aria-label="Pilihan saldo token">
          <button
            type="button"
            id="token-tab-buy"
            role="tab"
            aria-selected={tab === "buy"}
            aria-controls="token-panel-buy"
            onClick={() => {
              setTab("buy");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`cursor-pointer px-4 py-2.5 text-xs font-bold border-b-2 transition -mb-[1px] flex items-center gap-2 ${
              tab === "buy"
                ? "border-brand text-brand bg-white dark:bg-card rounded-t-xl"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <CreditCard className="size-3.5" />
            <span>Pilih Paket Token</span>
          </button>
          <button
            type="button"
            id="token-tab-voucher"
            role="tab"
            aria-selected={tab === "voucher"}
            aria-controls="token-panel-voucher"
            onClick={() => {
              setTab("voucher");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`cursor-pointer px-4 py-2.5 text-xs font-bold border-b-2 transition -mb-[1px] flex items-center gap-2 ${
              tab === "voucher"
                ? "border-brand text-brand bg-white dark:bg-card rounded-t-xl"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Gift className="size-3.5" />
            <span>Klaim Kode Voucher</span>
          </button>
        </div>

        {/* Content Body */}
        <div
          className="p-6 overflow-y-auto space-y-5"
          role="tabpanel"
          id={tab === "buy" ? "token-panel-buy" : "token-panel-voucher"}
          aria-labelledby={tab === "buy" ? "token-tab-buy" : "token-tab-voucher"}
        >
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs font-semibold" role="alert" aria-live="polite">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2" role="status" aria-live="polite">
              <Check className="size-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === "buy" ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {TOKEN_PACKAGES.map((pkg: TokenPackage) => (
                  <div
                    key={pkg.id}
                    className={`relative rounded-2xl border p-4.5 flex flex-col justify-between transition ${
                      pkg.popular
                        ? "border-brand bg-brand-soft/40 shadow-xs ring-1 ring-brand/30"
                        : "border-line bg-paper/60 hover:border-line-strong"
                    }`}
                  >
                    {pkg.badge && (
                      <span
                        className={`absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          pkg.popular
                            ? "bg-brand text-white shadow-xs"
                            : "bg-paper-2 text-ink-soft border border-line"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <h4 className="font-display font-bold text-base text-ink">{pkg.name}</h4>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="font-mono text-2xl font-extrabold text-ink">
                          Rp {pkg.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-brand mt-0.5">
                        {pkg.words.toLocaleString("id-ID")} kata naskah
                      </p>
                      <p className="text-xs text-muted mt-2 leading-relaxed">{pkg.description}</p>
                    </div>

                    <a
                      href={getPackageWhatsAppUrl(pkg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-xs active:scale-98 ${
                        pkg.popular
                          ? "bg-brand hover:bg-brand-dark text-white"
                          : "bg-white dark:bg-slate-800 border border-line hover:border-line-strong text-ink"
                      }`}
                    >
                      <MessageCircle className="size-3.5 text-emerald-500" />
                      <span>Beli via WhatsApp</span>
                    </a>
                  </div>
                ))}
              </div>

              {/* Info Pembayaran Resmi Mas Joki */}
              <div className="p-4 rounded-2xl border border-line bg-paper-2/70 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <ShieldCheck className="size-4 text-brand" />
                  <span>Metode Pembayaran Resmi Mas Joki</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Transfer E-Wallet ({pembayaran.metode.join(", ")}) ke nomor{" "}
                  <span className="font-mono font-bold text-ink">{pembayaran.nomor}</span> (a.n.{" "}
                  Bagas Adi Saputra / Mas Joki). Kirim bukti transfer di WhatsApp dan admin akan langsung
                  memberikan kode voucher sekali pakai untuk kamu klaim!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-brand/20 bg-brand-soft/40 text-xs text-ink-soft leading-relaxed">
                Punya kode voucher dari pembelian via WhatsApp atau voucher promo pengguna baru?
                Masukkan kodenya di bawah ini untuk mencairkan kuota kata AI Humanizer kamu.
                <div className="mt-1.5 text-[11px] text-muted">
                  ⚠️ <i>Catatan: Setiap kode voucher hanya bisa digunakan 1 kali dan langsung hangus setelah diklaim.</i>
                </div>
              </div>

              <form onSubmit={handleRedeem} className="space-y-3">
                <div>
                  <label htmlFor="voucher-code" className="block text-xs font-bold text-ink mb-1.5">
                    Kode Voucher (contoh: MJ-3K-XXXX-YYYY atau MASJOKIBARU)
                  </label>
                  <input
                    id="voucher-code"
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    name="voucherCode"
                    placeholder="Contoh: MJ-3K-8AF7-1A9A…"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-white dark:bg-slate-800 text-ink text-sm font-mono tracking-wider focus:outline-hidden focus:border-brand focus:ring-1 focus:ring-brand"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !voucherCode.trim()}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-brand hover:bg-brand-dark text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Sparkles className="size-3.5 animate-spin" />
                      <span>Memverifikasi Database…</span>
                    </>
                  ) : (
                    <>
                      <Gift className="size-3.5" />
                      <span>Klaim Voucher Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
