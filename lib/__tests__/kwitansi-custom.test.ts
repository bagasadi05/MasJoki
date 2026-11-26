import assert from "node:assert/strict";
import { test } from "node:test";

import { daftarEmailAdmin, isEmailAdmin } from "../admin-auth";
import { hitungTotalKwitansi, parseKwitansiCustom } from "../kwitansi-custom";
import { kodeKwitansiValid } from "../kwitansi";

const PAYLOAD_VALID = {
  kode: "",
  name: "Budi Santoso",
  whatsapp: "0812 3456 7890",
  judul: "Paket makalah 10 halaman + revisi",
  lines: [
    { label: "Makalah 10 halaman", amount: 150000 },
    { label: "Revisi 2x", amount: 0 },
    { label: "Diskon paket", amount: -25000 },
  ],
  catatan: "DP 50% di muka.",
};

test("parseKwitansiCustom: payload valid lolos dan whatsapp dinormalisasi", () => {
  const hasil = parseKwitansiCustom(PAYLOAD_VALID);
  assert.equal(hasil.ok, true);
  if (hasil.ok) {
    assert.equal(hasil.data.whatsapp, "081234567890");
    assert.equal(hasil.data.kode, "");
    assert.equal(hasil.data.lines.length, 3);
  }
});

test("parseKwitansiCustom: amount di-coerce dari string seperti input form", () => {
  const hasil = parseKwitansiCustom({
    ...PAYLOAD_VALID,
    lines: [{ label: "Jasa", amount: "75000" }],
  });
  assert.equal(hasil.ok, true);
  if (hasil.ok) assert.equal(hasil.data.lines[0]?.amount, 75000);
});

test("parseKwitansiCustom: menolak lines kosong, label kosong, dan whatsapp salah", () => {
  const tanpaLines = parseKwitansiCustom({ ...PAYLOAD_VALID, lines: [] });
  assert.equal(tanpaLines.ok, false);

  const labelKosong = parseKwitansiCustom({
    ...PAYLOAD_VALID,
    lines: [{ label: "   ", amount: 1000 }],
  });
  assert.equal(labelKosong.ok, false);
  if (!labelKosong.ok) assert.ok(labelKosong.fieldErrors.lines);

  const waSalah = parseKwitansiCustom({ ...PAYLOAD_VALID, whatsapp: "123" });
  assert.equal(waSalah.ok, false);
  if (!waSalah.ok) assert.ok(waSalah.fieldErrors.whatsapp);
});

test("parseKwitansiCustom: amount non-bulat ditolak", () => {
  const hasil = parseKwitansiCustom({
    ...PAYLOAD_VALID,
    lines: [{ label: "Jasa", amount: 1000.5 }],
  });
  assert.equal(hasil.ok, false);
});

test("hitungTotalKwitansi: menjumlah semua baris termasuk diskon negatif", () => {
  const parsed = parseKwitansiCustom(PAYLOAD_VALID);
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(hitungTotalKwitansi(parsed.data.lines), 125000);
  }
});

test("kode custom: hanya lolos kalau sesuai pola MJ-YYYYMMDD-XXXX", () => {
  assert.equal(kodeKwitansiValid("MJ-20261114-AB12"), true);
  assert.equal(kodeKwitansiValid("kode-bebas"), false);
  assert.equal(kodeKwitansiValid(""), false);
});

test("isEmailAdmin: fail-closed tanpa env, lalu cocok según daftar ADMIN_EMAILS", () => {
  const lama = process.env.ADMIN_EMAILS;
  try {
    delete process.env.ADMIN_EMAILS;
    assert.equal(isEmailAdmin("kamu@email.com"), false);

    process.env.ADMIN_EMAILS = "Kamu@Email.com, rekan@email.com";
    assert.deepEqual(daftarEmailAdmin(), ["kamu@email.com", "rekan@email.com"]);
    assert.equal(isEmailAdmin("kamu@email.com"), true);
    assert.equal(isEmailAdmin("REKAN@email.com"), true);
    assert.equal(isEmailAdmin("orang-lain@email.com"), false);
    assert.equal(isEmailAdmin(null), false);
  } finally {
    if (lama === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = lama;
  }
});
