"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Minus,
  Plus,
  Rocket,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { submitOrder, submitQuote } from "@/app/actions";
import { useCalculator } from "./calculator-context";
import { Nota } from "./nota";
import { ServiceIcon } from "./service-icon";
import { AnimatedPrice } from "./animated-number";
import { aksenLayanan } from "@/lib/aksen";
import { angka, rupiah } from "@/lib/format";
import {
  computePrice,
  DEADLINES,
  getAddonsForService,
  type AddonId,
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
import { pembayaran } from "@/lib/site";
import type { ActionResult } from "@/lib/types";

const fieldClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-sm text-ink placeholder:text-muted/60 transition-all duration-150 hover:border-line-strong focus:border-brand focus:ring-3 focus:ring-brand/15 focus:outline-none";

const labelClass = "mb-2.5 block text-[0.84rem] font-extrabold text-ink";

/** Kolom yang difokuskan untuk tiap kunci error dari zod. */
const FOKUS_ERROR: Record<string, string> = {
  serviceId: "jumlah",
  qty: "jumlah",
  deadlineId: "tenggat-hitung",
  name: "name",
  whatsapp: "whatsapp",
  fileUrl: "fileUrl",
  notes: "notes",
  detail: "detail",
  budget: "budget",
};

/** Urutan visual kolom, supaya fokus selalu ke kesalahan paling atas. */
const URUTAN_HITUNG = [
  "serviceId",
  "qty",
  "deadlineId",
  "name",
  "whatsapp",
  "fileUrl",
  "notes",
];
const URUTAN_PENAWARAN = [
  "serviceId",
  "detail",
  "deadlineId",
  "budget",
  "name",
  "whatsapp",
  "fileUrl",
];

function fokusKesalahan(
  errors: Record<string, string> | undefined,
  mode: "hitung" | "penawaran",
) {
  if (!errors) return;

  const urutan = mode === "hitung" ? URUTAN_HITUNG : URUTAN_PENAWARAN;
  const kunci =
    urutan.find((item) => item in errors) ?? Object.keys(errors)[0];
  const petaMode =
    mode === "hitung"
      ? { serviceId: "jumlah", deadlineId: "tenggat-hitung" }
      : { serviceId: "layanan-kutipan", deadlineId: "tenggat-kutipan" };
  const id = kunci
    ? ((petaMode as Record<string, string>)[kunci] ?? FOKUS_ERROR[kunci])
    : undefined;
  const el = id ? document.getElementById(id) : null;
  if (!el) return;

  const kurangiGerak = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  el.focus({ preventScroll: true });
  el.scrollIntoView({
    behavior: kurangiGerak ? "auto" : "smooth",
    block: "center",
  });
}

function PesanGalat({ id, pesan }: { id: string; pesan?: string }) {
  if (!pesan) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] font-medium leading-relaxed text-red-600"
    >
      <span aria-hidden>⚠️</span>
      <span>{pesan}</span>
    </p>
  );
}

function defaultQtys(): Record<string, string> {
  return Object.fromEntries(
    SERVICES.map((service) => [service.id, String(service.defaultQty)]),
  );
}

const KONVERSI_HALAMAN_KATA = [
  { hal: 2, kata: 500 },
  { hal: 4, kata: 1000 },
  { hal: 8, kata: 2000 },
  { hal: 12, kata: 3000, badge: "-5%" },
  { hal: 20, kata: 5000, badge: "-10%" },
];

