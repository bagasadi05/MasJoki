import assert from "node:assert/strict";
import { test } from "node:test";
import { hargaTampil } from "../harga-tampil";
import { rupiah } from "../format";
import { SERVICES, getService, type ServiceId } from "../services";
import { WORD_TIERS } from "../pricing";

const SEMUA = SERVICES.map((s) => s.id);

test("semua layanan punya teks harga yang terisi", () => {
  for (const id of SEMUA) {
    const { angka, satuan } = hargaTampil(id);
    assert.ok(angka.length > 0, `angka kosong untuk ${id}`);
    assert.ok(satuan.length > 0, `satuan kosong untuk ${id}`);
    assert.ok(
      angka.startsWith("Rp") || angka === "Minta Penawaran",
      `format angka aneh untuk ${id}: ${angka}`,
    );
  }
});

test("tarif mengikuti SERVICES, bukan angka terpisah", () => {
  for (const id of ["parafrase", "humanisasi", "makalah", "powerpoint", "terjemah", "desain"] as ServiceId[]) {
    const service = getService(id);
    assert.equal(hargaTampil(id).angka, rupiah(service.pricePerChunk));
  }
});

test("layanan dengan tarif khusus memakai sumbernya masing-masing", () => {
  assert.equal(hargaTampil("word").angka, rupiah(WORD_TIERS[0].price));
  assert.equal(hargaTampil("jurnal").angka, rupiah(getService("jurnal").pricePerChunk));
  assert.equal(hargaTampil("turnitin_ai").angka, "Minta Penawaran");
});

test("satuan selalu menyebut dasar perhitungan", () => {
  assert.equal(hargaTampil("parafrase").satuan, "per 100 kata");
  assert.equal(hargaTampil("makalah").satuan, "per halaman");
  assert.equal(hargaTampil("desain").satuan, "per desain");
  assert.equal(hargaTampil("artikel_ilmiah").satuan, "per artikel (maks. 3.000 kata)");
});
