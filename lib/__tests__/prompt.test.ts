import assert from "node:assert/strict";
import { test } from "node:test";
import { SYSTEM_INSTRUCTION_BASE } from "../humanizer/gemini.server";

/**
 * Prompt ini adalah kontrak produk: ia menentukan apakah hasil humanizer
 * mengikuti doktrin skill humanisasi-akademik atau justru mendorong pola
 * seragam. Tes ini mengunci bagian yang paling mudah rusak saat prompt diedit.
 */
const prompt = SYSTEM_INSTRUCTION_BASE;

test("prompt meminta sebaran panjang kalimat, bukan semua pendek", () => {
  assert.match(prompt, /di bawah 8 kata/);
  assert.match(prompt, /di atas 30 kata/);
  assert.doesNotMatch(
    prompt,
    /8-14 kata/,
    "aturan lama '8-14 kata' membuat semua kalimat sedang dan variansi nol",
  );
});

test("prompt mewajibkan pelaku kalimat yang jelas", () => {
  assert.match(prompt, /PELAKU HARUS JELAS/i);
  assert.match(prompt, /kalimat tanpa pelaku/i);
});

test("prompt melarang wacana berpola", () => {
  assert.match(prompt, /menutup setiap paragraf dengan simpulan/i);
  assert.match(prompt, /tiga item sejajar/i);
});

test("prompt menjaga istilah, sitasi, dan angka", () => {
  assert.match(prompt, /UBAH ARSITEKTUR KALIMAT, BUKAN ISTILAH/i);
  assert.match(prompt, /SITASI AKADEMIK HARUS 100% PERSIS/i);
  assert.match(prompt, /FORMAT ANGKA HARUS PERSIS/i);
});

test("prompt melarang menambah klaim baru", () => {
  assert.match(prompt, /JANGAN menambah fakta baru/i);
  assert.match(prompt, /menambah klaim baru/i);
});

test("prompt tidak memuat instruksi Inggris yang tidak relevan", () => {
  assert.doesNotMatch(prompt, /not just X but Y/i);
  assert.doesNotMatch(prompt, /rule of three/i);
});
