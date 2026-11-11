---
name: humanisasi-akademik
description: Menyunting naskah akademik berbahasa Indonesia agar berirama alami dan tidak seragam seperti keluaran LLM, lalu mengaudit hasilnya dengan metrik terukur. Gunakan saat pengguna ingin menurunkan skor deteksi AI (DrillBit, Turnitin, GPTZero), meminta "humanisasi" atau parafrase naskah akademik, atau ketika tulisannya ditandai AI padahal disusun sendiri.
license: MIT
compatibility: claude-code opencode autoclaw
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
---

# Humanisasi Akademik Indonesia

Menyunting naskah agar lolos pembacaan mesin **tanpa mengarang isi**. Yang diubah adalah arsitektur kalimat dan urutan gagasan, bukan klaim, data, atau sitasi.

## Doktrin

Detektor tidak membaca "kecerdasan". Ia membaca **prediktabilitas**. Teks yang setiap kalimatnya bisa ditebak bentuknya, dengan pola yang sama dari paragraf pertama sampai terakhir, memberi sinyal seragam. Hukumannya bukan karena kalimatnya pendek atau panjang, tapi karena **semuanya sama**.

Lima prinsip yang menurunkan sinyal itu:

1. **Variansi mengalahkan pemendekan.** Kalimat 6 kata disusul 41 kata mengalahkan seluruh paragraf 15 kata. Rata-rata panjang kalimat hampir tidak berarti; sebarannya yang berarti.
2. **Agen manusia harus terlihat.** "Perlindungan perlu diperbaiki" tidak punya pelaku. "Pemerintah belum menerbitkan aturan turunannya" punya.
3. **Kekhususan mengalahkan keumuman.** Angka, nomor pasal, nama tempat, tahun, dan detail yang hanya bisa diketahui penulisnya adalah sinyal termahal bagi model bahasa.
4. **Wacana tidak boleh berpola.** Jangan buka paragraf dengan konektor yang sama, jangan tutup setiap paragraf dengan simpulan, jangan pakai tiga item sejajar berulang.
5. **Ubah arsitektur, bukan istilah.** Dalam tulisan hukum, "Pasal 87 ayat (1) Undang-Undang Nomor 22 Tahun 2022" harus tetap utuh. Yang divariasikan adalah cara kalimat menyusunnya.

Prinsip ke-5 adalah yang paling sering dilanggar tool humanizer. Membuat istilah hukum bervariasi menghasilkan teks yang tidak akurat, dan itu kerusakan yang tidak bisa dipulihkan reviewer.

## Dua sumbu kegagalan

Ada dua cara tulisan ditandai, dan keduanya harus ditutup:

1. **Terlalu rapi.** Ritme seragam, kosakata aman, wacana berpola. Skor naik karena teks terlalu mudah diprediksi.
2. **Terlalu rusak.** Kalimat hasil parafrase mesin: konektor salah tempat, register turun, kata mubazir, kalimat patah. Skor naik karena teksnya tidak wajar.

Paradoksnya, keduanya bisa terjadi pada dokumen yang sama. Pada data pengguna, dokumen dengan ritme paling sehat justru memperoleh skor tertinggi (83,84%) karena artefak kebahasaannya paling banyak — 24 temuan, termasuk 9 kali "kalau" dan 7 kali "sedangkan" yang salah pakai. Sebaliknya, naskah 56,33% ritmenya jauh lebih buruk (8 dari 13 metrik di luar band) tetapi artefaknya 81 temuan.

Kesimpulannya: **ritme yang rapi saja tidak menjamin skor turun.** Kedua sumbu harus bersih sebelum hasilnya bisa dipercaya.

## Alur kerja

### 1. Audit dulu, jangan langsung menulis

```bash
python scripts/audit_id.py naskah.docx
python scripts/audit_id.py naskah.docx --lint
```

Skrip mengukur 13 metrik ritme dan, dengan `--lint`, menghitung artefak kebahasaan. Sembilan metrik bertanda `*` adalah **metrik kunci**: hanya itu yang dipakai sebagai gerbang, karena sisanya bandnya longgar dan tidak pernah menolak apa pun.

Dasar angkanya: tiga artikel jurnal berbahasa Indonesia yang terbit, ditambah dua dokumen yang skornya sudah diketahui dari detektor. Kalau naskah Anda di luar bidang hukum, band ini perlu dikalibrasi ulang — peringatkan itu ke pengguna, jangan diamkan.

Urutan kerja yang benar: **bersihkan artefak dulu, baru perbaiki ritme.** Kalau kalimatnya masih rusak, menilai variansinya tidak ada artinya.

Untuk melihat kalimat mana yang harus dikerjakan lebih dulu:

```bash
python scripts/audit_id.py naskah.docx --kerja
```

### 2. Diagnosis

Baca tabel, lalu tentukan **satu** penyebab dominan. Urutan prioritas, dari yang paling sering menentukan:

