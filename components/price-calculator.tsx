"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { submitOrder, submitQuote } from "@/app/actions";
import { useCalculator } from "./calculator-context";
import { Nota } from "./nota";
import { angka, rupiah } from "@/lib/format";
import {
  computePrice,
  DEADLINES,
  DIFFICULTIES,
  type DeadlineId,
  type DifficultyId,
} from "@/lib/pricing";
import {
  BASIS_LABEL,
  getService,
  priceLabel,
  SERVICES,
  type ServiceId,
} from "@/lib/services";
import { pembayaran, site } from "@/lib/site";
import type { ActionResult } from "@/lib/types";

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors hover:border-line-strong focus:border-brand focus:outline-none";

const labelClass = "mb-1.5 block text-[0.78rem] font-semibold text-ink";

function defaultQtys(): Record<string, string> {
  return Object.fromEntries(
    SERVICES.map((service) => [service.id, String(service.defaultQty)]),
  );
}

export function PriceCalculator() {
  const { serviceId, setServiceId, mode, setMode } = useCalculator();
  const service = getService(serviceId);

  const [qtyInput, setQtyInput] = useState<Record<string, string>>(defaultQtys);
  const [deadlineId, setDeadlineId] = useState<DeadlineId>("normal");
  const [difficultyId, setDifficultyId] = useState<DifficultyId>("standar");
  const [quoteService, setQuoteService] = useState<ServiceId | "lainnya">(
    serviceId,
  );

  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const qtyMentah = Number(qtyInput[service.id] ?? service.defaultQty);
  const price = useMemo(
    () =>
      computePrice(
        service,
        Number.isFinite(qtyMentah) && qtyMentah > 0
          ? qtyMentah
          : service.defaultQty,
        deadlineId,
        difficultyId,
      ),
    [service, qtyMentah, deadlineId, difficultyId],
  );

  function ubahJumlah(value: string) {
    setQtyInput((prev) => ({ ...prev, [service.id]: value.replace(/\D/g, "") }));
  }

  function pilihLayananLain(id: ServiceId) {
    setServiceId(id);
    setQuoteService(id);
    setResult(null);
  }

  function kirim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const jawaban =
        mode === "hitung"
          ? await submitOrder(null, data)
          : await submitQuote(null, data);
      setResult(jawaban);
      if (jawaban.status === "ok") {
        form.reset();
        setQtyInput(defaultQtys());
      }
    });
  }

  if (result?.status === "ok") {
    return (
      <SuccessPanel
        result={result}
        mode={mode}
        serviceName={
          mode === "hitung"
            ? service.name
            : quoteService === "lainnya"
              ? "Tugas lain"
              : getService(quoteService).name
        }
        total={mode === "hitung" ? price.total : null}
        onReset={() => setResult(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-8 inline-flex rounded-md border border-line bg-white p-1">
        <button
          type="button"
          onClick={() => {
            setMode("hitung");
            setResult(null);
          }}
          aria-pressed={mode === "hitung"}
          className={`rounded px-3.5 py-2 text-[0.82rem] font-semibold transition-colors ${
            mode === "hitung"
              ? "bg-ink text-paper"
              : "text-ink-soft hover:bg-paper-2"
          }`}
        >
          Hitung langsung
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("penawaran");
            setResult(null);
          }}
          aria-pressed={mode === "penawaran"}
          className={`rounded px-3.5 py-2 text-[0.82rem] font-semibold transition-colors ${
            mode === "penawaran"
              ? "bg-ink text-paper"
              : "text-ink-soft hover:bg-paper-2"
          }`}
        >
          Minta penawaran
        </button>
      </div>

      <form
        ref={formRef}
        onSubmit={kirim}
        className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14"
      >
        {/* Kolom kiri atas: variabel yang mengubah harga */}
        <div className="space-y-8 lg:col-start-1 lg:row-start-1">
          {mode === "hitung" ? (
            <>
              <fieldset>
                <legend className={labelClass}>Layanan</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SERVICES.map((item) => {
                    const aktif = item.id === service.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => pilihLayananLain(item.id)}
                        aria-pressed={aktif}
                        className={`flex flex-col items-start rounded-md border px-3 py-2.5 text-left transition-colors ${
                          aktif
                            ? "border-brand bg-brand-soft"
                            : "border-line bg-white hover:border-line-strong"
                        }`}
                      >
                        <span className="text-[0.86rem] font-semibold text-ink">
                          {item.name}
                        </span>
                        <span className="mt-0.5 font-mono text-[0.68rem] tabular-nums text-muted">
                          {priceLabel(item)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="jumlah" className={labelClass}>
                  Jumlah {BASIS_LABEL[service.basis]}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="jumlah"
                    name="qtyTampilan"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={qtyInput[service.id] ?? String(service.defaultQty)}
                    onChange={(event) => ubahJumlah(event.target.value)}
                    className={`${fieldClass} max-w-[10rem] font-mono tabular-nums`}
                  />
                  <span className="text-sm text-muted">
                    {BASIS_LABEL[service.basis]}
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {service.presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => ubahJumlah(String(preset))}
                      className="rounded border border-line bg-white px-2.5 py-1 font-mono text-[0.72rem] tabular-nums text-ink-soft transition-colors hover:border-brand hover:text-brand"
                    >
                      {angka(preset)}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="qty" value={price.qty} />
                <input type="hidden" name="serviceId" value={service.id} />
              </div>

              <fieldset>
                <legend className={labelClass}>Tenggat</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DEADLINES.map((item) => (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-baseline justify-between gap-2 rounded-md border px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-brand/30 ${
                        deadlineId === item.id
                          ? "border-brand bg-brand-soft"
                          : "border-line bg-white hover:border-line-strong"
                      }`}
                    >
                      <span className="flex items-baseline gap-2">
                        <input
                          type="radio"
                          name="deadlineId"
                          value={item.id}
                          checked={deadlineId === item.id}
                          onChange={() => setDeadlineId(item.id)}
                          className="sr-only"
                        />
                        <span className="text-[0.83rem] font-medium text-ink">
                          {item.label}
                        </span>
                      </span>
                      <span className="font-mono text-[0.68rem] tabular-nums text-muted">
                        {item.note}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={labelClass}>Tingkat kesulitan</legend>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((item) => (
                    <label
                      key={item.id}
                      className={`cursor-pointer rounded-md border px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-brand/30 ${
                        difficultyId === item.id
                          ? "border-brand bg-brand-soft"
                          : "border-line bg-white hover:border-line-strong"
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficultyId"
                        value={item.id}
                        checked={difficultyId === item.id}
                        onChange={() => setDifficultyId(item.id)}
                        className="sr-only"
                      />
                      <span className="block text-[0.83rem] font-medium text-ink">
                        {item.label}
                      </span>
                      <span className="block text-[0.68rem] text-muted">
                        {item.note}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="layanan-kutipan" className={labelClass}>
                  Jenis tugas
                </label>
                <select
                  id="layanan-kutipan"
                  name="serviceId"
                  value={quoteService}
                  onChange={(event) =>
                    setQuoteService(event.target.value as ServiceId | "lainnya")
                  }
                  className={fieldClass}
                >
                  {SERVICES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                  <option value="lainnya">Lainnya (jelaskan di bawah)</option>
                </select>
              </div>

              <div>
                <label htmlFor="detail" className={labelClass}>
                  Ceritakan tugasnya
                </label>
                <textarea
                  id="detail"
                  name="detail"
                  required
                  minLength={20}
                  rows={6}
                  placeholder="Contoh: makalah 20 halaman, tema kebijakan publik, sudah ada 8 referensi, butuh daftar pustaka APA 7."
                  className={`${fieldClass} resize-y leading-relaxed`}
                />
                <p className="mt-1.5 text-[0.72rem] text-muted">
                  Semakin detail, semakin cepat admin memberi angka pasti.
                </p>
              </div>

              <fieldset>
                <legend className={labelClass}>Dibutuhkan kapan?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DEADLINES.map((item) => (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-baseline justify-between gap-2 rounded-md border px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-brand/30 ${
                        deadlineId === item.id
                          ? "border-brand bg-brand-soft"
                          : "border-line bg-white hover:border-line-strong"
                      }`}
                    >
                      <span className="flex items-baseline gap-2">
                        <input
                          type="radio"
                          name="deadlineId"
                          value={item.id}
                          checked={deadlineId === item.id}
                          onChange={() => setDeadlineId(item.id)}
                          className="sr-only"
                        />
                        <span className="text-[0.83rem] font-medium text-ink">
                          {item.label}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="budget" className={labelClass}>
                  Anggaran (opsional)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="text"
                  placeholder="Contoh: di bawah Rp 200.000"
                  className={fieldClass}
                />
              </div>
            </>
          )}
        </div>

        {/* Nota: di mobile muncul setelah variabel, sebelum data kontak */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <div aria-live="polite">
              {mode === "hitung" ? (
                <Nota
                  lines={price.lines}
                  total={price.total}
                  note={`Pengerjaan ${service.turnaround} untuk tenggat ini. Harga dikunci admin setelah file dicek.`}
                  stamp="Harga terbuka"
                  code="DRAF"
                />
              ) : (
                <NotaPenawaran />
              )}
            </div>

            <dl className="mt-5 space-y-2 rounded-md border border-line bg-paper-2/70 px-4 py-3.5 text-[0.76rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Jam operasional</dt>
                <dd className="text-right font-medium text-ink-soft">
                  {site.jamOperasional}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Pembayaran</dt>
                <dd className="text-right font-medium text-ink-soft">
                  {pembayaran.metode.join(" · ")}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Revisi</dt>
                <dd className="text-right font-medium text-ink-soft">
                  2× termasuk
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Kolom kiri bawah: data kontak + kirim */}
        <div className="space-y-5 lg:col-start-1 lg:row-start-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Nama
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                placeholder="Nama atau panggilanmu"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className={labelClass}>
                WhatsApp
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="0812 3456 7890"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="fileUrl" className={labelClass}>
              Tautan file (opsional)
            </label>
            <input
              id="fileUrl"
              name="fileUrl"
              type="url"
              placeholder="https://drive.google.com/..."
              className={fieldClass}
            />
            <p className="mt-1.5 text-[0.72rem] text-muted">
              Google Drive, OneDrive, atau apa pun yang bisa dibuka tanpa login.
            </p>
          </div>

          {mode === "hitung" ? (
            <div>
              <label htmlFor="notes" className={labelClass}>
                Catatan (opsional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Contoh: pakai APA 7, font Times New Roman 12, ada template dari kampus."
                className={`${fieldClass} resize-y leading-relaxed`}
              />
            </div>
          ) : null}

          {/* Jebakan bot */}
          <div aria-hidden className="hidden">
            <label htmlFor="perusahaan">Perusahaan</label>
            <input id="perusahaan" name="perusahaan" tabIndex={-1} autoComplete="off" />
          </div>

          {result?.status === "error" ? (
            <p
              role="alert"
              className="rounded-md border border-red-300 bg-red-50 px-3.5 py-2.5 text-[0.82rem] text-red-800"
            >
              {result.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-brand px-5 py-3.5 text-[0.92rem] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? "Mengirim…"
              : mode === "hitung"
                ? `Pesan sekarang · ${rupiah(price.total)}`
                : "Kirim permintaan penawaran"}
          </button>

          <p className="text-center text-[0.72rem] leading-relaxed text-muted">
            Tidak perlu daftar. Setelah dikirim, admin konfirmasi lewat WhatsApp
            sebelum kamu bayar.
          </p>
        </div>
      </form>
    </div>
  );
}

function NotaPenawaran() {
  return (
    <div className="nota">
      <div className="px-5 pb-7 pt-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xl leading-none tracking-tight">
              Mas Joki
            </p>
            <p className="mt-1.5 text-[0.7rem] text-muted">
              Permintaan penawaran
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.66rem] tracking-wide text-muted">Nomor</p>
            <p className="font-mono text-sm font-medium tabular-nums text-ink">
              —
            </p>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-line" />

        <div className="space-y-3">
          {["Jenis tugas", "Jumlah", "Tenggat", "Tingkat kesulitan"].map(
            (label) => (
              <div key={label} className="flex items-baseline justify-between gap-3">
                <p className="text-[0.86rem] text-ink">{label}</p>
                <span className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-line-strong" />
                <p className="font-mono text-[0.78rem] text-muted">—</p>
              </div>
            ),
          )}
        </div>

        <div className="my-4 border-t border-dashed border-line" />

        <div className="flex items-end justify-between gap-3">
          <p className="text-[0.78rem] font-semibold text-ink">Total</p>
          <p className="font-display text-[1.7rem] leading-none tracking-tight text-muted">
            Menunggu
          </p>
        </div>

        <p className="mt-3 text-[0.72rem] leading-relaxed text-muted">
          Angka keluar setelah admin membaca brief. Biasanya di bawah 1 jam
          kerja.
        </p>

        <div className="mt-5 flex justify-end">
          <span className="stempel">Dihitung manual</span>
        </div>
      </div>
    </div>
  );
}

function SuccessPanel({
  result,
  mode,
  serviceName,
  total,
  onReset,
}: {
  result: ActionResult;
  mode: "hitung" | "penawaran";
  serviceName: string;
  total: number | null;
  onReset: () => void;
}) {
  const [tersalin, setTersalin] = useState(false);

  async function salinNomor() {
    try {
      await navigator.clipboard.writeText(pembayaran.nomor);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 2000);
    } catch {
      // Clipboard bisa ditolak browser; nomornya tetap terbaca di layar.
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-md border border-line bg-white p-7 shadow-[0_18px_40px_-28px_rgba(16,26,51,0.4)] sm:p-9">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[0.72rem] font-semibold text-brand">
          <span aria-hidden className="size-1.5 rounded-full bg-brand" />
          {mode === "hitung" ? "Pesanan siap" : "Brief siap"}
        </p>

        <h3 className="mt-4 font-display text-2xl tracking-tight text-ink">
          {mode === "hitung"
            ? "Tinggal kirim ke WhatsApp."
            : "Tinggal kirim brief-nya."}
        </h3>

        <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
          {result.message}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-dashed border-line py-4 text-[0.8rem]">
          <div>
            <dt className="text-muted">Layanan</dt>
            <dd className="mt-0.5 font-medium text-ink">{serviceName}</dd>
          </div>
          <div>
            <dt className="text-muted">
              {mode === "hitung" ? "Estimasi" : "Harga"}
            </dt>
            <dd className="mt-0.5 font-mono text-base font-semibold tabular-nums text-ink">
              {total ? rupiah(total) : "Menunggu admin"}
            </dd>
          </div>
        </dl>

        {result.waUrl ? (
          <>
            <div className="mt-5 rounded-md border border-line bg-paper-2/70 px-4 py-3.5">
              <p className="text-[0.78rem] font-semibold text-ink">
                Pembayaran setelah dikonfirmasi
              </p>
              <p className="mt-1 text-[0.74rem] text-muted">
                {pembayaran.metode.join(" · ")}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[1.05rem] font-semibold tabular-nums text-ink">
                  {pembayaran.nomor}
                </span>
                <button
                  type="button"
                  onClick={salinNomor}
                  className="rounded border border-line bg-white px-2.5 py-1 text-[0.72rem] font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand"
                >
                  {tersalin ? "Tersalin" : "Salin nomor"}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={result.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-md bg-brand px-5 py-3 text-[0.88rem] font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Kirim pesanan via WhatsApp
              </a>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center rounded-md border border-line px-5 py-3 text-[0.88rem] font-semibold text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              >
                Buat lagi
              </button>
            </div>

            <p className="mt-3 text-center text-[0.72rem] leading-relaxed text-muted">
              Isi pesan sudah terisi otomatis. Kamu tinggal tekan kirim di
              WhatsApp.
            </p>
          </>
        ) : (
          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-line px-5 py-3 text-[0.88rem] font-semibold text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            Kembali
          </button>
        )}
      </div>
    </div>
  );
}
