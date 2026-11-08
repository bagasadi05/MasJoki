---
name: bahasa-sederhana-alami
version: 1.0.0
description: Ubah teks akademik atau formal menjadi bahasa Indonesia sangat sederhana, seperti tulisan orang yang belum terbiasa menulis, tanpa mengubah fakta, angka, sitasi, atau makna. Gunakan ketika pengguna meminta rewrite, parafrase, sederhanakan bahasa, atau 'bahasa orang tidak tahu cara menulis'.
---

# Skill: Bahasa Sederhana Alami

## Tujuan
Menulis ulang teks pengguna ke bahasa sehari-hari yang sangat sederhana, agak polos, dan tidak terdengar seperti artikel yang ditulis profesional. Utamakan keterbacaan dan kesetiaan pada data, bukan kesan elegan.

## Kapan digunakan
- Pengguna meminta rewrite/parafrase teks Indonesia dengan gaya sangat sederhana.
- Pengguna menulis 'bahasa orang tidak tahu cara menulis', 'belum pandai menulis', 'jangan terlalu rapi', atau permintaan serupa.
- Jika pengguna secara eksplisit meminta bahasa Inggris, terapkan prinsip yang sama dalam bahasa Inggris sederhana.

## Aturan wajib
1. Pertahankan makna pokok dan urutan gagasan. Jangan memasukkan penemuan, alasan kausal, atau kesimpulan baru.
2. JANGAN mengubah nama orang, sekolah/tempat, jumlah siswa, nilai, rentang angka, persentase, periode, tanggal, identitas teori, dan nama penelitian.
3. Pertahankan sitasi dan letaknya secara wajar, misalnya `(Slavin, 2015)` atau `(Dewantara, 2013)`. Jangan membuat sumber atau DOI baru.
4. Gunakan kata umum: 'melihat', 'membantu', 'membuat', 'dilakukan', 'masalah', 'aturan', 'naik', 'turun'.
5. Gunakan penghubung dasar seperlunya: 'jadi', 'karena', 'tetapi', 'lalu', 'kalau', 'setelah itu', 'selain itu'. Boleh terasa agak berulang, tetapi jangan memaksakan pengulangan pada setiap kalimat.
6. Pecah kalimat panjang. Hindari susunan kalimat yang sangat rapi, abstrak, atau penuh istilah akademik.
7. Pertahankan istilah teknis yang wajib akurat: PTKK, TGT, Wordwall, KKTP, penelitian, nama teori, norma, metode, nama lembaga. Beri arti sederhana jika perlu.
8. Panjang kurang lebih setara dengan teks asal; tidak memperpanjang hanya untuk menjelaskan hal yang sudah jelas. Jika pendek, tetap pendek.
9. Pertahankan jumlah dan urutan paragraf bila membantu. Pertahankan penomoran, heading, dan subbagian jika ada.
10. Tidak sengaja membuat salah ejaan, tata bahasa yang tidak dapat dipahami, atau informasi keliru. 'Tidak tahu cara menulis' berarti sederhana dan tidak dipoles, bukan sengaja merusak mutu atau fakta.
11. Jangan mengklaim hasil akan lolos atau mengelabui alat pendeteksi AI. Kebutuhan utama adalah perubahan gaya secara jujur.
12. Jika sumber menyatakan hasil yang mengandung konflik angka atau simpulan yang berlebihan, pertahankan teks sesuai maksud, tetapi beri catatan singkat di luar rewrite jika kesalahan itu penting.

## Cara kerja
1. Baca seluruh teks, tandai angka, nama, kutipan, sitasi, istilah wajib, dan batasan makna.
2. Pecah setiap kalimat padat menjadi kalimat lebih pendek.
3. Ganti istilah rumit dengan kata biasa tanpa mengubah arti. Jangan hilangkan rincian penelitian.
4. Buat tulisan terasa polos, seperti seseorang menjelaskan dengan kata yang ia punya. Hindari frasa manis/retorik, metafora yang tidak ada di sumber, dan penutup berlebihan.
5. Cek ulang setiap angka, nama, dan sitasi terhadap teks asal.
6. Keluarkan hanya hasil rewrite, kecuali pengguna meminta evaluasi, alasan, atau catatan.

## Panduan istilah
- 'mengimplementasikan' → 'menggunakan' / 'melakukan'
- 'mengidentifikasi' → 'mengetahui' / 'melihat'
- 'berdasarkan temuan' → 'dari hasil yang ditemukan'
- 'partisipasi peserta didik' → 'siswa yang ikut dalam kegiatan'
- 'mengalami peningkatan signifikan' → 'nilainya naik' (jangan menyebut signifikan statistik tanpa bukti)
- 'instrumen diagnostik nonkognitif' → 'angket awal tentang cara dan minat belajar' (jika ini sesuai konteks)
- 'berlandaskan' → 'mengikuti' / 'sesuai dengan'

## Contoh
**Masukan:** Penerapan model pembelajaran kooperatif mampu meningkatkan partisipasi aktif peserta didik selama proses pembelajaran berlangsung.

**Hasil:** Kalau siswa belajar dengan kelompok, mereka bisa lebih banyak ikut belajar. Karena siswa tidak hanya duduk dan mendengarkan guru saja. Mereka juga bisa berbicara dengan teman dan mengerjakan tugas bersama. Jadi siswa bisa lebih aktif saat belajar.

**Masukan:** Nilai rata-rata kelas naik dari 75,05 pada prasiklus menjadi 80,65 pada Siklus I dan 87,80 pada Siklus II (Slavin, 2015).

**Hasil:** Sebelum kegiatan dilakukan, nilai rata-rata kelas masih 75,05. Setelah Siklus I naik menjadi 80,65. Lalu pada Siklus II nilainya naik lagi menjadi 87,80 (Slavin, 2015).

## Cek sebelum mengirim
- [ ] Arti tetap sama
- [ ] Angka, nama, dan sitasi tidak berubah
- [ ] Kata umum, kalimat tidak rumit
- [ ] Tidak terlalu halus atau terlalu seperti bahasa akademik
- [ ] Tidak sengaja menambah atau menghilangkan fakta
- [ ] Bahasa mengikuti permintaan (default Indonesia)
