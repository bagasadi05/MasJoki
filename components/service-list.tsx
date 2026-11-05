"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { useOptionalCalculator } from "./calculator-context";
import { ServiceIcon } from "./service-icon";
import { StempelLayanan } from "./stempel-layanan";
import { aksenLayanan } from "@/lib/aksen";
import {
  CATALOG_SERVICES,
  type ServiceId,
} from "@/lib/services";

export const DESKRIPSI_AWAM: Record<ServiceId, string> = {
  parafrase:
    "Menulis ulang teks yang sudah ada dengan kata-kata baru — maknanya tetap, tampilannya beda.",
  humanisasi:
    "Khusus teks hasil AI: dibuat terbaca natural seperti tulisan manusia. Beda dengan parafrase yang untuk teks tulisan sendiri.",
  makalah:
    "Menyusun tugas makalah dan laporan dari referensi yang kamu kirim, lengkap dengan daftar pustaka (daftar referensi).",
  artikel_ilmiah:
    "Artikel ilmiah terstruktur untuk tugas kuliah, lengkap dengan sitasi (rujukan kutipan) dan daftar pustaka.",
  jurnal_submit:
    "Artikel jurnal standar publikasi (SINTA/internasional), struktur IMRAD (struktur jurnal) lengkap siap submit.",
  jurnal:
    "Penulisan artikel ilmiah tugas kuliah atau artikel jurnal siap submit publikasi, mulai Rp250.000.",
  powerpoint:
    "Membuat slide presentasi yang rapi, visual, dan enak dibaca dari materi tugas atau makalahmu.",
  word:
    "Merapikan margin, penomoran halaman, dan daftar isi otomatis sesuai pedoman kampusmu.",
  terjemah:
    "Menerjemahkan teks akademik Indonesia–Inggris secara luwes dan kontekstual, tersedia opsi Paket Abstrak.",
  paket_abstrak:
    "Pasangan abstrak dua versi (Indonesia + Inggris) untuk skripsi atau artikel jurnal.",
  desain:
    "Membuat cover tugas, poster ilmiah, atau infografis rapi lengkap dengan file sumber yang bisa diedit.",
  turnitin_ai:
    "Menurunkan skor kemiripan (skor Turnitin) dan deteksi AI naskahmu hingga target aman yang disepakati.",
};

export const HARGA_SERAGAM: Record<
  ServiceId,
  { angka: string; satuan: string }
> = {
  parafrase: { angka: "Rp3.000", satuan: "per 100 kata" },
  humanisasi: { angka: "Rp4.000", satuan: "per 100 kata" },
  makalah: { angka: "Rp12.000", satuan: "per halaman" },
  artikel_ilmiah: {
    angka: "Rp250.000",
    satuan: "per artikel (maks. 3.000 kata)",
  },
  jurnal_submit: {
    angka: "Rp400.000",
    satuan: "per artikel (maks. 6.000 kata)",
  },
  jurnal: { angka: "Rp250.000", satuan: "mulai 2 pilihan tingkat" },
  powerpoint: { angka: "Rp7.500", satuan: "per slide" },
  word: { angka: "Rp30.000", satuan: "berdasarkan jumlah halaman" },
  terjemah: { angka: "Rp10.000", satuan: "per 100 kata" },
  paket_abstrak: { angka: "Rp35.000", satuan: "per paket (ID+EN)" },
  desain: { angka: "Rp45.000", satuan: "per desain" },
  turnitin_ai: { angka: "Minta Penawaran", satuan: "sesuai skor awal & naskah" },
};

const KODE_LAYANAN: Record<ServiceId, string> = {
  parafrase: "PF-01",
  humanisasi: "HM-02",
  makalah: "MK-03",
  artikel_ilmiah: "AI-04A",
  jurnal_submit: "JS-04B",
  jurnal: "JR-04",
  powerpoint: "PT-05",
  word: "WD-06",
  terjemah: "TJ-07",
  paket_abstrak: "AB-07B",
  desain: "DS-08",
  turnitin_ai: "TI-09",
};

interface ServiceListProps {
  isCatalogPage?: boolean;
}

export function ServiceList({ isCatalogPage = false }: ServiceListProps) {
  const calc = useOptionalCalculator();

  function onHitungClick(serviceId: ServiceId) {
    if (calc) {
      calc.pilihLayanan(serviceId);
      const target =
        document.getElementById("kalkulator") || document.getElementById("hitung");
      target?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/hitung?layanan=${serviceId}`;
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CATALOG_SERVICES.map((service) => {
        const aksen = aksenLayanan(service.id);
        const kode = KODE_LAYANAN[service.id];
        const deskripsi = DESKRIPSI_AWAM[service.id] ?? service.promise;
        const harga = HARGA_SERAGAM[service.id];

        return (
          <div
            key={service.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
          >
            {/* Top colored accent line */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ backgroundColor: aksen.hex }}
            />

            <div>
              {/* Header: Icon & Stamp & Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="grid size-11 place-items-center rounded-2xl border shadow-2xs transition-transform duration-200 group-hover:scale-105"
                    style={{
                      backgroundColor: `${aksen.hex}14`,
                      borderColor: `${aksen.hex}30`,
                      color: aksen.hex,
                    }}
                  >
                    <ServiceIcon id={service.id} className="size-5" />
                  </div>
                  <StempelLayanan id={service.id} ukuran="kecil" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-slate-500 tracking-wider">
                    {kode}
                  </span>
                  {service.popular ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber/25 bg-amber-soft px-2 py-0.5 text-xs font-bold text-amber shadow-2xs">
                      <Flame className="size-2.5 text-amber fill-amber" />
                      <span>Populer</span>
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                <Link href={`/jasa/${service.id}`} className="hover:underline">
                  {service.name}
                </Link>
              </h3>

              {/* Satu Kalimat Penjelasan Bahasa Awam (<= 18 kata) */}
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                {deskripsi}
              </p>
            </div>

            {/* Baris Harga Seragam (Angka besar, satuan kecil di bawahnya) & Tombol Hitung */}
            <div className="mt-6 border-t border-dashed border-line pt-4 flex items-end justify-between gap-3">
              <div>
                <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                  Tarif Mulai
                </span>
                <p className="font-display text-xl sm:text-2xl font-black text-ink tabular-nums leading-none mt-1">
                  {harga.angka}
                </p>
                <span className="block text-xs text-slate-500 font-medium mt-1">
                  {harga.satuan}
                </span>
              </div>

              {service.customQuoteOnly ? (
                <Link
                  href="/hitung?mode=penawaran&layanan=turnitin_ai"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-brand-dark hover:shadow-md active:scale-95 shrink-0"
                >
                  <span>Minta Penawaran</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : isCatalogPage ? (
                <Link
                  href={`/hitung?layanan=${service.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-brand-dark hover:shadow-md active:scale-95 shrink-0"
                >
                  <span>Hitung</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => onHitungClick(service.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-brand-dark hover:shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <span>Hitung</span>
                  <ArrowRight className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>

      {/* Glosarium Ringkas 1 Baris (Tugas 3 Poin 5) */}
      <div className="rounded-xl border border-line bg-paper-2/70 px-4 py-3 text-xs text-slate-600 sm:text-center">
        <strong className="text-ink">Bingung bedanya?</strong>{" "}
        <span>Parafrase = naskah buatanmu sendiri; </span>
        <span>Humanisasi = naskah dari AI (ChatGPT, Claude, dsb.); </span>
        <span>Rapikan Word = format &amp; tata letak saja, isi naskah tidak diubah.</span>
      </div>
    </div>
  );
}
