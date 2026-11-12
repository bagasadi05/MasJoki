import { test } from "node:test";
import assert from "node:assert/strict";

import { applyBahasaSederhana, humanize, cleanAiWords } from "../engine";
import { analyze, estimateRisk, extractStarter } from "../analyzer";

test("1. Preservasi 100%: Istilah Indonesia dalam kurung tidak boleh hilang", () => {
  const input = "Petugas menjaga (blok hunian) setiap hari.";
  const output = humanize(input);
  assert.ok(
    output.includes("(blok hunian)"),
    `Expected "(blok hunian)" to be preserved, got: ${output}`
  );

  const testCases = [
    "Kondisi di (Nusakambangan) sangat ketat.",
    "Berdasarkan aturan (Permenkumham) yang berlaku.",
    "Perlu memperhatikan (substansi hukum) yang ada.",
    "Pengawasan terhadap (narapidana teroris/narkotika) ditingkatkan.",
    "Pendekatan keadilan retributif (retributive justice) diterapkan.",
  ];

  for (const tc of testCases) {
    const res = humanize(tc);
    assert.ok(
      res.includes("("),
      `Expected parentheses to be preserved for: "${tc}", but got: "${res}"`
    );
  }
});

test("2. Preservasi 100%: Kalimat pengguna tidak boleh dihapus diam-diam", () => {
  const input = "Risiko kerja mereka sangat nyata. Ini kalimat lain yang penting.";
  const output = humanize(input);
  assert.ok(
    output.includes("Risiko kerja mereka") || output.includes("risiko kerja"),
    `Sentence was deleted! Output: ${output}`
  );
  assert.ok(
    output.includes("Ini kalimat lain") || output.includes("kalimat lain"),
    `Second sentence was deleted! Output: ${output}`
  );
});

test("3. Struktur Dokumen: Heading tidak boleh menempel ke paragraf berikutnya", () => {
  const input = `Abstrak
Penelitian ini membahas tentang keselamatan petugas yang bekerja di lapas dengan risiko tinggi.

KESIMPULAN
Aturan hukum mengenai keselamatan kerja petugas di lapas perlu terus diperbaiki.`;

  const output = humanize(input);
  const paragraphs = output.split(/\n\n+/);

  assert.equal(
    paragraphs[0].trim(),
    "Abstrak",
    `Expected 'Abstrak' to be a standalone paragraph, got: '${paragraphs[0]}'`
  );
  assert.ok(
    paragraphs[1].includes("Penelitian ini membahas"),
    `Expected paragraph 2 to have abstract body, got: '${paragraphs[1]}'`
  );
  assert.ok(
    output.includes("KESIMPULAN\n\n") || output.includes("KESIMPULAN\n"),
    `Expected 'KESIMPULAN' to remain a distinct heading, got: ${output}`
  );
});

test("4. Sinkronisasi Kamus: Kata pantangan berhasil diganti ke bahasa alami", () => {
  const input = "Penelitian ini memiliki signifikansi yang nyata untuk membuktikan eksistensi aturan dan konsekuensi yuridis yang komprehensif.";
  const output = humanize(input);

  assert.ok(
    !/\beksistensi\b/i.test(output),
    `'eksistensi' should be replaced, got: ${output}`
  );
  assert.ok(
    !/\bkonsekuensi yuridis\b/i.test(output),
    `'konsekuensi yuridis' should be replaced, got: ${output}`
  );
  assert.ok(
    !/\bkomprehensif\b/i.test(output),
    `'komprehensif' should be replaced, got: ${output}`
  );
});

test("5. Kalibrasi Analyzer: Teks pendek tidak boleh otomatis dituduh AI (Waspada)", () => {
  const shortText = "Penulis melakukan wawancara langsung dengan para staf di lapangan.";
  const result = analyze(shortText);

  assert.ok(
    result.risk.score < 15,
    `Short neutral text should have low risk (< 15%), got ${result.risk.score}%`
  );
  assert.equal(
    result.risk.verdict,
    "RISIKO RENDAH (< 15%)",
    `Verdict should be low risk, got ${result.risk.verdict}`
  );
});

test("5b. Kalibrasi Analyzer: Ritme akademik normal tidak menjadi risiko tinggi", () => {
  const risk = estimateRisk(
    {
      totalSentences: 10,
      totalWords: 193,
      mean: 19.3,
      sd: 5.02,
      minLocalSd: 5.09,
      flaggedWindows: 0,
      shortCount: 0,
      mediumCount: 7,
      longCount: 3,
      mediumPercentage: 70,
    },
    { repeatedCount: 0, percentage: 0, details: {} },
    {
      forbiddenCount: 0,
      forbiddenWordsFound: [],
      totalGlosses: 0,
      glossesFound: [],
      totalTemplates: 0,
      templatesFound: [],
    }
  );

  assert.ok(
    risk.score < 15,
    `A natural 10-sentence academic sample should stay low risk, got ${risk.score}%`
  );
});