| Temuan | Artinya | Tindakan |
|---|---|---|
| `cv_panjang_kalimat` < 0,55 | Ritme datar | Gabung dan pecah kalimat, bukan memendekkan semuanya |
| `kalimat_pita_tengah_pct` > 74 | Hampir semua kalimat 9–28 kata | Paksa 20% kalimat melewati 30 kata, 20% di bawah 8 kata |
| `kalimat_dibuka_marker_pct` > 38 | Paragraf digerakkan konektor | Hapus dua dari tiga konektor pembuka |
| `kalimat_panjang_pct` < 8 | Tidak ada kalimat majemuk | Sisipkan klausa relatif, keterangan, atau aposisi |
| `hapax_ratio` < 0,55 | Kosakata berputar | Ganti sebagian pengulangan dengan kata sekali pakai yang tepat |
| `paragraf_ditutup_ringkasan_pct` > 55 | Tiap paragraf bermuara sama | Biarkan paragraf berakhir pada detail, bukan simpulan |

### 3. Tulis ulang per paragraf

Kerjakan berurutan, satu paragraf sekali duduk. Untuk setiap paragraf:

- **Simpan klaim.** Hitung ada berapa proposisi faktual. Jumlahnya harus sama setelah disunting.
- **Ubah bentuk, bukan isi.** Dua kalimat pendek boleh jadi satu kalimat majemuk; satu kalimat panjang boleh dipecah tiga. Yang dilarang adalah menambah atau menghapus proposisi.
- **Pilih satu kalimat untuk dijadikan panjang dan berlapis.** Biasanya kalimat yang memuat syarat, sebab, atau pengecualian.
- **Hapus konektor pembuka yang bisa dihilangkan tanpa mengubah makna.** Dalam bahasa Indonesia, urutan kalimat sudah menyatakan hubungan; "Jadi" dan "Artinya" sering hanya pengisi.
- **Akhiri paragraf dengan sesuatu yang spesifik**, bukan dengan rumusan yang bisa dipakai di artikel lain.

Rujuk [references/02-pola-id.md](references/02-pola-id.md) untuk katalog pola dan contoh sebelum/sesudah.

### 4. Audit ulang

```bash
python scripts/audit_id.py naskah-lama.docx naskah-baru.docx --banding
```

Target: metrik yang tadinya di luar band masuk band. Kalau `cv_panjang_kalimat` naik tapi `hapax_ratio` turun, penyuntingan terlalu banyak mengulang kata sendiri; perbaiki sebelum lanjut.

### 5. Cek integritas

Wajib, sebelum menyerahkan hasil. Baca [references/04-integritas.md](references/04-integritas.md).

- Setiap angka, nomor pasal, nama, dan tahun sama dengan aslinya.
- Setiap sitasi masih menempel pada klaim yang sama.
- Tidak ada klaim baru yang tidak ada di naskah asli.
- EYD/PUEBI tetap taat: "di" sebagai kata depan terpisah, istilah asing dimiringkan, tanda baca baku.
- Struktur IMRAD dan penomoran bagian tidak berubah.
- `--lint` menunjukkan temuan bahasa di bawah 4 per 1.000 kata.
- Kalau muncul peringatan abstrak ID/EN bermiripan, versi Inggris harus ditulis ulang dari ide.

Lalu jalankan `--profil`. Empat hal yang menjadi gerbang: 9 metrik kunci, temuan bahasa, deret monoton, dan CV terendah antarbagian. Naskah di bawah 800 kata tidak divonis sama sekali — metriknya belum stabil.

### 6. Kalibrasi (kalau ada skor pembanding)

Metrik di skill ini adalah proksi. Proksi bisa meleset. Kalau pengguna punya beberapa versi naskah yang sudah dikirim ke alat yang sama beserta skornya, jalankan:

```bash
python scripts/kalibrasi.py data.csv
```

Format: `nama,skor,path`. Skrip menampilkan korelasi peringkat antara tiap metrik dan skor. Ini menjawab pertanyaan yang tidak bisa dijawab proksi: **pada naskah ini, metrik mana yang benar-benar bergerak bersama skor.**

Jangan mengarang prediksi skor sebelum ada minimal empat titik data. Sampaikan apa adanya: metrik bergerak, skor belum diuji.

## Kalau targetnya angka tertentu (mis. di bawah 30%)

Ambang 30% jauh lebih ketat daripada ambang vendor (60%), jadi ia bukan sekadar "lebih rapi sedikit". Urutannya berdasarkan dampak:

1. **Seluruh dokumen, bukan sampel.** Penandaan tersebar merata; menyunting 5 paragraf tidak menggeser apa pun. Pakai `--bagian` untuk melihat bagian mana yang paling parah, kerjakan dari situ.
2. **Dua sumbu bersih di semua bagian.** `--profil` harus berbunyi LAYAK KIRIM. Satu bagian yang masih 6 temuan sudah cukup menahan skor.
3. **Tambahkan isi yang tidak bisa diprediksi.** Ini tuas terbesar yang sah: ringkasan peraturan memang berpola, tapi perbandingan kasus, kritik terhadap implementasi, dan posisi penulis sendiri tidak. Naskah yang 90% isinya rangkuman pasal akan selalu terbaca datar, seberapa pun kalimatnya divariasikan.
4. **Abstrak Inggris jangan mencerminkan abstrak Indonesia.** Kalau perlu, tulis versi Inggris lebih dulu.