export function PriceCalculator() {
  const { serviceId, setServiceId, mode, setMode } = useCalculator();
  const service = getService(serviceId);
  const aksen = aksenLayanan(service.id);

  const [qtyInput, setQtyInput] = useState<Record<string, string>>(defaultQtys);
  const [deadlineId, setDeadlineId] = useState<DeadlineId>("normal");
  const difficultyId: DifficultyId = "standar";
  const [selectedAddons, setSelectedAddons] = useState<
    Record<string, AddonId[]>
  >({});
  const [quoteService, setQuoteService] = useState<ServiceId | "lainnya">(
    serviceId,
  );

  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const qtyMentah = Number(qtyInput[service.id] ?? service.defaultQty);
  const currentQty =
    Number.isFinite(qtyMentah) && qtyMentah > 0
      ? qtyMentah
      : service.defaultQty;

  const availableAddons = useMemo(
    () => getAddonsForService(service.id),
    [service.id],
  );
  const activeAddonIds = useMemo(
    () => selectedAddons[service.id] ?? [],
    [selectedAddons, service.id],
  );

  const price = useMemo(
    () =>
      computePrice(
        service,
        currentQty,
        deadlineId,
        difficultyId,
        activeAddonIds,
      ),
    [service, currentQty, deadlineId, difficultyId, activeAddonIds],
  );

  const sliderMax =
    service.basis === "kata"
      ? 10000
      : service.basis === "halaman"
        ? 80
        : service.basis === "slide"
          ? 50
          : 10;
  const sliderStep = service.chunk > 1 ? service.chunk : 1;

  function ubahJumlah(value: string) {
    setQtyInput((prev) => ({
      ...prev,
      [service.id]: value.replace(/\D/g, ""),
    }));
  }

  function sesuaikanJumlah(selisih: number) {
    const nilaiLama =
      Number(qtyInput[service.id] ?? service.defaultQty) || service.defaultQty;
    const langkah = service.chunk > 1 ? service.chunk : 1;
    const nilaiBaru = Math.max(service.minQty, nilaiLama + selisih * langkah);
    ubahJumlah(String(nilaiBaru));
  }

  function toggleAddon(addonId: AddonId) {
    setSelectedAddons((prev) => {
      const current = prev[service.id] ?? [];
      const exists = current.includes(addonId);
      const next = exists
        ? current.filter((id) => id !== addonId)
        : [...current, addonId];
      return { ...prev, [service.id]: next };
    });
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
        setSelectedAddons({});
      } else {
        fokusKesalahan(jawaban.fieldErrors, mode);
      }
    });
  }

  /** Hapus pesan galat pada kolom yang sedang diperbaiki. */
  function bersihkanGalat(event: React.SyntheticEvent<HTMLFormElement>) {
    if (result?.status !== "error" || !result.fieldErrors) return;

    const nama = (event.target as HTMLInputElement).name;
    const kunci = nama === "qtyTampilan" ? "qty" : nama;
    if (!kunci || !(kunci in result.fieldErrors)) return;

    const sisa = { ...result.fieldErrors };
    delete sisa[kunci];
    setResult(
      Object.keys(sisa).length === 0
        ? null
        : { ...result, fieldErrors: sisa },
    );
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
        detail={
          mode === "hitung"
            ? `${price.qty} ${BASIS_LABEL[service.basis]} · ${price.deadline.label} · ${price.difficulty.label}`
            : undefined
        }
        total={mode === "hitung" ? price.total : null}
        dpAmount={mode === "hitung" ? price.dpAmount : null}
        onReset={() => setResult(null)}
      />
    );
  }

  const galat =
    result?.status === "error" &&
    result.fieldErrors &&
    Object.keys(result.fieldErrors).length > 0
      ? result.fieldErrors
      : undefined;

  return (
    <div id="kalkulator-area" className="relative">
      {/* Mode Switcher */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[0.94rem] font-bold text-ink">
            Pilih cara pemesanan yang paling cocok untuk tugasmu:
          </p>
        </div>

        <div
          role="group"
          aria-label="Pilih cara memesan"
          className="inline-flex rounded-2xl border border-line bg-paper-2 p-1.5 shadow-xs"
        >
          <button
            type="button"
            onClick={() => {
              setMode("hitung");
              setResult(null);
            }}
            aria-pressed={mode === "hitung"}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.86rem] font-extrabold transition-all cursor-pointer ${
              mode === "hitung"
                ? "bg-brand text-white shadow-md shadow-brand/20"
                : "text-ink-soft hover:bg-white hover:text-ink"
            }`}
          >
            <span>🧮</span>
            <span>Hitung Langsung</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("penawaran");
              setResult(null);
            }}
            aria-pressed={mode === "penawaran"}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.86rem] font-extrabold transition-all cursor-pointer ${
              mode === "penawaran"
                ? "bg-brand text-white shadow-md shadow-brand/20"
                : "text-ink-soft hover:bg-white hover:text-ink"
            }`}
          >
            <span>📝</span>
            <span>Minta Penawaran</span>
          </button>
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={kirim}
        onInput={bersihkanGalat}
        noValidate
        className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12"
      >
        {/* Kolom Kiri: Pilihan Layanan & Input Variabel */}
        <div className="space-y-8 lg:col-start-1 lg:row-start-1">
          {mode === "hitung" ? (
            <>
              {/* Pilihan Layanan */}
              <fieldset>
                <div className="flex items-center justify-between mb-3">
                  <legend className={labelClass}>1. Pilih Layanan Tugas</legend>
                  <span className="text-[0.74rem] font-bold text-brand">
                    Terpilih: {service.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {SERVICES.map((item) => {
                    const aktif = item.id === service.id;
                    const itemAksen = aksenLayanan(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => pilihLayananLain(item.id)}
                        aria-pressed={aktif}
                        className={`group relative flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                          aktif
                            ? `${itemAksen.soft} ${itemAksen.border} ring-2 ${itemAksen.ring} shadow-md`
                            : "border-line bg-white hover:border-line-strong hover:bg-paper-2/40"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className="p-1.5 rounded-xl border"
                            style={{
                              backgroundColor: `${itemAksen.hex}15`,
                              borderColor: `${itemAksen.hex}30`,
                              color: itemAksen.hex,
                            }}
                          >
                            <ServiceIcon id={item.id} className="size-4" />
                          </span>
                          <span
                            aria-hidden
                            className={`size-2.5 rounded-full ${itemAksen.dot}`}
                          />
                        </div>
                        <span className="mt-2.5 text-[0.84rem] font-extrabold text-ink leading-tight">
                          {item.name}
                        </span>
                        <span className="mt-1 font-mono text-[0.66rem] text-muted">
                          {priceLabel(item)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <PesanGalat id="galat-layanan" pesan={galat?.serviceId} />
              </fieldset>

              {/* Jumlah Satuan & Slider & Stepper */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="jumlah" className={labelClass}>
                    2. Jumlah {BASIS_LABEL[service.basis]}
                  </label>
                  <span className="rounded-full bg-paper-2 px-3 py-1 text-[0.72rem] font-bold text-ink-soft">
                    📐 {price.equivalentLabel}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Stepper controls */}
                    <div className="flex items-center rounded-2xl border border-line bg-paper-2 p-1.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => sesuaikanJumlah(-1)}
                        className="grid size-11 place-items-center rounded-xl bg-white text-ink shadow-2xs transition-all hover:bg-brand hover:text-white active:scale-95 cursor-pointer"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="size-4 stroke-[2.5]" />
                      </button>
                      <input
                        id="jumlah"
                        name="qtyTampilan"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={qtyInput[service.id] ?? String(service.defaultQty)}
                        onChange={(event) => ubahJumlah(event.target.value)}
                        aria-invalid={galat?.qty ? true : undefined}
                        aria-describedby={galat?.qty ? "galat-jumlah" : undefined}
                        className="w-28 bg-transparent text-center font-mono text-xl font-black tabular-nums text-ink focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => sesuaikanJumlah(1)}
                        className="grid size-11 place-items-center rounded-xl bg-white text-ink shadow-2xs transition-all hover:bg-brand hover:text-white active:scale-95 cursor-pointer"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="size-4 stroke-[2.5]" />
                      </button>
                    </div>

                    <div>
                      <span className="block text-base font-bold text-ink-soft">
                        {BASIS_LABEL[service.basis]}
                      </span>
                      <span className="block text-[0.7rem] text-muted">
                        Min. {service.minQty} {BASIS_LABEL[service.basis]}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-muted">
                      Rata-rata Biaya
                    </span>
                    <span className="font-mono text-sm font-bold text-brand">
                      {price.effectiveUnitLabel}
                    </span>
                  </div>
                </div>

                {/* Range Slider for Ultra-Smooth UX */}
                <div className="mt-5">
                  <input
                    type="range"
                    min={service.minQty}
                    max={sliderMax}
                    step={sliderStep}
                    value={Math.min(currentQty, sliderMax)}
                    onChange={(e) => ubahJumlah(e.target.value)}
                    className="w-full accent-brand cursor-pointer"
                    aria-label={`Geser jumlah ${BASIS_LABEL[service.basis]}`}
                  />
                  <div className="flex justify-between text-[0.68rem] text-muted font-mono mt-1">
                    <span>
                      {service.minQty} {BASIS_LABEL[service.basis]}
                    </span>
                    <span>
                      {angka(sliderMax)} {BASIS_LABEL[service.basis]}
                    </span>
                  </div>
                </div>

                {/* Banner Diskon Kuantitas Otomatis */}
                {price.discountAmount > 0 && price.discountLabel ? (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/90 px-4 py-2.5 text-[0.78rem] text-emerald-900">
                    <div className="flex items-center gap-2 font-bold">
                      <Sparkles className="size-4 text-emerald-600 fill-emerald-500" />
                      <span>{price.discountLabel} aktif otomatis!</span>
                    </div>
                    <span className="shrink-0 rounded-lg bg-emerald-600 px-2.5 py-0.5 font-mono text-[0.74rem] font-extrabold text-white">
                      Hemat {rupiah(price.discountAmount)}
                    </span>
                  </div>
                ) : price.nextDiscountHint ? (
                  <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-2 text-[0.76rem] text-amber-900">
                    <span>💡 {price.nextDiscountHint}</span>
                    <span className="shrink-0 font-bold text-amber-800">
                      Diskon Otomatis
                    </span>
                  </div>
                ) : null}

                <PesanGalat id="galat-jumlah" pesan={galat?.qty} />

                {/* Preset Chips */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-line pt-3.5">
                  <span className="text-[0.74rem] font-bold text-muted">
                    Pilihan cepat:
                  </span>
                  {service.presets.map((preset) => {
                    const aktif = price.qty === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => ubahJumlah(String(preset))}
                        aria-pressed={aktif}
                        className={`rounded-xl border px-3.5 py-1.5 font-mono text-[0.76rem] font-bold tabular-nums transition-all cursor-pointer ${
                          aktif
                            ? "border-brand bg-brand text-white shadow-xs"
                            : "border-line bg-paper-2 text-ink-soft hover:border-brand hover:text-brand hover:bg-white"
                        }`}
                      >
                        {angka(preset)} {BASIS_LABEL[service.basis]}
                      </button>
                    );
                  })}
                </div>

                {/* Kalkulator Bantu Konversi Halaman ke Kata */}
                {service.basis === "kata" ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-paper-2/70 p-3">
                    <span className="text-[0.72rem] font-bold text-ink-soft">
                      📄 Hanya tahu jumlah halaman A4? Pilih taksiran:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {KONVERSI_HALAMAN_KATA.map((item) => {
                        const aktif = price.qty === item.kata;
                        return (
                          <button
                            key={item.hal}
                            type="button"
                            onClick={() => ubahJumlah(String(item.kata))}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[0.72rem] font-bold transition-all cursor-pointer ${
                              aktif
                                ? "border-brand bg-brand-soft text-brand shadow-2xs"
                                : "border-line bg-white text-ink-soft hover:border-brand hover:text-brand"
                            }`}
                          >
                            <span>
                              {item.hal} Hal (≈{angka(item.kata)} kata)
                            </span>
                            {item.badge ? (
                              <span className="rounded bg-emerald-100 px-1 py-0.2 text-[0.62rem] font-extrabold text-emerald-800">
                                {item.badge}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <input type="hidden" name="qty" value={price.qty} />
                <input type="hidden" name="serviceId" value={service.id} />
              </div>

              {/* Tenggat Waktu */}
              <fieldset id="tenggat-hitung" tabIndex={-1}>
                <div className="flex items-center justify-between mb-2.5">
                  <legend className="text-[0.84rem] font-extrabold text-ink">
                    3. Kapan tugas ini dibutuhkan?
                  </legend>
                  <span className="text-[0.74rem] font-semibold text-emerald-700 flex items-center gap-1">
                    <Clock className="size-3.5" />
                    <span>Estimasi: {price.estimatedTurnaround}</span>
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DEADLINES.map((item) => {
                    const aktif = deadlineId === item.id;
                    const IconTenggat =
                      item.id === "kilat"
                        ? Zap
                        : item.id === "cepat"
                          ? Rocket
                          : item.id === "normal"
                            ? Clock
                            : Calendar;

                    return (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                          aktif
                            ? "border-brand bg-brand-soft/70 ring-2 ring-brand/30 shadow-sm"
                            : "border-line bg-white hover:border-line-strong hover:bg-paper-2/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="deadlineId"
                            value={item.id}
                            checked={aktif}
                            onChange={() => setDeadlineId(item.id)}
                            className="sr-only"
                          />
                          <div
                            className={`p-2 rounded-xl border ${
                              aktif
                                ? "bg-brand text-white border-brand"
                                : "bg-paper-2 text-ink-soft border-line"
                            }`}
                          >
                            <IconTenggat className="size-4.5" />
                          </div>
                          <div>
                            <span className="block text-[0.88rem] font-extrabold text-ink">
                              {item.label}
                            </span>
                            <span className="block text-[0.74rem] text-muted mt-0.5">
                              {item.note}
                            </span>
                          </div>
                        </div>

                        {item.mult > 1 ? (
                          <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[0.68rem] font-extrabold text-amber-900">
                            +{Math.round((item.mult - 1) * 100)}%
                          </span>
                        ) : (
                          <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[0.68rem] font-extrabold text-emerald-900">
                            Normal
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                <PesanGalat id="galat-tenggat" pesan={galat?.deadlineId} />
              </fieldset>

              {/* Catatan Transparansi Penilaian Tingkat Kerumitan */}
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-paper-2/70 p-4 text-[0.78rem] text-ink-soft">
                <span className="text-base select-none leading-none mt-0.5">💡</span>
                <p className="leading-relaxed">
                  <strong className="text-ink font-bold">Tentang Tingkat Kesulitan:</strong> Estimasi dihitung otomatis untuk pengerjaan tugas standar/umum. Jika tugasmu memiliki kebutuhan analisis data teknis khusus (seperti olah data SPSS, coding, atau uji laboratorium), admin Mas Joki yang akan menilai dan mengonfirmasi kesepakatannya di WhatsApp setelah memeriksa file brief.
                </p>
              </div>

              <input type="hidden" name="difficultyId" value="standar" />

              {/* Opsi Tambahan / Pendamping Kontekstual */}
              {availableAddons.length > 0 ? (
                <fieldset>
                  <div className="flex items-center justify-between mb-2.5">
                    <legend className="text-[0.84rem] font-extrabold text-ink">
                      4. Opsi Pendamping Tambahan (Opsional)
                    </legend>
                    <span className="text-[0.72rem] font-semibold text-muted">
                      Bisa pilih lebih dari satu
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableAddons.map((addon) => {
                      const terpilih = activeAddonIds.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                            terpilih
                              ? "border-brand bg-brand-soft/60 ring-2 ring-brand/25 shadow-xs"
                              : "border-line bg-white hover:border-line-strong hover:bg-paper-2/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              name="addons"
                              value={addon.id}
                              checked={terpilih}
                              onChange={() => toggleAddon(addon.id)}
                              className="mt-1 size-4 accent-brand rounded cursor-pointer"
                            />
                            <div>
                              <span className="block text-[0.84rem] font-extrabold text-ink leading-snug">
                                {addon.label}
                              </span>
                              <span className="mt-1 block text-[0.72rem] leading-snug text-muted">
                                {addon.note}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-lg bg-paper-2 px-2 py-1 font-mono text-[0.72rem] font-bold text-brand">
                            +{rupiah(addon.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}
            </>
          ) : (
            /* Mode Penawaran */
            <div className="space-y-6">
              <div>
                <label htmlFor="layanan-kutipan" className={labelClass}>
                  Jenis Tugas Utama
                </label>
                <select
                  id="layanan-kutipan"
                  name="serviceId"
                  value={quoteService}
                  onChange={(event) =>
                    setQuoteService(event.target.value as ServiceId | "lainnya")
                  }
                  aria-invalid={galat?.serviceId ? true : undefined}
                  aria-describedby={
                    galat?.serviceId ? "galat-layanan-kutipan" : undefined
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
                <PesanGalat
                  id="galat-layanan-kutipan"
                  pesan={galat?.serviceId}
                />
              </div>

              <div>
                <label htmlFor="detail" className={labelClass}>
                  Ceritakan Kebutuhan Tugasmu Secara Lengkap
                </label>
                <textarea
                  id="detail"
                  name="detail"
                  required
                  minLength={20}
                  rows={6}
                  aria-invalid={galat?.detail ? true : undefined}
                  aria-describedby={galat?.detail ? "galat-detail" : undefined}
                  placeholder="Contoh: Makalah 20 halaman tema kebijakan publik, ada 8 referensi wajib, format APA 7, dan butuh ringkasan eksekutif..."
                  className={`${fieldClass} resize-y leading-relaxed`}
                />
                <PesanGalat id="galat-detail" pesan={galat?.detail} />
                <p className="mt-1.5 text-[0.76rem] text-muted">
                  Semakin rinci brief yang kamu berikan, semakin akurat dan cepat admin memberikan harga penawaran.
                </p>
              </div>

              <fieldset id="tenggat-kutipan" tabIndex={-1}>
                <legend className={labelClass}>Dibutuhkan Kapan?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DEADLINES.map((item) => (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                        deadlineId === item.id
                          ? "border-brand bg-brand-soft ring-2 ring-brand/30"
                          : "border-line bg-white hover:border-line-strong"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deadlineId"
                        value={item.id}
                        checked={deadlineId === item.id}
                        onChange={() => setDeadlineId(item.id)}
                        className="sr-only"
                      />
                      <span className="text-[0.88rem] font-bold text-ink">
                        {item.label}
                      </span>
                      <span className="text-[0.74rem] text-muted">
                        {item.note}
                      </span>
                    </label>
                  ))}
                </div>
                <PesanGalat id="galat-tenggat-kutipan" pesan={galat?.deadlineId} />
              </fieldset>

              <div>
                <label htmlFor="budget" className={labelClass}>
                  Ekspektasi Anggaran (Opsional)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="text"
                  placeholder="Contoh: Sekitar Rp 150.000 – Rp 200.000"
                  aria-invalid={galat?.budget ? true : undefined}
                  aria-describedby={galat?.budget ? "galat-budget" : undefined}
                  className={fieldClass}
                />
                <PesanGalat id="galat-budget" pesan={galat?.budget} />
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Nota Kwitansi Transparan (Sticky) */}
        <div id="ringkasan-nota" className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {mode === "hitung" ? `Total ${rupiah(price.total)}` : ""}
            </p>

            <div>
              {mode === "hitung" ? (
                <Nota
                  lines={price.lines}
                  total={price.total}
                  dpAmount={price.dpAmount}
                  effectiveUnitLabel={price.effectiveUnitLabel}
                  estimatedTurnaround={price.estimatedTurnaround}
                  equivalentLabel={price.equivalentLabel}
                  note="Harga terkunci setelah file dicek admin. Tidak ada biaya tersembunyi."
                  stamp="Harga Transparan"
                  code="EST-LIVE"
                  aksen={aksen}
                />
              ) : (
                <NotaPenawaran />
              )}
            </div>

            {/* Benefit Box */}
            <div className="mt-5 rounded-3xl border border-line bg-paper-2/90 p-5 text-[0.8rem] shadow-xs">
              <p className="font-extrabold text-ink mb-2.5">
                Jaminan Layanan Mas Joki:
              </p>
              <ul className="space-y-2 text-ink-soft">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Bisa DP 50% Dulu</strong>, pelunasan saat tugas beres
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Gratis 2× Revisi</strong> sesuai brief awal
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>File Sumber Diserahkan</strong> (Word, PPT, dll.)
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Bayar via E-Wallet</strong>: ShopeePay, GoPay, DANA
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Kolom Kiri Bawah: Form Kontak & Submit CTA */}
        <div
          id="kontak-pesan"
          className="space-y-5 rounded-3xl border border-line bg-white p-7 shadow-sm lg:col-start-1 lg:row-start-2"
        >
          <div>
            <h3 className="font-display text-xl font-extrabold text-ink">
              Data Kontak &amp; Pengiriman
            </h3>
            <p className="mt-1 text-[0.82rem] text-muted">
              Hanya digunakan admin untuk konfirmasi pengerjaan dan mengirim hasil file.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Nama Panggilan
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                placeholder="Contoh: Bagas"
                aria-invalid={galat?.name ? true : undefined}
                aria-describedby={galat?.name ? "galat-name" : undefined}
                className={fieldClass}
              />
              <PesanGalat id="galat-name" pesan={galat?.name} />
            </div>

            <div>
              <label htmlFor="whatsapp" className={labelClass}>
                Nomor WhatsApp
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                spellCheck={false}
                placeholder="0812 3456 7890"
                aria-invalid={galat?.whatsapp ? true : undefined}
                aria-describedby={galat?.whatsapp ? "galat-whatsapp" : undefined}
                className={fieldClass}
              />
              <PesanGalat id="galat-whatsapp" pesan={galat?.whatsapp} />
            </div>
          </div>

          <div>
            <label htmlFor="fileUrl" className={labelClass}>
              Tautan File Dokumen / Referensi (Opsional)
            </label>
            <input
              id="fileUrl"
              name="fileUrl"
              type="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="https://drive.google.com/… (pastikan akses publik)"
              aria-invalid={galat?.fileUrl ? true : undefined}
              aria-describedby={galat?.fileUrl ? "galat-fileUrl" : undefined}
              className={fieldClass}
            />
            <PesanGalat id="galat-fileUrl" pesan={galat?.fileUrl} />
            <p className="mt-1.5 text-[0.74rem] text-muted">
              Tautan Google Drive atau OneDrive. Pastikan izin berbagi diset{" "}
              <em>&quot;Siapa saja yang memiliki link dapat melihat&quot;</em>.
            </p>
          </div>

          {mode === "hitung" ? (
            <div>
              <label htmlFor="notes" className={labelClass}>
                Catatan Khusus (Opsional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Contoh: Format font Times New Roman 12, spasi 1.5, sitasi Harvard style."
                aria-invalid={galat?.notes ? true : undefined}
                aria-describedby={galat?.notes ? "galat-notes" : undefined}
                className={`${fieldClass} resize-y leading-relaxed`}
              />
              <PesanGalat id="galat-notes" pesan={galat?.notes} />
            </div>
          ) : null}

          {/* Jebakan bot */}
          <div aria-hidden className="hidden">
            <label htmlFor="perusahaan">Perusahaan</label>
            <input
              id="perusahaan"
              name="perusahaan"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {result?.status === "error" && !galat ? (
            <p
              role="alert"
              className="rounded-2xl border border-red-300 bg-red-50 p-4 text-[0.84rem] font-medium text-red-800"
            >
              {result.message}
            </p>
          ) : null}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-brand px-7 py-4.5 text-[0.98rem] font-extrabold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0 cursor-pointer"
          >
            {pending ? (
              <span>Sedang Memproses…</span>
            ) : mode === "hitung" ? (
              <>
                <Send className="size-4.5" />
                <span>Kirim Pesanan ke WhatsApp</span>
                <span className="rounded-lg bg-white/20 px-2.5 py-0.5 font-mono text-sm font-bold">
                  {rupiah(price.total)}
                </span>
                <span aria-hidden>→</span>
              </>
            ) : (
              <>
                <Send className="size-4.5" />
                <span>Kirim Permintaan Penawaran</span>
                <span aria-hidden>→</span>
              </>
            )}
          </button>

          <p className="text-center text-[0.76rem] leading-relaxed text-muted">
            🔒 Tanpa buat akun. Pesan akan terbuka otomatis di aplikasi WhatsApp kamu.
          </p>
        </div>
      </form>

      {/* Floating Sticky Mobile Summary Bar */}
      {mode === "hitung" && (
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-line bg-white/95 p-3.5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-2.5">
              <div
                className="grid size-10 place-items-center rounded-xl border text-brand shrink-0"
                style={{
                  backgroundColor: `${aksen.hex}15`,
                  borderColor: `${aksen.hex}30`,
                }}
              >
                <ServiceIcon id={service.id} className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-muted truncate">
                  {service.name} ({price.qty} {BASIS_LABEL[service.basis]})
                </p>
                <p className="font-display text-lg font-black leading-none text-brand tabular-nums">
                  <AnimatedPrice value={price.total} />
                </p>
              </div>
            </div>

            <a
              href="#kontak-pesan"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand/20 active:scale-95"
            >
              <span>Lanjut Pesan</span>
              <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function NotaPenawaran() {
  return (
    <div className="nota">
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 -rotate-3 place-items-center rounded-2xl border border-brand/20 bg-brand-soft text-brand shadow-xs">
              <span className="font-display text-[0.88rem] font-black">MJ</span>
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-none tracking-tight text-ink">
                Mas Joki
              </p>
              <p className="mt-1 text-[0.72rem] font-medium text-muted">
                Penawaran Khusus
              </p>
            </div>
          </div>
          <span className="rounded-md bg-paper-2 px-2 py-0.5 font-mono text-[0.66rem] font-semibold uppercase text-muted">
            CUSTOM
          </span>
        </div>

        <div className="my-5 border-t border-dashed border-line" />

        <div className="space-y-3.5 text-[0.88rem]">
          {["Jenis tugas", "Jumlah satuan", "Tenggat", "Tingkat kerumitan"].map(
            (label) => (
              <div key={label} className="flex items-baseline justify-between gap-3">
                <p className="font-medium text-ink">{label}</p>
                <span className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-line-strong" />
                <p className="font-mono text-[0.78rem] text-muted">Disesuaikan</p>
              </div>
            ),
          )}
        </div>

        <div className="my-5 border-t border-dashed border-line" />

        <div className="flex items-end justify-between gap-3 rounded-2xl bg-paper-2/70 p-4">
          <p className="text-[0.74rem] font-bold uppercase tracking-wider text-ink">
            Estimasi Biaya
          </p>
          <p className="font-display text-xl font-bold tracking-tight text-brand">
            Dihitung Admin
          </p>
        </div>

        <p className="mt-3.5 text-[0.74rem] leading-relaxed text-muted">
          ⚡ Admin akan membaca brief kamu dan memberikan penawaran terbaik dalam &lt;1 jam kerja.
        </p>

        <div className="mt-5 flex justify-end">
          <span className="stempel">✓ Hitung Personal</span>
        </div>
      </div>
    </div>
  );
}

function SuccessPanel({
  result,
  mode,
  serviceName,
  detail,
  total,
  dpAmount,
  onReset,
}: {
  result: ActionResult;
  mode: "hitung" | "penawaran";
  serviceName: string;
  detail?: string;
  total: number | null;
  dpAmount: number | null;
  onReset: () => void;
}) {
  const [tersalin, setTersalin] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    panelRef.current?.scrollIntoView({
      behavior: kurangiGerak ? "auto" : "smooth",
      block: "center",
    });
  }, []);

  async function salinNomor() {
    try {
      await navigator.clipboard.writeText(pembayaran.nomor);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 2000);
    } catch {
      // Clipboard fallback
    }
  }

  return (
    <div ref={panelRef} className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-2xl shadow-brand/10 sm:p-9">
        <div role="status" aria-live="polite">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-[0.76rem] font-bold text-emerald-800">
            <span aria-hidden className="size-2 rounded-full bg-emerald-500 " />
            {mode === "hitung" ? "Pesanan Siap Dikirim" : "Brief Siap Dikirim"}
          </span>

          <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {mode === "hitung"
              ? "Tinggal Kirim ke WhatsApp Admin!"
              : "Tinggal Kirimkan Brief Kamu!"}
          </h3>

          <p className="mt-2.5 text-[0.94rem] leading-relaxed text-ink-soft">
            {result.message}
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-dashed border-line bg-paper-2/60 p-4.5 text-[0.84rem]">
          <div>
            <dt className="text-muted text-[0.72rem] font-bold uppercase tracking-wider">
              Layanan
            </dt>
            <dd className="mt-1 font-bold text-ink">{serviceName}</dd>
            {detail ? (
              <dd className="mt-0.5 text-[0.72rem] text-muted">{detail}</dd>
            ) : null}
          </div>
          <div>
            <dt className="text-muted text-[0.72rem] font-bold uppercase tracking-wider">
              {mode === "hitung" ? "Estimasi Biaya" : "Status Harga"}
            </dt>
            <dd className="mt-1 font-mono text-base font-black tabular-nums text-brand">
              {total ? rupiah(total) : "Menunggu Admin"}
            </dd>
            {dpAmount ? (
              <dd className="mt-0.5 text-[0.72rem] font-semibold text-emerald-700">
                Bisa DP 50%: {rupiah(dpAmount)}
              </dd>
            ) : null}
          </div>
        </dl>

        {result.waUrl ? (
          <>
            <div className="mt-6 rounded-2xl border border-line bg-brand-soft/40 p-4.5">
              <p className="text-[0.84rem] font-bold text-ink">
                Metode Pembayaran (Setelah Dikonfirmasi Admin):
              </p>
              <p className="mt-1 text-[0.76rem] text-muted">
                {pembayaran.metode.join(" · ")}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3 border border-brand/20">
                <span className="font-mono text-lg font-bold tabular-nums text-ink">
                  {pembayaran.nomor}
                </span>
                <button
                  type="button"
                  onClick={salinNomor}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-paper-2 px-3.5 py-1.5 text-[0.78rem] font-bold text-ink-soft transition-colors hover:bg-brand hover:text-white cursor-pointer"
                >
                  {tersalin ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Salin Nomor</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={result.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-[0.95rem] font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35"
              >
                <span>Buka WhatsApp Sekarang</span>
                <ExternalLink className="size-4" />
              </a>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center rounded-2xl border border-line px-5 py-4 text-[0.88rem] font-bold text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink cursor-pointer"
              >
                Hitung Lagi
              </button>
            </div>

            <p className="mt-3.5 text-center text-[0.76rem] leading-relaxed text-muted">
              ✨ Format chat sudah tersusun rapi otomatis. Kamu cukup klik tombol kirim di WhatsApp.
            </p>
          </>
        ) : (
          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-line px-5 py-4 text-[0.88rem] font-bold text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink cursor-pointer"
          >
            Kembali
          </button>
        )}
      </div>
    </div>
  );
}
