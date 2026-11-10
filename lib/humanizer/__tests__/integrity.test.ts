import { test } from "node:test";
import assert from "node:assert/strict";

import { validateHumanizerIntegrity } from "../integrity";

test("Integrity: angka, sitasi, dan istilah proteksi yang sama diterima", () => {
  const source = "Nilainya 75,05% pada 2015 (Slavin, 2015). PTK dipakai.";
  const output = "Pada 2015, nilainya tetap 75,05% (Slavin, 2015). PTK dipakai.";

  assert.deepEqual(
    validateHumanizerIntegrity(source, output, ["PTK"]),
    { ok: true },
  );
});

test("Integrity: perubahan angka ditolak", () => {
  const result = validateHumanizerIntegrity(
    "Kapasitasnya 100 orang.",
    "Kapasitasnya 120 orang.",
  );

  assert.equal(result.ok, false);
});

test("Integrity: sitasi yang hilang dan istilah yang hilang ditolak", () => {
  const result = validateHumanizerIntegrity(
    "Menurut (Slavin, 2015), metode PTK dipakai.",
    "Metode penelitian dipakai.",
    ["PTK"],
  );

  assert.equal(result.ok, false);
});
