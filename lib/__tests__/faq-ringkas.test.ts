import assert from "node:assert/strict";
import { test } from "node:test";
import { faq, faqRingkas } from "../../content/faq";

test("FAQ beranda berisi lima pertanyaan", () => {
  assert.equal(faqRingkas.length, 5);
});

test("setiap pertanyaan ringkas punya jawaban dan unik", () => {
  const terlihat = new Set<string>();
  for (const item of faqRingkas) {
    assert.ok(item.q.length > 0);
    assert.ok(item.a.length > 40, `jawaban terlalu pendek: ${item.q}`);
    assert.equal(terlihat.has(item.q), false, `pertanyaan ganda: ${item.q}`);
    terlihat.add(item.q);
  }
});

test("semua pertanyaan ringkas berasal dari daftar utama", () => {
  for (const item of faqRingkas) {
    assert.ok(
      faq.some((utama) => utama.q === item.q),
      `tidak ada di faq utama: ${item.q}`,
    );
  }
});
