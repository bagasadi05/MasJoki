# Cara Detektor Bekerja, dan Sejauh Mana Bisa Dipercaya

Ringkasan bukti yang menjadi dasar skill ini. Angka diambil dari sumber primer; setiap klaim diberi tautan.

## 1. Tiga keluarga metode

**Perplexity.** Mengukur seberapa terkejut model bahasa terhadap teks. Kata yang mudah ditebak menurunkan perplexity. Keluaran LLM cenderung berada di lembah probabilitas, jadi perplexity rendah dianggap sinyal AI. Ini dasar DetectGPT dan Fast-DetectGPT, yang melihat kelengkungan log-probabilitas di sekitar teks.

**Burstiness.** Variansi panjang dan kompleksitas kalimat. Manusia menulis tidak rata: satu kalimat 6 kata, berikutnya 40 kata, lalu 12. Model bahasa cenderung stabil di pita menengah. Burstiness rendah dianggap sinyal AI.

**Classifier terlatih.** Model yang dilatih membedakan korpus manusia dan korpus mesin. Ia tidak memakai satu rumus; ia mempelajari distribusi gaya, termasuk pilihan kata, kerangka kalimat, dan pola wacana.

Penting dicatat: **GPTZero menyatakan berhenti memakai perplexity dan burstiness sejak musim gugur 2023** dan beralih ke model deep learning ([GPTZero](https://gptzero.me/news/perplexity-and-burstiness-what-is-it)). Pangram juga berargumen keduanya tidak bisa mendeteksi AI pada tingkat salah-deteksi yang rendah ([Pangram](https://www.pangram.com/blog/why-perplexity-and-burstiness-fail-to-detect-ai)). Artinya, memperbaiki dua metrik itu bukan jaminan. Tapi keduanya tetap menjadi fitur yang dipakai banyak vendor, dan — yang lebih penting untuk penulis — keduanya berkorelasi dengan prosa yang memang tidak enak dibaca.

## 2. DrillBit: apa yang mereka klaim, dan apa yang mereka akui

Dari whitepaper resmi DrillBit ([PDF](https://www.drillbitglobal.com/assets/img/drillbit_ai_detection_whitepaper.pdf)):

- Pipeline: ekstraksi teks, lalu **perplexity scoring, burstiness index, stylometric profiling, semantic coherence analysis**, kemudian ensemble neural network + gradient-boosted decision tree.
- Korpus: 2,5 juta sampel; 1 juta manusia, 1 juta AI, 500 ribu campuran.
- Korpus manusia: artikel peer-review **terbit sebelum 2018** dan tugas mahasiswa **sebelum 2015** — dipilih agar bebas kontaminasi AI.
- Korpus AI: ChatGPT (GPT-3.5/GPT-4), Gemini, Grok; minimum 500 kata; delapan domain akademik.
- Hasil: true negative rate 93%, false positive rate 7%, true positive rate 83%.
- Ambang klasifikasi: **≥60% baru disebut AI**; ≤20% disebut manusia; **20–60% adalah zona ketidakpastian** yang by design dialihkan ke tinjauan manusia.

Tiga konsekuensi yang harus dipahami pengguna laporan DrillBit:

**(a) Skor 40–60% bukan vonis.** Vendor sendiri menulis bahwa rentang itu adalah "classification uncertainty boundary", dan ambang untuk menyebut sesuatu AI adalah 60%. Laporan 56,33% atau 46,72% berada di bawah ambang vendor itu sendiri. Membacanya sebagai "56% tulisan ini buatan AI" adalah salah tafsir terhadap instrumennya.

**(b) Model ini tidak dievaluasi pada bahasa Indonesia.** Bagian *Limitations* menyatakan: "Language scope: The current evaluation covers English-language documents. Multilingual AI detection is an active development area and was not evaluated in this study." Korpus manusianya pun artikel berbahasa Inggris pra-2018. Naskah Indonesia adalah data di luar distribusi. Validitas skornya tidak diketahui, dan tidak ada angka akurasi yang boleh diklaim untuknya.

**(c) Teks formal mudah naik.** Vendor mengakui sendiri bahwa "formal, translated, or template-based text may produce elevated signals". Itu tepat menggambarkan artikel hukum Indonesia.

Ada satu detail teknis yang sering terlewat. Pada laporan, kolom `AI MATCHED (%)` per blok **berjumlah tepat sama dengan skor total** (pada laporan 278135: 24 blok, totalnya 56,33). Artinya angka itu adalah **kontribusi**, bukan kadar AI per blok. Penandaan tersebar merata di seluruh dokumen, bukan menumpuk di beberapa paragraf. Konsekuensi praktisnya: tidak ada gunanya menyunting dua-tiga paragraf; yang harus berubah adalah ritme seluruh naskah.

## 3. Bukti salah-deteksi

**Penutur non-asli bahasa Inggris.** Liang dkk. (2023) menguji tujuh detektor populer pada esai TOEFL dan menemukan **61,22% esai karya penutur non-asli ditandai sebagai AI** ([Patterns / PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10382961)). Penyebabnya bukan kecurangan, melainkan gaya: kalimat sederhana, kosakata terbatas, struktur formulaik — persis ciri yang juga dipakai detektor sebagai sinyal AI. Ringkasan Stanford HAI: [tautan](https://hai.stanford.edu/news/ai-detectors-biased-against-non-native-english-writers).

Ini signifikan untuk konteks Indonesia. Banyak naskah akademik Indonesia berada dalam register yang sama dengan tulisan non-asli: kalimat pendek, konektor eksplisit, sedikit idiomatik. Detektor membaca itu sebagai mesin.

**Teks terjemahan.** DrillBit sendiri menyebut teks terjemahan sebagai pemicu sinyal tinggi. Abstrak dua bahasa yang diterjemahkan kata per kata adalah kasus paling murni: struktur sintaksisnya identik, jadi model melihat distribusi yang terlalu rapi.

**Penilaian manusia juga tidak bisa diandalkan.** Wikipedia mencatat studi 2025 yang menemukan kemampuan manusia membedakan teks LLM dari manusia **tidak lebih baik dari tebakan acak**, dan studi lain pada tesis Jerman hanya mencapai 57% untuk teks AI dan 64% untuk teks manusia ([Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)). Artinya "saya rasa ini AI" bukan bukti, dari pihak mana pun.

## 4. Parafrase: yang bekerja dan yang tidak

Cheng dkk., *Adversarial Paraphrasing* (NeurIPS 2025, [arXiv](https://arxiv.org/html/2506.07001v1)), menguji serangan terhadap delapan detektor:

- **Parafrase sederhana justru memperburuk**: T@1%F naik 8,57% pada RADAR dan 15,03% pada Fast-DetectGPT. Teks makin mirip mesin, bukan makin mirip manusia.
- **Parafrase adversarial** — parafrase yang dipandu skor detektor secara token per token — menurunkan T@1%F rata-rata **87,88%**, dengan penurunan hingga 98,96% pada Fast-DetectGPT.
- Penulisnya sendiri mencatat biaya: sebagian kualitas teks turun.

Yang bisa diambil penulis manusia:

1. Parafrase buta adalah jebakan. Mengganti sinonim dan membalik urutan klausa memindahkan teks ke distribusi mesin lain.
2. Yang menurunkan deteksi secara andal adalah **menggeser teks mendekati distribusi tulisan manusia** — dan itu berarti variansi, kekhususan, dan wacana yang tidak berpola. Bukan trik permukaan.
3. Serangan adversarial butuh akses ke detektor dan model parafrase, plus merusak kualitas. Skill ini menempuh jalur yang bisa dipertanggungjawabkan: perbaiki prosa, bukan akali klasifier.

## 5. Yang tidak bisa dijanjikan

Tidak ada bukti bahwa perbaikan gaya **menjamin** skor turun pada detektor tertentu. Detektor berubah, ambangnya bergeser, dan tiap vendor memakai fitur berbeda. Satu-satunya verifikasi yang sah adalah pengiriman ulang ke alat yang sama.

Data pengguna sendiri memberi satu observasi: konten yang sama, dua versi. Versi hasil parafrase mesin memperoleh **83,84%**; versi yang disunting manual menjadi kalimat pendek memperoleh **56,33%**. Selisih 27 poin dari perubahan gaya semata. Itu bukan bukti kausal yang ketat — hanya satu dokumen — tetapi cukup untuk menunjukkan bahwa skor bergerak mengikuti gaya, bukan mengikuti asal-usul teks.

Angka 56,33% sendiri tetap di bawah ambang 60% yang dipakai vendor untuk menyebut sesuatu AI. Dalam kerangka mereka, laporan itu tidak menyatakan naskah ini AI.
