import test from "node:test";
import assert from "node:assert/strict";

import { pesanOrderSpesifik, pesanPesanan, pesanPenawaran } from "../pesan";
import { computePrice } from "../pricing";
import { getService } from "../services";

const parafrase = getService("parafrase");

test("Pesanan: memuat layanan, jumlah, total, dan kontak", () => {
  const price = computePrice(parafrase, 500, "santai", "standar");
  const teks = pesanPesanan({
    service: parafrase,
    price,
    name: "Budi",
    whatsapp: "081234567890",
    fileUrl: "https://drive.google.com/file/d/uji",
    notes: "Pertahankan sitasi.",
  });

  assert.match(teks, /Layanan: Parafrase/);
  assert.match(teks, /Jumlah: 500 kata/);
  assert.match(teks, /Estimasi Total: Rp 15\.000/);
  assert.match(teks, /Nama: Budi/);
  assert.match(teks, /WhatsApp: 081234567890/);
  assert.match(teks, /File: https:\/\/drive\.google\.com/);
  assert.match(teks, /ShopeePay\/GoPay\/DANA/);
});

test("Penawaran: memuat brief dan anggaran", () => {
  const teks = pesanPenawaran({
    layanan: "makalah",
    deadlineId: "normal",
    budget: "Sekitar Rp 200.000",
    detail: "Makalah 20 halaman, 8 referensi APA 7.",
    name: "Sari",
    whatsapp: "081298765432",
  });

  assert.match(teks, /minta penawaran/i);
  assert.match(teks, /Makalah 20 halaman/);
  assert.match(teks, /Anggaran: Sekitar Rp 200\.000/);
  assert.match(teks, /Nama: Sari/);
});

test("Order spesifik: slug pengecek dan rentang skor dirapikan", () => {
  const price = computePrice(parafrase, 500, "normal", "standar");
  const teks = pesanOrderSpesifik({
    service: parafrase,
    price,
    name: "Uji",
    whatsapp: "081200000000",
    checkerTool: "turnitin",
    currentScore: "25-40%",
    targetScore: ">60%",
  });

  assert.match(teks, /Pengecek\/Sistem: Turnitin/);
  assert.match(teks, /Kondisi\/Skor Saat Ini: 25–40%/);
  assert.match(teks, /Target Skor Akhir: di atas 60%/);
  assert.doesNotMatch(teks, /25-40%/);
  assert.doesNotMatch(teks, /turnitin/);
});

test("Order spesifik: slug tak dikenal tetap terbaca manusia", () => {
  const price = computePrice(parafrase, 500, "normal", "standar");
  const teks = pesanOrderSpesifik({
    service: parafrase,
    price,
    name: "Uji",
    whatsapp: "081200000000",
    checkerTool: "custom_checker_baru",
  });

  assert.match(teks, /Pengecek\/Sistem: Custom Checker Baru/);
});
