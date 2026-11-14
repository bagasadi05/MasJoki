import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  KATEGORI_TESTIMONI,
  TESTIMONI_BUKTI,
  URUTAN_TAMPIL_TESTIMONI,
} from "../../content/testimoni";
import { AKSEN } from "../aksen";
import { SERVICES } from "../services";

const ROOT = process.cwd();

function readWebpDimensions(filePath: string): { width: number; height: number } {
  const buf = fs.readFileSync(filePath);
  assert.equal(buf.subarray(0, 4).toString("ascii"), "RIFF", "Bukan berkas RIFF");
  assert.equal(buf.subarray(8, 12).toString("ascii"), "WEBP", "Bukan berkas WEBP");
  const chunk = buf.subarray(12, 16).toString("ascii");

  if (chunk === "VP8X") {
    return {
      width: buf.readUIntLE(24, 3) + 1,
      height: buf.readUIntLE(27, 3) + 1,
    };
  }
  if (chunk === "VP8 ") {
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  throw new Error(`Format chunk WebP tidak dikenali: ${chunk}`);
}

test("data testimoni berisi tepat lima bukti chat nyata yang terurut lengkap", () => {
  assert.equal(TESTIMONI_BUKTI.length, 5);
  assert.equal(URUTAN_TAMPIL_TESTIMONI.length, 5);
  assert.equal(new Set(URUTAN_TAMPIL_TESTIMONI).size, 5);

  for (const id of URUTAN_TAMPIL_TESTIMONI) {
    assert.ok(
      TESTIMONI_BUKTI.some((item) => item.id === id),
      `ID urutan tidak ditemukan: ${id}`,
    );
  }

  for (const item of TESTIMONI_BUKTI) {
    assert.ok(item.aksenId in AKSEN, `aksenId tidak valid: ${item.aksenId}`);
    if (item.serviceId) {
      assert.ok(
        SERVICES.some((s) => s.id === item.serviceId),
        `serviceId tidak dikenal: ${item.serviceId}`,
      );
    }
    assert.ok(
      KATEGORI_TESTIMONI.some((k) => k.id === item.kategori),
      `kategori tidak terdaftar: ${item.kategori}`,
    );
    assert.ok(item.ctaHref.startsWith("/"), `ctaHref harus rute internal: ${item.ctaHref}`);
    assert.ok(item.timeline.length >= 2, `timeline terlalu singkat: ${item.id}`);
    assert.ok(item.berkas.length >= 1, `berkas kosong: ${item.id}`);
  }
});

test("semua gambar bukti chat ada di public/testimoni/ dan dimensinya persis", () => {
  for (const item of TESTIMONI_BUKTI) {
    assert.ok(
      item.gambar.src.startsWith("/testimoni/"),
      `path gambar harus di /testimoni/: ${item.gambar.src}`,
    );
    const fullPath = path.join(ROOT, "public", item.gambar.src.replace(/^\//, ""));
    assert.ok(fs.existsSync(fullPath), `berkas gambar tidak ada: ${fullPath}`);

    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 1024, `berkas gambar terlalu kecil/kosong: ${fullPath}`);

    if (fullPath.endsWith(".webp")) {
      const dims = readWebpDimensions(fullPath);
      assert.equal(dims.width, item.gambar.width, `lebar tidak cocok untuk ${item.id}`);
      assert.equal(dims.height, item.gambar.height, `tinggi tidak cocok untuk ${item.id}`);
    }
    assert.ok(item.gambar.alt.length >= 30, `alt text kurang deskriptif: ${item.id}`);
  }
});

test("Bukti #04 memuat detail Turnitin 31/10/2026 beserta filter & disclaimer non-jaminan", () => {
  const bukti04 = TESTIMONI_BUKTI.find((item) => item.id === "bukti-04");
  assert.ok(bukti04, "bukti-04 harus ada");
  assert.ok(bukti04.turnitinDetail, "bukti-04 wajib memiliki turnitinDetail");

  assert.equal(bukti04.turnitinDetail.tanggal, "31/10/2026");
  assert.equal(bukti04.turnitinDetail.similarity, "12%");
  assert.deepEqual(bukti04.turnitinDetail.filters, [
    { label: "Exclude Quotes", nilai: "off" },
    { label: "Exclude Bibliography", nilai: "on" },
    { label: "Exclude Matches", nilai: "off" },
  ]);
  assert.match(bukti04.turnitinDetail.disclaimer, /31\/10\/2026/);
  assert.match(bukti04.turnitinDetail.disclaimer, /bukan jaminan/i);
});

test("kepatuhan Pasal 04 & aturan copy: nihil PII klien, nihil 'Anda', nihil klaim/rating palsu", () => {
  const filesToAudit = [
    path.join(ROOT, "content", "testimoni.ts"),
    path.join(ROOT, "components", "testimoni-nyata.tsx"),
    path.join(ROOT, "app", "page.tsx"),
  ];

  const forbiddenPii = [
    /bondan/i,
    /nawfal/i,
    /ilyas/i,
    /damar/i,
    /wibowo/i,
    /rahmada/i,
    /wicaksana/i,
    /813[- ]?3081[- ]?7139/,
    /081330817139/,
    /universitas terbuka/i,
    /@gmail\.com/i,
  ];

  const forbiddenCopy = [
    /\bAnda\b/,
    /4\.9\s*\/\s*5/,
    /\bbintang\s*5\b/i,
    /\b(?:100|120)\+\s*klien\b/i,
    /100%\s*lolos/i,
    /dijamin\s*(?:lolos|bebas)/i,
    /\blolos\s*turnitin\b/i,
    /\bbebas\s*plagiat\b/i,
    /\bsisa\s*\d+\s*slot\b/i,
  ];

  for (const filePath of filesToAudit) {
    const source = fs.readFileSync(filePath, "utf8");
    for (const pattern of forbiddenPii) {
      assert.doesNotMatch(
        source,
        pattern,
        `Kebocoran PII (${pattern}) ditemukan di ${path.relative(ROOT, filePath)}`,
      );
    }
    for (const pattern of forbiddenCopy) {
      assert.doesNotMatch(
        source,
        pattern,
        `Copy terlarang (${pattern}) ditemukan di ${path.relative(ROOT, filePath)}`,
      );
    }
  }
});
