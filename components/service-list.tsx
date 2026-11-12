"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "./service-icon";
import { aksenLayanan } from "@/lib/aksen";
import { hargaTampil } from "@/lib/harga-tampil";
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
    "Penulisan artikel ilmiah tugas kuliah atau artikel jurnal siap submit publikasi, mulai Rp 250.000.",
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


interface ServiceListProps {
  isCatalogPage?: boolean;
  hanyaHighlight?: boolean;
}

export function ServiceList({
  hanyaHighlight = false,
}: ServiceListProps) {
  const services = hanyaHighlight
    ? CATALOG_SERVICES.filter((s) => s.popular)
    : CATALOG_SERVICES;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const deskripsi = DESKRIPSI_AWAM[service.id] ?? service.promise;
          const harga = hargaTampil(service.id);
          const aksen = aksenLayanan(service.id);
          const isUnggulan = service.id === "humanisasi" || service.id === "turnitin_ai";

          return (
            <div
              key={service.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isUnggulan
                  ? "border-2 border-brand/50 shadow-md ring-1 ring-brand/15"
                  : "border border-line shadow-sm hover:border-brand/40"
              }`}
            >
              {/* Garis atas mengikuti warna layanan, bukan warna aksi. */}
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1.5 transition-[height] duration-300 group-hover:h-2 motion-reduce:transition-none ${aksen.dot}`}
              />

              <div>
                {/* Header: Ikon Seragam Brand & Badge Populer Bersih */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`grid size-12 place-items-center rounded-2xl border border-line shadow-2xs transition-transform duration-200 group-hover:scale-105 ${aksen.soft}`}>
                    <ServiceIcon id={service.id} className="size-7" />
                  </div>

                  {isUnggulan ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint-soft px-2.5 py-0.5 text-xs font-bold text-mint shadow-2xs">
                      <span className="size-1.5 rounded-full bg-mint" />
                      Produk Unggulan
                    </span>
                  ) : service.popular ? (
                    <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">
                      Populer
                    </span>
                  ) : null}
                </div>

                {/* Title */}
                <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                  <Link href={`/jasa/${service.id}`} className="hover:underline">
                    {service.name}
                  </Link>
                </h3>

                {/* Highlight Tag Khusus Produk Unggulan */}
                {service.id === "humanisasi" && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-mint">
                    <span>✓</span>
                    <span>Penyuntingan manual agar terbaca alami</span>
                  </p>
                )}
                {service.id === "turnitin_ai" && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-brand">
                    <span>✓</span>
                    <span>Penyuntingan Manual &amp; Target Aman</span>
                  </p>
                )}

                {/* Satu Kalimat Penjelasan Bahasa Awam (minimal 14px text-sm line-height >= 1.55) */}
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {deskripsi}
                </p>
              </div>

              {/* Baris Harga Seragam & Tombol Hitung */}
              <div className="mt-6 border-t border-dashed border-line pt-4 flex items-end justify-between gap-3">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Tarif Mulai
                  </span>
                  <p className="font-display text-xl sm:text-2xl font-black text-ink tabular-nums leading-none mt-1">
                    {harga.angka}
                  </p>
                  <span className="block text-xs text-slate-600 font-medium mt-1">
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
                ) : (
                  <Link
                    href={`/hitung?layanan=${service.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-brand-dark hover:shadow-md active:scale-95 shrink-0"
                  >
                    <span>Hitung</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hanyaHighlight ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line bg-paper-2/80 p-5 sm:p-6 shadow-2xs">
          <div>
            <p className="font-display text-base font-bold text-ink">
              Mencari layanan akademik lainnya?
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
              Tersedia Rapikan Word per rentang halaman, Terjemahan Akademik ID–EN, Desain Cover &amp; Poster, hingga Paket Abstrak dwibahasa.
            </p>
          </div>
          <Link
            href="/jasa"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0b1329] dark:bg-brand px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-brand dark:hover:bg-brand-dark shrink-0"
          >
            <span>Buka Semua Layanan</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        /* Glosarium Ringkas 1 Baris */
        <div className="rounded-xl border border-line bg-paper-2/70 px-4 py-3 text-xs sm:text-sm text-slate-600 sm:text-center">
          <strong className="text-ink">Bingung bedanya?</strong>{" "}
          <span>Parafrase = naskah buatanmu sendiri; </span>
          <span>Humanisasi = naskah dari AI (ChatGPT, Claude, dsb.); </span>
          <span>Rapikan Word = format &amp; tata letak saja, isi naskah tidak diubah.</span>
        </div>
      )}
    </div>
  );
}
