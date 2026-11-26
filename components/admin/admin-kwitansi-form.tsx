"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { FileText, Loader2, Plus, Trash2 } from "lucide-react";

import { lacak } from "@/lib/analytics";
import { rupiah } from "@/lib/format";

interface BarisForm {
  label: string;
  amount: string;
}

const BARIS_AWAL: BarisForm = { label: "", amount: "" };

const inputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-hidden focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "mb-1.5 block text-xs font-bold text-ink";

function errorText(message?: string) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300" role="alert">
      {message}
    </p>
  );
}

/**
 * Form kwitansi custom untuk pengelola. Validasi véges lewat zod di server
 * (POST /admin/kwitansi/buat); error per kolom dikembalikan sebagai
 * fieldErrors dan fokus pindah ke kolom pertama yang salah.
 */
export function AdminKwitansiForm() {
  const [judul, setJudul] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [kode, setKode] = useState("");
  const [catatan, setCatatan] = useState("");
  const [lines, setLines] = useState<BarisForm[]>([{ ...BARIS_AWAL }]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kodeHasil, setKodeHasil] = useState<string | null>(null);

  const total = useMemo(() => {
    return lines.reduce((acc, baris) => {
      const nilai = Number(baris.amount);
      return acc + (Number.isFinite(nilai) ? Math.trunc(nilai) : 0);
    }, 0);
  }, [lines]);

  // Fokus ke kolom pertama yang error dari server.
  useEffect(() => {
    const kunci = Object.keys(fieldErrors)[0];
    if (!kunci) return;
    const target = document.getElementById(
      kunci === "lines" ? "admin-lines-0-label" : `admin-${kunci}`,
    );
    target?.focus();
  }, [fieldErrors]);

  function bersihkanGalat(kunci: string) {
    setFieldErrors((prev) => {
      if (!(kunci in prev)) return prev;
      const baru = { ...prev };
      delete baru[kunci];
      return baru;
    });
  }

  function updateLine(index: number, patch: Partial<BarisForm>) {
    setLines((prev) => prev.map((baris, i) => (i === index ? { ...baris, ...patch } : baris)));
    bersihkanGalat("lines");
  }

  function tambahBaris() {
    setLines((prev) => [...prev, { ...BARIS_AWAL }]);
  }

  function hapusBaris(index: number) {
    setLines((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setKodeHasil(null);
    setFieldErrors({});

    const payload = {
      kode: kode.trim(),
      judul,
      name,
      whatsapp,
      catatan,
      lines: lines.map((baris) => ({ label: baris.label, amount: Number(baris.amount) })),
    };

    try {
      const res = await fetch("/admin/kwitansi/buat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
          fieldErrors?: Record<string, string>;
        } | null;
        if (data?.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data?.error ?? "Gagal membuat kwitansi. Coba lagi sebentar.");
      }

      const kodeHeader = res.headers.get("x-kode-kwitansi");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kwitansi-${kodeHeader ?? "mas-joki"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Jangan revoke langsung: Safari/Firefox bisa membatalkan unduhan.
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      if (kodeHeader) setKodeHasil(kodeHeader);
      lacak("poster_unduh", { jenis: "kwitansi_custom" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat kwitansi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-judul" className={labelClass}>
          Perihal kwitansi
        </label>
        <input
          id="admin-judul"
          value={judul}
          onChange={(event) => {
            setJudul(event.target.value);
            bersihkanGalat("judul");
          }}
          placeholder="mis. Paket makalah 10 halaman + revisi…"
          autoComplete="off"
          spellCheck={false}
          maxLength={120}
          className={inputClass}
        />
        {errorText(fieldErrors.judul)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="admin-name" className={labelClass}>
            Nama pemesan
          </label>
          <input
            id="admin-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              bersihkanGalat("name");
            }}
            placeholder="Nama lengkap…"
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
            className={inputClass}
          />
          {errorText(fieldErrors.name)}
        </div>
        <div>
          <label htmlFor="admin-whatsapp" className={labelClass}>
            Nomor WhatsApp
          </label>
          <input
            id="admin-whatsapp"
            value={whatsapp}
            onChange={(event) => {
              setWhatsapp(event.target.value);
              bersihkanGalat("whatsapp");
            }}
            placeholder="0812 3456 7890…"
            inputMode="tel"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
          />
          {errorText(fieldErrors.whatsapp)}
        </div>
      </div>

      <div>
        <label htmlFor="admin-kode" className={labelClass}>
          Kode kwitansi <span className="font-semibold text-muted">(opsional, kosong = otomatis)</span>
        </label>
        <input
          id="admin-kode"
          value={kode}
          onChange={(event) => {
            setKode(event.target.value);
            bersihkanGalat("kode");
          }}
          placeholder="MJ-20261114-AB12…"
          autoComplete="off"
          spellCheck={false}
          maxLength={20}
          className={`${inputClass} font-mono`}
        />
        {errorText(fieldErrors.kode)}
      </div>

      <fieldset>
        <legend className={`${labelClass} mb-2`}>Rincian biaya</legend>
        <div className="space-y-2.5">
          {lines.map((baris, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <label htmlFor={`admin-lines-${index}-label`} className="sr-only">
                  Uraian baris {index + 1}
                </label>
                <input
                  id={`admin-lines-${index}-label`}
                  value={baris.label}
                  onChange={(event) => updateLine(index, { label: event.target.value })}
                  placeholder={`Uraian ${index + 1}…`}
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={140}
                  className={inputClass}
                />
              </div>
              <div className="w-36 sm:w-44">
                <label htmlFor={`admin-lines-${index}-amount`} className="sr-only">
                  Nominal baris {index + 1} (rupiah, negatif = diskon)
                </label>
                <input
                  id={`admin-lines-${index}-amount`}
                  value={baris.amount}
                  onChange={(event) => updateLine(index, { amount: event.target.value })}
                  placeholder="0"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  className={`${inputClass} font-mono tabular-nums`}
                />
              </div>
              <button
                type="button"
                onClick={() => hapusBaris(index)}
                disabled={lines.length <= 1}
                aria-label={`Hapus baris ${index + 1}`}
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-paper text-muted transition hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
        {errorText(fieldErrors.lines)}
        <button
          type="button"
          onClick={tambahBaris}
          disabled={lines.length >= 20}
          className="mt-2.5 inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-line-strong px-3.5 py-2 text-xs font-bold text-ink-soft transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" aria-hidden />
          Tambah baris
        </button>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Nominal dalam rupiah; isi negatif untuk potongan/diskon. Total otomatis:{" "}
          <span className="font-mono font-bold text-ink">{rupiah(total)}</span>
        </p>
      </fieldset>

      <div>
        <label htmlFor="admin-catatan" className={labelClass}>
          Catatan <span className="font-semibold text-muted">(opsional)</span>
        </label>
        <textarea
          id="admin-catatan"
          value={catatan}
          onChange={(event) => {
            setCatatan(event.target.value);
            bersihkanGalat("catatan");
          }}
          placeholder="Catatan tambahan untuk pemesan…"
          autoComplete="off"
          spellCheck={false}
          maxLength={500}
          rows={3}
          className={`${inputClass} resize-y`}
        />
        {errorText(fieldErrors.catatan)}
      </div>

      {error && (
        <p
          className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-3 text-xs font-semibold text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
          role="alert"
        >
          {error}
        </p>
      )}
      {kodeHasil && (
        <p
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
          role="status"
        >
          Kwitansi terunduh. Kode: <span className="font-mono font-bold">{kodeHasil}</span>
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <FileText className="size-4" aria-hidden />
        )}
        <span>{loading ? "Membuat PDF…" : "Cetak Kwitansi (PDF)"}</span>
      </button>
    </form>
  );
}
