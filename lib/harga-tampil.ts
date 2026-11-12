import { rupiah } from "./format";
import { WORD_TIERS } from "./pricing";
import { BASIS_LABEL, getService, type ServiceId } from "./services";

export interface HargaTampil {
  angka: string;
  satuan: string;
}

/**
 * Satu-satunya sumber teks harga yang ditampilkan ke pengunjung (kartu
 * layanan, poster, ringkasan). Angkanya diturunkan dari `SERVICES`, bukan
 * ditulis ulang, supaya perubahan tarif tidak meninggalkan angka lama di UI.
 *
 * Teks satuan tetap di sini karena itu copy, bukan hitungan.
 */
export function hargaTampil(id: ServiceId): HargaTampil {
  const service = getService(id);

  if (service.customQuoteOnly) {
    return { angka: "Minta Penawaran", satuan: "sesuai skor awal & naskah" };
  }

  switch (id) {
    case "word":
      return {
        angka: rupiah(WORD_TIERS[0].price),
        satuan: "berdasarkan jumlah halaman",
      };
    case "jurnal":
      return {
        angka: rupiah(service.pricePerChunk),
        satuan: "mulai 2 pilihan tingkat",
      };
    case "artikel_ilmiah":
      return {
        angka: rupiah(service.pricePerChunk),
        satuan: "per artikel (maks. 3.000 kata)",
      };
    case "jurnal_submit":
      return {
        angka: rupiah(service.pricePerChunk),
        satuan: "per artikel (maks. 6.000 kata)",
      };
    case "paket_abstrak":
      return {
        angka: rupiah(service.pricePerChunk),
        satuan: "per paket (ID+EN)",
      };
    default: {
      const basis = BASIS_LABEL[service.basis] ?? service.basis;
      const satuan =
        service.chunk === 1 ? `per ${basis}` : `per ${service.chunk} ${basis}`;
      return { angka: rupiah(service.pricePerChunk), satuan };
    }
  }
}
