import assert from "node:assert/strict";
import { test } from "node:test";
import { submitOrder, submitSpecializedOrder } from "../../app/actions";
import { normalisasiLayananKalkulator } from "../../components/calculator-context";
import { SERVICE_ORDER_SPECS } from "../order-specs";
import { buatBreadcrumbGraph, buatBreadcrumbSchema, buatOpenGraph } from "../schema";
import { SERVICES } from "../services";

function buatFormDataOrder(overrides: Record<string, string>): FormData {
  const fd = new FormData();
  fd.set("serviceId", "word");
  fd.set("qty", "25");
  fd.set("deadlineId", "normal");
  fd.set("difficultyId", "standar");
  fd.set("name", "Budi");
  fd.set("whatsapp", "081234567890");
  for (const [key, val] of Object.entries(overrides)) {
    fd.set(key, val);
  }
  return fd;
}

test("SERVICE_ORDER_SPECS mencakup seluruh layanan dan bebas frasa berulang", () => {
  for (const service of SERVICES) {
    const spec = SERVICE_ORDER_SPECS[service.id];
    assert.ok(spec, `Spec hilang untuk layanan ${service.id}`);
    assert.ok(spec.headline.trim().length > 5);
    assert.ok(spec.subheadline.trim().length > 10);
    assert.ok(spec.fileHelperText.trim().length > 10);
    assert.equal(
      /mengalir alami yang mengalir alami/i.test(spec.subheadline),
      false,
      `Frasa berulang ditemukan pada subheadline ${service.id}`,
    );
  }
});

test("normalisasiLayananKalkulator memetakan jurnal ke artikel_ilmiah", () => {
  assert.equal(normalisasiLayananKalkulator("jurnal"), "artikel_ilmiah");
  assert.equal(normalisasiLayananKalkulator("artikel_ilmiah"), "artikel_ilmiah");
  assert.equal(normalisasiLayananKalkulator("jurnal_submit"), "jurnal_submit");
  assert.equal(normalisasiLayananKalkulator("turnitin_ai"), "turnitin_ai");
});

test("submitOrder menolak pesanan yang melebihi batas hitungan otomatis", async () => {
  const wordOver = await submitOrder(
    null,
    buatFormDataOrder({ serviceId: "word", qty: "150" }),
  );
  assert.equal(wordOver.status, "error");
  assert.match(wordOver.message, /120 halaman/);

  const artikelOver = await submitOrder(
    null,
    buatFormDataOrder({ serviceId: "artikel_ilmiah", qty: "3500" }),
  );
  assert.equal(artikelOver.status, "error");
  assert.match(artikelOver.message, /3\.000 kata/);

  const customOnly = await submitOrder(
    null,
    buatFormDataOrder({ serviceId: "turnitin_ai", qty: "1" }),
  );
  assert.equal(customOnly.status, "error");
  assert.match(customOnly.message, /Penawaran/i);
});

test("submitSpecializedOrder menolak over-limit dan menerima qty dalam batas", async () => {
  const abstrakOver = await submitSpecializedOrder(
    null,
    buatFormDataOrder({ serviceId: "paket_abstrak", qty: "400" }),
  );
  assert.equal(abstrakOver.status, "error");
  assert.match(abstrakOver.message, /300 kata/);

  const wordValid = await submitSpecializedOrder(
    null,
    buatFormDataOrder({ serviceId: "word", qty: "100" }),
  );
  assert.equal(wordValid.status, "ok");
  assert.ok(wordValid.waUrl?.includes("https://wa.me/"));
});

test("helper SEO schema menghasilkan BreadcrumbList absolut dan OpenGraph", () => {
  const og = buatOpenGraph("Kalkulator Biaya", "Hitung estimasi tugas", "/hitung");
  assert.equal(og.url, "/hitung");
  assert.match(String(og.title), /Kalkulator Biaya/);

  const schema = buatBreadcrumbSchema([{ name: "Kalkulator Biaya", path: "/hitung" }]);
  assert.equal(schema["@context"], "https://schema.org");
  assert.equal(schema["@type"], "BreadcrumbList");
  assert.equal(schema.itemListElement.length, 2);
  assert.match(schema.itemListElement[0].item, /^https?:\/\//);
  assert.match(schema.itemListElement[1].item, /\/hitung$/);

  const graphNode = buatBreadcrumbGraph([{ name: "FAQ", path: "/faq" }]);
  assert.equal(graphNode["@type"], "BreadcrumbList");
  assert.equal(graphNode.itemListElement[1].position, 2);
});
