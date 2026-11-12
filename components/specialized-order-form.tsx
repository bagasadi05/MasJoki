"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Lightbulb,
  Minus,
  Plus,
  Rocket,
  Send,
  ShieldCheck,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";
import { submitSpecializedOrder } from "@/app/actions";
import { AnimatedPrice } from "./animated-number";
import { Nota } from "./nota";
import { ServiceIcon } from "./service-icon";
import { aksenLayanan } from "@/lib/aksen";
import { angka, rupiah } from "@/lib/format";
import { getOrderSpec } from "@/lib/order-specs";
import { useEstimatedDateRange } from "./use-wib-status";
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
  priceLabel,
  type Service,
} from "@/lib/services";
import { pembayaran } from "@/lib/site";
import type { ActionResult } from "@/lib/types";

const fieldClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-base sm:text-sm text-ink placeholder:text-muted/60 transition-all duration-150 hover:border-line-strong focus:border-brand focus:ring-3 focus:ring-brand/15 focus:outline-none";

const labelClass = "mb-2 block text-[0.84rem] font-bold text-ink";

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

const KONVERSI_HALAMAN_KATA = [
  { hal: 2, kata: 500 },
  { hal: 4, kata: 1000 },
  { hal: 8, kata: 2000 },
  { hal: 12, kata: 3000, badge: "-5%" },
  { hal: 20, kata: 5000, badge: "-10%" },
];

interface SpecializedOrderFormProps {
  service: Service;
}

