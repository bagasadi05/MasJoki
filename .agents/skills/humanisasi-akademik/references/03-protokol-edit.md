# Protokol Penyuntingan

Prosedur tujuh lintasan. Setiap lintasan mengejar satu sifat teks; mengerjakan semuanya sekaligus selalu menghasilkan pola baru yang seragam.

**Sebelum mulai.** Simpan berkas asli dengan nama berbeda. Jangan pernah menyunting di berkas sumber — integritas naskah harus bisa dibuktikan lewat perbandingan versi.

---

## Lintasan 0 — Audit

```bash
python scripts/audit_id.py naskah.docx
python scripts/audit_id.py naskah.docx --kerja
```

Catat angka awal. Pilih **dua** metrik terburuk sebagai sasaran lintasan ini. Memperbaiki semuanya sekaligus membuat Anda kehilangan arah, dan biasanya menghasilkan teks yang aneh.

Metrik yang paling sering perlu diperbaiki, berurutan: `cv_panjang_kalimat`, `kalimat_pita_tengah_pct`, `kalimat_dibuka_marker_pct`, `kalimat_panjang_pct`, `hapax_ratio`.

---

## Lintasan 0b — Bersihkan artefak kebahasaan

```bash
python scripts/audit_id.py naskah.docx --lint
```

Kerjakan **sebelum** menyentuh ritme. Kalau kalimatnya masih rusak, mengukur variansinya tidak ada artinya.

| Temuan | Sasaran | Cara memperbaiki |
|---|---|---|
| Kata informal | 0 | "kalau" → "apabila" / "jika"; "cuma" → "hanya"; "soal" → "mengenai"; "bikin" → "menyebabkan" |
| Kata ganda | 0 | hapus satu |
| Pasangan mubazir | 0 | "dan juga" → "dan"; "agar supaya" → "agar" |
| "Penyebabnya," | 0 | ganti "sebabnya" hanya kalau sebabnya memang sudah dijelaskan |
| "sedangkan" berlebih | ≤ 3 per 1.000 kata | banyak dipakai sebagai penghubung serba bisa padahal artinya "sedangkan/while" |
| "di mana" / "yang mana" | 0 | ganti "tempat", "yang", atau pecah kalimat |
| Spasi sebelum tanda baca | 0 | rapikan |

Ambang keseluruhan: **≤ 4 temuan per 1.000 kata**. Kalibrasi pada tiga artikel jurnal terbit memberi 0,7–3,3; dokumen hasil parafrase mesin 9–24. Spasi dan tanda baca ganda tidak dihitung — itu artefak ekstraksi PDF, bukan kesalahan penulis.

Kata informal dalam naskah akademik bukan sekadar pelanggaran EYD. Ia petunjuk bahwa teks pernah melewati parafrase mesin atau ditulis dengan register percakapan. Pada satu naskah hukum yang diperiksa, "kalau" muncul 43 kali — itu bukan variasi gaya, itu kerusakan register.

---

## Lintasan 1 — Paragraf

Kerjakan sebelum menyentuh kalimat. Kalau paragrafnya masih seragam, menyunting kalimat hanya menciptakan variansi lokal di dalam bingkai yang tetap datar.

1. Hitung kata per paragraf. Kalau semua paragraf 80–120 kata, ubah proporsinya: sisakan beberapa paragraf 40–60 kata, buat beberapa 180–250 kata.
2. Bongkar **kalimat penutup yang merangkum** pada minimal separuh paragraf. Ganti dengan detail, angka, atau lanjutan yang membuka, bukan menutup.
3. Pastikan tidak lebih dari separuh paragraf dibuka dengan konektor.
4. Jangan mengubah urutan argumen. Struktur IMRAD, penomoran bagian, dan alur logika tetap.

**Uji cepat.** Ambil kalimat terakhir tiap paragraf. Kalau lima di antaranya bisa saling ditukar tanpa terasa aneh, semuanya pengisi.

---

## Lintasan 2 — Panjang kalimat