Setelah itu: kirim **sekali** ke alat yang sama, catat skornya, jalankan `kalibrasi.py`. Jangan mengirim per bagian — biayanya tidak sebanding dan skornya tidak bisa dibandingkan.

Yang harus dikatakan ke pengguna, apa adanya: perbaikan dua sumbu membuat skor turun secara masuk akal, tapi tidak ada jaminan angka. Yang dijamin hanya bahwa naskahnya berhenti memiliki ciri yang membuatnya mudah ditandai.

## Yang menurunkan sinyal, yang tidak

| Bergerak | Tidak bergerak | justru memburuk |
|---|---|---|
| Variansi panjang kalimat | Mengganti sinonim | Parafrase otomatis sekali jalan |
| Kalimat majemuk bertingkat | Memendekkan semua kalimat | Menerjemahkan ulang dari abstrak Inggris |
| Keragaman kata pembuka | Menghapus tanda hubung | Menambahkan basa-basi "sebagai penulis" |
| Kekhususan (angka, nama, tahun) | Mengubah urutan bagian | Menyisipkan idiom yang tidak sesuai register |
| Paragraf dengan panjang berbeda | Menambah kalimat retoris | Menghapus sitasi agar "lebih lancar" |

Dua baris terakhir patut dijelaskan. Parafrase otomatis pernah diuji secara formal: parafrase sederhana justru **menaikkan** deteksi, sebesar 8,57% pada RADAR dan 15,03% pada Fast-DetectGPT ([Cheng dkk., NeurIPS 2025](https://arxiv.org/html/2506.07001v1)). Data pengguna sendiri menunjukkan hal sama: versi yang diparafrase mesin memperoleh 83,84%, versi yang disunting manual turun ke 56,33% pada konten yang sama. Parafrase mesin memindahkan teks ke distribusi mesin lain, bukan ke distribusi manusia.

## Kesalahan yang harus dihindari

1. **Menyunting seluruh naskah sekaligus.** Kerjakan per bagian; menyunting borongan selalu menghasilkan pola baru yang seragam, persis masalah yang hendak dihilangkan.
2. **Menganggap kalimat pendek itu manusiawi.** Ini kekeliruan paling mahal. Teks yang seluruhnya pendek adalah teks paling mudah dideteksi karena variansinya nol.
3. **Menerapkan aturan humanizer Inggris apa adanya.** Tanda pisah panjang, "not just X but Y", dan *rule of three* adalah penanda bahasa Inggris. Dalam bahasa Indonesia, "bukan X melainkan Y" adalah konstruksi baku, bukan penanda AI. Memaksakan aturan Inggris merusak naskah tanpa menurunkan skor.
4. **Menghapus pengulangan istilah teknis.** Pengulangan "petugas pemasyarakatan" itu benar dalam tulisan hukum; sinonim paksa ("penjaga lembaga") adalah kesalahan terminologi.
5. **Menambah klaim agar kalimat terasa lebih kaya.** Ini mengarang. Batas mutlak.
6. **Menjanjikan angka skor.** Tidak ada yang bisa menjamin skor detektor tertentu. Yang bisa dijamin hanya metrik ritme bergerak ke band teks manusia.

## Batas

Skill ini untuk penulis yang menyunting **karyanya sendiri**, dan untuk penulis yang perlu membela diri dari salah tandai. Bukan untuk memberi atribusi palsu pada teks yang disusun pihak lain.

Detektor memang tidak akurat, dan itu bukan alasan untuk mengakalinya, melainkan alasan mengapa keputusan akademik tidak boleh bergantung pada satu angka. Baca [references/04-integritas.md](references/04-integritas.md) untuk angka salah-deteksi yang bisa dipakai dalam sanggahan resmi.

## Berkas

| Berkas | Isi |
|---|---|
| `references/01-cara-detektor-bekerja.md` | Metrik, bukti empiris, keterbatasan DrillBit/Turnitin |
| `references/02-pola-id.md` | Katalog pola AI bahasa Indonesia + sebelum/sesudah |
| `references/03-protokol-edit.md` | Prosedur per lintasan, target metrik, resep kalimat |
| `references/04-integritas.md` | Batas etis, bukti salah-deteksi, cara menyanggah |
| `scripts/audit_id.py` | 13 metrik (`*` = kunci), `--banding`, `--kerja`, `--lint`, `--bagian`, `--profil`, cek cermin abstrak |
| `scripts/kalibrasi.py` | Korelasi metrik vs skor detektor dari data kirim-ulang |
