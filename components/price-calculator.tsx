"use client";
import Link from "next/link";
import { lacak } from "@/lib/analytics";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  ArrowRight,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Lightbulb,
  Minus,
  Plus,
  Rocket,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { submitOrder, submitQuote } from "@/app/actions";
import { useCalculator } from "./calculator-context";
import { useEstimatedDateRange } from "./use-wib-status";
import { Nota } from "./nota";
import { ServiceIcon } from "./service-icon";
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
  CALCULABLE_SERVICES,
  getService,
  priceLabel,
  SERVICES,
  type ServiceId,
} from "@/lib/services";
import { pembayaran, waLink } from "@/lib/site";
import type { ActionResult } from "@/lib/types";

const fieldClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-base sm:text-sm text-ink placeholder:text-muted/60 transition duration-150 hover:border-line-strong focus:border-brand focus:ring-3 focus:ring-brand/15 focus:outline-none";

const labelClass = "mb-2.5 block text-[0.84rem] font-bold text-ink";

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
      <span>{pesan}</span>
    </p>
  );
}

function defaultQtys(): Record<string, string> {
  return {
    ...Object.fromEntries(
      SERVICES.map((service) => [service.id, String(service.defaultQty)]),
    ),
    artikel_ilmiah: "2000",
    jurnal_submit: "4000",
    paket_abstrak: "250",
    word: "25",
  };
}

const KONVERSI_HALAMAN_KATA = [
  { hal: 2, kata: 500 },
  { hal: 4, kata: 1000 },
  { hal: 8, kata: 2000 },
  { hal: 12, kata: 3000, badge: "-5%" },
  { hal: 20, kata: 5000, badge: "-10%" },
];