test("5c. Fallback lokal: kalimat formal umum tetap mengalami perubahan", () => {
  const input =
    "Penyelenggaraan sistem pemasyarakatan di Indonesia masih sering dihadapkan pada gangguan keamanan dan ketertiban berupa peredaran telepon genggam ilegal, praktik pungutan liar dan penyalahgunaan narkotika.";
  const output = applyBahasaSederhana(input, {
    intensity: "sederhana",
    bahasaSederhana: true,
  });

  assert.notEqual(output, input, "Fallback lokal tidak boleh diam-diam menjadi no-op");
  assert.match(output, /pengelolaan/i);
  assert.match(output, /menghadapi/i);
});

test("6. Proteksi Istilah Kustom: customTerms terlindungi 100%", () => {
  const input = "Analisis menggunakan uji Anova dan model Lapastik secara mendalam.";
  const output = humanize(input, { customTerms: ["Anova", "Lapastik"] });

  assert.ok(
    output.includes("Anova"),
    `Custom term 'Anova' must be preserved, got: ${output}`
  );
  assert.ok(
    output.includes("Lapastik"),
    `Custom term 'Lapastik' must be preserved, got: ${output}`
  );
});

test("7. Integritas Angka: desimal, persen, dan ribuan tidak dipecah", () => {
  const output = humanize(
    "Hasil uji menunjukkan nilai p = 0.05 dan tarif 3.5% dari total biaya Rp 15.000."
  );

  assert.ok(output.includes("0.05"), `Desimal rusak: ${output}`);
  assert.ok(output.includes("3.5%"), `Persen rusak: ${output}`);
  assert.ok(output.includes("15.000"), `Ribuan rusak: ${output}`);
});

test("8. Daftar Pustaka: entri tidak digabung atau dipecah", () => {
  const input = `DAFTAR PUSTAKA
Arief, B. N. (2014). Hukum Pidana. Jakarta: Kencana.
Muladi. (2015). Teori Hukum. Bandung: Alumni.`;
  const output = humanize(input);

  assert.ok(
    output.includes("Arief, B. N. (2014). Hukum Pidana."),
    `Entri referensi berubah: ${output}`
  );
  assert.ok(
    output.split(/\n+/).some((line) => line.startsWith("Muladi. (2015)")),
    `Entri kedua tidak utuh: ${output}`
  );
  assert.ok(!output.includes("Kencana. Muladi"), `Entri digabung: ${output}`);
});

test("9. Istilah Statistik: 'signifikan' tidak diganti pada konteks uji", () => {
  const output = humanize(
    "Uji t menunjukkan perbedaan signifikan antara kelompok kontrol dan perlakuan."
  );

  assert.ok(
    /perbedaan signifikan/i.test(output),
    `Istilah statistik ikut diganti: ${output}`
  );
});

test("10. Nama Diri: penggabungan kalimat tidak merendahkan kapitalisasi", () => {
  const output = humanize(
    "Deni Wahyu meneliti hal itu dengan sangat serius sekali. Wahyudi juga mengamati hal yang sama pada hari itu."
  );

  assert.ok(output.includes("Wahyudi"), `Nama diri jadi huruf kecil: ${output}`);
  assert.ok(!/sementara wahyudi/i.test(output), `Konjungsi karangan muncul: ${output}`);
});

test("11. Gloss Teknis: kurung Inggris yang tidak dikenal dipertahankan", () => {
  const output = humanize(
    "Pendekatan ini menekankan prinsip (self-determination) pada subjek penelitian."
  );

  assert.ok(
    output.includes("(self-determination)"),
    `Istilah teknis terhapus: ${output}`
  );
});

test("12. Kalimat Kapital: isi berhuruf besar tetap diproses", () => {
  const input =
    "ADAPUN PETUGAS LAPAS WAJIB MENDAPAT PERLINDUNGAN HUKUM YANG JELAS DARI NEGARA KARENA RISIKO KERJANYA BERAT";
  const output = humanize(input);

  assert.ok(!/adapun/i.test(output), `Kalimat kapital dilewati: ${output}`);
});