export function SpecializedOrderForm({ service }: SpecializedOrderFormProps) {
  const aksen = aksenLayanan(service.id);
  const spec = useMemo(() => getOrderSpec(service.id), [service.id]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [qty, setQty] = useState<number>(service.defaultQty);
  const [deadlineId, setDeadlineId] = useState<DeadlineId>("normal");
  const estimatedDateRange = useEstimatedDateRange(deadlineId);
  const difficultyId: DifficultyId = "standar";
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>([]);

  // Specialized fields state
  const [checkerTool, setCheckerTool] = useState<string>(
    spec.checkerOptions?.[0]?.value ?? "",
  );
  const [currentScore, setCurrentScore] = useState<string>(
    spec.currentScoreOptions?.[0]?.value ?? "",
  );
  const [targetScore, setTargetScore] = useState<string>(
    spec.targetScoreOptions?.[0]?.value ?? "",
  );
  const [citationStyle, setCitationStyle] = useState<string>(
    spec.citationOptions?.[0]?.value ?? "",
  );
  const [customPreference, setCustomPreference] = useState<string>(
    spec.customQuestionOptions?.[0]?.value ?? "",
  );

  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const stepContainerRef = useRef<HTMLDivElement>(null);
  const galat = result?.fieldErrors;

  useEffect(() => {
    stepContainerRef.current?.focus({ preventScroll: true });
  }, [step]);

  const availableAddons = useMemo(
    () => getAddonsForService(service.id),
    [service.id],
  );

  const price = useMemo(
    () =>
      computePrice(
        service,
        qty,
        deadlineId,
        difficultyId,
        selectedAddons,
      ),
    [service, qty, deadlineId, difficultyId, selectedAddons],
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

  function ubahJumlah(val: number) {
    setQty(Math.max(service.minQty, val));
  }

  function sesuaikanJumlah(selisih: number) {
    const langkah = service.chunk > 1 ? service.chunk : 1;
    ubahJumlah(qty + selisih * langkah);
  }

  function toggleAddon(addonId: AddonId) {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  }

  function kirim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const jawaban = await submitSpecializedOrder(null, data);
      setResult(jawaban);
      if (jawaban.status === "ok") {
        form.reset();
      } else if (jawaban.fieldErrors) {
        if (jawaban.fieldErrors.qty) {
          setStep(1);
          setTimeout(() => document.getElementById("jumlah-spesifik")?.focus(), 80);
        } else if (jawaban.fieldErrors.deadlineId) {
          setStep(2);
        } else if (jawaban.fieldErrors.name) {
          setStep(3);
          setTimeout(() => document.getElementById("name-input")?.focus(), 80);
        } else if (jawaban.fieldErrors.whatsapp) {
          setStep(3);
          setTimeout(() => document.getElementById("whatsapp-input")?.focus(), 80);
        } else if (jawaban.fieldErrors.fileUrl) {
          setStep(3);
          setTimeout(() => document.getElementById("fileUrl-input")?.focus(), 80);
        }
      }
    });
  }

  if (result?.status === "ok") {
    return (
      <SuccessPanel
        result={result}
        serviceName={service.name}
        detail={`${price.qty} ${BASIS_LABEL[service.basis]} · ${price.deadline.label}`}
        total={price.total}
        dpAmount={price.dpAmount}
        onReset={() => {
          setResult(null);
          setStep(1);
        }}
      />
    );
  }

  return (
    <div className="relative">
      {/* 3-Step Accessible Stepper */}
      <nav aria-label="Tahapan formulir pemesanan" className="mb-10">
        <ol className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            {
              num: 1,
              title: "Parameter & Jumlah",
              icon: Sliders,
            },
            {
              num: 2,
              title: "Tenggat & Tambahan",
              icon: Clock,
            },
            {
              num: 3,
              title: "Dokumen & Kontak",
              icon: Send,
            },
          ].map((item) => {
            const aktif = step === item.num;
            const lewat = step > item.num;
            const IconComponent = item.icon;

            return (
              <li key={item.num}>
                <button
                  type="button"
                  aria-current={aktif ? "step" : undefined}
                  onClick={() => setStep(item.num as 1 | 2 | 3)}
                  className={`w-full flex items-center gap-2.5 rounded-2xl border p-3 sm:p-4 text-left transition-all cursor-pointer ${
                    aktif
                      ? "border-brand bg-brand-soft/70 ring-2 ring-brand/20 shadow-xs"
                      : lewat
                        ? "border-mint/25 bg-mint-soft/50 text-mint"
                        : "border-line bg-white text-muted hover:border-line-strong"
                  }`}
                >
                  <div
                    className={`grid size-8 place-items-center rounded-xl text-xs font-bold shrink-0 ${
                      aktif
                        ? "bg-brand text-white shadow-2xs"
                        : lewat
                          ? "bg-mint text-white"
                          : "bg-paper-2 text-ink-soft"
                    }`}
                  >
                    {lewat ? <Check className="size-4 stroke-[3]" /> : item.num}
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p
                      className={`text-xs font-bold ${
                        aktif ? "text-brand" : "text-muted"
                      }`}
                    >
                      Langkah 0{item.num}
                    </p>
                    <p className="font-bold text-[0.84rem] text-ink truncate leading-tight mt-0.5">
                      {item.title}
                    </p>
                  </div>
                  <IconComponent className="size-4 ml-auto hidden sm:block opacity-40 shrink-0" />
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <form
        ref={formRef}
        onSubmit={kirim}
        noValidate
        className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12"
      >
        {/* Hidden Form Data */}
        <input type="hidden" name="serviceId" value={service.id} />
        <input type="hidden" name="qty" value={price.qty} />
        <input type="hidden" name="deadlineId" value={deadlineId} />
        <input type="hidden" name="difficultyId" value={difficultyId} />
        <input type="hidden" name="checkerTool" value={checkerTool} />
        <input type="hidden" name="currentScore" value={currentScore} />
        <input type="hidden" name="targetScore" value={targetScore} />
        <input type="hidden" name="citationStyle" value={citationStyle} />
        <input type="hidden" name="customPreference" value={customPreference} />
        {selectedAddons.map((addon) => (
          <input key={addon} type="hidden" name="addons" value={addon} />
        ))}

        {/* Kolom Kiri: Form Steps */}
        <div ref={stepContainerRef} tabIndex={-1} className="space-y-8 lg:col-start-1 outline-none">
          {/* STEP 1: PARAMETER & JUMLAH */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              {/* Header Box Layanan */}
              <div
                className="rounded-2xl border p-6 flex items-start gap-4"
                style={{
                  backgroundColor: `${aksen.hex}08`,
                  borderColor: `${aksen.hex}30`,
                }}
              >
                <div
                  className="grid size-12 place-items-center rounded-2xl border text-xl shrink-0"
                  style={{
                    backgroundColor: `${aksen.hex}20`,
                    borderColor: `${aksen.hex}40`,
                    color: aksen.hex,
                  }}
                >
                  <ServiceIcon id={service.id} className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold text-ink">
                      {service.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-brand bg-white px-2 py-0.5 rounded-md border border-brand/20">
                      {priceLabel(service)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                    {spec.subheadline}
                  </p>
                </div>
              </div>

              {/* Checker Tool Selector */}
              {spec.checkerOptions ? (
                <div>
                  <label className={labelClass}>{spec.checkerTitle}</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {spec.checkerOptions.map((opt) => {
                      const aktif = checkerTool === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={aktif}
                          onClick={() => setCheckerTool(opt.value)}
                          className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                            aktif
                              ? "border-brand bg-brand-soft ring-2 ring-brand/20 font-bold text-brand shadow-xs"
                              : "border-line bg-white hover:border-line-strong text-ink-soft"
                          }`}
                        >
                          <span className="text-[0.84rem]">{opt.label}</span>
                          {opt.badge ? (
                            <span className="rounded-md bg-paper-2 px-2 py-0.5 text-xs font-bold text-muted">
                              {opt.badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Current Score Selector */}
              {spec.currentScoreOptions ? (
                <div>
                  <label className={labelClass}>{spec.currentScoreTitle}</label>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {spec.currentScoreOptions.map((opt) => {
                      const aktif = currentScore === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={aktif}
                          onClick={() => setCurrentScore(opt.value)}
                          className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                            aktif
                              ? "border-amber/40 bg-amber-soft/70 ring-2 ring-amber/25 font-bold text-amber shadow-xs"
                              : "border-line bg-white hover:border-line-strong text-ink-soft"
                          }`}
                        >
                          <span className="text-[0.86rem] font-bold">
                            {opt.label}
                          </span>
                          {opt.description ? (
                            <span className="mt-0.5 text-xs text-muted">
                              {opt.description}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Target Score Selector */}
              {spec.targetScoreOptions ? (
                <div>
                  <label className={labelClass}>{spec.targetScoreTitle}</label>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {spec.targetScoreOptions.map((opt) => {
                      const aktif = targetScore === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={aktif}
                          onClick={() => setTargetScore(opt.value)}
                          className={`flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                            aktif
                              ? "border-mint/40 bg-mint-soft ring-2 ring-mint/25 text-mint shadow-xs"
                              : "border-line bg-white hover:border-line-strong text-ink-soft"
                          }`}
                        >
                          <div>
                            {opt.badge ? (
                              <span className="inline-block rounded-md bg-mint px-2 py-0.5 text-xs font-bold text-white mb-1">
                                {opt.badge}
                              </span>
                            ) : null}
                            <span className="block text-[0.84rem] font-bold leading-snug">
                              {opt.label}
                            </span>
                          </div>
                          {opt.description ? (
                            <span className="mt-1.5 block text-xs text-muted">
                              {opt.description}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Citation Options (for Makalah & Jurnal) */}
              {spec.citationOptions ? (
                <div>
                  <label className={labelClass}>{spec.citationTitle}</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {spec.citationOptions.map((opt) => {
                      const aktif = citationStyle === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={aktif}
                          onClick={() => setCitationStyle(opt.value)}
                          className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                            aktif
                              ? "border-brand bg-brand-soft ring-2 ring-brand/20 font-bold text-brand shadow-xs"
                              : "border-line bg-white hover:border-line-strong text-ink-soft"
                          }`}
                        >
                          <span className="text-[0.84rem]">{opt.label}</span>
                          {opt.badge ? (
                            <span className="rounded-md bg-paper-2 px-2 py-0.5 text-xs font-bold text-muted">
                              {opt.badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Custom Questions (Slide Style / Focus Perapian) */}
              {spec.customQuestionOptions ? (
                <div>
                  <label className={labelClass}>{spec.customQuestionTitle}</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {spec.customQuestionOptions.map((opt) => {
                      const aktif = customPreference === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={aktif}
                          onClick={() => setCustomPreference(opt.value)}
                          className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                            aktif
                              ? "border-brand bg-brand-soft ring-2 ring-brand/20 font-bold text-brand shadow-xs"
                              : "border-line bg-white hover:border-line-strong text-ink-soft"
                          }`}
                        >
                          <span className="text-[0.84rem]">{opt.label}</span>
                          {opt.badge ? (
                            <span className="rounded-md bg-paper-2 px-2 py-0.5 text-xs font-bold text-muted">
                              {opt.badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Jumlah Satuan Stepper & Slider */}
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="jumlah-spesifik" className={labelClass}>
                    Jumlah {BASIS_LABEL[service.basis]} yang Dikerjakan
                  </label>
                  <span className="rounded-full bg-paper-2 px-3 py-1 text-xs font-bold text-ink-soft">
                    {price.equivalentLabel}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-2xl border border-line bg-paper-2 p-1.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => sesuaikanJumlah(-1)}
                        className="grid size-11 place-items-center rounded-xl bg-white text-ink shadow-2xs transition-all hover:bg-brand hover:text-white active:scale-95 cursor-pointer"
                        aria-label={`Kurangi jumlah ${BASIS_LABEL[service.basis]}`}
                      >
                        <Minus className="size-4 stroke-[2.5]" />
                      </button>
                      <input
                        id="jumlah-spesifik"
                        type="text"
                        inputMode="numeric"
                        value={qty}
                        onChange={(e) =>
                          ubahJumlah(Number(e.target.value.replace(/\D/g, "")) || service.minQty)
                        }
                        className="w-28 bg-transparent text-center font-mono text-xl font-bold tabular-nums text-ink focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => sesuaikanJumlah(1)}
                        className="grid size-11 place-items-center rounded-xl bg-white text-ink shadow-2xs transition-all hover:bg-brand hover:text-white active:scale-95 cursor-pointer"
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

                {/* Range Slider */}
                <div className="mt-5">
                  <input
                    type="range"
                    min={service.minQty}
                    max={sliderMax}
                    step={sliderStep}
                    value={Math.min(qty, sliderMax)}
                    onChange={(e) => ubahJumlah(Number(e.target.value))}
                    className="w-full accent-brand cursor-pointer"
                    aria-label={`Geser jumlah ${BASIS_LABEL[service.basis]}`}
                    aria-valuemin={service.minQty}
                    aria-valuemax={sliderMax}
                    aria-valuenow={qty}
                    aria-valuetext={`${qty} ${BASIS_LABEL[service.basis]}`}
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
                  <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-amber/25 bg-amber-soft/70 px-4 py-2 text-[0.76rem] text-amber">
                    <span className="flex items-center gap-1.5"><Lightbulb className="size-3.5 shrink-0" />{price.nextDiscountHint}</span>
                    <span className="shrink-0 font-bold text-amber">
                      Diskon Otomatis
                    </span>
                  </div>
                ) : null}

                {/* Page to word helper for kata services */}
                {service.basis === "kata" ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-paper-2/70 p-3">
                    <span className="text-xs font-bold text-ink-soft">
                      Pilihan cepat halaman A4:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {KONVERSI_HALAMAN_KATA.map((item) => (
                        <button
                          key={item.hal}
                          type="button"
                          onClick={() => ubahJumlah(item.kata)}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            qty === item.kata
                              ? "border-brand bg-brand-soft text-brand"
                              : "border-line bg-white text-ink-soft hover:border-brand"
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
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Next Step Button */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-[0.94rem] font-bold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-dark cursor-pointer"
              >
                <span>Lanjut: Tentukan Tenggat &amp; Tambahan</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {/* STEP 2: TENGGAT & ADD-ONS */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              {/* Tenggat Waktu */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>Kapan Tugas Ini Harus Selesai?</label>
                  <span className="text-xs font-semibold text-mint flex items-center gap-1">
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
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDeadlineId(item.id)}
                        className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                          aktif
                            ? "border-brand bg-brand-soft/70 ring-2 ring-brand/30 shadow-sm"
                            : "border-line bg-white hover:border-line-strong hover:bg-paper-2/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
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
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Transparansi Penilaian Tingkat Kerumitan */}
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-paper-2/70 p-4 text-[0.78rem] text-ink-soft">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber" />
                <p className="leading-relaxed">
                  <strong className="text-ink font-bold">Tentang Tingkat Kesulitan:</strong> Estimasi dihitung untuk pengerjaan tugas standar/umum. Jika tugasmu memiliki kebutuhan teknis khusus (olah data statistik, lab, atau coding), Mas Joki yang akan menilai dan mengonfirmasi kesepakatannya di WhatsApp setelah memeriksa file brief.
                </p>
              </div>

              {/* Opsi Tambahan / Add-ons */}
              {availableAddons.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={labelClass}>
                      Opsi Tambahan / Pendamping (Opsional)
                    </label>
                    <span className="text-xs text-muted">Bisa pilih lebih dari satu</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableAddons.map((addon) => {
                      const terpilih = selectedAddons.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          htmlFor={`addon-${addon.id}`}
                          className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 transition-all ${
                            terpilih
                              ? "border-brand bg-brand-soft/60 ring-2 ring-brand/25 shadow-xs"
                              : "border-line bg-white hover:border-line-strong hover:bg-paper-2/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              id={`addon-${addon.id}`}
                              type="checkbox"
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
                </div>
              ) : null}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-5 py-4 text-sm font-bold text-ink hover:bg-paper-2 cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-[0.94rem] font-bold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-dark cursor-pointer"
                >
                  <span>Lanjut: Dokumen &amp; Kontak WhatsApp</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DOKUMEN & KONTAK WHATSAPP */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in rounded-2xl border border-line bg-white p-7 shadow-sm">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  Data Kontak &amp; Tautan Dokumen
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Digunakan Mas Joki untuk konfirmasi pengerjaan dan mengirim hasil jadi file.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name-input" className={labelClass}>
                    Nama Panggilan
                  </label>
                  <input
                    id="name-input"
                    name="name"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Contoh: Budi"
                    aria-invalid={galat?.name ? true : undefined}
                    aria-describedby={galat?.name ? "galat-name-input" : undefined}
                    className={fieldClass}
                  />
                  <PesanGalat id="galat-name-input" pesan={galat?.name} />
                </div>

                <div>
                  <label htmlFor="whatsapp-input" className={labelClass}>
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    id="whatsapp-input"
                    name="whatsapp"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="0812 3456 7890"
                    aria-invalid={galat?.whatsapp ? true : undefined}
                    aria-describedby={galat?.whatsapp ? "galat-whatsapp-input" : undefined}
                    className={fieldClass}
                  />
                  <PesanGalat id="galat-whatsapp-input" pesan={galat?.whatsapp} />
                </div>
              </div>

              <div>
                <label htmlFor="fileUrl-input" className={labelClass}>
                  Tautan File Dokumen / Naskah (Opsional)
                </label>
                <input
                  id="fileUrl-input"
                  name="fileUrl"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://drive.google.com/… (atau kirim file via WA)"
                  aria-invalid={galat?.fileUrl ? true : undefined}
                  aria-describedby={galat?.fileUrl ? "galat-fileUrl-input" : undefined}
                  className={fieldClass}
                />
                <PesanGalat id="galat-fileUrl-input" pesan={galat?.fileUrl} />
                <p className="mt-1.5 text-xs text-muted">
                  {spec.fileHelperText} <span className="block mt-0.5 text-ink-soft font-medium">💡 Belum punya link Drive? Jangan khawatir, kamu bisa langsung melampirkan file dokumen di chat WhatsApp nanti.</span>
                </p>
              </div>

              <div>
                <label htmlFor="notes-input" className={labelClass}>
                  Catatan Khusus untuk Mas Joki (Opsional)
                </label>
                <textarea
                  id="notes-input"
                  name="notes"
                  rows={3}
                  autoComplete="off"
                  placeholder="Contoh: Sitasi pada bab 2 tolong dipertahankan rujukan aslinya, naskah dikirim sebelum jam 5 sore."
                  className={`${fieldClass} resize-y leading-relaxed`}
                />
              </div>

              {/* Bot Honeypot */}
              <div aria-hidden className="hidden">
                <input name="perusahaan" tabIndex={-1} autoComplete="off" />
              </div>

              {result?.status === "error" ? (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-300 bg-red-50 p-4 text-[0.84rem] font-medium text-red-800"
                >
                  {result.message}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-5 py-4 text-sm font-bold text-ink hover:bg-paper-2 cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-brand px-7 py-4.5 text-[0.98rem] font-bold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {pending ? (
                    <span>Sedang Memproses…</span>
                  ) : (
                    <>
                      <Send className="size-4.5" />
                      <span>Kirim Pesanan ke WhatsApp</span>
                      <span className="rounded-lg bg-white/20 px-2.5 py-0.5 font-mono text-sm font-bold">
                        {rupiah(price.total)}
                      </span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[0.76rem] leading-relaxed text-muted">
                Tanpa perlu buat akun. Format chat terisi otomatis di aplikasi WhatsApp kamu.
              </p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Live Nota Kwitansi (Sticky) */}
        <div className="lg:col-start-2">
          <div className="lg:sticky lg:top-24">
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
              code="ORDER-SPECS"
              aksen={aksen}
            />

            {/* Jaminan Layanan Box */}
            <div className="mt-5 rounded-2xl border border-line bg-paper-2/90 p-5 text-[0.8rem] shadow-xs">
              <p className="font-bold text-ink mb-2.5">
                Jaminan Mas Joki untuk Pesanan Ini:
              </p>
              <ul className="space-y-2 text-ink-soft">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-mint shrink-0" />
                  <span>
                    <strong>Bisa DP 50% Dulu:</strong> {rupiah(price.dpAmount)} di awal
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
                    <strong>File Asli Word (.docx)</strong> diserahkan permanen
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-brand shrink-0" />
                  <span>
                    <strong>Kerahasiaan Terjamin</strong>, data naskah aman
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>

      {/* Floating Sticky Mobile Summary Bar */}
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
              <p className="text-xs font-bold uppercase tracking-wider text-muted truncate">
                Langkah {step}/3 · {service.name}
              </p>
              <p className="font-display text-lg font-bold leading-none text-brand tabular-nums">
                <AnimatedPrice value={price.total} />
              </p>
            </div>
          </div>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => ((s + 1) as 2 | 3))}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand/20 active:scale-95 cursor-pointer"
            >
              <span>Lanjut Langkah {step + 1}</span>
              <ArrowRight className="size-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand/20 active:scale-95 cursor-pointer"
            >
              <span>Kirim Pesanan</span>
              <Send className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessPanel({
  result,
  serviceName,
  detail,
  total,
  dpAmount,
  onReset,
}: {
  result: ActionResult;
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
    <div ref={panelRef} className="mx-auto max-w-xl py-6">
      <div className="overflow-hidden rounded-2xl border border-line bg-white p-7 shadow-2xl shadow-brand/10 sm:p-9">
        <div role="status" aria-live="polite">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint-soft px-3.5 py-1 text-[0.76rem] font-bold text-mint">
            <span aria-hidden className="size-2 rounded-full bg-mint " />
            Pesanan Siap Dikirim
          </span>

          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Tinggal Kirim ke WhatsApp Mas Joki!
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
              Estimasi Biaya
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
