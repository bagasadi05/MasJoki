import assert from "node:assert/strict";
import { test } from "node:test";
import { safeNextPath } from "../safe-redirect";
import { batasiKunci } from "../rate-limit";

const ORIGIN = "https://masjoki.example";

test("safeNextPath: path internal dipertahankan apa adanya", () => {
  assert.equal(
    safeNextPath("/hitung?layanan=parafrase#nota", ORIGIN),
    "/hitung?layanan=parafrase#nota",
  );
});

test("safeNextPath: protocol-relative ditolak", () => {
  assert.equal(safeNextPath("//evil.com", ORIGIN), "/humanizer");
});

test("safeNextPath: bypass backslash dan tab ditolak", () => {
  assert.equal(safeNextPath("/\\evil.com", ORIGIN), "/humanizer");
  assert.equal(safeNextPath("/\t/evil.com", ORIGIN), "/humanizer");
});

test("safeNextPath: URL absolut ke domain lain ditolak", () => {
  assert.equal(safeNextPath("https://evil.com/humanizer", ORIGIN), "/humanizer");
});

test("safeNextPath: kosong memakai fallback", () => {
  assert.equal(safeNextPath(null, ORIGIN), "/humanizer");
  assert.equal(safeNextPath("", ORIGIN), "/humanizer");
});

test("batasiKunci: menolak setelah batas, pulih setelah jendela", () => {
  const mulai = 1_700_000_000_000;
  const kunci = `uji:${Date.now()}`;

  assert.equal(batasiKunci(kunci, mulai, 2, 60).ok, true);
  assert.equal(batasiKunci(kunci, mulai + 1_000, 2, 60).ok, true);

  const ditolak = batasiKunci(kunci, mulai + 2_000, 2, 60);
  assert.equal(ditolak.ok, false);
  assert.ok((ditolak.cobaLagiDalamDetik ?? 0) > 0);

  assert.equal(batasiKunci(kunci, mulai + 61_000, 2, 60).ok, true);
});