export function PriceCalculator({ ringkas = false }: { ringkas?: boolean } = {}) {
  const {
    serviceId,
    setServiceId,
    mode,
    setMode,
    setEstimasiRingkas,
    preselectedQty,
    preselectedDeadline,
  } = useCalculator();
  const service = getService(serviceId);
  const aksen = aksenLayanan(service.id);

  const [qtyInput, setQtyInput] = useState<Record<string, string>>(defaultQtys);
  const [deadlineId, setDeadlineId] = useState<DeadlineId>("santai");
  const estimatedDateRange = useEstimatedDateRange(deadlineId);
  const difficultyId: DifficultyId = "standar";
  const [selectedAddons, setSelectedAddons] = useState<
    Record<string, AddonId[]>
  >({});
  const [quoteService, setQuoteService] = useState<ServiceId | "lainnya">(
    serviceId,
  );
  const [kategoriFilter, setKategoriFilter] = useState<string>("semua");
  const [bukaHitungKata, setBukaHitungKata] = useState(false);
  const [teksNaskah, setTeksNaskah] = useState("");

  const kataTerhitung = useMemo(() => {
    const trimmed = teksNaskah.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [teksNaskah]);

  useEffect(() => {
    setQuoteService(serviceId);
  }, [serviceId]);

  useEffect(() => {
    if (preselectedQty && preselectedQty > 0) {
      setQtyInput((prev) => ({
        ...prev,
        [serviceId]: String(preselectedQty),
      }));
    }
  }, [preselectedQty, serviceId]);

  useEffect(() => {
    if (
      preselectedDeadline &&
      DEADLINES.some((d) => d.id === preselectedDeadline)
    ) {
      setDeadlineId(preselectedDeadline as DeadlineId);
    }
  }, [preselectedDeadline]);

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

  useEffect(() => {
    if (mode === "penawaran") {
      setEstimasiRingkas({
        total: 0,
        label: service.name,
        qtyLabel: "Penawaran Khusus",
      });
      return () => {
        setEstimasiRingkas(null);
      };
    }
    setEstimasiRingkas({
      total: price.total,
      label: service.name,
      qtyLabel: `${price.qty} ${BASIS_LABEL[service.basis]}`,
    });
    return () => {
      setEstimasiRingkas(null);
    };
  }, [mode, price.total, service.name, price.qty, service.basis, setEstimasiRingkas]);

  const sliderMax =
    service.id === "artikel_ilmiah"
      ? 4000
      : service.id === "jurnal_submit"
        ? 8000
        : service.id === "paket_abstrak"
          ? 500
          : service.id === "word"
            ? 150
            : service.basis === "kata"
              ? 10000
              : service.basis === "halaman"
                ? 80
                : service.basis === "slide"
                  ? 50
                  : 10;

  const sliderStep =
    service.id === "word"
      ? 1
      : service.id === "paket_abstrak"
        ? 10
        : service.id === "artikel_ilmiah" || service.id === "jurnal_submit"
          ? 100
          : service.chunk > 1
            ? service.chunk
            : 1;

  function ubahJumlah(value: string) {
    setQtyInput((prev) => ({
      ...prev,
      [service.id]: value.replace(/\D/g, ""),
    }));
  }

  function sesuaikanJumlah(selisih: number) {
    const nilaiLama =
      Number(qtyInput[service.id] ?? service.defaultQty) || service.defaultQty;
    const langkah =
      service.id === "word"
        ? 1
        : service.id === "paket_abstrak"
          ? 25
          : service.id === "artikel_ilmiah" || service.id === "jurnal_submit"
            ? 250
            : service.chunk > 1
              ? service.chunk
              : 1;
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
    const target = getService(id);
    if (target.customQuoteOnly) {
      setMode("penawaran");
      setQuoteService(id);
      setResult(null);
      return;
    }
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
        lacak(mode === "hitung" ? "order_terkirim" : "penawaran_terkirim", {
          layanan: String(data.get("serviceId") ?? ""),
        });
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
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.86rem] font-bold transition cursor-pointer ${
              mode === "hitung"
                ? "bg-brand text-white shadow-md shadow-brand/20"
                : "text-ink-soft hover:bg-white hover:text-ink"
            }`}
          >
            <Calculator className="size-4" />
            <span>Hitung Langsung</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("penawaran");
              setResult(null);
            }}
            aria-pressed={mode === "penawaran"}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.86rem] font-bold transition cursor-pointer ${
              mode === "penawaran"
                ? "bg-brand text-white shadow-md shadow-brand/20"
                : "text-ink-soft hover:bg-white hover:text-ink"
            }`}
          >
            <FileText className="size-4" />
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
        <div className="min-w-0 space-y-8 lg:col-start-1 lg:row-start-1">
          {mode === "hitung" ? (
            <>
              {/* Pilihan Layanan dengan Pengelompokan Kategori & Varian (Task 8b) */}
              <fieldset>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <legend className={labelClass}>1. Pilih Layanan Tugas</legend>
                  <span className="text-xs font-bold text-brand">
                    Terpilih: {service.name}
                  </span>
                </div>

                {/* Filter Kategori Cepat untuk Navigasi Mobile Ringkas */}
                <div className="mb-2 flex w-full min-w-0 items-center gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
                  {[
                    { id: "semua", label: "Semua (11)" },
                    { id: "penulisan", label: "Penulisan & AI" },
                    { id: "makalah_jurnal", label: "Makalah & Jurnal" },
                    { id: "dokumen", label: "Format Dokumen" },
                    { id: "bahasa_desain", label: "Bahasa & Desain" },
                  ].map((cat) => {
                    const aktif = kategoriFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setKategoriFilter(cat.id)}
                        className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                          aktif
                            ? "bg-brand text-white shadow-xs"
                            : "bg-paper-2 text-slate-600 hover:bg-paper-2/80 hover:text-ink border border-line"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "penulisan",
                      category: "Parafrase & Humanisasi Teks",
                      services: ["parafrase", "humanisasi"],
                    },
                    {
                      id: "makalah_jurnal",
                      category: "Kepenulisan Makalah",
                      services: ["makalah"],
                    },
                    {
                      id: "makalah_jurnal",
                      category: "Artikel Jurnal",
                      badge: "2 Pilihan Tingkat",
                      services: ["artikel_ilmiah", "jurnal_submit"],
                    },
                    {
                      id: "dokumen",
                      category: "Presentasi & Format Dokumen",
                      services: ["powerpoint", "word"],
                    },
                    {
                      id: "bahasa_desain",
                      category: "Bahasa & Terjemahan",
                      badge: "Termasuk Paket Abstrak",
                      services: ["terjemah", "paket_abstrak"],
                    },
                    {
                      id: "bahasa_desain",
                      category: "Desain & Khusus",
                      services: ["desain", "turnitin_ai"],
                    },
                  ]
                    .filter((grp) => kategoriFilter === "semua" || grp.id === kategoriFilter)
                    .map((grp) => {
                    const groupItems = CALCULABLE_SERVICES.filter((item) =>
                      grp.services.includes(item.id),
                    );
                    return (
                      <div key={grp.category} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            {grp.category}
                          </span>
                          {grp.badge ? (
                            <span className="rounded-full bg-paper-2 border border-line px-2 py-0.5 text-xs font-semibold text-slate-600">
                              {grp.badge}
                            </span>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {groupItems.map((item) => {
                            const aktif = item.id === service.id;
                            const itemAksen = aksenLayanan(item.id);
                            let variantTag = null;
                            if (item.id === "artikel_ilmiah") {
                              variantTag = "Varian Tugas Kuliah (≤3.000 kata)";
                            } else if (item.id === "jurnal_submit") {
                              variantTag = "Varian Siap Submit (≤6.000 kata)";
                            } else if (item.id === "paket_abstrak") {
                              variantTag = "Varian Abstrak ID+EN (≤300 kata)";
                            }

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => pilihLayananLain(item.id)}
                                aria-pressed={aktif}
                                aria-label={`${item.name}, ${priceLabel(item)}`}
                                className={`group relative flex flex-col items-start rounded-2xl border p-3.5 text-left transition duration-200 cursor-pointer ${
                                  aktif
                                    ? `${itemAksen.soft} ${itemAksen.border} ring-2 ${itemAksen.ring} shadow-md`
                                    : "border-line bg-white hover:border-line-strong hover:bg-paper-2/40"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className="p-1.5 rounded-xl border"
                                      style={{
                                        backgroundColor: `${itemAksen.hex}15`,
                                        borderColor: `${itemAksen.hex}30`,
                                        color: itemAksen.hex,
                                      }}
                                    >
                                      <ServiceIcon id={item.id} className="size-5" />
                                    </span>
                                    {variantTag ? (
                                      <span className="rounded-md bg-paper-2 border border-line px-2 py-0.5 text-xs font-bold text-brand">
                                        {variantTag}
                                      </span>
                                    ) : null}
                                  </div>
                                  <span
                                    aria-hidden
                                    className={`size-2.5 rounded-full ${itemAksen.dot}`}
                                  />
                                </div>
                                <span className="mt-2.5 text-sm font-bold text-ink leading-tight">
                                  {item.name}
                                </span>
                                <span className="mt-1 font-mono text-xs text-slate-600 font-medium">
                                  {priceLabel(item)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <PesanGalat id="galat-layanan" pesan={galat?.serviceId} />
              </fieldset>

              {/* Jumlah Satuan & Slider & Stepper */}
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="jumlah" className={labelClass}>
                    2.{" "}
                    {service.id === "artikel_ilmiah"
                      ? "Perkiraan Jumlah Kata Naskah (Maks. 3.000 kata)"
                      : service.id === "jurnal_submit"
                        ? "Perkiraan Jumlah Kata Naskah (Maks. 6.000 kata)"
                        : service.id === "paket_abstrak"
                          ? "Jumlah Kata per Versi (Maks. 300 kata)"
                          : service.id === "word"
                            ? "Jumlah Halaman Dokumen Word"
                            : `Jumlah ${BASIS_LABEL[service.basis]}`}
                  </label>
                  <span className="rounded-full bg-paper-2 px-3 py-1 text-xs font-bold text-ink-soft">
                    {price.equivalentLabel}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Stepper controls */}
                    <div className="flex items-center rounded-2xl border border-line bg-paper-2 p-1.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => sesuaikanJumlah(-1)}
                        className="grid size-11 place-items-center rounded-xl bg-white text-ink shadow-2xs transition hover:bg-brand hover:text-white active:scale-95 cursor-pointer"
                        aria-label={`Kurangi jumlah ${BASIS_LABEL[service.basis]}`}
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
                        className="w-28 bg-transparent text-center font-mono text-xl font-bold tabular-nums text-ink focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => sesuaikanJumlah(1)}
                        className="grid size-11 place-items-center rounded-xl bg-white text-ink shadow-2xs transition hover:bg-brand hover:text-white active:scale-95 cursor-pointer"
                        aria-label={`Tambah jumlah ${BASIS_LABEL[service.basis]}`}
                      >
                        <Plus className="size-4 stroke-[2.5]" />
                      </button>
                    </div>

                    <div>
                      <span className="block text-base font-bold text-ink-soft">
                        {BASIS_LABEL[service.basis]}
                      </span>
                      <span className="block text-xs text-muted">
                        Min. {service.minQty} {BASIS_LABEL[service.basis]}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-bold uppercase tracking-wider text-muted">
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
                    aria-valuemin={service.minQty}
                    aria-valuemax={sliderMax}
                    aria-valuenow={currentQty}
                    aria-valuetext={`${currentQty} ${BASIS_LABEL[service.basis]}`}
                  />
                  <div className="flex justify-between text-xs text-muted font-mono mt-1">
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
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-mint/25 bg-mint-soft/90 px-4 py-2.5 text-[0.78rem] text-mint">
                    <div className="flex items-center gap-2 font-bold">
                      <Sparkles className="size-4 text-mint fill-mint" />
                      <span>{price.discountLabel} aktif otomatis!</span>
                    </div>
                    <span className="shrink-0 rounded-lg bg-mint px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                      Hemat {rupiah(price.discountAmount)}
                    </span>
                  </div>
                ) : price.nextDiscountHint ? (
                  <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-amber/25 bg-amber-soft/70 px-4 py-2 text-xs text-amber">
                    <span className="flex items-center gap-1.5"><Lightbulb className="size-3.5 shrink-0" />{price.nextDiscountHint}</span>
                    <span className="shrink-0 font-bold text-amber">
                      Diskon Otomatis
                    </span>
                  </div>
                ) : null}

                {/* Banner Peringatan Melebihi Batas Hitungan Otomatis */}
                {price.isOverLimit ? (
                  <div className="mt-4 rounded-2xl border border-amber/35 bg-amber-soft/85 p-4 text-[0.82rem] text-ink-soft">
                    <p className="font-bold text-amber-950 flex items-center gap-2">
                      <Lightbulb className="size-4 shrink-0 text-amber" />
                      <span>Dialihkan ke Mode Penawaran Khusus</span>
                    </p>
                    <p className="mt-1.5 leading-relaxed text-ink-soft">
                      {price.overLimitMessage ??
                        "Jumlah naskah melebihi batas perhitungan otomatis. Silakan kirimkan brief ke Mas Joki untuk penawaran waktu & biaya khusus."}
                    </p>
                  </div>
                ) : null}

                <PesanGalat id="galat-jumlah" pesan={galat?.qty} />

                {/* Preset Chips */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-line pt-3.5">
                  <span className="text-xs font-bold text-muted">
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
                        className={`rounded-xl border px-3.5 py-1.5 font-mono text-xs font-bold tabular-nums transition cursor-pointer ${
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
                    <span className="text-xs font-bold text-ink-soft">
                      Hanya tahu jumlah halaman A4? Pilih taksiran:
                    </span>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
                      {KONVERSI_HALAMAN_KATA.map((item) => {
                        const aktif = price.qty === item.kata;
                        return (
                          <button
                            key={item.hal}
                            type="button"
                            onClick={() => ubahJumlah(String(item.kata))}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                              aktif
                                ? "border-brand bg-brand-soft text-brand shadow-2xs"
                                : "border-line bg-white text-ink-soft hover:border-brand hover:text-brand"
                            }`}
                          >
                            <span>
                              {item.hal} Hal (≈{angka(item.kata)} kata)
                            </span>
                            {item.badge ? (
                              <span className="rounded bg-mint-soft px-1 py-0.2 text-xs font-bold text-mint">
                                {item.badge}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Alat Bantu Penghitung Kata Mandiri */}
                {service.basis === "kata" ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setBukaHitungKata(!bukaHitungKata)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline cursor-pointer"
                    >
                      <FileText className="size-3.5" />
                      <span>{bukaHitungKata ? "Tutup Penghitung Kata" : "Belum tahu jumlah kata? Cek di sini"}</span>
                    </button>

                    {bukaHitungKata && (
                      <div className="mt-2.5 rounded-2xl border border-brand/20 bg-brand-soft/30 p-3.5 sm:p-4">
                        <label htmlFor="tempel-naskah" className="block text-xs font-bold text-ink mb-1.5">
                          Tempel Naskah / Teks Tugas di Sini:
                        </label>
                        <textarea
                          id="tempel-naskah"
                          rows={4}
                          value={teksNaskah}
                          onChange={(e) => setTeksNaskah(e.target.value)}
                          placeholder="Paste teks tugas atau draft naskahmu di sini untuk menghitung kata secara otomatis..."
                          className="w-full rounded-xl border border-line bg-white p-3 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-y"
                        />
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                            <span>
                              <strong className="font-mono font-bold text-ink">{kataTerhitung}</strong> kata
                            </span>
                            <span>•</span>
                            <span>
                              <strong className="font-mono font-bold text-ink">{teksNaskah.length}</strong> karakter
                            </span>
                            <span>•</span>
                            <span>
                              ±<strong className="font-mono font-bold text-ink">{Math.max(1, Math.ceil(kataTerhitung / 250))}</strong> halaman A4
                            </span>
                          </div>

                          {kataTerhitung > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                ubahJumlah(String(kataTerhitung));
                                setBukaHitungKata(false);
                              }}
                              className="rounded-xl bg-brand px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-brand-dark transition cursor-pointer"
                            >
                              Terapkan {angka(kataTerhitung)} Kata
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500 font-medium">
                          🔒 100% aman: Teks dihitung langsung di browsermu, tidak disimpan atau dikirim ke mana pun.
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}

                <input type="hidden" name="qty" value={price.qty} />
                <input type="hidden" name="serviceId" value={service.id} />
              </div>

              {/* Tenggat Waktu */}
              <fieldset id="tenggat-hitung" tabIndex={-1}>
                <div className="flex items-center justify-between mb-2.5">
                  <legend className="text-[0.84rem] font-bold text-ink">
                    3. Kapan tugas ini dibutuhkan?
                  </legend>
                  <span className="text-xs font-semibold text-mint flex items-center gap-1" title={estimatedDateRange || undefined}>
                    <Clock className="size-3.5" />
                    <span>Estimasi: {price.estimatedTurnaround} {estimatedDateRange ? `(${estimatedDateRange})` : ""}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
                        className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 transition duration-200 ${
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
                            <span className="block text-[0.88rem] font-bold text-ink">
                              {item.label}
                            </span>
                            <span className="block text-xs text-muted mt-0.5">
                              {item.note}
                            </span>
                          </div>
                        </div>

                        {item.mult > 1 ? (
                          <span className="rounded-lg bg-amber-soft px-2 py-0.5 text-xs font-bold text-amber">
                            +{Math.round((item.mult - 1) * 100)}%
                          </span>
                        ) : (
                          <span className="rounded-lg bg-mint-soft px-2 py-0.5 text-xs font-bold text-mint">
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
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber" />
                <p className="leading-relaxed">
                  <strong className="text-ink font-bold">Tentang Tingkat Kesulitan:</strong> Estimasi dihitung otomatis untuk pengerjaan tugas standar/umum. Jika tugasmu memiliki kebutuhan analisis data teknis khusus (seperti olah data SPSS, coding, atau uji laboratorium), Mas Joki yang akan menilai dan mengonfirmasi kesepakatannya di WhatsApp setelah memeriksa file brief.
                </p>
              </div>

              <input type="hidden" name="difficultyId" value="standar" />

              {/* Opsi Tambahan / Pendamping Kontekstual */}
              {availableAddons.length > 0 ? (
                <fieldset>
                  <div className="flex items-center justify-between mb-2.5">
                    <legend className="text-[0.84rem] font-bold text-ink">
                      4. Opsi Pendamping Tambahan (Opsional)
                    </legend>
                    <span className="text-xs font-semibold text-muted">
                      Bisa pilih lebih dari satu
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableAddons.map((addon) => {
                      const terpilih = activeAddonIds.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 transition duration-200 ${
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
                              <span className="block text-[0.84rem] font-bold text-ink leading-snug">
                                {addon.label}
                              </span>
                              <span className="mt-1 block text-xs leading-snug text-muted">
                                {addon.note}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-lg bg-paper-2 px-2 py-1 font-mono text-xs font-bold text-brand">
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
                <p className="mt-1.5 text-xs text-slate-600">
                  Semakin rinci brief yang kamu berikan, semakin akurat dan cepat Mas Joki memberikan harga penawaran.
                </p>
              </div>

              <fieldset id="tenggat-kutipan" tabIndex={-1}>
                <legend className={labelClass}>Dibutuhkan Kapan?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DEADLINES.map((item) => (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
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
                      <span className="text-xs text-muted">
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
        <div id="ringkasan-nota" className="min-w-0 scroll-mt-20 lg:col-start-2 lg:row-span-2 lg:row-start-1">
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
                  estimatedDateRange={estimatedDateRange}
                  equivalentLabel={price.equivalentLabel}
                  note="Harga terkunci setelah file dicek Mas Joki. Tidak ada biaya tersembunyi."
                  stamp="Harga Transparan"
                  code="EST-LIVE"
                  aksen={aksen}
                  minimumAdjustmentNote={price.minimumAdjustmentNote}
                />
              ) : (
                <NotaPenawaran
                  serviceName={service.name}
                  deadlineLabel={DEADLINES.find((d) => d.id === deadlineId)?.label}
                />
              )}

              {/* CTA Ringkas untuk Beranda (Task 3b) */}
              {ringkas && (
                <div className="mt-4 space-y-2">
                  <Link
                    href={`/hitung?layanan=${service.id}&jumlah=${currentQty}&tenggat=${deadlineId}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl active:translate-y-0 cursor-pointer"
                  >
                    <span>Lanjut Pesan dengan Hitungan Ini</span>
                    <ArrowRight className="size-4.5" />
                  </Link>
                  <p className="text-center text-xs leading-relaxed text-slate-500 font-medium">
                    Hitungan otomatis diteruskan ke formulir pesanan di halaman kalkulator.
                  </p>
                </div>
              )}
            </div>

            {/* Benefit Box */}
            <div className="mt-5 rounded-2xl border border-line bg-paper-2/90 p-5 text-[0.8rem] shadow-xs">
              <p className="font-bold text-ink mb-2.5">
                Jaminan Layanan Mas Joki:
              </p>
              <ul className="space-y-2 text-ink-soft">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-mint shrink-0" />
                  <span>
                    <strong>Bisa DP 50% Dulu</strong>, pelunasan saat tugas beres
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-mint shrink-0" />
                  <span>
                    <strong>Gratis 2× Revisi</strong> sesuai brief awal
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-mint shrink-0" />
                  <span>
                    <strong>File Sumber Diserahkan</strong> (Word, PPT, dll.)
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-mint shrink-0" />
                  <span>
                    <strong>Bayar via E-Wallet</strong>: ShopeePay, GoPay, DANA
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Kolom Kiri Bawah: Form Kontak & Submit CTA (Hanya di /hitung, Task 3a) */}
        {!ringkas && (
          <div
            id="kontak-pesan"
            className="scroll-mt-20 space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-sm lg:col-start-1 lg:row-start-2"
          >
          <div>
            <h3 className="font-display text-xl font-bold text-ink">
              Data Kontak &amp; Pengiriman
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Hanya digunakan Mas Joki untuk konfirmasi pengerjaan dan mengirim hasil file.
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
                placeholder="Contoh: Budi"
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
            <p className="mt-1.5 text-xs text-muted">
              Tautan Google Drive atau OneDrive. Pastikan izin berbagi diset{" "}
              <em>&quot;Siapa saja yang memiliki link dapat melihat&quot;</em>.{" "}
              <span className="block mt-0.5 text-ink-soft font-medium">💡 Belum punya link Drive? Jangan khawatir, kamu bisa langsung melampirkan file dokumen di chat WhatsApp nanti.</span>
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
          {mode === "hitung" && price.isOverLimit ? (
            <div className="space-y-3">
              <a
                href={waLink(
                  `Halo Mas Joki, saya mau minta penawaran untuk layanan ${service.name} dengan jumlah perkiraan ${price.qty} ${BASIS_LABEL[service.basis]}. Tenggat: ${price.deadline.label}. Mohon info estimasi biaya dan waktu pengerjaannya!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-brand px-7 py-4.5 text-[0.98rem] font-bold text-white shadow-lg shadow-brand/25 transition duration-200 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35 cursor-pointer"
              >
                <Send className="size-4.5" />
                <span>Kirim Penawaran via WhatsApp</span>
                <ArrowRight className="size-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setMode("penawaran");
                  setQuoteService(service.id);
                }}
                className="w-full py-2 text-center text-xs font-bold text-brand hover:underline cursor-pointer"
              >
                Atau isi formulir detail di mode Minta Penawaran →
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-brand px-7 py-4.5 text-[0.98rem] font-bold text-white shadow-lg shadow-brand/25 transition duration-200 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0 cursor-pointer"
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
                  <ArrowRight className="size-4" />
                </>
              ) : (
                <>
                  <Send className="size-4.5" />
                  <span>Kirim Permintaan Penawaran</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          )}

          <p className="text-center text-xs leading-relaxed text-slate-500">
            Tanpa buat akun. Pesan akan terbuka otomatis di aplikasi WhatsApp kamu.
          </p>
        </div>
        )}
      </form>


    </div>
  );
}

function NotaPenawaran({
  serviceName,
  deadlineLabel,
}: {
  serviceName?: string;
  deadlineLabel?: string;
} = {}) {
  const barisPenawaran = [
    { label: "Jenis tugas", val: serviceName ?? "Disesuaikan" },
    { label: "Jumlah satuan", val: "Disesuaikan" },
    { label: "Tenggat", val: deadlineLabel ?? "Disesuaikan" },
    { label: "Tingkat kerumitan", val: "Sesuai brief" },
  ];

  return (
    <div className="nota">
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 -rotate-3 place-items-center rounded-2xl border border-brand/20 bg-brand-soft text-brand shadow-xs">
              <span className="font-display text-[0.88rem] font-bold">MJ</span>
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-none tracking-tight text-ink">
                Mas Joki
              </p>
              <p className="mt-1 text-[13px] font-semibold text-slate-600">
                Penawaran Khusus
              </p>
            </div>
          </div>
          <span className="rounded-md bg-paper-2 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-slate-600 border border-line">
            CUSTOM
          </span>
        </div>

        <div className="my-5 border-t border-dashed border-line" />

        <div className="space-y-3.5 text-[0.88rem]">
          {barisPenawaran.map((item) => (
            <div key={item.label} className="flex items-baseline justify-between gap-3">
              <p className="font-medium text-ink">{item.label}</p>
              <span className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-line-strong" />
              <p className="font-mono text-xs text-slate-600 font-medium">{item.val}</p>
            </div>
          ))}
        </div>

        <div className="my-5 border-t border-dashed border-line" />

        <div className="flex items-end justify-between gap-3 rounded-2xl bg-paper-2/70 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink">
            Estimasi Biaya
          </p>
          <p className="font-display text-xl font-bold tracking-tight text-brand">
            Dihitung Mas Joki
          </p>
        </div>

        <p className="mt-3.5 text-xs leading-relaxed text-slate-600">
          Mas Joki akan membaca brief kamu dan memberikan penawaran terbaik dalam &lt;1 jam kerja.
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
      <div className="overflow-hidden rounded-2xl border border-line bg-white p-7 shadow-2xl shadow-brand/10 sm:p-9">
        <div role="status" aria-live="polite">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint-soft px-3.5 py-1 text-xs font-bold text-mint">
            <span aria-hidden className="size-2 rounded-full bg-mint " />
            {mode === "hitung" ? "Pesanan Siap Dikirim" : "Brief Siap Dikirim"}
          </span>

          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {mode === "hitung"
              ? "Tinggal Kirim ke WhatsApp Mas Joki!"
              : "Tinggal Kirimkan Brief Kamu!"}
          </h3>

          <p className="mt-2.5 text-[0.94rem] leading-relaxed text-ink-soft">
            {result.message}
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-dashed border-line bg-paper-2/60 p-4.5 text-xs sm:text-sm">
          <div>
            <dt className="text-slate-600 text-xs font-bold uppercase tracking-wider">
              Layanan
            </dt>
            <dd className="mt-1 font-bold text-ink">{serviceName}</dd>
            {detail ? (
              <dd className="mt-0.5 text-xs text-slate-600">{detail}</dd>
            ) : null}
          </div>
          <div>
            <dt className="text-slate-600 text-xs font-bold uppercase tracking-wider">
              {mode === "hitung" ? "Estimasi Biaya" : "Status Harga"}
            </dt>
            <dd className="mt-1 font-mono text-base font-bold tabular-nums text-brand">
              {total ? rupiah(total) : "Dihitung Mas Joki"}
            </dd>
            {dpAmount ? (
              <dd className="mt-0.5 text-xs font-semibold text-mint">
                Bisa DP 50%: {rupiah(dpAmount)}
              </dd>
            ) : null}
          </div>
        </dl>

        {result.waUrl ? (
          <>
            <div className="mt-6 rounded-2xl border border-line bg-brand-soft/40 p-4.5">
              <p className="text-xs sm:text-sm font-bold text-ink">
                Metode Pembayaran (Setelah Dikonfirmasi Mas Joki):
              </p>
              <p className="mt-1 text-xs text-slate-600">
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
                      <Check className="size-3.5 text-mint" />
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
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-[0.95rem] font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35"
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

            <p className="mt-3.5 text-center text-xs leading-relaxed text-muted">
              Format chat sudah tersusun rapi otomatis. Kamu cukup klik tombol kirim di WhatsApp.
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
