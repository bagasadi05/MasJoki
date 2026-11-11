# Integritas, Salah Deteksi, dan Cara Menyanggah

## Batas yang tidak boleh dilewati

Skill ini menyunting naskah yang **Anda susun sendiri**. Tiga hal di luar batas:

1. **Mengarang isi.** Menambah angka, pasal, nama, atau temuan untuk membuat kalimat terasa lebih kaya. Ini fabrikasi, dan akibatnya jauh lebih berat daripada skor detektor.
2. **Mengubah klaim agar lolos.** Memperlunak simpulan supaya tidak diperiksa, atau memindahkan atribusi ke sumber yang tidak mengatakannya.
3. **Menyunting naskah orang lain lalu mengakuinya sebagai karya sendiri.** Tidak ada trik gaya yang mengubah kepengarangan.

Memperbaiki ritme dan kekhususan bukan kecurangan. Itu menyunting. Batasnya jelas dan terletak pada **kebenaran isi**, bukan pada bentuk kalimat.

---

## Kenapa skor tinggi bukan bukti

Kalau naskah Anda ditandai, ada empat hal yang perlu diketahui sebelum panik atau sebelum menuduh.

### 1. DrillBit sendiri menetapkan 60% sebagai ambang

Dari whitepaper resmi mereka: skor **≥60%** baru diklasifikasikan AI; **≤20%** manusia; **20–60% adalah zona ketidakpastian** yang secara desain dialihkan ke tinjauan manusia ([whitepaper](https://www.drillbitglobal.com/assets/img/drillbit_ai_detection_whitepaper.pdf)).

Skor 56,33% dan 46,72% berada **di bawah ambang mereka sendiri**. Membacanya sebagai "56% tulisan ini AI" adalah salah tafsir instrumen. Yang benar: "alat ini tidak yakin".

### 2. Model tidak dievaluasi pada bahasa Indonesia

Bagian *Limitations* whitepaper menyatakan evaluasi hanya mencakup dokumen berbahasa Inggris, dan deteksi multibahasa "was not evaluated in this study". Korpus manusianya pun artikel Inggris pra-2018.

Konsekuensinya: untuk naskah Indonesia, **tidak ada angka akurasi yang berlaku**. Vendor tidak mengklaim akurasi untuk bahasa Indonesia, sehingga skor apa pun pada naskah Indonesia tidak punya dasar kalibrasi.

### 3. Teks formal dan terjemahan memang naik skor

Vendor menulis sendiri: "Certain writing styles — formal, translated, or template-based text — may produce elevated signals across any system." Artikel hukum adalah definisi tulisan formal dan template-based.

### 4. Salah deteksi pada penutur non-asli terukur besar

Liang dkk. (2023) menguji tujuh detektor pada esai TOEFL: **61,22% esai karya penutur non-asli ditandai sebagai AI** ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10382961)). Penyebabnya gaya, bukan kecurangan.

Penilaian manusia juga tidak menolong: studi 2025 menemukan kemampuan manusia membedakan teks LLM dari tulisan manusia **tidak lebih baik dari tebakan acak** ([Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)).

---

## Kalau Anda dituduh

Urutannya penting. Jangan mulai dengan "detektornya salah" — itu klaim yang tidak bisa Anda buktikan dan terdengar defensif.

### Langkah 1 — Kumpulkan jejak proses, bukan jejak hasil

Yang meyakinkan bukan versi final, melainkan **perkembangan**:

- Riwayat versi berkas (Word/Drive/OneDrive menyimpan ini dengan timestamp).
- Catatan baca, kartu sitasi, atau tabel ekstraksi literatur.
- Draf dengan komentar, potongan yang dicoret, paragraf yang dipindah.
- Korespondensi dengan pembimbing atau rekan soal bagian tertentu.
- Log pencarian basis data (Scopus, Garuda, HeinOnline) dengan tanggal.

Naskah yang tumbuh dari enam draf dalam tiga bulan punya jejak yang tidak bisa dipalsukan setelah fakta. Ini bukti terkuat yang tersedia.

### Langkah 2 — Minta audit metodologis, bukan bantahan

Ajukan pertanyaan yang bisa dijawab institusi:

1. Alat apa, versi berapa, dan pada ambang berapa hasilnya disebut pelanggaran?
2. Apakah vendor mengklaim validitas untuk bahasa Indonesia? (Minta bagian *Limitations*.)
3. Apakah skor berada di atas ambang yang vendor sendiri tetapkan?
4. Apakah ada tinjauan manusia atas bagian yang ditandai, sebagaimana disarankan vendor?
5. Apa dasar keputusan: satu skor, atau pemeriksaan substansi?

Pertanyaan-pertanyaan ini menggeser perdebatan dari "Anda menyontek atau tidak" ke "apakah instrumen ini sah dipakai untuk keputusan ini" — dan itu perdebatan yang bisa dimenangkan dengan dokumen.

### Langkah 3 — Tawarkan verifikasi substansi

Yang membedakan penulis asli dari yang bukan: ia bisa mempertanggungjawabkan **pilihan**, bukan hanya isi. Tawarkan:

- menjelaskan mengapa suatu pasal dipilih dan bukan pasal lain;
- menunjukkan sumber yang mendasari satu paragraf;
- merekonstruksi alur argumen tanpa membuka naskah;
- memperlihatkan bagian yang sengaja tidak dimasukkan dan alasannya.

### Langkah 4 — Perbaiki tulisannya, jangan cuma skornya

Kalau skor tinggi karena ritmenya datar, itu masalah nyata pada tulisan — terlepas dari detektor. Naskah dengan variansi rendah memang melelahkan dibaca. Perbaiki dengan protokol di [03-protokol-edit.md](03-protokol-edit.md), lalu kirim ulang. Kalau skor turun, Anda punya bukti bahwa yang ditangkap alat itu gaya, bukan kepengarangan.

---

## Yang jangan dilakukan

| Jangan | Alasan |
|---|---|
| Menghapus riwayat versi | Satu-satunya bukti proses hilang |
| Mengaku "semua ini AI" untuk menyelesaikan masalah | Menciptakan pelanggaran yang tidak ada |
| Membeli jasa "lolos Turnitin" | Sering memakai parafrase mesin, yang justru menaikkan deteksi |
| Menyunting hanya bagian yang ditandai | Penandaan tersebar merata; tidak ada bagian yang "bersih" |
| Meminta orang lain menulis ulang seluruhnya | Mengubah kepengarangan, bukan gaya |

---

## Catatan untuk pembimbing dan editor

Kalau Anda membaca laporan ini sebagai penilai:

- Skor AI **bukan** temuan pelanggaran. Ia indikator yang, menurut vendor, harus melewati tinjauan manusia.
- Untuk naskah berbahasa Indonesia, tidak ada dasar kalibrasi. Memakai skor sebagai bukti berarti memakai alat di luar rentang validasinya.
- Teks hukum, teks terjemahan, dan tulisan penutur non-asli punya tingkat salah-deteksi yang terdokumentasi tinggi.
- Yang layak diperiksa adalah **substansi**: apakah penulis memahami sumbernya, apakah sitasi akurat, apakah ada kontribusi yang bisa dipertanggungjawabkan.
