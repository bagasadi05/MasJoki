#!/usr/bin/env python3
"""Audit ritme & gaya teks akademik Indonesia (proksi sinyal detektor AI).

Mengukur hal-hal yang secara mekanis dipakai detektor (perplexity, burstiness,
keseragaman komposisi) dalam bentuk yang bisa diperiksa manusia: variasi panjang
kalimat, kemerataan paragraf, pembuka kalimat yang berulang, kepadatan konektor,
keragaman leksikal, dan frasa template.

Pemakaian:
    python audit_id.py berkas.docx
    python audit_id.py berkas.txt --json
    python audit_id.py a.docx b.docx --banding

Skrip ini TIDAK memprediksi skor detektor. Ia mengukur penyebab, bukan gejala.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import statistics
import sys
from collections import Counter
from pathlib import Path

# ---------------------------------------------------------------- pemuatan teks

ABBREV = {
    "et", "al", "no", "hlm", "hal", "dll", "dsb", "dst", "dr", "prof", "ir",
    "mr", "mrs", "ms", "vs", "vol", "ed", "eds", "pp", "cf", "ibid", "op",
    "cit", "tanpa", "tahun", "th", "jl", "kec", "kab", "prov", "univ",
}


def load_text(path: Path) -> list[str]:
    """Kembalikan daftar paragraf."""
    suffix = path.suffix.lower()
    if suffix == ".docx":
        from docx import Document

        doc = Document(str(path))
        paras = [p.text.strip() for p in doc.paragraphs]
        return [p for p in paras if p]
    if suffix == ".pdf":
        from pypdf import PdfReader

        reader = PdfReader(str(path))
        raw = "\n".join((pg.extract_text() or "") for pg in reader.pages)
        return _paragraphs_from_lines(raw)
    raw = path.read_text(encoding="utf-8", errors="replace")
    blocks = re.split(r"\n\s*\n", raw)
    return [" ".join(b.split()) for b in blocks if b.strip()]


NOISE = re.compile(
    r"^(ai content detection report|submission id:|drillbit\s+ai content|"
    r"=== page \d+ ===|\d{1,3})$",
    re.IGNORECASE,
)


def _paragraphs_from_lines(raw: str) -> list[str]:
    keep = [ln for ln in raw.splitlines() if not NOISE.match(ln.strip())]
    text = "\n".join(keep)
    blocks = re.split(r"\n\s*\n", text)
    out = []
    for b in blocks:
        # baris dalam satu paragraf: gabung, kecuali baris pendek (judul/tabel)
        lines = [ln.strip() for ln in b.splitlines() if ln.strip()]
        buf: list[str] = []
        for ln in lines:
            if len(ln) < 45 and buf:
                buf.append("\x00" + ln)
            else:
                buf.append(ln)
        joined = " ".join(buf)
        for chunk in joined.split("\x00"):
            chunk = " ".join(chunk.split())
            if len(chunk.split()) >= 8:
                out.append(chunk)
    return out


# ------------------------------------------------------------- pemecah kalimat

SENT_END = re.compile(r"(?<=[.!?])\s+(?=[\"“'(\[]?[A-ZÀ-Þ])")


def split_sentences(paragraphs: list[str]) -> list[str]:
    sents: list[str] = []
    for para in paragraphs:
        parts = SENT_END.split(para)
        merged: list[str] = []
        for part in parts:
            if merged:
                prev = merged[-1]
                tail = re.split(r"[\s(]+", prev.rstrip(" ."))
                last_tok = tail[-1].lower().strip(",;:") if tail else ""
                if last_tok in ABBREV or re.fullmatch(r"[a-z]", last_tok or "x"):
                    merged[-1] = prev + " " + part
                    continue
            merged.append(part)
        sents.extend(s.strip() for s in merged if s.strip())
    return sents


WORD = re.compile(r"[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*")


def words(text: str) -> list[str]:
    return WORD.findall(text)


# ------------------------------------------------------------------- leksikon

CONNECTIVES = {
    "jadi", "artinya", "karena", "namun", "tetapi", "tapi", "selain", "meski",
    "meskipun", "sementara", "sedangkan", "dengan", "oleh", "hal", "karena",
    "sehingga", "maka", "begitu", "demikian", "pertama", "kedua", "ketiga",
    "selanjutnya", "kemudian", "akhirnya", "sebagai", "dalam", "pada", "untuk",
    "adapun", "sementara", "sebaliknya", "bahkan", "justru", "memang", "sudah",
}
# Yang dihitung hanya konektor wacana pembuka — bukan preposisi biasa.
OPENER_MARKERS = {
    "jadi", "artinya", "namun", "tetapi", "tapi", "selain", "meski", "meskipun",
    "sementara", "sedangkan", "sehingga", "maka", "begitu", "demikian",
    "pertama", "kedua", "ketiga", "selanjutnya", "kemudian", "akhirnya",
    "sebaliknya", "bahkan", "justru", "adapun", "karena", "oleh", "dengan",
    "hal", "sebagai", "dalam", "pada", "untuk", "jika", "apabila", "ketika",
    "saat", "setelah", "sebelum", "guna", "bagi", "menurut", "berdasarkan",
}

CLOSERS = re.compile(
    r"^(dengan demikian|dengan begitu|jadi|artinya|hal ini menunjukkan|"
    r"dapat disimpulkan|sebagai kesimpulan|oleh karena itu|karena itu)\b",
    re.IGNORECASE,
)

TEMPLATE_PHRASES = [
    "penelitian ini bertujuan untuk", "tujuan dari penelitian ini",
    "berdasarkan hasil analisis", "dapat disimpulkan bahwa",
    "hal ini menunjukkan bahwa", "hal ini sejalan dengan",
    "dalam konteks", "pada era", "di era digital", "sangat penting untuk",
    "memainkan peran penting", "memiliki peran yang sangat penting",
    "merupakan salah satu", "tidak dapat dipungkiri",
    "sebagai upaya untuk", "dalam rangka", "guna mencapai",
    "secara komprehensif", "secara holistik", "secara signifikan",
    "optimalisasi", "sinergi", "berbagai aspek", "berbagai pihak",
    "menjadi krusial", "sangat krusial", "perlu menjadi perhatian",
    "menjadi perhatian bersama", "tantangan tersendiri",
    "di sisi lain", "di samping itu", "lebih lanjut",
    "sejalan dengan hal tersebut", "sehubungan dengan hal tersebut",
    "perlu dicatat bahwa", "penting untuk dicatat",
]

TRANSLATIONESE = [
    "di mana", "yang mana", "hal tersebut", "hal ini", "tersebut di atas",
    "dalam hal ini", "pada dasarnya", "secara umum", "secara khusus",
]

LEXICON = {
    "adalah", "merupakan", "dapat", "dilakukan", "terdapat", "berbagai",
    "tersebut", "signifikan", "optimal", "efektif", "efisien", "komprehensif",
    "integratif", "holistik", "krusial", "esensial", "fundamental",
}


# --------------------------------------------------------------------- metrik

def analyse(paragraphs: list[str]) -> dict:
    paras = [p for p in paragraphs if len(words(p)) >= 8]
    sents = split_sentences(paras)
    lens = [len(words(s)) for s in sents]
    lens = [n for n in lens if n > 0]
    if len(lens) < 10:
        raise SystemExit("Teks terlalu pendek (minimal ~10 kalimat).")

    all_words = [w.lower() for p in paras for w in words(p)]
    n_words = len(all_words)
    toks = [w for w in all_words if len(w) > 2]

    mean_len = statistics.fmean(lens)
    sd_len = statistics.pstdev(lens)
    p10, p90 = _pct(lens, 0.10), _pct(lens, 0.90)

    # kemerataan: berapa banyak kalimat berurutan yang panjangnya mirip
    runs, cur = [], 1
    for a, b in zip(lens, lens[1:]):
        if abs(a - b) <= 3:
            cur += 1
        else:
            runs.append(cur)
            cur = 1
    runs.append(cur)
    longest_run = max(runs)

    openers = [words(s)[0].lower() for s in sents if words(s)]
    opener_counts = Counter(openers)
    top_opener, top_opener_n = opener_counts.most_common(1)[0]
    marker_starts = sum(1 for o in openers if o in OPENER_MARKERS)

    para_lens = [len(words(p)) for p in paras]
    para_cv = (statistics.pstdev(para_lens) / statistics.fmean(para_lens)) if len(para_lens) > 1 else 0.0

    trigrams = Counter(tuple(toks[i:i + 4]) for i in range(len(toks) - 3))
    rep4 = sum(c - 1 for c in trigrams.values() if c > 3)
    content_bigrams = Counter(
        (toks[i], toks[i + 1]) for i in range(len(toks) - 1)
        if toks[i] not in STOP and toks[i + 1] not in STOP
    )

    joined = " " + " ".join(all_words) + " "
    tmpl = {p: joined.count(" " + p + " ") for p in TEMPLATE_PHRASES}
    tmpl = {k: v for k, v in tmpl.items() if v}
    trans = {p: joined.count(" " + p + " ") for p in TRANSLATIONESE}
    trans = {k: v for k, v in trans.items() if v}

    lemma_density = {w: joined.count(" " + w + " ") for w in LEXICON}
    lemma_density = {k: v for k, v in lemma_density.items() if v}

    closers = sum(1 for p in paras if CLOSERS.match(split_sentences([p])[-1]) if split_sentences([p]))
    commas = sum(s.count(",") for s in sents) / len(sents)

    types = len(set(toks))
    ttr = types / len(toks) if toks else 0.0
    hapax = sum(1 for w, c in Counter(toks).items() if c == 1) / types if types else 0.0

    return {
        "paragraf": len(paras),
        "kalimat": len(sents),
        "kata": n_words,
        "rata_kata_per_kalimat": round(mean_len, 1),
        "sd_panjang_kalimat": round(sd_len, 1),
        "cv_panjang_kalimat": round(sd_len / mean_len, 3) if mean_len else 0.0,
        "p10_panjang": p10,
        "p90_panjang": p90,
        "rasio_p90_p10": round(p90 / p10, 2) if p10 else 0.0,
        "kalimat_sangat_pendek_pct": round(100 * sum(1 for n in lens if n < 9) / len(lens), 1),
        "kalimat_panjang_pct": round(100 * sum(1 for n in lens if n > 28) / len(lens), 1),
        "kalimat_pita_tengah_pct": round(100 * sum(1 for n in lens if 9 <= n <= 28) / len(lens), 1),
        "run_monoton_terpanjang": longest_run,
        "pembuka_terbanyak": f"{top_opener} ({top_opener_n}x, {100 * top_opener_n / len(openers):.0f}%)",
        "pembuka_bervariasi_ratio": round(len(opener_counts) / len(openers), 3),
        "kalimat_dibuka_marker_pct": round(100 * marker_starts / len(openers), 1),
        "koma_per_kalimat": round(commas, 2),
        "kalimat_terpanjang": max(lens),
        "cv_panjang_paragraf": round(para_cv, 3),
        "paragraf_ditutup_ringkasan_pct": round(100 * closers / len(paras), 1),
        "ttr": round(ttr, 3),
        "hapax_ratio": round(hapax, 3),
        "pengulangan_4gram": rep4,
        "pengulangan_4gram_per_1k": round(1000 * rep4 / n_words, 2),
        "bigram_konten_teratas": [
            {"frase": f"{a} {b}", "n": c}
            for (a, b), c in content_bigrams.most_common(8)
        ],
        "frasa_template": dict(sorted(tmpl.items(), key=lambda kv: -kv[1])[:10]),
        "penanda_terjemahan": dict(sorted(trans.items(), key=lambda kv: -kv[1])[:8]),
        "kata_klise_per_1k": round(1000 * sum(lemma_density.values()) / n_words, 1),
    }


STOP = {
    "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk", "pada",
    "dalam", "tidak", "juga", "akan", "atau", "karena", "sudah", "ada", "oleh",
    "adalah", "merupakan", "sebagai", "para", "setiap", "dapat", "telah",
}


def _pct(vals: list[int], q: float) -> int:
    s = sorted(vals)
    idx = min(len(s) - 1, max(0, int(round(q * (len(s) - 1)))))
    return s[idx]


# -------------------------------------------------------------------- sasaran

# Band hasil kalibrasi terhadap 3 artikel jurnal berbahasa Indonesia yang terbit
# (johannesibrahim 2023, Contoh Penulisan Artikel Ilmiah Hukum, Karya Ilmiah
# Catur Fitriana Ulfah), dibandingkan dengan dokumen yang ditandai detektor.
# Bukan ambang universal: naskah di luar bidang hukum perlu dikalibrasi ulang.
TARGET = {
    "cv_panjang_kalimat": (0.55, 9.9),
    "kalimat_sangat_pendek_pct": (8.0, 34.0),
    "kalimat_panjang_pct": (8.0, 32.0),
    "kalimat_pita_tengah_pct": (0.0, 74.0),
    "run_monoton_terpanjang": (0, 6),
    "kalimat_dibuka_marker_pct": (0, 38.0),
    "pembuka_bervariasi_ratio": (0.55, 9.9),
    "cv_panjang_paragraf": (0.65, 9.9),
    "paragraf_ditutup_ringkasan_pct": (0, 55.0),
    "hapax_ratio": (0.55, 9.9),
    "pengulangan_4gram_per_1k": (0, 26.0),
    "kata_klise_per_1k": (0, 38.0),
    "koma_per_kalimat": (0.95, 3.4),
}

# Metrik yang pada kalibrasi benar-benar memisahkan teks manusia dari teks yang
# ditandai. Sisanya dilaporkan sebagai informasi: bandnya longgar sehingga tidak
# pernah menolak apa pun, dan memakainya sebagai gerbang akan menyesatkan.
KUNCI = (
    "cv_panjang_kalimat",
    "kalimat_panjang_pct",
    "kalimat_pita_tengah_pct",
    "run_monoton_terpanjang",
    "kalimat_dibuka_marker_pct",
    "pembuka_bervariasi_ratio",
    "cv_panjang_paragraf",
    "hapax_ratio",
    "koma_per_kalimat",
)

LABEL = {
    "cv_panjang_kalimat": "Variasi panjang kalimat (CV)",
    "kalimat_sangat_pendek_pct": "% kalimat <9 kata",
    "kalimat_panjang_pct": "% kalimat >28 kata",
    "kalimat_pita_tengah_pct": "% kalimat pita tengah (9-28 kata)",
    "run_monoton_terpanjang": "Deret kalimat monoton terpanjang",
    "kalimat_dibuka_marker_pct": "% kalimat dibuka konektor",
    "pembuka_bervariasi_ratio": "Keragaman kata pembuka",
    "cv_panjang_paragraf": "Variasi panjang paragraf",
    "paragraf_ditutup_ringkasan_pct": "% paragraf ditutup kalimat ringkasan",
    "hapax_ratio": "Rasio kata sekali-pakai (hapax)",
    "pengulangan_4gram_per_1k": "Pengulangan 4-gram per 1k kata",
    "kata_klise_per_1k": "Kepadatan kata klise per 1k",
    "koma_per_kalimat": "Klausa (koma) per kalimat",
}


def verdict(metrics: dict) -> list[dict]:
    rows = []
    for key, (lo, hi) in TARGET.items():
        val = metrics[key]
        if val < lo:
            status = "RENDAH"
        elif val > hi:
            status = "TINGGI"
        else:
            status = "OK"
        rows.append({"metrik": LABEL[key], "nilai": val, "band": f"{lo}–{hi}", "status": status, "kunci": key in KUNCI})
    return rows


INFORMAL = ["kalau", "cuma", "banget", "nggak", "gak", "udah", "bikin", "kayak", "gimana", "soal"]
REDUNDAN = ["dan juga", "agar supaya", "namun tetapi", "sangat sangat", "para para", "adalah merupakan"]


def lint(paragraphs: list[str]) -> str:
    """Cek artefak kebahasaan: gejala parafrase mesin dan kalimat rusak."""
    text = " ".join(paragraphs)
    low = text.lower()
    out: list[str] = ["\n=== CEK KEBAHASAAN ==="]

    dups = re.findall(r"\b(\w{3,})\s+\1\b", low)
    out.append(f"kata ganda (mis. 'yang yang')      : {len(dups)}" + (f"  -> {dups[:4]}" if dups else ""))

    sp = re.findall(r"\s+[.,;:](?!\d)", text)
    out.append(f"spasi sebelum tanda baca           : {len(sp)}")

    dp = re.findall(r"[.,;:]{2,}", text)
    out.append(f"tanda baca ganda                   : {len(dp)}")

    info = {w: len(re.findall(r"\b" + w + r"\b", low)) for w in INFORMAL}
    info = {k: v for k, v in info.items() if v}
    out.append(f"kata informal (register turun)     : {sum(info.values())}" + (f"  -> {info}" if info else ""))

    red = {p: low.count(p) for p in REDUNDAN}
    red = {k: v for k, v in red.items() if v}
    out.append(f"pasangan mubazir                   : {sum(red.values())}" + (f"  -> {red}" if red else ""))

    sed = low.count(" sedangkan ") + low.count("sedangkan,")
    out.append(f"'sedangkan' (rawan salah pakai)    : {sed}")

    peny = low.count("penyebabnya,")
    out.append(f"'Penyebabnya,' (sebab tanpa bukti) : {peny}")

    rel = low.count(" di mana ") + low.count(" yang mana ")
    out.append(f"'di mana'/'yang mana' (calque)     : {rel}")

    dim = len(re.findall(r"\bdimana\b", low))
    out.append(f"'dimana' (bentuk salah)            : {dim}")

    long_s = [s for s in split_sentences(paragraphs) if len(words(s)) > 45]
    out.append(f"kalimat > 45 kata                  : {len(long_s)}")

    def per1k(w: str) -> float:
        return round(1000 * len(re.findall(r"\b" + w + r"\b", low)) / max(1, len(words(text))), 1)

    out.append("")
    out.append(
        "catatan kepadatan /1.000 kata: "
        f"tersebut {per1k('tersebut')} · berbagai {per1k('berbagai')} · "
        f"sangat {per1k('sangat')} · dilakukan {per1k('dilakukan')}"
    )
    out.append("  (pedoman: tersebut <8 · berbagai <6 · sangat <8 · dilakukan <12)")

    noend = [s for s in split_sentences(paragraphs) if not s.rstrip().endswith((".", "!", "?", ":"))]
    out.append(f"kalimat tanpa penutup              : {len(noend)}")

    pasti = (
        len(dups) + sum(info.values()) + sum(red.values())
        + max(0, sed - 3) + peny + rel + dim
    )
    lunak = len(sp) + len(dp)
    per1k = round(1000 * pasti / max(1, len(words(text))), 1)
    out.append("")
    out.append(f"TEMUAN BAHASA (dihitung)          : {pasti}  ({per1k} per 1.000 kata)")
    out.append(f"ARTEFAK TIPOGRAFI (diabaikan)      : {lunak}  spasi/tanda baca ganda")
    out.append(f"  Pedoman: <= 4 temuan per 1.000 kata. Artikel jurnal manusia berkisar 0,7-3,3; dokumen hasil parafrase mesin 9-24.")
    return "\n".join(out), pasti


HEAD_RE = re.compile(
    r"^(BAB\s+[IVXLC]+|BAGIAN\s+[A-Z]+|[IVX]{1,5}\s*\.\s*[A-Z]|\d+(?:\.\d+)*\.?\s+[A-Z])"
)


def load_blocks(path: Path) -> list[tuple[str, str]]:
    """Paragraf beserta nama gayanya (untuk mengenali judul bagian di .docx)."""
    if path.suffix.lower() == ".docx":
        from docx import Document

        doc = Document(str(path))
        return [(p.text.strip(), p.style.name) for p in doc.paragraphs if p.text.strip()]
    return [(t, "") for t in load_text(path)]


COMMON_HEADS = {
    "abstrak", "abstract", "pendahuluan", "metode penelitian", "metode",
    "pembahasan", "hasil", "hasil dan pembahasan", "diskusi", "kesimpulan",
    "simpulan", "daftar pustaka", "tinjauan pustaka", "kata kunci", "keywords",
}


def _is_heading(text: str, style: str) -> bool:
    t = text.strip()
    if style.lower().startswith("heading") or style.lower() in {"title", "subtitle"}:
        return True
    if t.startswith("#"):
        return True
    w = words(t)
    if len(w) > 14:
        return False
    if t.lower().rstrip(":") in COMMON_HEADS:
        return True
    if HEAD_RE.match(t):
        return True
    return t.isupper() and len(w) <= 12


def sections(blocks: list[tuple[str, str]]) -> list[tuple[str, list[str]]]:
    """Pecah naskah menurut judul bagian; kalau tidak terdeteksi, potong per ~1.500 kata."""
    marks = [i for i, (t, s) in enumerate(blocks) if _is_heading(t, s)]

    if len(marks) < 2:
        out, cur, cnt = [], [], 0
        for t, _ in blocks:
            cur.append(t)
            cnt += len(words(t))
            if cnt >= 1500:
                out.append((f"bagian {len(out) + 1}", cur))
                cur, cnt = [], 0
        if cur:
            out.append((f"bagian {len(out) + 1}", cur))
        return out

    if marks[0] != 0:
        marks.insert(0, 0)
    out = []
    for k, start in enumerate(marks):
        end = marks[k + 1] if k + 1 < len(marks) else len(blocks)
        body = [t for t, _ in blocks[start:end]]
        raw = " ".join(words(blocks[start][0])[:9]) or f"bagian {k + 1}"
        out.append((raw.lstrip("# "), body))
    return out


REF_TITLES = ("daftar pustaka", "daftar referensi", "referensi", "references", "bibliografi", "bibliography")


def strip_references(blocks: list[tuple[str, str]]) -> list[tuple[str, str]]:
    """Buang bagian daftar pustaka: ia bukan prosa yang bisa disunting."""
    for i, (t, s) in enumerate(blocks):
        if _is_heading(t, s) and t.strip().lower().rstrip(":") in REF_TITLES:
            return blocks[:i]
    return blocks


def section_report(blocks: list[tuple[str, str]]) -> str:
    rows = []
    for title, body in sections(blocks):
        if sum(len(words(p)) for p in body) < 120:
            continue
        try:
            m = analyse(body)
        except SystemExit:
            continue  # bagian terlalu pendek untuk metrik yang stabil
        bad = sum(1 for r in verdict(m) if r["status"] != "OK")
        _, lint_n = lint(body)
        rows.append((title, len(words(" ".join(body))), bad, m["cv_panjang_kalimat"], lint_n))

    if not rows:
        return "\n=== PER BAGIAN ===\n  naskah terlalu pendek untuk dipecah."

    out = ["\n=== PER BAGIAN ===", f"{'bagian':<34}{'kata':>7}{'luar band':>11}{'CV':>8}{'artefak':>9}"]
    out.append("-" * 69)
    for title, w, bad, cv, ln in rows:
        abaikan = title.lower().startswith(REF_TITLES)
        flag = "  (abaikan)" if abaikan else ("" if bad == 0 and ln <= 3 else "  <-- kerjakan")
        out.append(f"{title[:33]:<34}{w:>7}{bad:>11}{cv:>8}{ln:>9}{flag}")
    rows = [r for r in rows if not r[0].lower().startswith(REF_TITLES)]
    out.append(f"\nBagian perlu dikerjakan: {sum(1 for r in rows if r[2] or r[4] > 3)} dari {len(rows)}")
    out.append(f"Total temuan ritme: {sum(r[2] for r in rows)}")
    return "\n".join(out)


def section_cv_floor(blocks: list[tuple[str, str]]) -> tuple[float, str] | None:
    """CV terendah antar bagian (hanya bagian >= 250 kata).

    Metrik tingkat dokumen menutupi monotoninya: kalau tiap bagian seragam
    tetapi berbeda satu sama lain, CV dokumen terlihat wajar. CV per bagian
    yang menangkapnya.
    """
    worst: tuple[float, str] | None = None
    for title, body in sections(blocks):
        if sum(len(words(p)) for p in body) < 250:
            continue
        try:
            m = analyse(body)
        except SystemExit:
            continue
        cv = m["cv_panjang_kalimat"]
        if worst is None or cv < worst[0]:
            worst = (cv, title)
    return worst


def profile(paragraphs: list[str], metrics: dict, lint_total: int, name: str,
            cv_floor: tuple[float, str] | None = None) -> str:
    """Vonis siap-kirim berdasarkan dua sumbu."""
    rows = verdict(metrics)
    bad_kunci = [r for r in rows if r["kunci"] and r["status"] != "OK"]
    bad_all = [r for r in rows if r["status"] != "OK"]
    per1k = 1000 * lint_total / max(1, metrics["kata"])
    checks = [
        ("Ritme: 9 metrik kunci dalam band", not bad_kunci,
         f"{len(bad_kunci)} di luar band (total {len(bad_all)}/13)"),
        ("Bahasa: <= 4 temuan per 1.000 kata", per1k <= 4.0, f"{lint_total} temuan ({per1k:.1f}/1.000)"),
        ("Tidak ada deret monoton > 6", metrics["run_monoton_terpanjang"] <= 6,
         f"{metrics['run_monoton_terpanjang']} kalimat"),
    ]
    if cv_floor is not None:
        checks.append(("CV tiap bagian >= 0,45", cv_floor[0] >= 0.45,
                       f"terendah {cv_floor[0]:.3f} ({cv_floor[1][:24]})"))
    out = [f"\n=== VONIS: {name} ==="]
    for label, ok, detail in checks:
        out.append(f"  [{'LULUS' if ok else 'GAGAL'}] {label:<42} {detail}")

    out.append("")
    if metrics["kata"] < 800:
        out.append(f"  BELUM BISA DIVONIS: naskah hanya {metrics['kata']} kata.")
        out.append("  Metrik ritme butuh >= 800 kata untuk stabil. Uji dulu pada naskah utuh.")
        return "\n".join(out)

    if all(c[1] for c in checks):
        out.append("  LAYAK KIRIM. Dua sumbu bersih. Kirim ulang untuk verifikasi skor.")
    else:
        gagal = [c[0] for c in checks if not c[1]]
        out.append(f"  BELUM LAYAK. Selesaikan: {'; '.join(gagal)}.")
    return "\n".join(out)


def _pearson(a: list[float], b: list[float]) -> float:
    n = len(a)
    ma, mb = sum(a) / n, sum(b) / n
    num = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    den = (sum((x - ma) ** 2 for x in a) * sum((y - mb) ** 2 for y in b)) ** 0.5
    return num / den if den else 0.0


def mirror_check(blocks: list[tuple[str, str]]) -> str | None:
    """Deteksi abstrak ID/EN yang saling mencerminkan (terjemahan kata per kata)."""
    idx_id = idx_en = None
    for i, (t, s) in enumerate(blocks):
        if _is_heading(t, s):
            key = t.strip().lower().rstrip(":")
            if key == "abstrak" and idx_id is None:
                idx_id = i
            if key == "abstract" and idx_en is None:
                idx_en = i
    if idx_id is None or idx_en is None:
        return None

    def body(idx: int) -> list[str]:
        out = []
        for t, s in blocks[idx + 1:]:
            if _is_heading(t, s):
                break
            out.append(t)
        return out

    id_s = split_sentences(body(idx_id))
    en_s = split_sentences(body(idx_en))
    if len(id_s) < 4 or len(en_s) < 4:
        return None

    li = [len(words(x)) for x in id_s]
    le = [len(words(x)) for x in en_s]
    r = _pearson(li, le) if len(li) == len(le) else None
    mi, me = sum(li) / len(li), sum(le) / len(le)
    ratio = me / mi if mi else 0

    signs = []
    if r is not None and r > 0.8:
        signs.append(f"r={r:.2f}")
    if 0.85 <= ratio <= 1.15:
        signs.append(f"rasio panjang={ratio:.2f}")
    if signs:
        return (
            f"\n  [PERHATIAN] Abstrak ID dan EN bermiripan ({', '.join(signs)}).\n"
            "  Kemungkinan terjemahan cermin. Tulis ulang versi Inggris dari ide, bukan dari teks."
        )
    return None


def worklist(paragraphs: list[str]) -> str:
    """Daftar kalimat/paragraf yang paling perlu disunting lebih dulu."""
    paras = [p for p in paragraphs if len(words(p)) >= 8]
    sents = split_sentences(paras)
    lens = [len(words(s)) for s in sents]
    out: list[str] = []

    # 1. deret monoton
    out.append("\n[a] Deret kalimat yang panjangnya nyaris sama")
    i, found = 0, 0
    while i < len(lens) - 1 and found < 3:
        j = i + 1
        while j < len(lens) and abs(lens[j] - lens[j - 1]) <= 3:
            j += 1
        if j - i >= 4:
            found += 1
            out.append(f"  deret {j - i} kalimat (panjang: {lens[i:j]})")
            for k in range(i, min(j, i + 3)):
                out.append(f"    - {sents[k][:140]}")
        i = j
    if not found:
        out.append("  tidak ada deret panjang.")

    # 2. pembuka berulang
    openers = [words(s)[0].lower() for s in sents if words(s)]
    counts = Counter(o for o in openers if o in OPENER_MARKERS)
    out.append("\n[b] Kata pembuka yang berulang")
    if counts:
        for w, c in counts.most_common(6):
            out.append(f"  {w}: {c}x")
    else:
        out.append("  tidak ada.")

    # 3. kalimat penutup paragraf yang merangkum
    out.append("\n[c] Kalimat penutup paragraf yang berbunyi simpulan")
    hits = 0
    for p in paras:
        ss = split_sentences([p])
        if ss and CLOSERS.match(ss[-1]):
            hits += 1
            out.append(f"  - {ss[-1][:140]}")
    if not hits:
        out.append("  tidak ada.")

    # 4. paragraf dengan panjang seragam
    plens = [len(words(p)) for p in paras]
    out.append("\n[d] Panjang paragraf")
    out.append(f"  {plens}")

    return "\n".join(out)


def render(metrics: dict, name: str) -> str:
    rows = verdict(metrics)
    bad = [r for r in rows if r["status"] != "OK"]
    out = [
        f"\n=== {name} ===",
        f"{metrics['kata']} kata · {metrics['kalimat']} kalimat · {metrics['paragraf']} paragraf",
        "",
        f"{'metrik':<44}{'nilai':>9}{'band':>14}  status",
        "-" * 78,
    ]
    for r in rows:
        tanda = "*" if r["kunci"] else " "
        out.append(f"{r['metrik']:<43}{tanda}{r['nilai']:>9}{r['band']:>14}  {r['status']}")
    out.append("")
    out.append("* = metrik kunci (yang benar-benar memisahkan pada kalibrasi)")
    out.append("")
    out.append(f"Temuan di luar band: {len(bad)}/{len(rows)}")
    top = metrics["bigram_konten_teratas"][:5]
    if top:
        out.append("Frasa konten paling sering: " + ", ".join(f"{b['frase']} ({b['n']})" for b in top))
    if metrics["frasa_template"]:
        out.append("Frasa template terdeteksi: " + ", ".join(f"{k} ({v})" for k, v in metrics["frasa_template"].items()))
    if metrics["penanda_terjemahan"]:
        out.append("Penanda terjemahan: " + ", ".join(f"{k} ({v})" for k, v in metrics["penanda_terjemahan"].items()))
    return "\n".join(out)


def main() -> None:
    ap = argparse.ArgumentParser(description="Audit ritme teks akademik Indonesia.")
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--banding", action="store_true", help="tampilkan tabel perbandingan")
    ap.add_argument("--kerja", action="store_true", help="daftar kerja: kalimat/paragraf yang disunting lebih dulu")
    ap.add_argument("--lint", action="store_true", help="cek artefak kebahasaan (parafrase mesin, kalimat rusak)")
    ap.add_argument("--bagian", action="store_true", help="tabel metrik per bagian naskah")
    ap.add_argument("--profil", action="store_true", help="vonis siap-kirim berdasarkan dua sumbu")
    args = ap.parse_args()

    results = {}
    for raw in args.paths:
        path = Path(raw)
        if not path.exists():
            print(f"Tidak ditemukan: {path}", file=sys.stderr)
            continue
        paragraphs = load_text(path)
        metrics = analyse(paragraphs)
        results[path.name] = metrics
        if not args.json:
            print(render(metrics, path.name))
            lint_total = 0
            if args.lint:
                rep, lint_total = lint(paragraphs)
                print(rep)
            if args.bagian:
                print(section_report(load_blocks(path)))
            if args.profil:
                blocks = load_blocks(path)
                prose = [t for t, _ in strip_references(blocks)]
                if prose and prose != paragraphs:
                    m_prose = analyse(prose)
                    _, lint_total = lint(prose)
                    print("\n(vonis dihitung tanpa daftar pustaka)")
                else:
                    m_prose = metrics
                    if not args.lint:
                        _, lint_total = lint(paragraphs)
                print(profile(prose or paragraphs, m_prose, lint_total, path.name,
                              section_cv_floor(blocks)))
                mc = mirror_check(blocks)
                if mc:
                    print(mc)
            if args.kerja:
                print(worklist(paragraphs))

    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))

    if args.banding and len(results) > 1:
        keys = [k for k in TARGET if k in next(iter(results.values()))]
        names = list(results)
        print("\n=== PERBANDINGAN ===")
        head = f"{'metrik':<40}" + "".join(f"{n[:16]:>18}" for n in names)
        print(head)
        print("-" * len(head))
        for k in keys:
            line = f"{LABEL[k]:<40}" + "".join(f"{results[n][k]:>18}" for n in names)
            print(line)


if __name__ == "__main__":
    main()