Ini lintasan yang paling menentukan. Sasaran distribusi:

| Pita | Target | Arti |
|---|---|---|
| < 10 kata | 20–28% | Pernyataan tegas, transisi, kesimpulan lokal |
| 10–28 kata | 45–60% | Kalimat penjelas biasa |
| > 28 kata | 20–28% | Kalimat berlapis: syarat, sebab, pengecualian, perbandingan |

Cara mencapainya bukan dengan memanjangkan semua kalimat, melainkan **menggabungkan dua kalimat pendek yang bersambungan** dan **memecah satu kalimat panjang menjadi tiga**.

### Resep kalimat berlapis

Pilih satu kalimat per paragraf untuk dijadikan panjang. Bentuk yang bisa dipakai:

**Syarat + akibat.**
> Apabila tindakan itu mengakibatkan cedera, petugas berhadapan dengan dua jalur sekaligus: pemeriksaan internal dan kemungkinan laporan pidana.

**Kontras terkendali.**
> Pengamanan ketat menurunkan risiko pelarian, tetapi tidak menghapus risiko kekerasan; justru di lapas dengan pengamanan tertinggi, ketegangan antarpenghuni menumpuk pada ruang yang sempit.

**Sebab berlapis.**
> Karena jumlah petugas tidak bertambah sementara penghuni melebihi kapasitas, pengawasan bergeser dari pendampingan menjadi penjagaan, dan dari penjagaan menjadi respons atas kejadian.

**Pengecualian.**
> Kecuali di satuan kerja yang punya dokter jiwa, pemeriksaan kesehatan mental pascainsiden hampir selalu bergantung pada inisiatif atasan langsung.

**Aposisi.**
> Nusakambangan, pulau yang menampung beberapa lapas pengamanan maksimum, menjadi contoh paling sering dipakai — sekaligus paling jarang diteliti.

**Perbandingan.**
> Beban kerja di lapas narkotika berbeda bentuk dari lapas terorisme: yang pertama menguras tenaga pada pengawasan harian, yang kedua pada kewaspadaan terhadap ancaman dari luar.

### Resep kalimat pendek

Kalimat 4–8 kata dipakai untuk menegaskan, bukan untuk menjelaskan:

> Dasar hukumnya ada. · Yang belum ada kejelasan. · Angkanya tidak tersedia. · Itu masalah tersendiri.

Satu-dua per beberapa paragraf cukup. Terlalu banyak dan teks terasa seperti catatan.

### Batas kadar

- CV panjang kalimat jangan melebihi **0,95**. Di atas itu teks terasa gelisah, bukan manusiawi.
- Jangan menaruh dua kalimat pendek berturut-turut lebih dari sekali per paragraf.
- Jangan membuat kalimat lebih dari 45 kata. Pembaca akademik akan tersesat lebih dulu daripada detektor.

---

## Lintasan 3 — Pembuka kalimat

Periksa kata pertama tiap kalimat. Kalau "Jadi", "Artinya", "Namun", "Karena itu", "Hal ini" muncul lebih dari sepertiga, kerjakan ini:

1. Hapus konektor yang hubungannya sudah tersirat dari urutan kalimat. Dalam bahasa Indonesia, parataksis (kalimat berdampingan tanpa penghubung) lazim dan justru terasa lebih dewasa.
2. Untuk yang harus dipertahankan, pindahkan konektor ke tengah: bukan "Namun, aturan itu belum jelas", melainkan "Aturan itu, bagaimanapun, belum jelas".
3. Ganti sebagian dengan subjek pelaku: "Pemerintah belum menerbitkan aturan turunannya." Lebih tajam, dan menambah agen.

**Target.** `pembuka_bervariasi_ratio` ≥ 0,55; `kalimat_dibuka_marker_pct` ≤ 38.

---

## Lintasan 4 — Verba dan agen

Untuk tiap kalimat, tanyakan: **siapa yang melakukan apa?**