test("13. Titik Koma: kata kerja umum direndahkan setelah penggabungan", () => {
  const output = humanize(
    "Pengawasan internal yang lemah membuat keluhan petugas tidak tertangani dengan baik. Diperlukan perbaikan menyeluruh pada sistem pelaporan insiden di setiap unit."
  );

  assert.ok(
    output.includes("; diperlukan"),
    `Kata kerja pasif tidak direndahkan setelah titik koma: ${output}`
  );
});

test("14. Penulisan lugas: Preservasi sitasi, istilah teknis, dan angka", () => {
  const input =
    "Nilai rata-rata kelas naik dari 75,05 pada prasiklus menjadi 80,65 pada Siklus I dan 87,80 pada Siklus II (Slavin, 2015).";
  const output = humanize(input, { intensity: "sederhana" });

  assert.ok(
    output.includes("(Slavin, 2015)"),
    `Sitasi (Slavin, 2015) harus utuh, dapat: ${output}`
  );
  assert.ok(output.includes("75,05"), `Angka 75,05 harus utuh, dapat: ${output}`);
  assert.ok(output.includes("80,65"), `Angka 80,65 harus utuh, dapat: ${output}`);
  assert.ok(output.includes("87,80"), `Angka 87,80 harus utuh, dapat: ${output}`);
  assert.ok(
    output.toLowerCase().includes("sebelum kegiatan dilakukan"),
    `'pada prasiklus' harus disederhanakan jadi 'sebelum kegiatan dilakukan', dapat: ${output}`
  );
});

test("15. Penulisan lugas: Ketuntasan & angka persen tetap terjaga", () => {
  const input =
    "Pada Siklus I, rata-rata hasil belajar meningkat dari 75,05 menjadi 80,65 dengan ketuntasan 80%.";
  const output = humanize(input, { intensity: "sederhana" });

  assert.ok(output.includes("75,05"), `Angka 75,05 harus utuh, dapat: ${output}`);
  assert.ok(output.includes("80,65"), `Angka 80,65 harus utuh, dapat: ${output}`);
  assert.ok(output.includes("80%"), `Persentase 80% harus utuh, dapat: ${output}`);
  assert.ok(
    output.toLowerCase().includes("siswa yang tuntas") ||
      output.toLowerCase().includes("ketuntasan"),
    `Ketuntasan belajar harus dipertahankan secara wajar, dapat: ${output}`
  );
});

test("16. Penulisan lugas: Transformasi istilah akademik ke bahasa lugas", () => {
  const input =
    "Guru mengimplementasikan metode baru untuk mengidentifikasi kebutuhan belajar peserta didik berdasarkan temuan instrumen diagnostik nonkognitif.";
  const output = humanize(input, { intensity: "sederhana" });

  assert.ok(
    !output.includes("mengimplementasikan"),
    `'mengimplementasikan' harus diubah, dapat: ${output}`
  );
  assert.ok(
    output.includes("menggunakan"),
    `'mengimplementasikan' harus menjadi 'menggunakan', dapat: ${output}`
  );
  assert.ok(
    !output.includes("mengidentifikasi"),
    `'mengidentifikasi' harus diubah, dapat: ${output}`
  );
  assert.ok(
    output.includes("mengetahui"),
    `'mengidentifikasi' harus menjadi 'mengetahui', dapat: ${output}`
  );
  assert.ok(
    !output.includes("peserta didik"),
    `'peserta didik' harus diubah menjadi 'siswa', dapat: ${output}`
  );
  assert.ok(
    output.includes("siswa"),
    `Harus memuat kata 'siswa', dapat: ${output}`
  );
  assert.ok(
    output.includes("dari hasil yang ditemukan"),
    `'berdasarkan temuan' harus jadi 'dari hasil yang ditemukan', dapat: ${output}`
  );
  assert.ok(
    output.includes("angket awal tentang cara dan minat belajar"),
    `'instrumen diagnostik nonkognitif' harus disederhanakan, dapat: ${output}`
  );
});

test("17. Penulisan lugas: Kalimat padat model pembelajaran", () => {
  const input =
    "Penerapan model pembelajaran kooperatif mampu meningkatkan partisipasi aktif peserta didik selama proses pembelajaran berlangsung.";
  const output = humanize(input, { intensity: "sederhana" });

  assert.ok(
    !output.includes("partisipasi aktif peserta didik"),
    `Frasa 'partisipasi aktif peserta didik' harus disederhanakan, dapat: ${output}`
  );
  assert.ok(
    output.toLowerCase().includes("siswa"),
    `Harus menggunakan kata 'siswa', dapat: ${output}`
  );
});

