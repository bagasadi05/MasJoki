import { aksenLayanan, INISIAL } from "@/lib/aksen";
import { ServiceIcon } from "./service-icon";
import type { ServiceId } from "@/lib/services";

interface StempelLayananProps {
  id: ServiceId;
  /** "kecil" untuk kartu padat, "sedang" untuk daftar dan judul layanan, "besar" untuk hero detail. */
  ukuran?: "kecil" | "sedang" | "besar";
  denganIkon?: boolean;
}

/**
 * Cap identitas layanan: kombinasi inisial dan ikon warna lembut yang ramah,
 * memberikan identitas visual yang khas dan ceria pada setiap layanan.
 */
export function StempelLayanan({
  id,
  ukuran = "sedang",
  denganIkon = false,
}: StempelLayananProps) {
  const aksen = aksenLayanan(id);

  if (denganIkon) {
    return (
      <span
        aria-hidden
        className={`inline-flex shrink-0 select-none items-center justify-center rounded-xl border ${aksen.border} ${aksen.soft} ${
          ukuran === "kecil"
            ? "size-7 text-xs"
            : ukuran === "besar"
              ? "size-12 text-2xl shadow-sm"
              : "size-9 text-base shadow-xs"
        } transition-transform duration-200 group-hover:scale-105`}
      >
        <ServiceIcon
          id={id}
          className={ukuran === "kecil" ? "size-4" : ukuran === "besar" ? "size-6" : "size-4.5"}
        />
      </span>
    );
  }

  const kecil = ukuran === "kecil";
  const besar = ukuran === "besar";

  return (
    <span
      aria-hidden
      className={`inline-flex -rotate-2 shrink-0 select-none items-center justify-center rounded-lg border-2 ${aksen.border} ${aksen.soft} ${aksen.text} ${
        kecil
          ? "size-7 text-xs"
          : besar
            ? "size-10 text-[0.88rem] shadow-xs"
            : "size-8 text-xs shadow-2xs"
      } font-display font-bold leading-none transition-transform duration-200 group-hover:rotate-0`}
    >
      <span className="tracking-wide">
        {INISIAL[id]}
      </span>
    </span>
  );
}