- "dilakukan penilaian terhadap X" → "tim menilai X" / "penilai menilai X"
- "terdapat perbedaan" → "hasilnya berbeda" / "kedua penelitian berbeda"
- "perlu diperbaiki" → "pemerintah perlu memperbaiki" / "perbaikan harus datang dari…"
- "menjadi perhatian" → "menarik perhatian" / "diabaikan"

Kalau pelakunya memang tidak diketahui, jangan dikarang. "Belum ada data" adalah kalimat yang jujur dan justru menambah kredibilitas.

---

## Lintasan 5 — Leksikal dan kekhususan

1. Cari frasa konten yang muncul lebih dari 4 kali (`--kerja` menampilkannya). Perbaiki dengan mengubah **subjek kalimat**, bukan dengan sinonim.
2. Ganti kata umum dengan kata khusus: "berbagai penelitian" → nama penelitinya; "tingkat risiko yang tinggi" → angka atau kategori yang dipakai sumbernya.
3. Tambahkan detail yang hanya bisa diketahui penulis: nama lapas, tahun kajian, jumlah responden, nomor pasal. Ini menaikkan `hapax_ratio` sekaligus membuat teks lebih berguna.
4. **Jangan** menambah detail yang tidak ada di sumber. Kalau tidak ada, jangan diisi.

---

## Lintasan 6 — Abstrak dan versi Inggris

1. Tulis versi Inggris dari **catatan ide**, bukan dari teks Indonesia.
2. Ubah urutan gagasan antarversi. Kalau versi Indonesia membuka dengan "Penelitian ini membahas…", versi Inggris buka dengan kondisinya.
3. Jangan menyamakan panjang kalimat antarversi — itu petunjuk paling jelas bahwa satu versi hanya dipetakan.
4. Tetap penuhi kaidah abstrak jurnal: 150–250 kata, memuat tujuan, metode, temuan, kontribusi. Jangan mengorbankan struktur hanya demi variansi.

---

## Lintasan 7 — Audit ulang dan integritas

```bash
python scripts/audit_id.py naskah-asli.docx naskah-baru.docx --banding
```

Periksa:

- [ ] Metrik sasaran sudah masuk band
- [ ] Tidak ada metrik yang tadinya OK sekarang keluar band
- [ ] Jumlah kalimat tidak berubah drastis (patokan: ±15%) — perubahan besar menandakan ada isi yang hilang atau ditambah
- [ ] Semua angka, pasal, nama, tahun identik dengan aslinya
- [ ] Semua sitasi masih menempel pada klaim yang sama
- [ ] EYD/PUEBI taat: "di" kata depan terpisah, istilah asing dimiringkan, tanda baca baku
- [ ] Penomoran bagian dan hierarki judul tidak berubah
- [ ] Tidak ada klaim baru

Verifikasi akhir hanya bisa dilakukan dengan mengirim ulang ke alat yang sama. Jangan menjanjikan angka sebelum itu.

---

## Perkiraan waktu

Sekitar **400–600 kata per jam** untuk hasil yang layak dipertahankan. Naskah 6.000 kata butuh dua sampai tiga sesi. Siapa pun yang mengaku bisa menurunkan skor seluruh naskah dalam sepuluh menit sedang melakukan parafrase mesin, dan itu justru menaikkan deteksi.

---

## Kesalahan kadar yang paling sering

| Kesalahan | Akibat |
|---|---|
| Memendekkan semua kalimat | Variansi nol, skor justru naik |
| Mengganti istilah teknis dengan sinonim | Kesalahan terminologi, reviewer menolak |
| Menambah kalimat retoris untuk "suara manusia" | Terbaca sebagai basa-basi, bukan gaya |
| Menyunting semua bagian dengan pola yang sama | Seragam lagi, hanya dengan pola baru |
| Menghapus sitasi karena mengganggu kelancaran | Pelanggaran integritas |
| Menyalin hasil parafrase mesin lalu merapikan sedikit | Skor lebih tinggi dari aslinya |