test("18. Capture group: penggantian frasa tidak boleh menyisakan '$1'", () => {
  const output = humanize("Secara fisik dan mental, petugas menghadapi tekanan.");
  const outputSimple = humanize("Secara fisik dan mental, petugas menghadapi tekanan.", {
    intensity: "sederhana",
  });

  for (const res of [output, outputSimple]) {
    assert.ok(!res.includes("$1"), `Placeholder capture group bocor: ${res}`);
    assert.ok(!res.includes("$2"), `Placeholder capture group bocor: ${res}`);
    assert.ok(
      /fisik dan mental/i.test(res),
      `Klausa 'fisik dan mental' harus tetap ada, dapat: ${res}`
    );
  }
});

test("19. Daftar Pustaka: kata 'serta' di entri referensi tidak diubah", () => {
  const input =
    "Arief, B. N. (2014). Hukum serta Keadilan yang Komprehensif. Jakarta: Kencana.";
  const output = humanize(input);

  assert.ok(
    output.includes("Hukum serta Keadilan"),
    `Entri referensi tidak boleh ditulis ulang: ${output}`
  );
  assert.ok(!output.includes("dan juga"), `'serta' di referensi ikut diganti: ${output}`);
});

test("20. Sitasi dalam teks: nama penulis di dalam kurung tidak diubah", () => {
  const output = humanize("Menurut (Slavin, 2015), proses pembelajaran berlangsung baik.");

  assert.ok(
    output.includes("(Slavin, 2015)"),
    `Sitasi dalam kurung harus utuh, dapat: ${output}`
  );
});

test("21. Struktur: judul Title Case dan baris daftar tidak digabung", () => {
  const input = "Pembahasan\n- Petugas kurang tidur\n- Beban kerja tinggi";
  const output = humanize(input);

  assert.ok(/Pembahasan/.test(output), `Judul hilang: ${output}`);
  assert.ok(/- Petugas kurang tidur/.test(output), `Bullet pertama rusak: ${output}`);
  assert.ok(/- Beban kerja tinggi/.test(output), `Bullet kedua rusak: ${output}`);
});

test("22. Analyzer: awalan berkoma ('jadi,') tetap dikenali", () => {
  assert.equal(extractStarter("Jadi, semua aman."), "jadi");

  const result = analyze(
    "Jadi, petugas perlu dilindungi. Jadi, mereka bekerja setiap hari. Jadi, semua aman."
  );
  assert.equal(
    result.starters.details.jadi,
    3,
    `Awalan 'jadi' harus dihitung 3x, dapat: ${JSON.stringify(result.starters.details)}`
  );
});

test("23. Analyzer: 'bahwa' dan 'serta' dihitung, 'serta-merta' tidak", () => {
  const result = analyze("Bahwa serta bahwa serta bahwa serta bahwa serta bahwa serta.");
  assert.ok(result.scan.forbiddenCount > 0, "Kata pantangan tidak terdeteksi");
  assert.ok(
    result.scan.forbiddenWordsFound.some((item) => item.startsWith("bahwa")),
    `'bahwa' tidak terhitung: ${JSON.stringify(result.scan.forbiddenWordsFound)}`
  );

  const safe = analyze("Mereka datang serta-merta ke lokasi.");
  assert.equal(
    safe.scan.forbiddenCount,
    0,
    `'serta-merta' tidak boleh dihitung sebagai 'serta'`
  );
});

test("24. Intensitas: balanced berbeda dari aggressive", () => {
  const input =
    "Petugas lapas bekerja keras setiap hari tanpa kenal lelah. Mereka selalu menjaga keamanan blok hunian dengan penuh tanggung jawab.";
  const aggressive = humanize(input, { intensity: "aggressive" });
  const balanced = humanize(input, { intensity: "balanced" });

  assert.notEqual(
    aggressive,
    balanced,
    `Mode balanced harus berbeda dari aggressive. Keduanya: ${aggressive}`
  );
});

test("25. Aksi granular: pembersihan kata tetap menjaga sitasi & referensi", () => {
  const input =
    "Menurut (Slavin, 2015), petugas serta peneliti perlu menjaga data.\n\nArief, B. N. (2014). Hukum serta Keadilan. Jakarta: Kencana.";
  const output = cleanAiWords(input);

  assert.ok(output.includes("(Slavin, 2015)"), `Sitasi rusak: ${output}`);
  assert.ok(
    output.includes("Hukum serta Keadilan"),
    `Entri referensi ikut diubah: ${output}`
  );
});

