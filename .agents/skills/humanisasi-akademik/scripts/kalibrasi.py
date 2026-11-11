#!/usr/bin/env python3
"""Kalibrasi: hubungkan metrik ritme dengan skor detektor yang sebenarnya.

Dipakai setelah beberapa naskah dikirim ulang ke alat yang sama (DrillBit,
Turnitin, dsb). Tujuannya bukan memprediksi skor, melainkan mengetahui metrik
mana yang benar-benar bergerak bersama skor pada naskah Anda sendiri.

Data masukan (CSV, pemisah koma atau titik koma):

    nama,skor,path
    artikel-v1,56.33,C:\\...\\Artikel_Deni_14_Artikel_Jurnal.docx
    artikel-v2,31.20,C:\\...\\artikel-v2.docx

Pemakaian:
    python kalibrasi.py data.csv
"""

from __future__ import annotations

import csv
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from audit_id import TARGET, analyse, load_text, verdict


def ranks(vals: list[float]) -> list[float]:
    order = sorted(range(len(vals)), key=lambda i: vals[i])
    out = [0.0] * len(vals)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and vals[order[j + 1]] == vals[order[i]]:
            j += 1
        avg = (i + j) / 2 + 1
        for k in range(i, j + 1):
            out[order[k]] = avg
        i = j + 1
    return out


def spearman(x: list[float], y: list[float]) -> float:
    rx, ry = ranks(x), ranks(y)
    mx, my = statistics.fmean(rx), statistics.fmean(ry)
    num = sum((a - mx) * (b - my) for a, b in zip(rx, ry))
    den = (sum((a - mx) ** 2 for a in rx) * sum((b - my) ** 2 for b in ry)) ** 0.5
    return num / den if den else 0.0


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        return
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"Tidak ditemukan: {path}", file=sys.stderr)
        return

    raw = path.read_text(encoding="utf-8-sig")
    delim = ";" if raw.count(";") > raw.count(",") else ","
    rows = list(csv.DictReader(raw.splitlines(), delimiter=delim))
    if not rows:
        print("CSV kosong.")
        return

    data = []
    for r in rows:
        key = {k.strip().lower(): (v or "").strip() for k, v in r.items()}
        nama, skor, p = key.get("nama", "?"), float(key["skor"]), key.get("path", "")
        if not Path(p).exists():
            print(f"Lewati {nama}: berkas tidak ditemukan ({p})", file=sys.stderr)
            continue
        m = analyse(load_text(Path(p)))
        out = sum(1 for v in verdict(m) if v["status"] != "OK")
        data.append((nama, skor, m, out))

    if not data:
        print("Tidak ada berkas yang bisa dibaca.")
        return

    data.sort(key=lambda d: -d[1])
    print(f"\n{'naskah':<22}{'skor':>7}{'luar band':>11}{'CV':>8}{'>28 kata':>10}{'pita tengah':>13}{'hapax':>8}")
    print("-" * 80)
    for nama, skor, m, out in data:
        print(
            f"{nama[:21]:<22}{skor:>7.2f}{out:>11}"
            f"{m['cv_panjang_kalimat']:>8}{m['kalimat_panjang_pct']:>10}"
            f"{m['kalimat_pita_tengah_pct']:>13}{m['hapax_ratio']:>8}"
        )

    n = len(data)
    print(f"\nJumlah naskah: {n}")
    if n < 4:
        print("Catatan: dengan kurang dari 4 titik data, korelasi belum bisa dipercaya.")
        print("Kirim ulang beberapa versi naskah yang sama, lalu jalankan lagi.")

    if n >= 3:
        scores = [d[1] for d in data]
        print(f"\n{'metrik':<34}{'rho':>8}  arah")
        print("-" * 58)
        corr = []
        for key in TARGET:
            vals = [d[2][key] for d in data]
            if len(set(vals)) == 1:
                continue
            rho = spearman(vals, scores)
            corr.append((abs(rho), key, rho))
        for _, key, rho in sorted(corr, reverse=True)[:8]:
            arah = "naik bersama skor" if rho > 0 else "turun saat skor naik"
            print(f"{key:<34}{rho:>8.2f}  {arah}")

        print("\nCara membaca: rho positif kuat berarti metrik itu ikut naik saat skor AI naik.")
        print("Kalau 'cv_panjang_kalimat' ber-rho negatif kuat, variansi memang menurunkan skor")
        print("pada naskah Anda. Kalau tidak, penyebabnya ada di luar ritme.")


if __name__ == "__main__":
    main()
