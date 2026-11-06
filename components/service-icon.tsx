import type { ServiceId } from "@/lib/services";

export const SERVICE_ICON_PATHS: Record<ServiceId, string> = {
  parafrase: "/icons/layanan/parafrase.svg",
  humanisasi: "/icons/layanan/humanisasi.svg",
  makalah: "/icons/layanan/makalah.svg",
  artikel_ilmiah: "/icons/layanan/artikel_ilmiah.svg",
  jurnal_submit: "/icons/layanan/jurnal_submit.svg",
  jurnal: "/icons/layanan/jurnal.svg",
  powerpoint: "/icons/layanan/powerpoint.svg",
  word: "/icons/layanan/word.svg",
  terjemah: "/icons/layanan/terjemah.svg",
  paket_abstrak: "/icons/layanan/paket_abstrak.svg",
  desain: "/icons/layanan/desain.svg",
  turnitin_ai: "/icons/layanan/turnitin_ai.svg",
};

interface ServiceIconProps {
  id: ServiceId;
  className?: string;
  size?: number;
}

/**
 * Gambar Ilustrasi Khusus untuk Setiap Pilihan Tugas Mas Joki.
 * Vektor presisi tinggi dengan visual kaya & metafor spesifik sesuai jenis layanan.
 */
export function ServiceIcon({ id, className = "size-5", size }: ServiceIconProps) {
  const props = {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    width: size,
    height: size,
    "aria-hidden": "true" as const,
  };

  switch (id) {
    case "parafrase":
      return (
        <svg {...props}>
          {/* Dokumen sumber & siklus penulisan ulang */}
          <rect x="10" y="8" width="22" height="30" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M24 8V14C24 15.1046 24.8954 16 26 16H32" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 16H20M16 22H26M16 28H23" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          {/* Panah parafrase dinamis melingkar */}
          <path d="M35 19C38 23 37.5 29 33 33" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M31 33H34V30" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 29C10 25 10.5 19 15 15" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M17 15H14V18" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Pena presisi emas */}
          <g transform="translate(25, 23) rotate(-35)">
            <rect x="0" y="0" width="6" height="15" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <path d="M0 15L3 20L6 15H0Z" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 18L3 20" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "humanisasi":
      return (
        <svg {...props}>
          {/* Sisi Kiri: Chip Prosesor AI */}
          <rect x="7" y="14" width="18" height="20" rx="4" fill="#EDE9FE" stroke="#6366F1" strokeWidth="2.5" />
          <rect x="12" y="19" width="8" height="10" rx="2" fill="#818CF8" />
          <path d="M7 19H4M7 24H4M7 29H4M16 14V11M20 14V11M16 34V37M20 34V37" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
          {/* Sisi Kanan: Pena Alami & Sentuhan Manusia */}
          <path d="M26 35C26 35 28 27 34 20C38 15 42 12 42 12C42 12 40 18 36 24C32 30 29 33 29 33" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 33L26 37L30 36" fill="#2563EB" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />
          <path d="M33 22L37 26" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          {/* Kilau Bahasa Natural */}
          <path d="M22 9L23.5 12.5L27 14L23.5 15.5L22 19L20.5 15.5L17 14L20.5 12.5L22 9Z" fill="#F59E0B" />
          <circle cx="39" cy="35" r="2" fill="#10B981" />
        </svg>
      );

    case "makalah":
      return (
        <svg {...props}>
          {/* Buku Berjilid & Pembatas Merah */}
          <rect x="9" y="8" width="28" height="32" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M9 12C9 9.79086 10.7909 8 13 8H15V40H13C10.7909 40 9 38.2091 9 36V12Z" fill="#2563EB" stroke="#2563EB" strokeWidth="1.5" />
          <path d="M28 8V18L31.5 15L35 18V8H28Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Tab Bab di Kanan */}
          <rect x="37" y="16" width="3" height="6" rx="1.5" fill="#3B82F6" />
          <rect x="37" y="24" width="3" height="6" rx="1.5" fill="#10B981" />
          <path d="M19 16H24M19 22H33M19 27H33M19 32H27" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          {/* Segel Keaslian Akademis */}
          <circle cx="33" cy="33" r="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <path d="M30.5 33L32.5 35L35.5 31.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "artikel_ilmiah":
      return (
        <svg {...props}>
          {/* Format Jurnal Ilmiah 2 Kolom */}
          <rect x="8" y="7" width="32" height="34" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          <rect x="13" y="12" width="18" height="3" rx="1.5" fill="#2563EB" />
          <path d="M13 18H35" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Kolom Kiri */}
          <path d="M13 22H21M13 26H21M13 30H21M13 34H18" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          {/* Kolom Kanan */}
          <path d="M27 22H35M27 26H35M27 30H35M27 34H32" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="21" x2="24" y2="35" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Topi Toga Sarjana / Akademis */}
          <g transform="translate(26, 4)">
            <path d="M9 1L1 5L9 9L17 5L9 1Z" fill="#1E293B" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M4 6.5V11C4 12.5 6.2 13.5 9 13.5C11.8 13.5 14 12.5 14 11V6.5" fill="#1E293B" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M16 6V11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="11.5" r="1" fill="#F59E0B" />
          </g>
        </svg>
      );

    case "jurnal_submit":
      return (
        <svg {...props}>
          {/* Manuskrip Jurnal Siap Submit Publikasi */}
          <rect x="8" y="7" width="32" height="34" rx="4" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2.5" />
          <path d="M8 11C8 8.79086 9.79086 7 12 7H36C38.2091 7 40 8.79086 40 11V14H8V11Z" fill="#1D4ED8" />
          <rect x="13" y="10" width="12" height="2" rx="1" fill="#FFFFFF" />
          <path d="M13 19H25M13 24H22M13 29H24M13 34H20" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          {/* Barcode DOI / Sitasi */}
          <path d="M27 33H29M31 33H34M36 33H37" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tameng Verifikasi Submit Hijau */}
          <g transform="translate(24, 16)">
            <path d="M10 2L2 5.5V11C2 16.5 5.5 21.5 10 23C14.5 21.5 18 16.5 18 11V5.5L10 2Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M6 12L8.5 14.5L14 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      );

    case "jurnal":
      return (
        <svg {...props}>
          {/* Dua Tingkat Jurnal (Koleksi / Ikhtisar) */}
          <rect x="10" y="24" width="28" height="15" rx="3" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
          <path d="M10 32H38" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="2 2" />
          <rect x="14" y="28" width="14" height="2" rx="1" fill="#7C3AED" />
          {/* Volume Utama di Depan */}
          <rect x="7" y="10" width="28" height="16" rx="3" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M7 19H35" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="2 2" />
          <rect x="12" y="14" width="12" height="2" rx="1" fill="#2563EB" />
          {/* Lencana Bintang Emas */}
          <g transform="translate(27, 6)">
            <circle cx="9" cy="9" r="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <path d="M9 4.5L10.2 7.2L13.1 7.5L10.9 9.4L11.5 12.2L9 10.8L6.5 12.2L7.1 9.4L4.9 7.5L7.8 7.2L9 4.5Z" fill="#F59E0B" />
          </g>
        </svg>
      );

    case "powerpoint":
      return (
        <svg {...props}>
          {/* Kanvas Layar Presentasi 16:9 & Penyangga */}
          <rect x="6" y="8" width="36" height="24" rx="4" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.5" />
          <rect x="8" y="10" width="32" height="20" rx="2" fill="#FFFBEB" />
          <path d="M24 32V38M17 38H31" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
          {/* Diagram Batang Infografis Slide */}
          <rect x="13" y="21" width="4" height="6" rx="1" fill="#F59E0B" />
          <rect x="19" y="17" width="4" height="10" rx="1" fill="#2563EB" />
          <rect x="25" y="13" width="4" height="14" rx="1" fill="#10B981" />
          {/* Garis Tren Pertumbuhan & Laser Pointer */}
          <path d="M14 18L21 14L27 11L33 13" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="33" cy="13" r="2.5" fill="#EF4444" />
        </svg>
      );

    case "word":
      return (
        <svg {...props}>
          {/* Format Dokumen Word & Mistar Penggaris Margin */}
          <rect x="9" y="8" width="30" height="32" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          {/* Skala Mistar Margin Atas */}
          <path d="M9 13H39" stroke="#2563EB" strokeWidth="1.5" />
          <path d="M14 8V11M19 8V11M24 8V12M29 8V11M34 8V11" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M15 13V40" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Paragraf Rapi & Heading Terstruktur */}
          <rect x="18" y="17" width="16" height="2.5" rx="1" fill="#2563EB" />
          <rect x="18" y="22" width="18" height="2" rx="1" fill="#64748B" />
          <rect x="18" y="26" width="18" height="2" rx="1" fill="#64748B" />
          <rect x="18" y="30" width="12" height="2" rx="1" fill="#64748B" />
          <rect x="22" y="35" width="4" height="2" rx="1" fill="#2563EB" />
        </svg>
      );

    case "terjemah":
      return (
        <svg {...props}>
          {/* Dua Kartu Bahasa: ID (Indonesia) & EN (Inggris) */}
          <rect x="6" y="11" width="19" height="23" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="9" y="14" width="13" height="3.5" rx="1.5" fill="#EF4444" />
          <text x="10" y="28" fontFamily="sans-serif" fontWeight="800" fontSize="9" fill="#0369A1">ID</text>
          <rect x="23" y="15" width="19" height="23" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          <rect x="26" y="18" width="13" height="3.5" rx="1.5" fill="#2563EB" />
          <text x="27" y="32" fontFamily="sans-serif" fontWeight="800" fontSize="9" fill="#1D4ED8">EN</text>
          {/* Panah Lingkar Konversi Bahasa */}
          <path d="M18 36C18 38.5 21 40 25 40C29 40 32 38.5 32 36" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 34L17 37L20 40" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30 10C30 7.5 27 6 23 6C19 6 16 7.5 16 10" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 12L31 9L28 6" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "paket_abstrak":
      return (
        <svg {...props}>
          {/* Dua Lembar Abstrak Terjepit Klip Kertas */}
          <rect x="15" y="13" width="24" height="28" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          <path d="M22 22H33M22 26H31M22 30H33M22 34H28" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="9" y="8" width="24" height="28" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M15 16H27M15 20H25M15 24H27M15 28H22" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          {/* Paperclip Logam */}
          <path d="M15 15V6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6V16C21 18.2091 19.2091 20 17 20C14.7909 20 13 18.2091 13 16V9" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          {/* Lencana ID+EN Hijau */}
          <rect x="23" y="32" width="19" height="9" rx="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="25.5" y="38.5" fontFamily="sans-serif" fontWeight="800" fontSize="6.5" fill="#FFFFFF">ID+EN</text>
        </svg>
      );

    case "desain":
      return (
        <svg {...props}>
          {/* Kanvas Tata Letak & Kurva Bezier */}
          <rect x="8" y="8" width="32" height="32" rx="5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2.5" />
          <path d="M14 14H34M14 34H34" stroke="#FED7AA" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M14 30C16 18 28 32 34 18" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="22" y="23" width="5" height="5" rx="1" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
          {/* Tiga Titik Palet Warna */}
          <circle cx="15" cy="15" r="3" fill="#2563EB" />
          <circle cx="23" cy="15" r="3" fill="#F59E0B" />
          <circle cx="31" cy="15" r="3" fill="#10B981" />
        </svg>
      );

    case "turnitin_ai":
      return (
        <svg {...props}>
          {/* Perisai Audit Skor & Keamanan Orisinalitas */}
          <path d="M24 5L9 11V22C9 31.5 15.5 39.5 24 43C32.5 39.5 39 31.5 39 22V11L24 5Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Meteran Busur: Merah ke Hijau (Aman < 20%) */}
          <path d="M16 23C16 18.5817 19.5817 15 24 15" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 15C26 15 28 16 29.5 17.5" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <path d="M29.5 17.5C31.5 19.5 32 21 32 23" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          {/* Jarum Menunjuk ke Zona Hijau */}
          <path d="M24 23L29 18" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="23" r="3" fill="#1E293B" />
          {/* Stempel Centang Hijau */}
          <circle cx="24" cy="33" r="5" fill="#10B981" />
          <path d="M22 33L23.5 34.5L26 32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    default:
      return (
        <svg {...props}>
          <rect x="10" y="8" width="28" height="32" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M18 18H30M18 24H30M18 30H26" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