test("26. Frasa Akademik: teks akademik umum harus bertransformasi aktif ke bahasa alami", () => {
  const input1 =
    "Sistem ini dirancang untuk mempermudah proses evaluasi mahasiswa pada akhir semester.";
  const out1 = humanize(input1);
  assert.notEqual(out1, input1, "Teks rancang/evaluasi tidak boleh sama persis");
  assert.ok(/dibuat untuk memudahkan/i.test(out1) || /memudahkan penilaian/i.test(out1));

  const input2 =
    "Pendidikan memiliki peran penting dalam membentuk karakter generasi muda di masa depan.";
  const out2 = humanize(input2);
  assert.notEqual(out2, input2, "Teks peran penting tidak boleh sama persis");
  assert.ok(/sangat penting/i.test(out2));
  assert.ok(/anak muda/i.test(out2));

  const input3 =
    "Implementasi kurikulum merdeka memberikan kebebasan kepada guru dalam merancang pembelajaran.";
  const out3 = humanize(input3);
  assert.notEqual(out3, input3, "Teks implementasi tidak boleh sama persis");
  assert.ok(/penerapan/i.test(out3));
});

test("27. Turut Serta: tidak boleh berubah menjadi 'turut dan juga' atau 'ikut dan juga'", () => {
  const input =
    "Pemerintah serta para petugas turut serta menjaga ketertiban masyarakat di daerah rawan konflik.";
  const output = humanize(input);
  assert.ok(!output.includes("turut dan juga"), `'turut serta' rusak jadi: ${output}`);
  assert.ok(!output.includes("ikut dan juga"), `'turut serta' rusak jadi: ${output}`);
  assert.ok(output.includes("ikut serta"), `Harus menjadi 'ikut serta', dapat: ${output}`);
  assert.ok(output.includes("dan juga para petugas"), `'serta' sebelum petugas harus jadi 'dan juga'`);
});

test("28. Kalimat Panjang Tunggal: dipecah dengan konjungsi alami meskipun hanya 1 kalimat", () => {
  const input =
    "Sistem ini dirancang untuk mempermudah proses evaluasi mahasiswa pada akhir semester, sehingga pihak kampus dapat memantau capaian akademik secara cepat dan transparan.";
  const output = humanize(input);
  assert.notEqual(output, input, "Kalimat panjang tunggal harus bertransformasi");
  assert.ok(
    output.includes(". Jadi,") || output.includes(". Maka"),
    `Kalimat panjang harus dipecah menjadi dua kalimat, dapat: ${output}`
  );
});

test("29. Analyzer: mendeteksi kalke AI Indonesia ('Tidak hanya... melainkan juga', 'Di era digital', 'Patut dicatat bahwa')", () => {
  const aiCalqueText =
    "Di era digital, aplikasi ini tidak hanya mempercepat pekerjaan, melainkan juga menurunkan biaya. Patut dicatat bahwa tingkat partisipasi mencapai 80%.";
  const result = analyze(aiCalqueText);

  assert.ok(
    result.scan.totalTemplates >= 3,
    `Minimal 3 pola template kalke AI harus terdeteksi, dapat: ${JSON.stringify(result.scan.templatesFound)}`
  );
  assert.ok(
    result.scan.forbiddenCount >= 2,
    `Kata klise kalke harus terhitung, dapat: ${JSON.stringify(result.scan.forbiddenWordsFound)}`
  );
});

test("30. Transformasi Kalke AI: membersihkan klise kalke sambil menjaga angka 80%", () => {
  const aiCalqueText =
    "Di era digital, patut dicatat bahwa pelatihan ini tidak hanya melatih keterampilan, melainkan juga menjaga ketuntasan 80%.";
  const output = humanize(aiCalqueText);

  assert.ok(output.includes("80%"), `Angka 80% harus tetap utuh, dapat: ${output}`);
  assert.ok(!/di era digital/i.test(output), `'Di era digital' harus diganti, dapat: ${output}`);
  assert.ok(!/patut dicatat/i.test(output), `'Patut dicatat' harus diganti, dapat: ${output}`);
  assert.ok(!/melainkan juga/i.test(output), `'melainkan juga' harus disederhanakan, dapat: ${output}`);
});

test("31. Analyzer X-Ray: menandai pola template AI per kalimat (hasTemplatePattern)", () => {
  const sample =
    "Hal ini menunjukkan bahwa kolaborasi meningkat. Siswa mengerjakan soal latihan mandiri.";
  const result = analyze(sample);

  assert.equal(result.sentences[0]?.hasTemplatePattern, true);
  assert.ok(
    result.sentences[0]?.templatePatterns.includes("Hal ini menunjukkan bahwa"),
    `Template harus tercatat per kalimat: ${JSON.stringify(result.sentences[0])}`,
  );
  assert.equal(result.sentences[1]?.hasTemplatePattern, false);
});
