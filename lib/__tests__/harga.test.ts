import assert from "node:assert/strict";
import { test } from "node:test";
import {
  computePrice,
  bulatkan,
  clampQty,
  getValidAddons,
  hitungDp,
  MINIMUM_TRANSACTION,
} from "../pricing";
import { getService } from "../services";

const parafrase = getService("parafrase"); // Rp3.000 / 100 kata
const word = getService("word"); // tier per halaman
const artikel = getService("artikel_ilmiah"); // flat Rp250.000
const referensi = getService("referensi"); // Rp20.000 / 10 referensi

test("input referensi: harga per chunk 10, min order 10 tidak kena minimum transaksi", () => {
  const hasil = computePrice(referensi, 30, "santai", "standar");
  assert.equal(hasil.units, 3);
  assert.equal(hasil.total, 60_000);
  assert.equal(hasil.minimumFee, 0, "Rp 60.000 sudah di atas minimum Rp 15.000");

  const min = computePrice(referensi, 10, "santai", "standar");
  assert.equal(min.total, 20_000);
  assert.equal(min.minimumFee, 0, "Rp 20.000 masih di atas minimum transaksi");
});

test("input referensi: diskon kuantitas ≥100 (5%) dan ≥200 (10%)", () => {
  const hasil100 = computePrice(referensi, 100, "santai", "standar");
  assert.equal(hasil100.discountAmount, 10_000); // 10 chunk × 20.000 = 200.000, 5% = 10.000
  assert.equal(hasil100.total, 190_000);

  const hasil200 = computePrice(referensi, 200, "santai", "standar");
  assert.equal(hasil200.discountAmount, 40_000); // 20 chunk × 20.000 = 400.000, 10% = 40.000
  assert.equal(hasil200.total, 360_000);
});

test("input referensi: di atas 300 over-limit jadi penawaran manual", () => {
  const hasil = computePrice(referensi, 301, "santai", "standar");
  assert.equal(hasil.isOverLimit, true);
  assert.ok(hasil.overLimitMessage?.includes("300"));

  const batas = computePrice(referensi, 300, "santai", "standar");
  assert.equal(batas.isOverLimit, false);
});

test("pembulatan rupiah selalu ke kelipatan 500", () => {
  assert.equal(bulatkan(12_340), 12_500);
  assert.equal(bulatkan(12_240), 12_000);
  assert.equal(bulatkan(0), 0);
});

test("DP dibulatkan ke atas ke kelipatan 500", () => {
  assert.equal(hitungDp(85_500), 43_000);
  assert.equal(hitungDp(15_000), 7_500);
  assert.equal(hitungDp(1), 500);
});

test("chunk dibulatkan ke atas per 100 kata", () => {
  const hasil = computePrice(parafrase, 250, "santai", "standar", [], {
    applyMinimum: false,
  });
  assert.equal(hasil.units, 3);
  assert.equal(hasil.subtotal, 9_000);
  assert.equal(hasil.deadlineFee, 0);
});

test("minimum transaksi Rp15.000 dirapikan dengan catatan", () => {
  const hasil = computePrice(parafrase, 100, "santai", "standar");
  assert.equal(hasil.subtotal, 3_000);
  assert.equal(hasil.total, MINIMUM_TRANSACTION);
  assert.equal(hasil.minimumFee, 12_000);
  assert.match(hasil.minimumAdjustmentNote ?? "", /minimum transaksi/i);
});

test("applyMinimum:false dipakai untuk contoh harga murni", () => {
  const hasil = computePrice(parafrase, 100, "santai", "standar", [], {
    applyMinimum: false,
  });
  assert.equal(hasil.total, 3_000);
  assert.equal(hasil.minimumFee, 0);
});

test("tenggat cepat menambah 30% dari subtotal", () => {
  const hasil = computePrice(parafrase, 1_000, "cepat", "standar");
  assert.equal(hasil.subtotal, 30_000);
  assert.equal(hasil.deadlineFee, 9_000);
  assert.equal(hasil.total, 39_000);
});

test("kesulitan riset menambah 45% setelah tenggat", () => {
  const hasil = computePrice(parafrase, 1_000, "santai", "riset");
  assert.equal(hasil.difficultyFee, 13_500);
  assert.equal(hasil.total, 43_500);
});

test("diskon kuantitas 5% mulai 3.000 kata, 10% mulai 5.000 kata", () => {
  const lima = computePrice(parafrase, 3_000, "santai", "standar");
  assert.equal(lima.discountRate, 0.05);
  assert.equal(lima.discountAmount, 4_500);
  assert.equal(lima.total, 85_500);

  const sepuluh = computePrice(parafrase, 5_000, "santai", "standar");
  assert.equal(sepuluh.discountRate, 0.1);
  assert.equal(sepuluh.total, 135_000);
});

test("DP dan pelunasan selalu berjumlah sama dengan total", () => {
  for (const qty of [100, 1_000, 3_000, 5_000, 12_345]) {
    const hasil = computePrice(parafrase, qty, "cepat", "menengah");
    assert.equal(hasil.dpAmount + hasil.pelunasanAmount, hasil.total);
    assert.equal(hasil.dpAmount % 500, 0);
  }
});

test("Rapikan Word memakai tarif bertingkat per halaman", () => {
  assert.equal(computePrice(word, 25).total, 30_000);
  assert.equal(computePrice(word, 26).total, 50_000);
  assert.equal(computePrice(word, 60).total, 50_000);
  assert.equal(computePrice(word, 61).total, 85_000);
});

test("Word di atas 120 halaman ditandai lewat batas otomatis", () => {
  const hasil = computePrice(word, 121);
  assert.equal(hasil.isOverLimit, true);
  assert.match(hasil.overLimitMessage ?? "", /120 halaman/);
});

test("Artikel Ilmiah flat Rp250.000 dan menolak di atas 3.000 kata", () => {
  const pas = computePrice(artikel, 3_000);
  assert.equal(pas.total, 250_000);
  assert.equal(pas.isOverLimit, false);

  const lebih = computePrice(artikel, 3_500);
  assert.equal(lebih.isOverLimit, true);
  assert.match(lebih.overLimitMessage ?? "", /3\.000 kata/);
});

test("qty di bawah minimum dinaikkan, NaN memakai default", () => {
  assert.equal(clampQty(parafrase, 10), 100);
  assert.equal(clampQty(parafrase, Number.NaN), parafrase.defaultQty);
});

test("opsi tambahan hanya berlaku untuk layanan yang relevan", () => {
  const tidakRelevan = getValidAddons("powerpoint", ["lampiran_similarity"]);
  assert.equal(tidakRelevan.length, 0);

  const relevan = getValidAddons("parafrase", ["lampiran_similarity"]);
  assert.equal(relevan.length, 1);
  assert.equal(relevan[0].price, 15_000);
});

test("opsi tambahan ikut menambah total tanpa merusak pembulatan", () => {
  const dasar = computePrice(parafrase, 3_000, "santai", "standar");
  const denganAddon = computePrice(parafrase, 3_000, "santai", "standar", [
    "lampiran_similarity",
  ]);
  assert.equal(denganAddon.addonsTotal, 15_000);
  assert.equal(denganAddon.total, dasar.total + 15_000);
});
