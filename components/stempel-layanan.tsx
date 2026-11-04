import { aksenLayanan, INISIAL } from "@/lib/aksen";
import type { ServiceId } from "@/lib/services";

interface StempelLayananProps {
  id: ServiceId;
  /** "kecil" untuk kartu padat, "sedang" untuk daftar dan judul layanan. */
  ukuran?: "kecil" | "sedang";
}

/**
 * Cap identitas layanan: inisial dua huruf di kotak warna lembut, dimiringkan
 * seperti stempel nota. Menggantikan titik warna biasa di tempat yang lebih
 * besar (daftar harga, kartu /jasa, judul halaman layanan).
 */
export function StempelLayanan({ id, ukuran = "sedang" }: StempelLayananProps) {
  const aksen = aksenLayanan(id);
  const kecil = ukuran === "kecil";

  return (
    <span
      aria-hidden
      className={`inline-flex -rotate-3 shrink-0 select-none items-center justify-center rounded-[4px] border-2 ${aksen.border} ${aksen.soft} ${aksen.text} ${
        kecil ? "size-6" : "size-7"
      } font-display leading-none`}
    >
      <span className={`font-bold tracking-wide ${kecil ? "text-[0.66rem]" : "text-[0.74rem]"}`}>
        {INISIAL[id]}
      </span>
    </span>
  );
}
